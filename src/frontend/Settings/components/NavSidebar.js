import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { T, G } from '../utils/designTokens';
import { NAV } from '../utils/settingsData';

export function NavSidebar({ collapsed, setCollapsed }) {
  const [active, setActive] = useState('settings');
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user?.name || 'Student';
  const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  const w = collapsed ? 66 : 238;

  return (
    <aside
      style={{
        width: w,
        minWidth: w,
        height: '100vh',
        background: T.sidebar,
        borderRight: `1px solid ${T.bord}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        zIndex: 50,
        transition: 'width .3s cubic-bezier(.4,0,.2,1)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: collapsed ? '15px 12px' : '18px 16px',
          borderBottom: `1px solid ${T.bord}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: G.gold,
            display: 'grid',
            placeItems: 'center',
            fontSize: '.9rem',
            flexShrink: 0,
            boxShadow: '0 0 14px rgba(240,165,0,.35)',
          }}
        >
          🎓
        </div>
        {!collapsed && (
          <span
            style={{
              fontFamily: 'Fraunces,serif',
              fontSize: '1rem',
              fontWeight: 800,
              letterSpacing: '-.04em',
              whiteSpace: 'nowrap',
            }}
          >
            Learn<b style={{ color: T.gold }}>Verse</b>
          </span>
        )}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: collapsed ? '8px 6px' : '10px 8px',
          scrollbarWidth: 'none',
        }}
      >
        {NAV.map(({ g, items }) => (
          <div key={g} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: '.56rem',
                  fontWeight: 800,
                  letterSpacing: '.12em',
                  textTransform: 'uppercase',
                  color: T.text3,
                  padding: '7px 10px 3px',
                }}
              >
                {g}
              </div>
            )}
            {items.map((item) => (
              <div
                key={item.id}
                className={`nb${active === item.id ? ' on' : ''}`}
                onClick={() => setActive(item.id)}
                style={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '9px' : '9px 12px',
                }}
              >
                <span style={{ fontSize: '.95rem', flexShrink: 0 }}>{item.i}</span>
                {!collapsed && (
                  <span style={{ flex: 1, whiteSpace: 'nowrap', fontSize: '.82rem' }}>{item.l}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    style={{
                      fontSize: '.58rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 20,
                      background: ['assign', 'notif', 'msg'].includes(item.id)
                        ? 'rgba(239,68,68,.14)'
                        : 'rgba(74,222,128,.12)',
                      color: ['assign', 'notif', 'msg'].includes(item.id) ? T.red : T.green,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      </div>
    </aside>
  );
}


