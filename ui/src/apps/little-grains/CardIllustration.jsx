import { useEffect, useRef, useState } from "react";
import "./card-illustration.css";

export function CardIllustration({ card }) {
  const viewer = useRef(null);
  const [enlarged, setEnlarged] = useState(false);
  // A route/card change must never leave the previous picture open.
  useEffect(() => { viewer.current?.close(); }, [card.id, card.illustration_url]);
  if (!card.illustration_url) return null;
  const variants = card.illustration_srcset || [];
  const srcset = variants.map((variant) => `${variant.url} ${variant.width}w`).join(", ");
  const largest = variants.reduce((best, v) => (v && v.width > (best ? best.width : 0) ? v : best), null);
  const fullUrl = largest ? largest.url : card.illustration_url;
  const credit = card.illustration_credit ? [card.illustration_credit, card.illustration_license].filter(Boolean).join(", ") : "";
  // Book labels must not be cropped. Ordinary photos keep their existing crop.
  const bookFigure = (card.illustration_path || "").includes("/plongee-niveau-4-");
  const caption = <>
    {card.illustration_caption && <span className="grains-illustration-caption">{card.illustration_caption}</span>}
    {credit && (card.illustration_source_url
      ? <a className="grains-illustration-credit" href={card.illustration_source_url} target="_blank" rel="noopener noreferrer">Photo: {credit}</a>
      : <span className="grains-illustration-credit">Photo: {credit}</span>)}
  </>;
  return <figure className={bookFigure ? "grains-illustration grains-illustration--figure" : "grains-illustration"}>
    <button type="button" className="grains-illustration-trigger" aria-label="Enlarge picture" aria-haspopup="dialog" onClick={() => { setEnlarged(true); viewer.current.showModal(); }}>
      <img src={card.illustration_url} srcSet={srcset || undefined}
        sizes="(max-width: 660px) calc(100vw - 88px), 596px"
        width={card.illustration_width || undefined} height={card.illustration_height || undefined}
        loading="lazy" decoding="async" alt={card.illustration_alt || ""} />
      <span className="grains-illustration-hint" aria-hidden="true">⤢</span>
    </button>
    {(card.illustration_caption || credit) && <figcaption>{caption}</figcaption>}
    {/* Native modal dialog traps focus, makes the lesson inert, and restores
        focus to the picture when closed. Escape closes only this top layer. */}
    <dialog ref={viewer} className="grains-picture-viewer" aria-label="Enlarged picture" onClose={() => setEnlarged(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") event.stopPropagation();
        if (event.key === "Tab") {
          const controls = [...event.currentTarget.querySelectorAll("button, a[href]")];
          const first = controls[0], last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }}
      onMouseDown={(event) => { if (event.target === event.currentTarget) viewer.current.close(); }}>
      <div className="grains-picture-toolbar">
        <span>Picture</span>
        <button type="button" className="grains-picture-close" aria-label="Close picture" autoFocus onClick={() => viewer.current.close()}><span aria-hidden="true">×</span></button>
      </div>
      <figure className="grains-picture-content">
        <div className="grains-picture-image">{enlarged && <img src={fullUrl} alt={card.illustration_alt || ""} decoding="async" />}</div>
        {(card.illustration_caption || credit) && <figcaption>{caption}</figcaption>}
      </figure>
    </dialog>
  </figure>;
}
