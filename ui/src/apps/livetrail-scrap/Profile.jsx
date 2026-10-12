import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

function mergeDistances(html) {
  if (!html) return "";
  const document = new DOMParser().parseFromString(html, "text/html");
  const elements = [...document.body.querySelectorAll("div, input")];
  elements.forEach((element, index) => {
    if (element.tagName !== "DIV" || !element.classList.contains("divDeniv")) return;
    const distance = element.textContent.trim();
    if (!/^\d/.test(distance)) return;
    const nextTime = elements.slice(index + 1, index + 5).find(
      (candidate) => candidate.tagName === "DIV" && candidate.classList.contains("tpsProfil"),
    );
    if (!nextTime) return;
    const previousText = nextTime.textContent.trim();
    nextTime.replaceChildren(
      document.createTextNode(previousText),
      document.createElement("br"),
      document.createTextNode(`${distance} km`),
    );
  });
  return document.body.innerHTML;
}

export default function Profile({ profileHtml, profilePointsHtml }) {
  const [points, setPoints] = useState("");
  useEffect(() => setPoints(mergeDistances(profilePointsHtml)), [profilePointsHtml]);

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
        {points && (
          <div
            className="profile-points"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(points) }}
          />
        )}
      </div>
    </section>
  );
}
