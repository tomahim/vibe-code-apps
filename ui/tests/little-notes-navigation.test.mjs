import test from 'node:test';
import assert from 'node:assert/strict';
import { readNotesRoute, notesUrl } from '../src/apps/little-notes/navigation.js';

test('Little notes routes round-trip filters, view, page, item and admin', () => {
 const route={type:'idea',category:'',tag:'maps',q:'earth & water',month:'2026-11',page:2,view:'calendar',item:'real-item-id',day:'2026-11-04',adminKind:'tags',admin:true};
 assert.deepEqual(readNotesRoute(notesUrl(route).split('?')[1]),route);
});
test('Little notes route defaults and invalid values are safe',()=>{
 const route=readNotesRoute('?view=no&month=2026-99&page=-1');
 assert.equal(route.view,'default');assert.equal(route.month,'');assert.equal(route.page,1);assert.equal(route.category,'inbox');
 assert.equal(readNotesRoute('?category=').category,'');
});
