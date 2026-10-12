import DOMPurify from "dompurify";

export default function Profile({ profileHtml, times = [] }) {
  if (!profileHtml) return null;

  return (
    <section className="profile-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE COURSE</p>
          <h2>Elevation profile</h2>
        </div>
        <span className="profile-legend"><i /> Checkpoints</span>
      </div>
      <div className="profile-frame">
        <div
          className="profile-art"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(profileHtml) }}
        />
        <div className="profile-checkpoints" aria-label="Race checkpoints">
          {times.map((checkpoint, index) => (
            <article className="profile-checkpoint" key={`${checkpoint.checkpoint}-${index}`}>
              <span className="profile-checkpoint-name">{checkpoint.checkpoint}</span>
              <span className="profile-checkpoint-meta">
                <strong>{checkpoint.cumulatedTime || "Start"}</strong>
                <span>{checkpoint.distance} km</span>
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
