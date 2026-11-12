// The three Review session sizes, straight from his voice note: the time the
// learner has sets both the question count and how many stale paths are mixed.
const REVIEW_OPTIONS = [
  { minutes: 5, questions: 10, paths: 1 },
  { minutes: 10, questions: 20, paths: 2 },
  { minutes: 15, questions: 30, paths: 3 },
];

function ReviewPicker({ onPick, onClose }) {
  return <div className="grains-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="grains-quest" role="dialog" aria-modal="true" aria-label="Review - choose how much time you have">
      <div className="grains-quest-note">
        <p className="grains-card-index">REVIEW</p>
        <h2>How much time do you have?</h2>
        <p>Questions from the paths you have not practised for the longest time, across every theme.</p>
        <div className="grains-quest-options">{REVIEW_OPTIONS.map((option) => <button key={option.minutes} className="grains-quest-option" onClick={() => onPick(option.minutes)}>
          <b>{option.minutes} min</b><span>{option.questions} questions · {option.paths} path{option.paths === 1 ? "" : "s"}</span>
        </button>)}</div>
        <button className="grains-text-button" onClick={onClose}>Not now</button>
      </div>
    </section>
  </div>;
}

export { ReviewPicker };
