#!/usr/bin/env python3
"""Generate /tmp/p4-fixture.json for ui/p4-visual-check.mjs (run from repo root)."""
import yaml, json, os, glob, re
base='atomic-lessons/themes/plongee-niveau-4-partie-1/p4-prevoir-et-reconnaitre-les-accidents'
def front(p):
    t=open(p).read()
    m=re.match(r'^---\n(.*?)\n---\n?(.*)$', t, re.S)
    return yaml.safe_load(m.group(1)), m.group(2).strip()
lessons=[]
for d in sorted(os.listdir(base)):
    ip=os.path.join(base,d,'index.md')
    if os.path.isfile(ip):
        meta,_=front(ip)
        lessons.append({'dir':d,'id':meta['id'],'title':meta['title']})
ld=os.path.join(base,'15-les-signes-des-accidents-de-desaturation')
lm,lb=front(os.path.join(ld,'index.md'))
cards=[]
for f in sorted(glob.glob(ld+'/cards/*.md')):
    m,b=front(f)
    cards.append({'id':m['id'],'position':m['position'],'title':m['title'],'body_markdown':b})
questions=[]
for f in sorted(glob.glob(ld+'/questions/*.yaml')):
    q=yaml.safe_load(open(f))
    qq={'id':q['id'],'after_card_position':q['after_card_position'],'type':q['type'],'prompt':q['prompt']}
    if q['type']=='multiple_choice':
        qq['options']=[{'id':c['id'],'text':c['text']} for c in q['choices']]
    questions.append(qq)
json.dump({'lessons':lessons,'lesson':{'id':lm['id'],'title':lm['title'],'introduction_markdown':lb},'cards':cards,'questions':questions}, open('/tmp/p4-fixture.json','w'), ensure_ascii=False)
print('fixture ok', len(lessons), len(cards), len(questions))
