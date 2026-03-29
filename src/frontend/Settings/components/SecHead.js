import { G, T } from '../utils/designTokens';

export function SecHead({ icon, title }) {
  return (
    <div className="sdiv">
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: G.gold,
          display: 'grid',
          placeItems: 'center',
          fontSize: '.82rem',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(240,165,0,.3)',
        }}
      >
        {icon}
      </div>
      <div
        className="ff"
        style={{
          fontSize: '.82rem',
          fontWeight: 800,
          letterSpacing: '-.02em',
          color: T.text,
        }}
      >
        {title}
      </div>
    </div>
  );
}

