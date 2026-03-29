import { T } from "../../Explore/utils/designTokens";

export default function EnrollCourseCard({ course: c }) {
  const disc = c.originalPrice > c.price
    ? Math.round((1 - c.price / c.originalPrice) * 100) : 0;

  return (
    <div style={{ display: "flex", gap: 14, padding: "14px 16px", borderRadius: 12, background: T.s3, border: `1px solid ${T.b0}` }}>
      {/* Thumb */}
      <div style={{ width: 72, height: 72, borderRadius: 10, background: c.gradient || `linear-gradient(135deg,${T.s3},${T.s4})`, flexShrink: 0, overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {c.thumbnail
          ? <img src={c.thumbnail} alt={c.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: "2rem", opacity: .5 }}>{c.icon || "📘"}</span>
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: ".62rem", fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: c.accent || T.p, marginBottom: 4 }}>
          {c.category}
        </div>
        <div style={{ fontSize: ".88rem", fontWeight: 700, color: T.t0, lineHeight: 1.3, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {c.title}
        </div>
        <div style={{ fontSize: ".74rem", color: T.t2, marginBottom: 6 }}>{c.instructor}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: ".88rem", fontWeight: 800, color: T.amber }}>
            {c.price === 0 ? "FREE" : `₹${c.price.toLocaleString()}`}
          </span>
          {disc > 0 && (
            <>
              <span style={{ fontSize: ".72rem", color: T.t3, textDecoration: "line-through" }}>₹{c.originalPrice.toLocaleString()}</span>
              <span style={{ fontSize: ".62rem", fontWeight: 700, color: T.green, background: `${T.green}12`, padding: "1px 6px", borderRadius: 4 }}>{disc}% off</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
