import { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

export function buildCertHTML(cert, studentName) {
  const cornerSVG = `<svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L40 0 Q0 0 0 40 Z" fill="rgba(200,150,0,0.1)"/><path d="M0 0 L28 0 Q0 0 0 28 Z" fill="rgba(200,150,0,0.12)"/><path d="M2 2 L35 2" stroke="rgba(180,120,0,0.4)" stroke-width="1.5"/><path d="M2 2 L2 35" stroke="rgba(180,120,0,0.4)" stroke-width="1.5"/><circle cx="2" cy="2" r="3" fill="rgba(180,120,0,0.6)"/><circle cx="35" cy="2" r="2" fill="rgba(180,120,0,0.35)"/><circle cx="2" cy="35" r="2" fill="rgba(180,120,0,0.35)"/></svg>`;
  const sealSVG = `<svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="36" cy="36" r="33" fill="rgba(245,160,32,0.08)" stroke="rgba(180,120,0,0.3)" stroke-width="1.5"/><circle cx="36" cy="36" r="27" fill="rgba(245,160,32,0.06)" stroke="rgba(180,120,0,0.2)" stroke-width="1"/><text x="36" y="41" text-anchor="middle" font-size="22" fill="#d4a017">⭐</text></svg>`;

  return `
    <div class="cert-render" id="certificate-render">
      <div class="cert-bg"></div>
      <div class="cert-pattern"></div>
      <div class="cert-outer-border"></div>
      <div class="cert-inner-border"></div>
      <div class="cert-corner tl">${cornerSVG}</div>
      <div class="cert-corner tr">${cornerSVG}</div>
      <div class="cert-corner bl">${cornerSVG}</div>
      <div class="cert-corner br">${cornerSVG}</div>
      <div class="cert-content">
        <div class="cert-logo-area">
          <div class="cert-logo-badge">🎓</div>
          <span class="cert-brand">Learn<span>Verse</span></span>
        </div>
        <div class="cert-divider"></div>
        <div class="cert-header-text">This is to certify that</div>
        <div class="cert-name-text">${studentName}</div>
        <div class="cert-for">has successfully completed the assignment</div>
        <div class="cert-main-title">${cert.title}</div>
        <div class="cert-score-row">
          <div class="cert-score-item"><div class="cert-score-val">${cert.score}%</div><div class="cert-score-lab">Final Score</div></div>
          <div class="cert-score-sep"></div>
          <div class="cert-score-item"><div class="cert-score-val">${cert.grade}</div><div class="cert-score-lab">Grade</div></div>
          <div class="cert-score-sep"></div>
          <div class="cert-score-item"><div class="cert-score-val">${cert.courseName || "—"}</div><div class="cert-score-lab">Course</div></div>
          <div class="cert-score-sep"></div>
          <div class="cert-score-item"><div class="cert-score-val">${cert.issued}</div><div class="cert-score-lab">Issued</div></div>
        </div>
        <div class="cert-desc">This certificate is awarded in recognition of the commitment to learning, dedication to excellence, and mastery of the subject matter demonstrated throughout this assignment.</div>
        <div class="cert-footer">
          <div class="cert-sig"><div class="cert-sig-line"></div><div class="cert-sig-name">Dr. Amit Verma</div><div class="cert-sig-role">Head of Academics, LearnVerse</div></div>
          <div class="cert-seal">${sealSVG}</div>
          <div class="cert-sig"><div class="cert-sig-line"></div><div class="cert-sig-name">Rahul Kapoor</div><div class="cert-sig-role">CEO & Co-Founder, LearnVerse</div></div>
        </div>
        <div class="cert-id">Certificate ID: ${cert.id} · Verify at learnverse.io/verify · Issued: ${cert.issued}</div>
      </div>
    </div>`;
}

export default function CertModal({ certId, certsData = [], onClose, onDownload, onShare }) {
  const { user } = useAuth();
  const studentName = user?.name || "Student";
  const cert = certsData.find(c => c.id === certId);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!cert) return null;

  return (
    <div className="cert-modal-overlay" onClick={onClose}>
      <div className="cert-modal-box" onClick={e => e.stopPropagation()}>
        <div className="cert-modal-header">
          <span className="cert-modal-title">Certificate Preview</span>
          <button className="cert-modal-close" onClick={onClose}>✕</button>
        </div>
        <div style={{ overflowX: "auto" }}
          dangerouslySetInnerHTML={{ __html: buildCertHTML(cert, studentName) }} />
        <div className="cert-modal-actions">
          <button className="modal-btn modal-btn-primary" onClick={onDownload}>⬇ Download PDF</button>
          <button className="modal-btn modal-btn-ghost" onClick={onShare}>🔗 Copy Link</button>
          <button className="modal-btn modal-btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
