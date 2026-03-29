import React from 'react';
import { useAuth } from './context/AuthContext';

function TestAuth() {
  const { user, isAuthenticated, loading } = useAuth();

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'monospace', 
      background: '#1a1a1a', 
      color: '#fff',
      minHeight: '100vh'
    }}>
      <h1>🔍 Auth Debug Page</h1>
      
      <div style={{ 
        background: '#2a2a2a', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Auth State:</h2>
        <pre style={{ background: '#1a1a1a', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify({
            loading,
            isAuthenticated,
            user
          }, null, 2)}
        </pre>
      </div>

      <div style={{ 
        background: '#2a2a2a', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>LocalStorage:</h2>
        <pre style={{ background: '#1a1a1a', padding: '15px', borderRadius: '4px' }}>
          token: {localStorage.getItem('token') ? 
            localStorage.getItem('token').substring(0, 50) + '...' : 
            'NOT FOUND'}
        </pre>
      </div>

      <div style={{ 
        background: '#2a2a2a', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h2>Status:</h2>
        <div style={{ fontSize: '18px', marginTop: '10px' }}>
          {loading && <div>⏳ Loading...</div>}
          {!loading && isAuthenticated && <div>✅ Authenticated as: {user?.name}</div>}
          {!loading && !isAuthenticated && <div>❌ Not Authenticated</div>}
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <a href="/" style={{ 
          color: '#4a9eff', 
          textDecoration: 'none',
          fontSize: '16px'
        }}>
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

export default TestAuth;
