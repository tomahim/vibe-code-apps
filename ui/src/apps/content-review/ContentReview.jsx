import { useEffect, useState } from "react";
import { BRAND_BADGE, BRAND_NAME } from "../../config/brand.js";
import { authFetch, clearToken, getToken } from "../../auth.js";
import AccountMenu from "../../components/AccountMenu.jsx";
import {
  CHANGE_LABELS,
  KIND_LABELS,
  bodyLines,
  diffLines,
  unitSections,
} from "./review-utils.js";
import "./content-review.css";

function redirectToLogin() {
  window.history.replaceState({}, "", "/login");
  window.dispatchEvent(new PopStateEvent("popstate"));
}

// Authenticated fetch that bounces expired sessions to the login page.
async function reviewFetch(path, options) {
  const response = await authFetch(path, options);
  if (response.status === 401) {
    clearToken();
    redirectToLogin();
    throw new Error("signed out");
  }
  return response;
}

function ChangeChip({ change }) {
  return (
    <span className={`change-chip change-${change}`} title={change}>
      {CHANGE_LABELS[change] || change}
    </span>
  );
}

function Segments({ segments }) {
  return segments.map((segment, index) =>
    segment.bold ? <strong key={index}>{segment.text}</strong> : <span key={index}>{segment.text}</span>,
  );
}

function BodyPreview({ body }) {
  return (
    <div className="unit-body">
      {bodyLines(body).map((line, index) => {
        if (line.type === "blank") return <div key={index} className="body-gap" />;
        if (line.type === "quote")
          return (
            <p key={index} className="body-quote">
              <Segments segments={line.segments} />
            </p>
          );
        return (
          <p key={index} className="body-text">
            <Segments segments={line.segments} />
          </p>
        );
      })}
    </div>
  );
}

function QuestionPreview({ question }) {
  return (
    <div className="unit-question">
      <p className="question-prompt">{question.prompt}</p>
      <ul className="question-options">
        {question.options.map((option) => (
          <li key={option.id} className={option.id === question.answer ? "option-correct" : ""}>
            {option.text}
            {option.id === question.answer && <span className="option-check"> ✓</span>}
          </li>
        ))}
      </ul>
      {question.explanation && <p className="question-explanation">{question.explanation}</p>}
      <p className="question-meta">Checkpoint after card {question.after_card_position}</p>
    </div>
  );
}

function DiffView({ patch }) {
  const lines = diffLines(patch);
  if (!lines.length) return <p className="diff-empty">No textual diff for this file (binary or too large).</p>;
  return (
    <pre className="diff-view">
      {lines.map((line, index) => (
        <div key={index} className={`diff-line diff-${line.type}`}>
          {line.text || " "}
        </div>
      ))}
    </pre>
  );
}

function FeedbackBox({ onSend, compact }) {
  const [text, setText] = useState("");
  const [state, setState] = useState({ status: "idle", message: "" });

  async function send() {
    setState({ status: "sending", message: "" });
    try {
      const response = await onSend(text.trim());
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not post the comment.");
      setText("");
      setState({ status: "posted", message: "", url: data.comment && data.comment.url });
    } catch (err) {
      setState({ status: "failed", message: err.message || "Could not post the comment." });
    }
  }

  return (
    <div className={compact ? "feedback-box feedback-compact" : "feedback-box"}>
      <textarea
        value={text}
        rows={compact ? 2 : 3}
        placeholder="Your feedback…"
        onChange={(event) => {
          setText(event.target.value);
          if (state.status !== "idle") setState({ status: "idle", message: "" });
        }}
      />
      <div className="feedback-actions">
        <button type="button" disabled={!text.trim() || state.status === "sending"} onClick={send}>
          {state.status === "sending" ? "Posting…" : "Comment on the PR"}
        </button>
        {state.status === "posted" && (
          <span className="feedback-ok">
            Posted{state.url && (
              <>
                {" - "}
                <a href={state.url} target="_blank" rel="noreferrer">
                  see it on GitHub
                </a>
              </>
            )}
          </span>
        )}
        {state.status === "failed" && <span className="feedback-error">{state.message}</span>}
      </div>
    </div>
  );
}

