import { test, expect } from '@playwright/test';
const injuryOut={status_hint:'out',headline:'Fixture medical headline',url:'https://swisshockeynews.ch/en/shn/medical/fixture',source:'swisshockeynews.ch medical report',published_on:'2026-11-04',observed_at:'2026-11-05T08:00:00Z',excerpt:'Fixture excerpt'};
const injuryD2D={status_hint:'day_to_day',headline:'Fixture day-to-day headline',url:'https://swisshockeynews.ch/en/shn/medical/fixture-d2d',source:'swisshockeynews.ch medical report',published_on:'2026-11-05',observed_at:'2026-11-05T09:00:00Z',excerpt:'Fixture d2d excerpt'};
const players = [
 {licence_id:1,name:'Fixture Forward',position:'F',team:{id:1,name:'Fixture Club',acronym:'FIX'},season:{games:3,goals:2,assists:4,points:6,shots_on_goal:9},hm:{price_m:'8.5',points_season:142,points_avg:'7.47',captured_on:'2026-11-04'},injury:injuryOut},
 {licence_id:2,name:'Fixture Defender',position:'D',team:{id:1,name:'Fixture Club',acronym:'FIX'},season:{games:3,goals:1,assists:2,points:3,shots_on_goal:6},hm:{price_m:null},injury:null},
 {licence_id:3,name:'Fixture Incoming',position:'F',team:{id:2,name:'Other Club',acronym:'OTH'},season:{games:2,goals:1,assists:0,points:1,shots_on_goal:5},hm:{price_m:'6.5',points_season:87,points_avg:'5.8'},injury:injuryD2D},
 {licence_id:4,name:'Fixture Rookie',position:'F',team:{id:2,name:'Other Club',acronym:'OTH'},season:null,hm:{price_m:null},injury:null},
];
const manyPlayers = Array.from({length:60},(_,i)=>({licence_id:100+i,name:`Fixture Player ${String(i+1).padStart(2,'0')}`,position:['F','D','G'][i%3],team:{id:1,name:'Fixture Club',acronym:'FIX'},season:{games:3,goals:i%5,assists:i%4,points:(i%5)+(i%4),shots_on_goal:i%7},hm:{price_m:String(1+(i%10)),captured_on:'2026-11-04'}}));
async function setup(page,{empty=false,many=false}={}){
 const saved=[];const requests=[];const roster=many?manyPlayers:players;
 await page.addInitScript(()=>{localStorage.setItem('genious_token','fixture-token');localStorage.setItem('genious_user',JSON.stringify({email:'fixture@example.invalid'}));});
 await page.route('**/api/apps/hockey/**',async route=>{
  const url=new URL(route.request().url()), path=url.pathname.replace('/api/apps/hockey/','');
  let data={};
  if(path==='teams/') data={teams:empty?[]:[{id:1,name:'Fixture Club'},{id:2,name:'Other Club'}]};
  else if(path==='players/') {
   const ord=url.searchParams.get('sort');requests.push(ord);
   let rows=roster.filter(p=>(!url.searchParams.get('q') || p.name.toLowerCase().includes(url.searchParams.get('q').toLowerCase())) && (!url.searchParams.get('team') || String(p.team.id)===url.searchParams.get('team')) && (!url.searchParams.get('position') || p.position===url.searchParams.get('position')));
   if(ord){const key=ord.replace(/^-/,''),dir=ord.startsWith('-')?-1:1,val=pl=>key==='name'?pl.name:key==='price'?(pl.hm&&pl.hm.price_m!=null?Number(pl.hm.price_m):null):(pl.season?pl.season[key]:null);rows=rows.slice().sort((a,b)=>{const va=val(a),vb=val(b);if(va==null&&vb==null)return 0;if(va==null)return 1;if(vb==null)return -1;return va<vb?-dir:va>vb?dir:0;});}
   data={players:empty?[]:rows};
  }
  else if(path==='standings/') data={rows:[]};
  else if(path==='compare/') data={players:roster.filter(p=>url.searchParams.get('ids').split(',').includes(String(p.licence_id))).map(p=>({...p,weeks:[{week:38,games:1,goals:p.licence_id,assists:1,points:p.licence_id+1},{week:40,games:2,goals:0,assists:1,points:1}]})),missing:[]};
  else if(path==='my/teams/') data={teams:empty?[]:[{id:10,name:'Fixture team',roster_size:1,pair_count:1}],shared_with_me:empty?[]:[{id:11,name:'Pongo',roster_size:1,pair_count:1,read_only:true,owner_label:'aurore',granted_by:'Fixture consent 2026-11-04',roster:[{player:2,name:'Fixture Defender',slot:'D',acquired_price_m:'5.0',source:'hm_import',nationality:{code:'fi',source:'HM /fr/transfers-classic flag',observed_at:'2026-11-05T08:00:00Z'},injury:null}],pair_entries:[{label:'Fixture Pair A/B',hm_asset_id:93,current_price_m:'14.0',source:'hm_import'}]}]};
  else if(path==='my/teams/10/') data={id:10,name:'Fixture team',roster:[{player:1,name:'Fixture Forward',slot:'F',acquired_price_m:null,source:'manual',hm:{price_m:'8.5',points_season:142,points_avg:'7.47',captured_on:'2026-11-04'},nationality:{code:'ch',source:'HM /fr/transfers-classic flag',observed_at:'2026-11-05T08:00:00Z'},injury:{status_hint:'out',headline:'Fixture medical headline',url:'https://swisshockeynews.ch/en/shn/medical/fixture',source:'swisshockeynews.ch medical report',published_on:'2026-11-04',observed_at:'2026-11-05T08:00:00Z',excerpt:'Fixture excerpt'}}],pair_entries:[{label:'Fixture Own Pair C/D',hm_asset_id:175,current_price_m:'13.0',source:'hm_import',snapshot:{price_m:'13.0',points_season:210,points_avg:'11.05',captured_on:'2026-11-04'}}]};
  else if(path==='my/teams/10/simulations/') { if(route.request().method()==='POST'){ data={id:20,name:'Transfer what-if',computed_budget_after_m:'142',notes:'',created_at:'2026-11-04T21:00:00Z',sells:[players[0]],buys:[players[2]]};saved.push(data); } else data={simulations:saved}; }
  else if(path==='players/1/') data={...players[0],stints:[],injury:null,nationality:null};
  await route.fulfill({json:data});
 });
 return requests;
}
test('signed-out visitors are redirected to sign-in preserving the hockey route',async({page})=>{
 await page.goto('/apps/hockey/compare');await expect(page).toHaveURL(/\/login\?next=%2Fapps%2Fhockey%2Fcompare/);await expect(page.getByRole('heading',{name:'Welcome back.'})).toBeVisible();
});
test('search, club filters, selection, comparison graphs, details and refresh',async({page})=>{
 await setup(page);await page.goto('/apps/hockey/players');await expect(page.getByRole('heading',{name:'Hockey Lab'})).toBeVisible();
 await page.getByRole('checkbox',{name:'Select Fixture Forward',exact:true}).check();await page.getByLabel('Club',{exact:true}).selectOption('2');await expect(page.getByRole('button',{name:'Fixture Incoming',exact:true})).toBeVisible();await page.getByRole('checkbox',{name:'Select Fixture Incoming',exact:true}).check();
 await page.getByRole('button',{name:'Compare selected'}).click();await expect(page.getByRole('img',{name:/Weekly points/})).toBeVisible();await expect(page.getByText('2 players selected across filters')).toBeVisible();const cmp=page.locator('#hk-comparison');await expect(cmp.getByRole('columnheader',{name:'SOG/M'})).toBeVisible();await expect(cmp.getByRole('columnheader',{name:'SH%'})).toBeVisible();await expect(cmp.getByRole('cell',{name:'3.0',exact:true})).toBeVisible();await expect(cmp.getByRole('cell',{name:'22.2%',exact:true})).toBeVisible();await expect(cmp.getByRole('cell',{name:'2.5',exact:true})).toBeVisible();await expect(cmp.getByRole('cell',{name:'20.0%',exact:true})).toBeVisible();await expect(cmp.getByRole('columnheader',{name:'HM price'})).toBeVisible();await expect(cmp.getByRole('columnheader',{name:'HM points'})).toBeVisible();await expect(cmp.getByRole('columnheader',{name:'HM avg'})).toBeVisible();await expect(cmp.getByRole('cell',{name:'142',exact:true})).toBeVisible();await expect(cmp.getByRole('cell',{name:'7.47',exact:true})).toBeVisible();await expect(cmp.getByRole('cell',{name:'87',exact:true})).toBeVisible();await expect(cmp.getByRole('cell',{name:'5.8',exact:true})).toBeVisible();await expect(cmp.getByText(/latest imported HM snapshot/)).toBeVisible();await page.screenshot({path:'/downloads/hockey-compare-hm-metrics.png',fullPage:true});
 await page.getByLabel('Measure',{exact:true}).selectOption('goals');await expect(page.getByRole('img',{name:/Weekly goals/})).toBeVisible();await page.getByRole('button',{name:'Refresh data'}).click();await expect(page.getByRole('img',{name:/Weekly goals/})).toBeVisible();
 await page.getByLabel('Club',{exact:true}).selectOption('');await page.getByRole('button',{name:'Fixture Forward',exact:true}).click();await expect(page.getByRole('heading',{name:'Club history'})).toBeVisible();await expect(page.locator('.hk-detail .hk-badge-unknown').first()).toHaveText('Unknown');await expect(page.locator('.hk-detail').getByText(/not a confirmation of health/)).toBeVisible();await page.getByRole('button',{name:'Close player details'}).click();
 await page.getByLabel('Find a player').fill('Defender');await expect(page.getByRole('button',{name:'Fixture Defender',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Fixture Forward',exact:true})).toHaveCount(0);
});
test('rosters and simulation suppress unknown-cost budget, never make real trade',async({page})=>{
 await setup(page);await page.goto('/apps/hockey/teams');await expect(page.getByText('2 / 22 players')).toBeVisible();await expect(page.getByText('1 single player + 1 goalie pair (HM counts each goalie duo as one of the 22 players)')).toBeVisible();await page.screenshot({path:'/downloads/hockey-mobile-teams-slots.png',fullPage:true});await page.getByRole('button',{name:/Fixture team/}).click();await expect(page.getByRole('cell',{name:'Unknown',exact:true})).toBeVisible();await expect(page.getByRole('cell',{name:'Swiss',exact:true})).toBeVisible();await expect(page.getByRole('cell',{name:'8.5 M',exact:true})).toBeVisible();await expect(page.getByRole('cell',{name:'142',exact:true})).toBeVisible();await expect(page.getByRole('cell',{name:'7.47',exact:true})).toBeVisible();await expect(page.getByText(/210 HM points, 11\.05 avg per match \(HM snapshot 2026-11-04\)/)).toBeVisible();await page.screenshot({path:'/downloads/hockey-mobile-teams-hm-metrics.png',fullPage:true});const med=page.getByRole('link',{name:'Out · 11-04'});await expect(med).toBeVisible();await expect(med).toHaveAttribute('href','https://swisshockeynews.ch/en/shn/medical/fixture');await med.scrollIntoViewIfNeeded();await expect(med).toBeInViewport();const sub=page.getByText('latest report').first();await sub.scrollIntoViewIfNeeded();await expect(sub).toBeInViewport();await page.screenshot({path:'/downloads/hockey-mobile-teams-medical.png'});await page.screenshot({path:'/downloads/hockey-mobile-teams.png',fullPage:true});const wrap=page.locator('.hk-table-wrap').first();await wrap.evaluate(el=>{el.scrollLeft=el.scrollWidth;});await page.screenshot({path:'/downloads/hockey-mobile-teams-scrolled.png'});
 await page.getByRole('button',{name:'Pongo'}).click();await expect(page.getByText('Fixture consent')).toHaveCount(0);const sharedCard=page.locator('section.hk-card',{has:page.getByRole('heading',{name:'Shared with you'})});await expect(sharedCard.getByRole('columnheader',{name:'HM price'})).toHaveCount(0);await expect(sharedCard.getByRole('columnheader',{name:'HM points'})).toHaveCount(0);await expect(page.getByRole('cell',{name:'Foreign',exact:true})).toBeVisible();await expect(page.getByRole('cell',{name:'No report',exact:true})).toBeVisible();await page.screenshot({path:'/downloads/hockey-shared-team.png',fullPage:true});await page.getByRole('button',{name:'Plan a transfer'}).click();
 await page.getByRole('checkbox',{name:'Fixture Forward F'}).check();await page.getByRole('checkbox',{name:'Select Fixture Incoming',exact:true}).check();await page.getByRole('button',{name:'Save what-if (no real trade)'}).click();await expect(page.getByRole('heading',{name:'Saved: Transfer what-if'})).toBeVisible();await expect(page.getByText('Budget unavailable: missing costs or current HM prices.')).toBeVisible();await expect(page.getByText(/Estimated budget after:/)).toHaveCount(0);await expect(page.locator('.hk-sim-history li')).toHaveCount(1);await expect(page.locator('.hk-sim-history')).toContainText('Fixture Incoming');await page.screenshot({path:'/downloads/hockey-simulator.png',fullPage:true});await page.reload();await page.getByLabel('Your team',{exact:true}).selectOption('10');await expect(page.locator('.hk-sim-history li')).toHaveCount(1);await expect(page.locator('.hk-sim-history')).toContainText('Fixture Incoming');
});
test('simulator incoming list has the same filters and sorting as the player database',async({page})=>{
 const requests=await setup(page);await page.goto('/apps/hockey/simulator');await page.getByLabel('Your team',{exact:true}).selectOption('10');
 await expect(page.getByLabel('Find a player')).toBeVisible();await expect(page.getByLabel('Club',{exact:true})).toBeVisible();await expect(page.getByLabel('Position',{exact:true})).toBeVisible();await expect(page.getByLabel('Sort by',{exact:true})).toBeVisible();await expect(page.getByLabel('Sort direction',{exact:true})).toBeVisible();
 await expect(page.getByRole('checkbox',{name:'Select Fixture Forward',exact:true})).toHaveCount(0);
 await page.getByLabel('Sort by',{exact:true}).selectOption('points');
 await expect.poll(()=>requests[requests.length-1]).toBe('-points');
 await expect(page.locator('.hk-player-table tbody tr').first()).toContainText('Fixture Defender');
 await page.getByLabel('Club',{exact:true}).selectOption('2');
 await expect(page.getByRole('checkbox',{name:'Select Fixture Incoming',exact:true})).toBeVisible();
 await expect(page.getByRole('checkbox',{name:'Select Fixture Defender',exact:true})).toHaveCount(0);
 await page.getByLabel('Position',{exact:true}).selectOption('G');
 await expect(page.getByText(/No players found/)).toBeVisible();
 await page.getByLabel('Position',{exact:true}).selectOption('');await page.getByLabel('Club',{exact:true}).selectOption('');
 await page.getByLabel('Find a player').fill('Rookie');
 await expect(page.getByRole('checkbox',{name:'Select Fixture Rookie',exact:true})).toBeVisible();
 await expect(page.getByRole('checkbox',{name:'Select Fixture Incoming',exact:true})).toHaveCount(0);
 await page.screenshot({path:'/downloads/hockey-simulator-filters.png',fullPage:true});
});
test('player lists paginate 25 per page, selection survives page changes',async({page})=>{
 await setup(page,{many:true});await page.goto('/apps/hockey/players');
 await page.getByLabel('Sort direction',{exact:true}).selectOption('asc');
 await expect(page.locator('.hk-player-table tbody tr')).toHaveCount(25);
 const pager=page.getByRole('navigation',{name:'Player list pages'});await expect(pager).toContainText('Page 1 of 3');
 await page.getByRole('checkbox',{name:'Select Fixture Player 01',exact:true}).check();
 await pager.getByRole('button',{name:'Next page'}).click();await expect(pager).toContainText('Page 2 of 3');
 await expect(page.getByText('1 player selected across filters')).toBeVisible();
 await pager.getByRole('button',{name:'Next page'}).click();await expect(pager).toContainText('Page 3 of 3');
 await expect(page.locator('.hk-player-table tbody tr')).toHaveCount(10);
 await expect(pager.getByRole('button',{name:'Next page'})).toBeDisabled();
 await pager.getByRole('button',{name:'Previous page'}).click();await pager.getByRole('button',{name:'Previous page'}).click();await expect(pager).toContainText('Page 1 of 3');
 await expect(page.getByRole('checkbox',{name:'Select Fixture Player 01',exact:true})).toBeChecked();
 await page.getByLabel('Find a player').fill('Player 01');
 await expect(page.locator('.hk-player-table tbody tr')).toHaveCount(1);await expect(pager).toHaveCount(0);
 await page.screenshot({path:'/downloads/hockey-pagination.png',fullPage:true});
});
test('honest empty states and mobile screenshots',async({page})=>{
 await setup(page,{empty:true});await page.setViewportSize({width:393,height:852});await page.goto('/apps/hockey/players');await expect(page.getByText(/No players found/)).toBeVisible();await page.getByRole('link',{name:'Standings',exact:true}).click();await expect(page).toHaveURL(/apps\/hockey\/standings$/);await expect(page.getByText(/Official standings have not/)).toBeVisible();await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
 await page.screenshot({path:'/downloads/hockey-mobile-empty.png',fullPage:true});
});
test('mobile populated and comparison visual evidence',async({page})=>{
 await setup(page);await page.setViewportSize({width:393,height:852});await page.goto('/apps/hockey/players');await expect(page.getByRole('button',{name:'Fixture Forward',exact:true})).toBeVisible();await page.screenshot({path:'/downloads/hockey-mobile-players.png',fullPage:true});
 await page.getByRole('checkbox',{name:'Select Fixture Forward',exact:true}).check();await page.getByRole('checkbox',{name:'Select Fixture Defender',exact:true}).check();await page.getByRole('button',{name:'Compare selected'}).click();await expect(page.getByRole('img',{name:/Weekly points/})).toBeVisible();await page.screenshot({path:'/downloads/hockey-mobile-compare.png',fullPage:true});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);const cmpCard=page.locator('#hk-comparison');const cmpWrap=cmpCard.locator('.hk-table-wrap').first();await cmpWrap.evaluate(el=>{el.scrollLeft=el.scrollWidth;});const shHead=cmpCard.getByRole('columnheader',{name:'SH%'});await shHead.scrollIntoViewIfNeeded();await expect(cmpCard.getByRole('columnheader',{name:'SOG/M'})).toBeVisible();await expect(shHead).toBeVisible();await expect(cmpCard.getByRole('cell',{name:'3.0',exact:true})).toBeVisible();await expect(cmpCard.getByRole('cell',{name:'22.2%',exact:true})).toBeVisible();await expect(cmpCard.getByRole('cell',{name:'2.0',exact:true})).toBeVisible();await expect(cmpCard.getByRole('cell',{name:'16.7%',exact:true})).toBeVisible();await page.screenshot({path:'/downloads/hockey-mobile-compare-advanced.png'});
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'/downloads/hockey-desktop-compare.png',fullPage:true});
});
test('errors show retry and expired JWT returns to sign-in',async({page})=>{
 await setup(page);await page.route('**/api/apps/hockey/players/**',route=>route.fulfill({status:500,json:{error:'Fixture import unavailable'}}));await page.goto('/apps/hockey/players');await expect(page.getByRole('alert').filter({hasText:'Fixture import unavailable'})).toBeVisible();
 await page.route('**/api/apps/hockey/players/**',route=>route.fulfill({status:401,json:{error:'Expired'}}));await page.getByRole('button',{name:'Refresh data'}).click();await expect(page).toHaveURL(/\/login\?next=/);
});

