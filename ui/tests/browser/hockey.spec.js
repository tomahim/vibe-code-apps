import { test, expect } from '@playwright/test';
const players = [
 {licence_id:1,name:'Fixture Forward',position:'F',team:{id:1,name:'Fixture Club',acronym:'FIX'},season:{games:3,goals:2,assists:4,points:6},hm:{price_m:'8.5',captured_on:'2026-11-04'}},
 {licence_id:2,name:'Fixture Defender',position:'D',team:{id:1,name:'Fixture Club',acronym:'FIX'},season:{games:3,goals:1,assists:2,points:3},hm:{price_m:null}},
 {licence_id:3,name:'Fixture Incoming',position:'F',team:{id:2,name:'Other Club',acronym:'OTH'},season:{games:2,goals:1,assists:0,points:1},hm:{price_m:'6.5'}},
];
async function setup(page,{empty=false}={}){
 const saved=[];
 await page.addInitScript(()=>{localStorage.setItem('genious_token','fixture-token');localStorage.setItem('genious_user',JSON.stringify({email:'fixture@example.invalid'}));});
 await page.route('**/api/apps/hockey/**',async route=>{
  const url=new URL(route.request().url()), path=url.pathname.replace('/api/apps/hockey/','');
  let data={};
  if(path==='teams/') data={teams:empty?[]:[{id:1,name:'Fixture Club'},{id:2,name:'Other Club'}]};
  else if(path==='players/') data={players:empty?[]:players.filter(p=>(!url.searchParams.get('q') || p.name.toLowerCase().includes(url.searchParams.get('q').toLowerCase())) && (!url.searchParams.get('team') || String(p.team.id)===url.searchParams.get('team')))};
  else if(path==='standings/') data={rows:[]};
  else if(path==='compare/') data={players:players.filter(p=>url.searchParams.get('ids').split(',').includes(String(p.licence_id))).map(p=>({...p,weeks:[{week:38,games:1,goals:p.licence_id,assists:1,points:p.licence_id+1},{week:40,games:2,goals:0,assists:1,points:1}]})),missing:[]};
  else if(path==='my/teams/') data={teams:empty?[]:[{id:10,name:'Fixture team',roster_size:1}]};
  else if(path==='my/teams/10/') data={id:10,name:'Fixture team',roster:[{player:1,name:'Fixture Forward',slot:'F',acquired_price_m:null,source:'manual'}]};
  else if(path==='my/teams/10/simulations/') { if(route.request().method()==='POST'){ data={id:20,name:'Transfer what-if',computed_budget_after_m:'142',notes:'',created_at:'2026-11-04T21:00:00Z',sells:[players[0]],buys:[players[2]]};saved.push(data); } else data={simulations:saved}; }
  else if(path==='players/1/') data={...players[0],stints:[]};
  await route.fulfill({json:data});
 });
}
test('signed-out visitors are redirected to sign-in preserving the hockey route',async({page})=>{
 await page.goto('/apps/hockey/compare');await expect(page).toHaveURL(/\/login\?next=%2Fapps%2Fhockey%2Fcompare/);await expect(page.getByRole('heading',{name:'Welcome back.'})).toBeVisible();
});
test('search, club filters, selection, comparison graphs, details and refresh',async({page})=>{
 await setup(page);await page.goto('/apps/hockey/players');await expect(page.getByRole('heading',{name:'Hockey Lab'})).toBeVisible();
 await page.getByRole('checkbox',{name:'Select Fixture Forward',exact:true}).check();await page.getByLabel('Club',{exact:true}).selectOption('2');await expect(page.getByRole('button',{name:'Fixture Incoming',exact:true})).toBeVisible();await page.getByRole('checkbox',{name:'Select Fixture Incoming',exact:true}).check();
 await page.getByRole('button',{name:'Compare selected'}).click();await expect(page.getByRole('img',{name:/Weekly points/})).toBeVisible();await expect(page.getByText('2 players selected across filters')).toBeVisible();
 await page.getByLabel('Measure',{exact:true}).selectOption('goals');await expect(page.getByRole('img',{name:/Weekly goals/})).toBeVisible();await page.getByRole('button',{name:'Refresh data'}).click();await expect(page.getByRole('img',{name:/Weekly goals/})).toBeVisible();
 await page.getByLabel('Club',{exact:true}).selectOption('');await page.getByRole('button',{name:'Fixture Forward',exact:true}).click();await expect(page.getByRole('heading',{name:'Club history'})).toBeVisible();await page.getByRole('button',{name:'Close player details'}).click();
 await page.getByLabel('Find a player').fill('Defender');await expect(page.getByRole('button',{name:'Fixture Defender',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Fixture Forward',exact:true})).toHaveCount(0);
});
test('rosters and simulation suppress unknown-cost budget, never make real trade',async({page})=>{
 await setup(page);await page.goto('/apps/hockey/teams');await page.getByRole('button',{name:/Fixture team/}).click();await expect(page.getByRole('cell',{name:'Unknown',exact:true})).toBeVisible();await page.screenshot({path:'/downloads/hockey-mobile-teams.png',fullPage:true});await page.getByRole('button',{name:'Plan a transfer'}).click();
 await page.getByRole('checkbox',{name:'Fixture Forward F'}).check();await page.getByRole('checkbox',{name:'Select Fixture Incoming',exact:true}).check();await page.getByRole('button',{name:'Save what-if (no real trade)'}).click();await expect(page.getByRole('heading',{name:'Saved: Transfer what-if'})).toBeVisible();await expect(page.getByText('Budget unavailable: missing costs or current HM prices.')).toBeVisible();await expect(page.getByText(/Estimated budget after:/)).toHaveCount(0);await expect(page.locator('.hk-sim-history li')).toHaveCount(1);await expect(page.locator('.hk-sim-history')).toContainText('Fixture Incoming');await page.screenshot({path:'/downloads/hockey-simulator.png',fullPage:true});await page.reload();await page.getByLabel('Your team',{exact:true}).selectOption('10');await expect(page.locator('.hk-sim-history li')).toHaveCount(1);await expect(page.locator('.hk-sim-history')).toContainText('Fixture Incoming');
});
test('honest empty states and mobile screenshots',async({page})=>{
 await setup(page,{empty:true});await page.setViewportSize({width:393,height:852});await page.goto('/apps/hockey/players');await expect(page.getByText(/No players found/)).toBeVisible();await expect(page.getByText(/Official standings have not/)).toBeVisible();await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
 await page.screenshot({path:'/downloads/hockey-mobile-empty.png',fullPage:true});
});
test('mobile populated and comparison visual evidence',async({page})=>{
 await setup(page);await page.setViewportSize({width:393,height:852});await page.goto('/apps/hockey/players');await expect(page.getByRole('button',{name:'Fixture Forward',exact:true})).toBeVisible();await page.screenshot({path:'/downloads/hockey-mobile-players.png',fullPage:true});
 await page.getByRole('checkbox',{name:'Select Fixture Forward',exact:true}).check();await page.getByRole('checkbox',{name:'Select Fixture Defender',exact:true}).check();await page.getByRole('button',{name:'Compare selected'}).click();await expect(page.getByRole('img',{name:/Weekly points/})).toBeVisible();await page.screenshot({path:'/downloads/hockey-mobile-compare.png',fullPage:true});await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
 await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'/downloads/hockey-desktop-compare.png',fullPage:true});
});
test('errors show retry and expired JWT returns to sign-in',async({page})=>{
 await setup(page);await page.route('**/api/apps/hockey/players/**',route=>route.fulfill({status:500,json:{error:'Fixture import unavailable'}}));await page.goto('/apps/hockey/players');await expect(page.getByRole('alert').filter({hasText:'Fixture import unavailable'})).toBeVisible();
 await page.route('**/api/apps/hockey/players/**',route=>route.fulfill({status:401,json:{error:'Expired'}}));await page.getByRole('button',{name:'Refresh data'}).click();await expect(page).toHaveURL(/\/login\?next=/);
});

test('official standings show exact source date and shootout splits',async({page})=>{
 await setup(page);await page.route('**/api/apps/hockey/standings/**',r=>r.fulfill({json:{season:2027,captured_on:'2026-11-04',source:'data.sihf.ch standing table',source_updated_at:'2026-11-04T20:00:00Z',rows:[{rank:1,team:{id:1,name:'Fixture Club'},games_played:20,wins:10,ot_wins:2,so_wins:1,so_losses:2,ot_losses:1,losses:4,points:39,goals_for:60,goals_against:40}]}}));await page.goto('/apps/hockey/players');await expect(page.getByRole('columnheader',{name:'SOW',exact:true})).toBeVisible();await expect(page.getByText(/Source: data.sihf.ch standing table/)).toContainText('2026-11-04T20:00:00Z');
});
test('successful sign-in returns to hockey and rejects external next URL',async({page})=>{
 await page.route('**/api/auth/login',r=>r.fulfill({json:{token:'fixture-token',user:{email:'fixture@example.invalid'}}}));await page.route('**/api/apps/hockey/**',r=>r.fulfill({json:{players:[],teams:[],rows:[]}}));await page.goto('/login?next=%2Fapps%2Fhockey%2Fteams');await page.getByLabel('Email',{exact:true}).fill('fixture@example.invalid');await page.getByLabel('Password',{exact:true}).fill('not-a-real-password');await page.getByRole('button',{name:'Log in',exact:true}).click();await expect(page).toHaveURL(/apps\/hockey\/teams$/);
});
