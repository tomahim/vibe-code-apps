import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = new URL('../src/apps/lithotheque/', import.meta.url);
const { MINERALS } = await import(new URL('minerals.js', base));

test('six unique specimens with complete dossiers and reference-labelled readouts', () => {
  assert.equal(MINERALS.length, 6);
  assert.equal(new Set(MINERALS.map((m) => m.id)).size, 6);
  assert.equal(new Set(MINERALS.map((m) => m.no)).size, 6);
  for (const m of MINERALS) {
    for (const field of ['name', 'formula', 'system', 'hardness', 'sg', 'streak', 'luster', 'group', 'habit', 'typical', 'geology', 'story']) {
      assert.ok(m[field] && m[field].length > 0, `${m.id}: missing ${field}`);
    }
    assert.equal(m.readouts.length, 4, m.id);
    for (const r of m.readouts) assert.match(r.result, /^Reference: /, `${m.id}: readout not labelled as reference`);
    assert.ok(m.readouts.some((r) => r.tool === 'UV lamp'), `${m.id}: no UV lamp readout`);
    assert.ok(m.sources.length >= 1, `${m.id}: no sources`);
    for (const s of m.sources) assert.ok(s.url.startsWith('https://'), `${m.id}: insecure source ${s.url}`);
  }
});

test('app omits the requested model and readout disclaimer and ships no remote content', () => {
  const app = fs.readFileSync(new URL('Lithotheque.jsx', base), 'utf8');
  assert.doesNotMatch(app, /HonestNote|Original Three\.js study models|never scans or measured specimens|published reference values for the species/);
  assert.doesNotMatch(app, /fetch\(/);
  const engine = fs.readFileSync(new URL('engine.js', base), 'utf8');
  assert.match(engine, /three/);
  assert.doesNotMatch(engine, /fetch\(|https?:\/\//);
});

const { GLOSSARY_CATEGORIES, GLOSSARY_TERMS } = await import(new URL('glossary.js', base));
test('glossary has unique categories, complete bilingual cards, sources and image attribution', () => {
  const ids = new Set(GLOSSARY_CATEGORIES.map(c => c.id));
  assert.equal(ids.size, GLOSSARY_CATEGORIES.length);
  assert.equal(new Set(GLOSSARY_TERMS.map(t => t.id)).size, GLOSSARY_TERMS.length);
  for (const t of GLOSSARY_TERMS) {
    assert.ok(ids.has(t.category));
    for (const lang of ['fr', 'en']) {
      assert.ok(t[lang].term && t[lang].definition.length > 30);
      assert.match(t[lang].source, /^https:\/\//);
    }
    assert.match(t.image.url, /^https:\/\//);
    assert.match(t.image.file, /^https:\/\/commons.wikimedia.org\/wiki\/File:/);
    assert.ok(t.image.credit && t.image.alt);
    assert.match(t.image.license, /^(CC BY|Public domain)/);
  }
  for (const id of ['affleurement','gisement','schiste','granite','argile','gres','ravinement','lithosphere']) assert.ok(GLOSSARY_TERMS.some(t => t.id === id), id);
});

test('GEO follow-up keeps petrography and the requested plural profession separate', () => {
    const petro = GLOSSARY_TERMS.find((term) => term.id === 'petrographie');
    const technicians = GLOSSARY_TERMS.find((term) => term.id === 'litholamelleurs');
    assert.equal(petro.en.term, 'Petrography');
    assert.equal(technicians.fr.term, 'Litholamelleurs');
    assert.equal(technicians.en.term, 'Thin section technicians');
    assert.match(technicians.fr.definition, /Pluriel de litholamelleur/);
    assert.equal(petro.category, 'methodes');
    assert.equal(technicians.category, 'methodes');
});
