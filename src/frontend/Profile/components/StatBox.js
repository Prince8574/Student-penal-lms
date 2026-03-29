import AnimNumber from './AnimNumber';

const T = {
  bord: "rgba(255,255,255,0.06)",
  text3: "#3d4f6e",
  green: "#4ade80",
};

export default function StatBox({ num, label, color, trend, suffix = "", barColor, delay }) {
  return (
    <div className="stat-box" style={{ 
      padding: '18px 14px', 
      textAlign: 'center', 
      position: 'relative', 
      overflow: 'hidden', 
      borderRight: `1px solid ${T.bord}`, 
      transition: 'background .25s', 
      cursor: "pointer" 
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.03)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div className="sbox-shine" style={{ 
        position: 'absolute', 
        inset: 0, 
        opacity: 0, 
        background: 'radial-gradient(circle at 50% 0%,rgba(240,165,0,.09),transparent 70%)', 
        transition: 'opacity .3s', 
        pointerEvents: 'none' 
      }} />
      <div className="ff-serif" style={{ 
        fontSize: '1.85rem', 
        fontWeight: 900, 
        letterSpacing: '-.07em', 
        lineHeight: 1, 
        color 
      }}>
        <AnimNumber target={num} suffix={suffix} delay={delay} />
      </div>
      <div style={{ 
        fontSize: '.62rem', 
        fontWeight: 700, 
        letterSpacing: '.1em', 
        textTransform: 'uppercase', 
        color: T.text3, 
        marginTop: 5 
      }}>{label}</div>
      <div style={{ 
        fontSize: '.66rem', 
        color: T.green, 
        marginTop: 3, 
        fontWeight: 600 
      }}>{trend}</div>
      <div className="sbox-bar" style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: 2, 
        background: barColor, 
        opacity: 0, 
        transition: 'opacity .3s' 
      }} />
    </div>
  );
}
