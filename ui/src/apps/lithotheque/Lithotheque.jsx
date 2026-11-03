import { useState } from 'react';
import { MINERALS } from './minerals';
import { SpecimenCanvas } from './SpecimenCanvas';
import './lithotheque.css';

const GROUPS = ['All', ...new Set(MINERALS.map((m) => m.group))];
const TABS = ['Identity', 'Geology', 'Occurrence', 'Story', 'Resources'];

function FactGrid({ m }) {
    const rows = [
        ['Formula', m.formula], ['Crystal system', m.system], ['Hardness', m.hardness],
        ['Specific gravity', m.sg], ['Streak', m.streak], ['Luster', m.luster],
        ['Group', m.group], ['Habit', m.habit], ['Typical localities', m.typical],
    ];
    return (
        <dl className="litho-factgrid">
            {rows.map(([k, v]) => (
                <div key={k} className="litho-factrow"><dt>{k}</dt><dd>{v}</dd></div>
            ))}
        </dl>
    );
}

function SourceList({ m }) {
    return (
        <ul className="litho-sources">
            {m.sources.map((s) => (
                <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.label}</a></li>
            ))}
        </ul>
    );
}

export default function Lithotheque({ onHome }) {
    const [sel, setSel] = useState(null);
    const [group, setGroup] = useState('All');
    const [tab, setTab] = useState('Identity');
    const [tool, setTool] = useState(0);
    const list = group === 'All' ? MINERALS : MINERALS.filter((m) => m.group === group);
    const uv = sel !== null && sel.readouts[tool].tool === 'UV lamp';

    const open = (m) => { setSel(m); setTab('Identity'); setTool(0); };

    return (
        <div className="litho">
            <header className="litho-top">
                <div className="litho-brand">
                    <span className="litho-brand-name">Lithothèque</span>
                    <span className="litho-brand-sub">The bench</span>
                </div>
                <nav className="litho-topnav">
                    {sel && <button className="litho-navbtn" onClick={() => setSel(null)}>Catalogue</button>}
                    <button className="litho-navbtn ghost" onClick={onHome}>← Gallery</button>
                </nav>
            </header>
            {!sel ? (
                <main className="litho-cat">
                    <div className="litho-catbar">
                        <span className="litho-cat-count">{list.length} specimens</span>
                        <div className="litho-chips">
                            {GROUPS.map((g) => (
                                <button key={g} className={'litho-chip' + (g === group ? ' on' : '')} onClick={() => setGroup(g)}>{g}</button>
                            ))}
                        </div>
                    </div>
                    <div className="litho-benchgrid">
                        {list.map((m) => (
                            <button key={m.id} className="litho-benchcard" onClick={() => open(m)}>
                                <span className="litho-card-stage"><SpecimenCanvas kind={m.id} spin /></span>
                                <span className="litho-card-meta">
                                    <span className="litho-card-no">{m.no}</span>
                                    <span className="litho-card-name">{m.name}</span>
                                    <span className="litho-card-sub">{m.formula} · Mohs {m.hardness}</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </main>
            ) : (
                <main className="litho-detail">
                    <section className="litho-stage">
                        <SpecimenCanvas kind={sel.id} spin variant={uv ? 'benchUV' : 'bench'} className="litho-stage-canvas" />
                        <div className="litho-stage-tag">
                            <span className="litho-card-no">{sel.no}</span>
                            <span className="litho-stage-name">{sel.name}</span>
                            <span className="litho-stage-sub">Drag to turn · study model</span>
                        </div>
                    </section>
                    <section className="litho-rail">
                        <div className="litho-rail-label">Instrument rail · reference readouts</div>
                        <div className="litho-chips litho-rail-chips">
                            {sel.readouts.map((r, i) => (
                                <button key={r.tool}
                                    className={'litho-chip' + (i === tool ? ' on' : '')}
                                    onClick={() => setTool(i)}>
                                    {r.tool}
                                </button>
                            ))}
                        </div>
                        <p className="litho-readout">{sel.readouts[tool].result}</p>
                    </section>
                    <section className="litho-dossier">
                        <div className="litho-tabs">
                            {TABS.map((t) => (
                                <button key={t} className={'litho-tab' + (t === tab ? ' on' : '')} onClick={() => setTab(t)}>{t}</button>
                            ))}
                        </div>
                        <div className="litho-tabpane">
                            {tab === 'Identity' && <FactGrid m={sel} />}
                            {tab === 'Geology' && <p className="litho-prose">{sel.geology}</p>}
                            {tab === 'Occurrence' && <p className="litho-prose">Typical localities for the species: {sel.typical}. Habit shown here: {sel.habit.toLowerCase()}.</p>}
                            {tab === 'Story' && <p className="litho-prose">{sel.story}</p>}
                            {tab === 'Resources' && <SourceList m={sel} />}
                        </div>
                    </section>
                </main>
            )}
        </div>
    );
}