test('official standings show exact source date and shootout splits',async({page})=>{
 await setup(page);await page.route('**/api/apps/hockey/standings/**',r=>r.fulfill({json:{season:2027,captured_on:'2026-11-04',source:'data.sihf.ch standing table',source_updated_at:'2026-11-04T20:00:00Z',rows:[{rank:1,team:{id:1,name:'Fixture Club'},games_played:20,wins:10,ot_wins:2,so_wins:1,so_losses:2,ot_losses:1,losses:4,points:39,goals_for:60,goals_against:40}]}}));await page.goto('/apps/hockey/standings');await expect(page.getByRole('columnheader',{name:'SOW',exact:true})).toBeVisible();await expect(page.getByText(/Source: data.sihf.ch standing table/)).toContainText('2026-11-04T20:00:00Z');
});
test('successful sign-in returns to hockey and rejects external next URL',async({page})=>{
 await page.route('**/api/auth/login',r=>r.fulfill({json:{token:'fixture-token',user:{email:'fixture@example.invalid'}}}));await page.route('**/api/apps/hockey/**',r=>r.fulfill({json:{players:[],teams:[],rows:[]}}));await page.goto('/login?next=%2Fapps%2Fhockey%2Fteams');await page.getByLabel('Email',{exact:true}).fill('fixture@example.invalid');await page.getByLabel('Password',{exact:true}).fill('not-a-real-password');await page.getByRole('button',{name:'Log in',exact:true}).click();await expect(page).toHaveURL(/apps\/hockey\/teams$/);
});