function UnitDetail({ unit, onFeedback }) {
  const [view, setView] = useState("preview");
  useEffect(() => setView("preview"), [unit.key]);

  return (
    <article className="unit-detail">
      <header className="unit-header">
        <div>
          <span className={`kind-chip kind-${unit.kind}`}>{KIND_LABELS[unit.kind] || unit.kind}</span>
          <ChangeChip change={unit.change} />
          {unit.archived && <span className="kind-chip kind-archived">archived</span>}
          <h2>{unit.title || unit.path.split("/").pop()}</h2>
          <p className="unit-path">{unit.path}</p>
        </div>
        <div className="view-toggle" role="tablist">
          <button type="button" className={view === "preview" ? "active" : ""} onClick={() => setView("preview")}>
            Preview
          </button>
          <button type="button" className={view === "changes" ? "active" : ""} onClick={() => setView("changes")}>
            Changes
          </button>
        </div>
      </header>

      {unit.change === "removed" && <p className="unit-banner">This file is removed by the pull request.</p>}
      {unit.parse_error && <p className="unit-banner unit-banner-warning">Could not parse the metadata: {unit.parse_error}</p>}

      {view === "changes" ? (
        <DiffView patch={unit.patch} />
      ) : unit.kind === "question" && unit.question ? (
        <QuestionPreview question={unit.question} />
      ) : unit.body ? (
        <BodyPreview body={unit.body} />
      ) : (
        <p className="diff-empty">Nothing to preview for this file.</p>
      )}

      <FeedbackBox compact onSend={(text) => onFeedback(text, unit)} />
    </article>
  );
}

function OtherChange({ change, onFeedback }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="other-change">
      <button type="button" className="other-change-head" onClick={() => setOpen(!open)}>
        <ChangeChip change={change.change} /> {change.path}
      </button>
      {open && (
        <>
          <DiffView patch={change.patch} />
          <FeedbackBox compact onSend={(text) => onFeedback(text, { kind: "file", title: "", path: change.path })} />
        </>
      )}
    </div>
  );
}

