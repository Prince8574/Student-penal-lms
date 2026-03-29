const T = {
  text3: "#3d4f6e",
  red: "#ef4444",
  orange: "#ff7a30",
};

// Label Component
export const Label = ({ children, ch, req, max, cur, extra }) => (
  <div style={{
    fontSize: ".7rem",
    fontWeight: 700,
    letterSpacing: ".08em",
    textTransform: "uppercase",
    color: T.text3,
    marginBottom: 7,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}>
    <span>
      {children || ch}
      {req && <span style={{ color: T.red, marginLeft: 3 }}>*</span>}
    </span>
    {(max || extra) && (
      <span style={{
        textTransform: "none",
        letterSpacing: 0,
        fontSize: ".68rem",
        color: cur > max * .85 ? cur > max ? T.red : T.orange : T.text3
      }}>{extra || `${cur}/${max}`}</span>
    )}
  </div>
);

// Form Input Component
export function FormInput({ icon, err, ok, style = {}, ...p }) {
  return (
    <div style={{ position: "relative" }}>
      {icon && (
        <span style={{
          position: "absolute",
          left: 12,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: ".85rem",
          pointerEvents: "none",
          opacity: .45
        }}>{icon}</span>
      )}
      <input 
        className={`lv-inp${err ? " err" : ok ? " ok" : ""}`} 
        style={{ paddingLeft: icon ? 36 : 14, ...style }} 
        {...p} 
      />
    </div>
  );
}

// Form Select Component
export function FormSelect({ children, ...p }) {
  return (
    <select 
      className="lv-inp" 
      style={{
        cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%233d4f6e' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
        paddingRight: 36
      }} 
      {...p}
    >
      {children}
    </select>
  );
}

// Grid Component
export const Grid = ({ cols = 2, gap = 14, mb = 14, children }) => (
  <div style={{
    display: "grid",
    gridTemplateColumns: `repeat(${cols},1fr)`,
    gap,
    marginBottom: mb
  }}>{children}</div>
);