test('selection bar stays within reach while scrolling a long table',async({page})=>{
 await setup(page,{many:true});await page.setViewportSize({width:393,height:852});await page.goto('/apps/hockey/players');
 await expect(page.getByRole('checkbox',{name:'Select Fixture Player 60',exact:true})).toBeVisible();
 await page.getByRole('checkbox',{name:'Select Fixture Player 60',exact:true}).check();
 const bar=page.getByRole('region',{name:'Player selection'});
 await expect(bar).toBeVisible();await expect(bar).toContainText('1 player selected across filters');
 await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
 await expect(bar).toBeVisible();await expect(bar.getByRole('button',{name:'Compare selected'})).toBeVisible();
 const footerBox=await page.locator('.hk-footer').boundingBox();const barBox=await bar.boundingBox();
 expect(footerBox.y+footerBox.height).toBeLessThanOrEqual(barBox.y+1);
 const lastRow=await page.locator('.hk-player-table tbody tr').last().boundingBox();
 expect(lastRow.y+lastRow.height).toBeLessThanOrEqual(barBox.y+1);
 await page.screenshot({path:'/downloads/hockey-mobile-selection-bar.png'});
 await bar.getByRole('button',{name:'Compare selected'}).click();
 await expect(page.getByRole('img',{name:/Weekly points/})).toBeVisible();
 await expect(page.getByRole('button',{name:'Compare selected'})).toHaveCount(0);
 await expect(bar).toBeVisible();await expect(bar.getByRole('button',{name:'Clear selection'})).toBeVisible();
 await page.getByRole('link',{name:'Player database',exact:true}).click();
 await page.getByRole('checkbox',{name:'Select Fixture Player 59',exact:true}).check();
 await page.getByRole('link',{name:'Compare players',exact:true}).click();
 await expect(page.getByRole('img',{name:/Weekly points/})).toBeVisible();
 await page.evaluate(()=>window.scrollTo(0,0));
 await expect(bar.getByRole('button',{name:'View comparison'})).toBeVisible();
 await bar.getByRole('button',{name:'View comparison'}).click();
 await expect.poll(()=>page.evaluate(()=>{const r=document.getElementById('hk-comparison').getBoundingClientRect();return r.top>=0 && r.top<window.innerHeight;})).toBe(true);
});

