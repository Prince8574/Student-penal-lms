const T = {
  text: "#f0f6ff",
  text3: "#3d4f6e",
  gold: "#f0a500",
};

export default function SectionHeader({ title, link = "View all →" }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      marginBottom: 18 
    }}>
      <div className="ff-serif" style={{ 
        fontSize: '1rem', 
        fontWeight: 800, 
        letterSpacing: '-.04em', 
        color: T.text 
      }}>{title}</div>
      <button style={{ 
        fontSize: '.74rem', 
        fontWeight: 700, 
        color: T.text3, 
        background: 'none', 
        border: 'none', 
        cursor: "pointer", 
        fontFamily: 'Satoshi,sans-serif', 
        padding: '4px 9px', 
        borderRadius: 7, 
        transition: 'color .2s' 
      }}
      onMouseEnter={e => e.target.style.color = T.gold} 
      onMouseLeave={e => e.target.style.color = T.text3}
      >{link}</button>
    </div>
  );
}
