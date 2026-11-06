import { useState } from 'react';
import { GLOSSARY_CATEGORIES, GLOSSARY_TERMS } from './glossary';

function WordCard({ term, category }) {
    const [english, setEnglish] = useState(false);
    const [failed, setFailed] = useState(false);
    const lang = english ? 'en' : 'fr';
    const side = term[lang];
    return (
        <article className="gcard" data-term={term.id}>
            <div className="gface-imgwrap">
                {!failed ? <img className="gface-img" src={term.image.url} alt={term.image.alt} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
                    : <span className="gimage-fallback">Image indisponible · Image unavailable</span>}
            </div>
            <div className="gface-body" key={lang} lang={lang}>
                <div className="gface-topline"><span className="gface-lang">{lang.toUpperCase()}</span><span className="gface-cat">{category[lang]}</span></div>
                <h2 className="gface-term">{side.term}</h2>
                <p className="gface-def">{side.definition}</p>
                <div className="gface-foot">
                    <a href={side.source} target="_blank" rel="noreferrer">Source</a>
                    <button className="gflip" aria-label={`${side.term} : ${english ? 'voir en français' : 'read in English'}`} aria-pressed={english} onClick={() => setEnglish(!english)}>{english ? '↻ Français' : '↻ English'}</button>
                </div>
            </div>
            <a className="gface-credit" href={term.image.file} target="_blank" rel="noreferrer">{term.image.credit} · {term.image.license}</a>
        </article>
    );
}

export function Glossary() {
    const [cat, setCat] = useState('all');
    const [query, setQuery] = useState('');
    const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const terms = GLOSSARY_TERMS.filter((t) => (cat === 'all' || t.category === cat) && normalize(`${t.fr.term} ${t.en.term}`).includes(normalize(query.trim())));
    return (
        <section className="gloss" aria-label="Glossaire géologique bilingue">
            <div className="gloss-bar">
                <h1>Glossaire géologique</h1>
                <p className="gloss-intro">Un mot, deux faces. Retournez chaque carte pour passer du français à l'anglais.</p>
                <label className="gloss-search">Rechercher · Search<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Affleurement, outcrop…" /></label>
                <div className="litho-tabs gloss-tabs" role="group" aria-label="Catégories du glossaire">
                    <button aria-pressed={cat === 'all'} className={'litho-tab' + (cat === 'all' ? ' on' : '')} onClick={() => setCat('all')}>Tout · All</button>
                    {GLOSSARY_CATEGORIES.map((c) => <button key={c.id} aria-pressed={cat === c.id} className={'litho-tab' + (cat === c.id ? ' on' : '')} onClick={() => setCat(c.id)}>{c.fr}</button>)}
                </div>
                <span className="litho-cat-count" role="status">{terms.length} mots · terms</span>
            </div>
            <div className="gloss-grid">
                {terms.map((term) => <WordCard key={term.id} term={term} category={GLOSSARY_CATEGORIES.find((c) => c.id === term.category)} />)}
            </div>
            {terms.length === 0 && <p>Aucun mot trouvé · No terms found.</p>}
        </section>
    );
}
