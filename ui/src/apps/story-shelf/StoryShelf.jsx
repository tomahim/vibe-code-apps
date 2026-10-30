import { useEffect, useRef, useState } from 'react';
import { books, categories, illustration } from './content';
import Diorama from './Diorama';
import ShelfRoom from './ShelfRoom';
import './story-shelf.css';

function useReducedMotion() {
  const [reduced, set] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { const q=window.matchMedia('(prefers-reduced-motion: reduce)'); const update=()=>set(q.matches); q.addEventListener('change',update); return ()=>q.removeEventListener('change',update); },[]);
  return reduced;
}
export default function StoryShelf({ onHome }) {
  const [selected, setSelected] = useState(null);
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  const [page, setPage] = useState(0);
  const [turn, setTurn] = useState(null);
  const [filter, setFilter] = useState('All shelves');
  const [still, setStill] = useState(false);
  const [sources, setSources] = useState(false);
  const reduced = useReducedMotion();
  const timer=useRef(); const readerTitle=useRef(); const lastBook=useRef(); const start=useRef();
  const current = selected?.pages[page];
  function choose(book, event) { lastBook.current=book.slug; setSelected(book);setOpened(false);setOpening(false);setPage(0);setSources(false); }
  function back() { clearTimeout(timer.current);setTurn(null);setSelected(null);setOpened(false);setSources(false); requestAnimationFrame(()=>document.querySelector(`[data-book="${lastBook.current}"]`)?.focus()); }
  function openBook() {
    if(opening) return;
    if(reduced) { setOpened(true); return; }
    setOpening(true);
    timer.current=setTimeout(()=>{setOpening(false);setOpened(true);},720);
  }
  function flip(direction) {
    if(!opened || turn || page+direction<0 || page+direction>=selected.pages.length) return;
    if(reduced) {setPage(p=>p+direction); return;}
    setTurn(direction);
    timer.current=setTimeout(()=>{setPage(p=>p+direction);setTurn(null);},680);
  }
  useEffect(()=>()=>clearTimeout(timer.current),[]);
  useEffect(()=>{ if(selected) readerTitle.current?.focus(); },[selected,opened,page]);
  useEffect(()=>{ const key=e=>{ if(!selected || /INPUT|TEXTAREA/.test(e.target.tagName))return; if(e.key==='Escape'){e.preventDefault();back();} if(e.key==='ArrowRight'){e.preventDefault();flip(1);} if(e.key==='ArrowLeft'){e.preventDefault();flip(-1);} }; window.addEventListener('keydown',key); return()=>window.removeEventListener('keydown',key); });
  return <main className={`ss-app ${selected?'ss-reading':''}`}>
    <div className="ss-grain" aria-hidden="true" />
    <header className="ss-header"><button onClick={selected?back:onHome} className="ss-back">← <span>{selected?'The shelves':'Gallery'}</span></button><div className="ss-wordmark"><span aria-hidden="true">✳</span> THE STORY ROOM</div><button className="ss-about" onClick={()=>setSources(s=>!s)} aria-expanded={sources}>About & sources</button></header>
    {sources && <aside className="ss-sources"><h2>A small library, made to explore</h2><p>Four original, five-page books in English, designed for curious readers around 7-10. History books are historical fiction: invented children and dialogue, with real background facts. Pictures are AI-generated storybook art, not historical evidence. Paper sculptures are original Three.js models.</p><ul><li><a href="https://mediengeschichte.dnb.de/DBSMZBN/Content/EN/Printing/04-europaeischer-typendruck-en.html" target="_blank" rel="noreferrer">German National Library: European type printing</a></li><li><a href="https://www.nhm.ac.uk/discover/mary-anning-unsung-hero.html" target="_blank" rel="noreferrer">Natural History Museum: Mary Anning</a></li><li><a href="https://www.rhs.org.uk/education-learning/school-gardening/resources/gardening-club/planting-acorns" target="_blank" rel="noreferrer">RHS: growing acorns</a></li><li><a href="https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/british-trees/a-z-of-british-trees/english-oak/" target="_blank" rel="noreferrer">Woodland Trust: English oak</a></li><li><a href="https://www.usgs.gov/water-science-school/water-cycle" target="_blank" rel="noreferrer">USGS: the water cycle</a></li></ul><p>Inspired by the physical-book interaction of <a href="https://iamtechartist.com/dinosaurs-to-birds/" target="_blank" rel="noreferrer">Techartist's Still Here</a>. No code, models or images from that work are included.</p><button onClick={()=>setSources(false)}>Close notes</button></aside>}
    {!selected ? <>
      <section className="ss-intro"><div><p className="ss-eyebrow">A LITTLE LIBRARY OF BIG WONDERS</p><h1>Every spine.<br/>A new world.</h1><p className="ss-deck">Choose a book. Pull up a chair.<br/>Let the ordinary become extraordinary.</p></div><div className="ss-library-seal" aria-hidden="true"><span>EST. 2026</span><strong>4</strong><span>WORLDS TO WANDER</span></div></section>
      <nav className="ss-filters" aria-label="Book categories">{['All shelves',...categories].map(c=><button key={c} className={filter===c?'active':''} onClick={()=>setFilter(c)} aria-pressed={filter===c}>{c}</button>)}</nav>
      <ShelfRoom category={filter} reduced={reduced} onChoose={book=>choose(book,{currentTarget:null})}/>
      <div className="ss-collection-label"><span>THE COLLECTION</span><p>Or choose a cover below</p></div>
      <section className="ss-library" aria-label="Bookshelves">{categories.filter(c=>filter==='All shelves'||filter===c).map((category,index)=><section className="ss-shelf" key={category} aria-label={`${category} shelf`}><div className="ss-shelf-label"><span>0{categories.indexOf(category)+1}</span><h2>{category}</h2><p>{category==='History'?'Small footsteps through time':category==='Nature'?'The wild, wonderful everyday':'Where the earth meets the sky'}</p></div><div className="ss-books">{books.filter(b=>b.category===category).map((book,i)=><button key={book.slug} data-book={book.slug} className="ss-book-pick" style={{'--book-color':book.color,'--lean':`${i%2?-4:3}deg`}} onClick={e=>choose(book,e)} aria-label={`Read ${book.title}`}><span className="ss-book-volume"><span className="ss-book-spine"><i>THE STORY ROOM</i><strong>{book.title}</strong><b>✳</b></span><span className="ss-book-cover"><img src={book.cover} alt=""/><span className="ss-cover-type"><small>{book.category.toUpperCase()}</small><strong>{book.title}</strong><em>{book.subtitle}</em></span></span><span className="ss-book-edge"/></span><span className="ss-book-caption">{book.title}<small>5 pages · Open book ↗</small></span></button>)}<div className={`ss-shelf-decoration ss-decoration-${category.toLowerCase()}`} aria-hidden="true">{category==='History'?<><div className="ss-stack"/><span>✦</span></>:category==='Nature'?<><div className="ss-vase">♧</div><span>A little wonder<br/>goes a long way.</span></>:<><div className="ss-paper-mountain"/><span>Take the<br/>scenic route.</span></>}</div></div><div className="ss-wood-shelf" aria-hidden="true"/></section>)}</section>
      <footer className="ss-library-footer"><span>ILLUSTRATED STORIES · CURIOUS MINDS</span><p>Nothing to download. Just turn the page.</p></footer>
    </> : <section className="ss-table-room" aria-label={`${selected.title} reading table`} style={{'--book-color':selected.color}}>
      <div className="ss-reader-heading"><p className="ss-eyebrow">{selected.label}</p><h1 tabIndex="-1" ref={readerTitle}>{opened?current.title:selected.title}</h1><p>{opened?`Page ${page+1} of ${selected.pages.length}`:selected.subtitle}</p></div>
      {!opened ? <div className={`ss-closed-stage ${opening?'ss-opening':''}`}><div className="ss-table-light"/><button className="ss-closed-book" onClick={openBook} aria-label={`Open ${selected.title}`}><span className="ss-closed-pages"/><span className="ss-closed-cover"><img src={selected.cover} alt=""/><span><small>THE STORY ROOM · {selected.category.toUpperCase()}</small><strong>{selected.title}</strong><em>{selected.subtitle}</em><b>Open the book ↗</b></span></span></button><p className="ss-closed-note">A quiet moment before the first page.</p></div> : <>
        <div className={`ss-open-book ${turn?'ss-turning':''}`} onTouchStart={e=>{if(e.target.tagName!=='CANVAS') start.current={x:e.touches[0].clientX,y:e.touches[0].clientY};}} onTouchEnd={e=>{const t=e.changedTouches[0];if(start.current && Math.abs(t.clientY-start.current.y)<65 && Math.abs(t.clientX-start.current.x)>65)flip(t.clientX<start.current.x?1:-1);start.current=null;}}>
          <article className="ss-text-leaf"><span className="ss-page-imprint">{selected.title} <i>✳</i></span><span className="ss-chapter-number">0{page+1}</span><h2>{current.title}</h2>{current.paragraphs.map((p,i)=><p key={i}>{p}</p>)}<aside className="ss-field-note"><span>PAUSE & WONDER</span>{current.note}</aside><span className="ss-page-number">{String(page*2+1).padStart(2,'0')}</span></article>
          <div className="ss-picture-leaf"><div className="ss-model-caption"><span>THE PAPER THEATRE</span><button onClick={()=>setStill(s=>!s)} aria-pressed={still}>{still?'Let it move':'Pause motion'}</button></div><Diorama kind={selected.model} page={page} reduced={reduced||still}/><p className="ss-drag-hint">Drag the sculpture to explore ↔</p><img className="ss-story-illustration" src={illustration(selected,page)} alt={`${selected.title}: ${current.title}, an original storybook illustration`}/><div className="ss-picture-caption"><span>AN IMAGINED WORLD, A REAL CURIOSITY</span><span>{String(page*2+2).padStart(2,'0')}</span></div></div>
          {turn && <div className={`ss-turn-leaf ${turn<0?'ss-turn-back':''}`} aria-hidden="true"><img src={illustration(selected,page)}/></div>}
          <span className="ss-book-ribbon" aria-hidden="true"/>
        </div>
        <nav className="ss-page-controls" aria-label="Turn story pages"><button aria-label="Previous page" onClick={()=>flip(-1)} disabled={page===0||!!turn}>← <span>Previous</span></button><div className="ss-page-dots">{selected.pages.map((_,i)=><button key={i} aria-label={`Go to page ${i+1}`} aria-current={page===i?'page':undefined} disabled={!!turn} onClick={()=>{setPage(i);}}>{i+1}</button>)}</div><button aria-label={page===selected.pages.length-1?'Return to shelves':'Next page'} onClick={()=>page===selected.pages.length-1?back():flip(1)} disabled={!!turn}><span>{page===selected.pages.length-1?'The shelves':'Next page'}</span> →</button></nav>
        <p className="ss-reading-hint">Arrow keys or swipe to turn · Escape to return · <button onClick={()=>{setOpened(false);setPage(0);}}>Close book</button></p>
        <span className="ss-live" role="status" aria-live="polite">Page {page+1} of {selected.pages.length}: {current.title}</span>
      </>}
    </section>}
  </main>;
}
