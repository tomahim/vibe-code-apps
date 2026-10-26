#!/usr/bin/env python3
"""PR recap tool: build/open locally; publish/fetch recaps on a recaps branch via git. No AI calls."""
import argparse, hashlib, json, pathlib, re, subprocess, sys, tempfile, webbrowser
ROOT = pathlib.Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / '.claude/assets/pr-review-template.html'

def validate(data):
    def text(v, name, maximum=10000):
        if not isinstance(v,str) or not v.strip() or len(v)>maximum: raise ValueError('Invalid '+name)
    for key in ('repo','number','title','author','base','head','head_sha','description','files','layers','additions','deletions','provenance'):
        if key not in data: raise ValueError('Missing '+key)
    if data.get('schema_version')!=2 or data.get('template_version')!='0.2': raise ValueError('Expected schema v2 / template 0.2')
    if type(data['number']) is not int or data['number']<1: raise ValueError('Invalid PR number')
    if not re.fullmatch('[a-f0-9]{40,64}',data['head_sha']): raise ValueError('Full head SHA required')
    for k in ('repo','title','author','base','head','provenance'): text(data[k],k)
    desc=data['description']
    if not isinstance(desc,dict): raise ValueError('Invalid PR description')
    if not isinstance(desc.get('body'),str) or len(desc['body'])>100000: raise ValueError('Invalid original PR body')
    text(desc.get('summary'),'PR summary')
    url=desc.get('source_url','')
    if not re.fullmatch(r'https://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+/pull/[1-9][0-9]*',url): raise ValueError('Invalid source URL')
    def attention(items):
        if not isinstance(items,list) or len(items)>4: raise ValueError('Use at most four attention bullets')
        for v in items:text(v,'attention bullet',300)
    attention(desc.get('attention',[]))
    if not isinstance(data['files'],list) or not 0<len(data['files'])<=2000 or not data['layers']: raise ValueError('Files and layers required')
    paths={}
    for f in data['files']:
        text(f['path'],'file path')
        if f['path'] in paths: raise ValueError('Duplicate file path')
        if not isinstance(f.get('patch'),(str,type(None))): raise ValueError('Invalid patch')
        oldlines=set();newlines=set();old=nw=0
        for raw in (f.get('patch') or '').splitlines():
            h=re.match(r'^@@ -(\d+)(?:,\d+)? \+(\d+)',raw)
            if h:old,nw=map(int,h.groups());continue
            if not raw or raw.startswith('\\'):continue
            if raw[0]!='+':oldlines.add(old);old+=1
            if raw[0]!='-':newlines.add(nw);nw+=1
        paths[f['path']]={'old':oldlines,'new':newlines}
    for l in data['layers']:
        if l['type'] not in ('behavior','design','annex'): raise ValueError('Unknown layer')
        text(l['title'],'layer title',120);text(l['description'],'layer description',700)
        if any(k in l for k in ('summary','note')): raise ValueError('Old layer fields not supported')
        attention(l.get('attention',[]))
        for ref in l['refs']:
            if ref['path'] not in paths: raise ValueError('Unknown file reference')
            if not ref.get('highlights'): raise ValueError('Highlight required')
            for r in ref['highlights']:
                if r['side'] not in ('old','new') or type(r['start']) is not int or type(r['end']) is not int or not 0<r['start']<=r['end']: raise ValueError('Invalid range')
                if not set(range(r['start'],r['end']+1))<=paths[ref['path']][r['side']]: raise ValueError('Highlight outside captured hunk')
                text(r.get('comment'),'highlight comment',160)

BRANCH='recaps/pr-reviews'
def git(cwd,*args,check=True):
    r=subprocess.run(['git','-c','core.hooksPath=/dev/null','-C',str(cwd),*args],capture_output=True,text=True)
    if check and r.returncode: raise ValueError('git '+args[0]+' failed: '+r.stderr.strip()[:300])
    return r

def resolve_remote(remote):
    if remote.startswith('-'): raise ValueError('Invalid remote')
    r=subprocess.run(['git','config','--get','remote.'+remote+'.url'],capture_output=True,text=True)
    return r.stdout.strip() if r.returncode==0 and r.stdout.strip() else remote

def check_branch(b):
    if b.startswith('-') or not re.fullmatch(r'[A-Za-z0-9._/-]{1,100}',b) or '..' in b: raise ValueError('Invalid branch')