test('scouting table and simulator incoming list show latest medical reports, never a health claim',async({page})=>{
 await setup(page);await page.setViewportSize({width:393,height:852});await page.goto('/apps/hockey/players');
 await expect(page.getByRole('columnheader',{name:'Medical',exact:true})).toBeVisible();
 const fwd=page.locator('.hk-player-table tbody tr',{has:page.getByRole('button',{name:'Fixture Forward',exact:true})});
 const link=fwd.getByRole('link',{name:'Out · 11-04'});
 await expect(link).toBeVisible();await expect(link).toHaveAttribute('href','https://swisshockeynews.ch/en/shn/medical/fixture');await expect(link).toHaveAttribute('title',/not a current medical state/);
 const def=page.locator('.hk-player-table tbody tr',{has:page.getByRole('button',{name:'Fixture Defender',exact:true})});
 await expect(def.getByText('No report',{exact:true})).toBeVisible();
 await expect(page.getByText(/no report is not a confirmation of health/)).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
 await page.screenshot({path:'/downloads/hockey-mobile-scouting-medical.png',fullPage:true});
 const wrap=page.locator('.hk-table-wrap').first();await wrap.evaluate(el=>{el.scrollLeft=el.scrollWidth;});
 const badge=fwd.getByRole('link',{name:'Out · 11-04'});await badge.scrollIntoViewIfNeeded();await expect(badge).toBeInViewport();await wrap.screenshot({path:'/downloads/hockey-mobile-scouting-medical-scrolled.png'});
 await page.goto('/apps/hockey/simulator');await page.getByLabel('Your team',{exact:true}).selectOption('10');
 const inc=page.locator('.hk-player-table tbody tr',{has:page.getByRole('checkbox',{name:'Select Fixture Incoming',exact:true})});
 const d2d=inc.getByRole('link',{name:'Day-to-day · 11-05'});
 await expect(d2d).toBeVisible();await expect(d2d).toHaveAttribute('href','https://swisshockeynews.ch/en/shn/medical/fixture-d2d');
 await expect(page.getByText(/not a current medical state/)).toBeVisible();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
 await page.screenshot({path:'/downloads/hockey-mobile-simulator-medical.png',fullPage:true});
 const simWrap=page.locator('.hk-table-wrap').first();await simWrap.evaluate(el=>{el.scrollLeft=el.scrollWidth;});
 await d2d.scrollIntoViewIfNeeded();await expect(d2d).toBeInViewport();await simWrap.screenshot({path:'/downloads/hockey-mobile-simulator-medical-scrolled.png'});
});

