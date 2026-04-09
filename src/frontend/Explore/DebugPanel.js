import { useState, useEffect } from 'react';
import { courseAPI } from '../../services/api';

function DebugPanel({ courses, onRefresh }) {
  const [testResult, setTestResult] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const runTest = async () => {
    console.log('🧪 Running debug test...');
    setTestResult({ loading: true });

    try {
      // Test 1: Check API URL
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      console.log('🔧 API URL:', apiUrl);

      // Test 2: Direct fetch
      const directResponse = await fetch(`${apiUrl}/courses`);
      const directData = await directResponse.json();
      console.log('📦 Direct fetch result:', directData);

      // Test 3: Using courseAPI
      const apiResponse = await courseAPI.getAll();
      console.log('📦 courseAPI result:', apiResponse.data);

      setTestResult({
        loading: false,
        success: true,
        apiUrl,
        directFetch: directData,
        courseAPI: apiResponse.data,
        coursesInState: courses.length
      });
    } catch (error) {
      console.error('❌ Test failed:', error);
      setTestResult({
        loading: false,
        success: false,
        error: error.message,
        stack: error.stack
      });
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
          background: '#f59e0b',
          color: '#000',
          border: 'none',
          padding: '12px 20px',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(245,158,11,0.4)'
        }}
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      zIndex: 9999,
      background: '#1a1f2e',
      border: '2px solid #f59e0b',
      borderRadius: 12,
      padding: 20,
      maxWidth: 500,
      maxHeight: '80vh',
      overflow: 'auto',
      boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
      color: '#fff',
      fontFamily: 'monospace',
      fontSize: '0.85rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
        <h3 style={{ margin: 0, color: '#f59e0b' }}>🐛 Debug Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: 15 }}>
        <button
          onClick={runTest}
          style={{
            background: '#4ade80',
            color: '#000',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold',
            marginRight: 8
          }}
        >
          Run Test
        </button>
        <button
          onClick={onRefresh}
          style={{
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Refresh Courses
        </button>
      </div>

      <div style={{ background: '#0f1419', padding: 10, borderRadius: 6, marginBottom: 10 }}>
        <div><strong>Courses in State:</strong> {courses.length}</div>
        <div><strong>Environment:</strong> {process.env.NODE_ENV}</div>
        <div><strong>API URL:</strong> {process.env.REACT_APP_API_URL || 'undefined'}</div>
      </div>

      {testResult && (
        <div style={{
          background: testResult.success ? '#064e3b' : '#7f1d1d',
          padding: 10,
          borderRadius: 6,
          marginTop: 10
        }}>
          {testResult.loading ? (
            <div>⏳ Running tests...</div>
          ) : testResult.success ? (
            <>
              <div style={{ color: '#4ade80', fontWeight: 'bold', marginBottom: 8 }}>
                ✅ Tests Passed
              </div>
              <div style={{ fontSize: '0.75rem', lineHeight: 1.6 }}>
                <div><strong>API URL:</strong> {testResult.apiUrl}</div>
                <div><strong>Direct Fetch:</strong> {testResult.directFetch?.count || 0} courses</div>
                <div><strong>courseAPI:</strong> {testResult.courseAPI?.count || 0} courses</div>
                <div><strong>State:</strong> {testResult.coursesInState} courses</div>
                {testResult.directFetch?.data?.[0] && (
                  <div style={{ marginTop: 8 }}>
                    <strong>First Course:</strong>
                    <pre style={{ fontSize: '0.7rem', overflow: 'auto', maxHeight: 150 }}>
                      {JSON.stringify(testResult.directFetch.data[0], null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{ color: '#f87171', fontWeight: 'bold', marginBottom: 8 }}>
                ❌ Tests Failed
              </div>
              <div style={{ fontSize: '0.75rem' }}>
                <div><strong>Error:</strong> {testResult.error}</div>
                <pre style={{ fontSize: '0.7rem', overflow: 'auto', maxHeight: 150 }}>
                  {testResult.stack}
                </pre>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DebugPanel;