def template_sha(): return hashlib.sha256(TEMPLATE.read_text().encode()).hexdigest()

def render(d):
    payload=json.dumps(d,ensure_ascii=True).replace('<','\\u003c').replace('>','\\u003e').replace('&','\\u0026')
    t=TEMPLATE.read_text();assert t.count('__PR_DATA_JSON__')==1
    return t.replace('__PR_DATA_JSON__',payload)

def clone_branch(url,branch,work):
    """Fetch only the recaps branch into a scratch repo. Returns True if the branch exists."""
    git(work,'init','-q')
    if not git(work,'ls-remote','--exit-code','--heads','--',url,'refs/heads/'+branch,check=False).returncode==0: return False
    git(work,'fetch','-q','--no-tags','--',url,'+refs/heads/'+branch+':refs/remotes/origin/'+branch)
    return True

def read_index(work,branch,exists):
    if not exists: return {'version':1,'recaps':{}}
    r=git(work,'show','refs/remotes/origin/'+branch+':index.json',check=False)
    if r.returncode: raise ValueError('Recaps branch has no index.json')
    idx=json.loads(r.stdout)
    if idx.get('version')!=1 or not isinstance(idx.get('recaps'),dict): raise ValueError('Unsupported index')
    return idx

def publish(a):
    check_branch(a.branch);url=resolve_remote(a.remote)
    d=json.loads(pathlib.Path(a.json).read_text());validate(d)
    if a.current_head and a.current_head!=d['head_sha'] and not a.historical:
        raise ValueError('PR head moved (%s). Regenerate, or pass --historical to publish a labeled historical recap.'%a.current_head[:12])
    html=render(d);jtxt=json.dumps(d,indent=1)+'\n'
    key='%d@%s'%(d['number'],d['head_sha']);name='pr-%d-%s'%(d['number'],d['head_sha'])
    entry={'pr':d['number'],'head_sha':d['head_sha'],'title':d['title'],'html':name+'.html','json':name+'.json','template_version':d['template_version'],'template_sha256':template_sha(),'historical':bool(a.current_head and a.current_head!=d['head_sha'])}
    for attempt in (1,2):
        with tempfile.TemporaryDirectory() as tmp:
            work=pathlib.Path(tmp);exists=clone_branch(url,a.branch,work)
            if exists: git(work,'checkout','-q','-B',a.branch,'refs/remotes/origin/'+a.branch)
            else: git(work,'checkout','-q','--orphan',a.branch)
            idx=read_index(work,a.branch,exists)
            old=idx['recaps'].get(key)
            if old:
                if (work/entry['json']).read_text()==jtxt and (work/entry['html']).read_text()==html: print('Recap already published at this head; nothing to do.');return
                raise ValueError('Immutable recap already exists for '+key)
            idx['recaps'][key]=entry
            if not a.yes:
                print('Dry run. Would push %s and %s to branch %s of %s (%s). Re-run with --yes after confirming the audience.'%(entry['html'],entry['json'],a.branch,a.remote,'existing' if exists else 'new orphan'));return
            (work/entry['json']).write_text(jtxt);(work/entry['html']).write_text(html)
            (work/'index.json').write_text(json.dumps(idx,indent=1)+'\n')
            git(work,'add','--','index.json',entry['json'],entry['html'])
            git(work,'-c','user.name=pr-recap','-c','user.email=pr-recap@localhost','commit','-q','-m','Add review recap for PR #%d at %s'%(d['number'],d['head_sha'][:12]))
            r=git(work,'push','-q','--',url,'HEAD:refs/heads/'+a.branch,check=False)
            if r.returncode==0: print('Published',entry['html'],'to',a.branch);return
            if attempt==2: raise ValueError('Push rejected twice (another writer won). Stopped: '+r.stderr.strip()[:200])