test('server-side sorting with direction, nulls last, selection preserved',async({page})=>{
 const requests=await setup(page);await page.goto('/apps/hockey/players');
 await page.getByLabel('Sort by',{exact:true}).selectOption('points');
 await expect.poll(()=>requests[requests.length-1]).toBe('-points');
 await expect(page.locator('.hk-player-table tbody tr').first()).toContainText('Fixture Forward');
 await page.getByRole('checkbox',{name:'Select Fixture Defender',exact:true}).check();
 await page.getByLabel('Sort direction',{exact:true}).selectOption('asc');
 await expect.poll(()=>requests[requests.length-1]).toBe('points');
 await expect(page.locator('.hk-player-table tbody tr').first()).toContainText('Fixture Incoming');
 await expect(page.locator('.hk-player-table tbody tr').last()).toContainText('Fixture Rookie');
 await expect(page.getByRole('checkbox',{name:'Select Fixture Defender',exact:true})).toBeChecked();
 await expect(page.getByRole('region',{name:'Player selection'})).toContainText('1 player selected across filters');
 await page.getByLabel('Sort by',{exact:true}).selectOption('price');
 await expect.poll(()=>requests[requests.length-1]).toBe('price');
 await page.getByLabel('Sort direction',{exact:true}).selectOption('desc');
 await expect.poll(()=>requests[requests.length-1]).toBe('-price');
 await expect(page.locator('.hk-player-table tbody tr').first()).toContainText('Fixture Forward');
 await expect(page.locator('.hk-player-table tbody tr').last()).toContainText('Fixture Rookie');
 await page.screenshot({path:'/downloads/hockey-mobile-sorted.png',fullPage:true});
});

