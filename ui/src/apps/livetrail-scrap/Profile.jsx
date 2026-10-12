function getProfileImageSrc(profileHtml) {
  if (!profileHtml || typeof DOMParser === "undefined") return "";

  const document = new DOMParser().parseFromString(profileHtml, "text/html");
  const source = document.querySelector("img[src]")?.getAttribute("src");
  if (!source) return "";

  try {
    const url = new URL(source, window.location.origin);
    return url.protocol === "https:" && url.hostname.endsWith(".livetrail.net") ? url.href : "";
  } catch {
    return "";
  }
}

export default function Profile({ profileHtml, times = [] }) {
  const profileImageSrc = getProfileImageSrc(profileHtml);
  if (!profileImageSrc) return null;

  return (
    <section className="profile-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE COURSE</p>
          <h2>Elevation profile</h2>
        </div>
        <span className="profile-legend">Checkpoint list below</span>
      </div>
      <div className="profile-frame">
        <div className="profile-art">
          <img src={profileImageSrc} alt="Race elevation profile" />
        </div>
        <div className="profile-checkpoints" aria-label="Race checkpoints">
          {times.map((checkpoint, index) => {
            const isStart = index === 0;
            return (
              <article
                className={`profile-checkpoint${isStart ? " profile-checkpoint-start" : ""}`}
                key={`${checkpoint.checkpoint}-${index}`}
              >
                <div className="profile-checkpoint-title">
                  {isStart && <span className="profile-checkpoint-tag">START</span>}
                  <span className="profile-checkpoint-name">{checkpoint.checkpoint}</span>
                </div>
                <span className="profile-checkpoint-meta">
                  <strong>{checkpoint.cumulatedTime || (isStart ? "0:00" : "—")}</strong>
                  <span>{isStart ? "0 km" : `${checkpoint.distance} km`}</span>
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
