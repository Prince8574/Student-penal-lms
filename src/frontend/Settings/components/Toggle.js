import { G } from '../utils/designTokens';

export function Toggle({ on, onChange, color }) {
  return (
    <div
      className={`tog${on ? ' on' : ''}`}
      style={{ background: on ? (color || G.gold) : 'rgba(255,255,255,.08)' }}
      onClick={onChange}
    />
  );
}

