import { T } from '../utils/designTokens';

/* ══════════════════════════════════════
STAR RATING COMPONENT
══════════════════════════════════════ */
export default function Stars({rating, size=".72rem"}) {
  return (
    <div className="stars" style={{display:"flex", gap:"1px"}}>
      {[1,2,3,4,5].map(i => (
        <span 
          key={i} 
          className="star" 
          style={{
            fontSize: size,
            color: i <= Math.floor(rating) 
              ? T.gold 
              : i === Math.ceil(rating) && rating % 1 > .3 
                ? "#f0a500aa" 
                : T.text3,
            animation: `starPop .4s ${i*.06}s both`
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}