test('shared teams are named, read-only, price-free and show goalie pairs',async({page})=>{
 await setup(page);await page.goto('/apps/hockey/teams');
 await expect(page.getByRole('heading',{name:'Shared with you'})).toBeVisible();
 await page.getByRole('button',{name:/Pongo/}).click();
 await expect(page.getByText('Owner: aurore · Read-only')).toBeVisible();
 await expect(page.getByRole('cell',{name:'Fixture Defender',exact:true})).toBeVisible();
 await expect(page.getByRole('cell',{name:'Fixture Pair A/B',exact:true})).toBeVisible();
 await expect(page.getByRole('cell',{name:'Goalie pair',exact:true})).toBeVisible();
 await expect(page.getByText(/prices are excluded from this share/i)).toBeVisible();
 await expect(page.getByText('5.0 M')).toHaveCount(0);
 await expect(page.getByText('14.0')).toHaveCount(0);
 const shared=page.locator('section.hk-card',{has:page.getByRole('heading',{name:'Shared with you'})});
 await expect(shared.getByRole('button',{name:'Remove'})).toHaveCount(0);
 await expect(shared.getByRole('button',{name:'Plan a transfer'})).toHaveCount(0);
 await page.getByRole('button',{name:/Fixture team/}).click();
 await expect(page.getByRole('heading',{name:'Goalkeeper pairs'})).toBeVisible();
 await expect(page.getByText('Fixture Own Pair C/D')).toBeVisible();
 await expect(page.getByText(/last observed 13.0 M \(not an acquisition cost\)/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Remove'})).toHaveCount(1);
 await page.screenshot({path:'/downloads/hockey-mobile-shared-teams.png',fullPage:true});
});