def fetch(a):
    check_branch(a.branch);url=resolve_remote(a.remote)
    with tempfile.TemporaryDirectory() as tmp:
        work=pathlib.Path(tmp)
        if not clone_branch(url,a.branch,work): print('No recaps branch %s.'%a.branch);sys.exit(2)
        idx=read_index(work,a.branch,True);mine=[e for k,e in idx['recaps'].items() if e.get('pr')==a.number]
        want=a.sha or a.current_head
        if not want: raise ValueError('Pass --current-head (from gh) or --sha')
        if a.sha:
            m=[e for e in mine if e['head_sha'].startswith(a.sha.lower())]
            if len(m)>1: raise ValueError('Ambiguous SHA prefix')
        else: m=[e for e in mine if e['head_sha']==want]
        if not m:
            print('No recap for current head' if not a.sha else 'No recap for that SHA');print('Available:',', '.join(e['head_sha'][:12] for e in mine) or 'none');sys.exit(2)
        e=m[0];n='pr-%d-%s'%(a.number,e['head_sha'])
        if e['json']!=n+'.json': raise ValueError('Unexpected index filename')
        d=json.loads(git(work,'show','refs/remotes/origin/'+a.branch+':'+n+'.json').stdout);validate(d)
        if d['number']!=a.number or d['head_sha']!=e['head_sha']: raise ValueError('Recap does not match index')
    out=pathlib.Path(a.output);out.mkdir(parents=True,exist_ok=True)
    (out/(n+'.json')).write_text(json.dumps(d,indent=1)+'\n')
    f=out/(n+'.html');f.write_text(render(d))  # regenerated locally from validated data, remote HTML is never used
    summary(d)
    if a.current_head and d['head_sha']!=a.current_head: print('HISTORICAL: this recap is not for the current PR head %s'%a.current_head[:12])
    print(f.resolve())

def summary(d):
    print(f"PR #{d['number']} @ {d['head_sha'][:12]} | {d['title']}\n{d['description']['summary']}")
    for i,l in enumerate(d['layers'],1): print(f"  {i}. [{l['type']}] {l['title']}")
    if any(not f.get('patch') for f in d['files']): print("Warning: some files have no textual patch")
    print(f"Schema {d['schema_version']} | Template {d['template_version']}")
    print(f"{len(d['files'])} files | +{d['additions']} -{d['deletions']}")

def main():
    p=argparse.ArgumentParser(description=__doc__); sub=p.add_subparsers(dest='cmd',required=True)
    b=sub.add_parser('build');b.add_argument('json');b.add_argument('--output',default='pr-recaps')
    v=sub.add_parser('open');v.add_argument('html');v.add_argument('--no-browser',action='store_true')
    pb=sub.add_parser('publish');pb.add_argument('json');pb.add_argument('--remote',required=True);pb.add_argument('--branch',default=BRANCH);pb.add_argument('--current-head');pb.add_argument('--historical',action='store_true');pb.add_argument('--yes',action='store_true')
    fe=sub.add_parser('fetch');fe.add_argument('number',type=int);fe.add_argument('--remote',required=True);fe.add_argument('--branch',default=BRANCH);fe.add_argument('--current-head');fe.add_argument('--sha');fe.add_argument('--output',required=True)
    a=p.parse_args()
    if a.cmd=='publish':return publish(a)
    if a.cmd=='fetch':return fetch(a)
    if a.cmd=='build':
        d=json.loads(pathlib.Path(a.json).read_text());validate(d)
        # Escape for a raw-text script element, including adversarial </script> sequences.
        payload=json.dumps(d,ensure_ascii=True).replace('<','\\u003c').replace('>','\\u003e').replace('&','\\u0026')
        template=TEMPLATE.read_text();assert template.count('__PR_DATA_JSON__')==1
        out=pathlib.Path(a.output);out.mkdir(parents=True,exist_ok=True)
        target=out/f"pr-{d['number']}-{d['head_sha']}.html"
        html=template.replace('__PR_DATA_JSON__',payload)
        if target.exists() and target.read_text()!=html: raise ValueError('Immutable recap already exists; use a new output directory')
        target.write_text(html);summary(d);print(target.resolve());print('Template SHA256:',hashlib.sha256(template.encode()).hexdigest())
    else:
        f=pathlib.Path(a.html).resolve();html=f.read_text()
        m=re.search(r'<script id="pr-data" type="application/json">(.*?)</script>',html,re.S)
        if not m: raise ValueError('Missing data')
        d=json.loads(m[1]);validate(d);summary(d)
        # Only open recaps built from this trusted template. Remote HTML is executable content.
        payload=m[1];trusted=TEMPLATE.read_text().replace('__PR_DATA_JSON__',payload)
        if html!=trusted: raise ValueError('Template mismatch: inspect recap without opening it')
        if not a.no_browser:webbrowser.open(f.as_uri())
if __name__=='__main__':
    try:main()
    except (ValueError,KeyError,AssertionError,json.JSONDecodeError) as e:sys.exit(str(e))