function ReviewView({ prNumber, onBack }) {
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");
  const [selectedKey, setSelectedKey] = useState("");

  useEffect(() => {
    let cancelled = false;
    reviewFetch(`/api/apps/content-review/prs/${prNumber}`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Could not load the pull request.");
        if (cancelled) return;
        setDetail(data);
        if (data.units.length) setSelectedKey(data.units[0].key);
        else if (data.other_changes.length) setSelectedKey(`other:${data.other_changes[0].path}`);
      })
      .catch((err) => {
        if (!cancelled && err.message !== "signed out") setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [prNumber]);

  function sendFeedback(text, unit) {
    return reviewFetch(`/api/apps/content-review/prs/${prNumber}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(unit ? { text, kind: unit.kind, title: unit.title || "", path: unit.path } : { text }),
    });
  }

  if (error) {
    return (
      <main className="review-page">
        <Header onBack={onBack} backLabel="← All pull requests" />
        <p className="review-error" role="alert">{error}</p>
      </main>
    );
  }
  if (!detail) {
    return (
      <main className="review-page">
        <Header onBack={onBack} backLabel="← All pull requests" />
        <p className="review-status">Loading the pull request…</p>
      </main>
    );
  }

  const { pr, units, other_changes: otherChanges, summary } = detail;
  const sections = unitSections(units);
  const selected = units.find((unit) => unit.key === selectedKey);

  return (
    <main className="review-page">
      <Header onBack={onBack} backLabel="← All pull requests" />
      <div className="review-layout">
        <aside className="review-sidebar">
          <div className="pr-summary">
            <h1>
              #{pr.number} {pr.title}
            </h1>
            <p className="pr-meta">
              {pr.author && <span>{pr.author} · </span>}
              <code>{pr.head_ref}</code>
            </p>
            <p className="pr-meta">
              <span className="sum-added">+{summary.added}</span> <span className="sum-modified">~{summary.modified}</span>{" "}
              <span className="sum-removed">−{summary.removed}</span>
              {" · "}
              <a href={pr.url} target="_blank" rel="noreferrer">
                Open on GitHub
              </a>
            </p>
          </div>

          <nav className="unit-tree" aria-label="Changed content">
            {sections.map((section) => (
              <div key={section.key} className={`tree-section tree-depth-${section.depth}`}>
                <p className="tree-section-title">{section.title}</p>
                {section.units.map((unit) => (
                  <button
                    key={unit.key}
                    type="button"
                    className={`tree-unit ${unit.key === selectedKey ? "selected" : ""}`}
                    onClick={() => setSelectedKey(unit.key)}
                  >
                    <ChangeChip change={unit.change} />
                    <span className="tree-unit-title">{unit.title || unit.path.split("/").pop()}</span>
                    <span className="tree-unit-kind">{KIND_LABELS[unit.kind]}</span>
                  </button>
                ))}
              </div>
            ))}
            {otherChanges.length > 0 && (
              <div className="tree-section tree-depth-1">
                <p className="tree-section-title">Other library files</p>
                {otherChanges.map((change) => (
                  <button
                    key={change.path}
                    type="button"
                    className={`tree-unit ${`other:${change.path}` === selectedKey ? "selected" : ""}`}
                    onClick={() => setSelectedKey(`other:${change.path}`)}
                  >
                    <ChangeChip change={change.change} />
                    <span className="tree-unit-title">{change.path.split("/").pop()}</span>
                  </button>
                ))}
              </div>
            )}
            {!units.length && !otherChanges.length && (
              <p className="review-status">This pull request does not change the learning content.</p>
            )}
          </nav>

          <div className="pr-feedback">
            <p className="tree-section-title">Feedback on the whole PR</p>
            <FeedbackBox compact onSend={(text) => sendFeedback(text, null)} />
          </div>
        </aside>

        <section className="review-main">
          {selected && <UnitDetail unit={selected} onFeedback={sendFeedback} />}
          {!selected && selectedKey.startsWith("other:") && (
            <OtherChange
              change={otherChanges.find((change) => `other:${change.path}` === selectedKey)}
              onFeedback={sendFeedback}
            />
          )}
          {!selected && !selectedKey.startsWith("other:") && (
            <p className="review-status">Pick a changed item on the left to review it.</p>
          )}
        </section>
      </div>
    </main>
  );
}

function Header({ onBack, backLabel }) {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label={`${BRAND_NAME} home`}>
        <span className="brand-mark">{BRAND_BADGE}</span>
        <span>{BRAND_NAME}</span>
      </a>
      <div className="header-actions">
        {onBack ? (
          <button type="button" className="back-link" onClick={onBack}>
            {backLabel}
          </button>
        ) : (
          <a className="back-link" href="/">
            ← Back to the tools
          </a>
        )}
        <AccountMenu />
      </div>
    </header>
  );
}

function PrList({ onOpen }) {
  const [prs, setPrs] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    reviewFetch("/api/apps/content-review/prs")
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Could not load pull requests.");
        if (!cancelled) setPrs(data.pull_requests || []);
      })
      .catch((err) => {
        if (!cancelled && err.message !== "signed out") setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="review-page">
      <Header />
      <section className="review-intro">
        <p className="eyebrow">LITTLE GRAINS</p>
        <h1>Content review</h1>
        <p className="grains-subtitle">
          Review learning content while it is still a pull request - before it reaches the database.
        </p>
      </section>

      {error && <p className="review-error" role="alert">{error}</p>}
      {!error && prs === null && <p className="review-status">Loading open pull requests…</p>}
      {prs && prs.length === 0 && <p className="review-status">No open pull requests right now.</p>}
      {prs && (
        <section className="pr-list" aria-label="Open pull requests">
          {prs.map((pr) => (
            <button key={pr.number} type="button" className="pr-card" onClick={() => onOpen(pr.number)}>
              <span className="pr-card-title">
                #{pr.number} {pr.title}
              </span>
              <span className="pr-card-meta">
                {pr.author && `${pr.author} · `}
                <code>{pr.head_ref}</code>
              </span>
              <span className="pr-card-changes">
                {pr.content_changes.files > 0 ? (
                  <>
                    <span className="sum-added">+{pr.content_changes.added}</span>{" "}
                    <span className="sum-modified">~{pr.content_changes.modified}</span>{" "}
                    <span className="sum-removed">−{pr.content_changes.removed}</span> content files
                  </>
                ) : (
                  <span className="sum-none">no content changes</span>
                )}
              </span>
            </button>
          ))}
        </section>
      )}
    </main>
  );
}

// Content review is account-gated like Little Grains: without a token it
// sends the visitor to the login page.
export default function ContentReview() {
  const [prNumber, setPrNumber] = useState(null);

  useEffect(() => {
    if (!getToken()) {
      // Defer: App's popstate listener (a parent effect) must be attached first.
      const id = setTimeout(redirectToLogin, 0);
      return () => clearTimeout(id);
    }
  }, []);

  if (prNumber) return <ReviewView prNumber={prNumber} onBack={() => setPrNumber(null)} />;
  return <PrList onOpen={setPrNumber} />;
}
