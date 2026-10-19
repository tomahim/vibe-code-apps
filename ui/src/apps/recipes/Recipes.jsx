import { useEffect, useRef, useState } from 'react';
import RecipeWheel from './RecipeWheel.jsx';
import { ingredientNames, recipeQuery, safeUrl, wheelRecipes } from './wheel.js';
import './recipes.css';

const API = '/api/apps/recipes/';

async function readRecipes(endpoint, signal) {
  const response = await fetch(`${API}${endpoint}`, { signal });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('The recipe collection is unavailable. Please try again.');
  return response.json();
}

function RecipePhoto({ recipe }) {
  const [failed, setFailed] = useState(false);
  const url = safeUrl(recipe.image_url);
  return url && !failed
    ? <img className="recipe-photo" src={url} alt={recipe.title} onError={() => setFailed(true)} />
    : <div className="recipe-photo-placeholder"><span aria-hidden="true">♧</span><p>{failed ? 'Photo unavailable' : 'Good food needs no photo.'}</p></div>;
}

export default function Recipes({ onHome }) {
  const [draft, setDraft] = useState('');
  const [filters, setFilters] = useState([]);
  const [revision, setRevision] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [segments, setSegments] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [spin, setSpin] = useState(null);
  const [result, setResult] = useState(null);
  const active = useRef(null);
  const busy = useRef(false);
  const resultRef = useRef(null);
  const query = recipeQuery(filters);
  const spinning = status === 'choosing' || status === 'spinning';

  useEffect(() => {
    const controller = new AbortController();
    active.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    let disposed = false;
    setStatus('loading'); setError(''); setResult(null); setSpin(null);
    readRecipes(`recipes/${query}`, controller.signal)
      .then((data) => {
        if (disposed) return;
        if (!Array.isArray(data?.recipes)) throw new Error('Could not read the recipe collection. Please try again.');
        setCandidates(data.recipes);
        setSegments(wheelRecipes(data.recipes));
        setStatus(data.recipes.length ? 'ready' : 'empty');
      })
      .catch((err) => {
        if (disposed) return;
        setStatus('error'); setSegments([]);
        setError(err.name === 'AbortError' ? 'The request timed out. Please try again.' : err.message);
      })
      .finally(() => clearTimeout(timeout));
    return () => { disposed = true; controller.abort(); clearTimeout(timeout); };
  }, [query, revision]);

  useEffect(() => () => active.current?.abort(), []);

  function applyFilters(event) {
    event.preventDefault();
    if (busy.current) return;
    const names = ingredientNames(draft);
    setDraft(names.join(', ')); setFilters(names);
  }

  async function startSpin() {
    if (busy.current || !['ready', 'done'].includes(status)) return;
    busy.current = true;
    setStatus('choosing'); setError(''); setResult(null);
    const controller = new AbortController();
    active.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const recipe = await readRecipes(`random/${query}`, controller.signal);
      if (controller.signal.aborted) return;
      if (!recipe) {
        setSegments([]); setCandidates([]); setStatus('empty'); busy.current = false;
        return;
      }
      if (!recipe.id || typeof recipe.title !== 'string' || !Array.isArray(recipe.ingredients)) throw new Error('Could not read the selected recipe. Please try again.');
      // Keep the current wheel when possible; include the API winner if it was
      // outside the displayed subset (or added since the list was loaded).
      const next = segments.some((item) => item.id === recipe.id) ? segments : wheelRecipes(candidates, recipe);
      setSegments(next);
      setSpin({ index: next.findIndex((item) => item.id === recipe.id), recipe, id: Date.now() });
      setStatus('spinning');
    } catch (err) {
      setError(err.name === 'AbortError' ? 'The request timed out. Please try again.' : err.message);
      setStatus('ready'); busy.current = false;
    } finally { clearTimeout(timeout); }
  }

  function finishSpin(recipe) {
    setResult(recipe); setStatus('done'); busy.current = false;
    requestAnimationFrame(() => {
      resultRef.current?.focus({ preventScroll: true });
      if (window.matchMedia('(max-width: 760px)').matches) {
        resultRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      }
    });
  }

  function clearFilters() { setDraft(''); setFilters([]); }
  const source = safeUrl(result?.source_url);

  return <main className="recipes-app">
    <header className="recipes-header"><button onClick={onHome}>← All apps</button><span>ETCHEBEST <i> / </i> THE RECIPE COLLECTION</span><a href="/admin/recipes/recipe/">Manage recipes ↗</a></header>
    <section className="recipes-intro"><p className="recipes-eyebrow">A LITTLE CHANCE. A GREAT MEAL.</p><h1>What’s cooking tonight?</h1><p>Bring your ingredients. Let the wheel bring the inspiration.</p></section>
    <div className="recipes-layout">
      <section className="recipes-stage" aria-label="Recipe selector">
        <div className="recipes-stage-top"><span>LA ROUE DU CHEF</span><span>{status === 'loading' ? 'Loading collection…' : `${candidates.length} eligible recipe${candidates.length === 1 ? '' : 's'}`}</span></div>
        {segments.length > 0 && !['loading', 'error'].includes(status) ? <RecipeWheel recipes={segments} spin={spin} onComplete={finishSpin} /> : <div className="recipes-wheel-empty"><span aria-hidden="true">✧</span><h2>{status === 'loading' ? 'Setting the table…' : status === 'empty' ? 'No recipes on the menu.' : 'The kitchen is taking a moment.'}</h2><p>{status === 'empty' ? filters.length ? 'No recipe contains every selected ingredient. Try fewer ingredients or clear the filters.' : 'Add your first recipe to give the wheel something delicious to choose.' : status === 'loading' ? 'Fetching your recipe collection.' : 'Try loading the collection again.'}</p>{status === 'empty' && (filters.length ? <button onClick={clearFilters}>Clear filters</button> : <a href="/admin/recipes/recipe/add/">Add a recipe ↗</a>)}</div>}
        <button className="recipes-spin" onClick={startSpin} disabled={!['ready', 'done'].includes(status)}>{status === 'choosing' ? 'Choosing your recipe…' : status === 'spinning' ? 'A little suspense…' : result ? 'Spin again ↻' : 'Spin the wheel ↻'}</button>
        <p className="recipes-spin-note" role="status">{spinning ? 'Your next meal is on its way.' : result ? `On the menu: ${result.title}` : 'Ten slices of inspiration. One delicious decision.'}</p>
        {segments.length > 0 && <details className="recipes-wheel-list"><summary>Recipes on this wheel</summary><ol>{segments.map((recipe, i) => <li key={i} data-selected={result?.id === recipe.id || undefined}>{recipe.title}</li>)}</ol></details>}
      </section>
      <aside className="recipes-sidebar">
        <section className="recipes-filter"><p className="recipes-eyebrow">01 / YOUR PANTRY</p><h2>What do you have?</h2><p>Find recipes that use <strong>every</strong> ingredient you enter. Leave blank to explore everything.</p><form onSubmit={applyFilters}><label htmlFor="recipe-ingredients">Ingredients, separated by commas</label><input id="recipe-ingredients" placeholder="tomato, pasta, basil" value={draft} onChange={(event) => setDraft(event.target.value)} disabled={spinning} /><button disabled={spinning} type="submit">Find recipes <span>→</span></button></form>{filters.length > 0 && <div className="recipes-active-filters"><span>Using: {filters.join(' + ')}</span><button disabled={spinning} onClick={clearFilters}>Clear</button></div>}</section>
        {error && <div className="recipes-error" role="alert"><p>{error}</p>{status === 'error' && <button onClick={() => setRevision((value) => value + 1)}>Try again</button>}</div>}
        <section className="recipes-result" ref={resultRef} tabIndex={-1} aria-label="Selected recipe" aria-busy={spinning}>
          <p className="recipes-eyebrow">02 / TONIGHT’S INSPIRATION</p>
          {result ? <><RecipePhoto key={`${spin?.id}-${result.image_url}`} recipe={result} /><div className="recipes-result-copy"><span className="recipes-picked">THE WHEEL HAS SPOKEN</span><h2>{result.title}</h2><h3>Ingredients</h3>{result.ingredients.length ? <ul>{result.ingredients.map((item, i) => <li key={i}><span>{item.name}</span><strong>{item.quantity || 'Not specified'}</strong></li>)}</ul> : <p>No ingredients recorded for this recipe yet.</p>}{source && <a className="recipes-source" href={source} target="_blank" rel="noopener noreferrer">View the recipe <span>↗</span></a>}</div></> : <div className="recipes-result-waiting"><span aria-hidden="true">♧</span><h2>Your next favorite awaits.</h2><p>Give the wheel a spin. Your recipe, ingredients, and photo will appear here.</p></div>}
        </section>
      </aside>
    </div><footer className="recipes-footer">Less deciding. More cooking.<span>Bon appétit.</span></footer>
  </main>;
}
