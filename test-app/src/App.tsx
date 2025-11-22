import { useState, useEffect } from 'react';
import { initSessify, getSessionId, startSession, endSession, isSessionActive } from '@softprobe/sessify';
import './App.css';

type StorageType = 'session' | 'local';

function App() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [storageType, setStorageType] = useState<StorageType>('session');

  // 初始化sessify库
  useEffect(() => {
    console.log('App component mounted');
    
    // 初始化sessify库
    console.log('Initializing sessify library...');
    initSessify({
      siteName: 'tracestate-test-app',
      sessionStorageType: storageType
    });
    
    console.log('Sessify library initialization completed');
    
    // 检查当前session状态
    const active = isSessionActive();
    setSessionActive(active);
    
    if (active) {
      const sessionId = getSessionId();
      setCurrentSessionId(sessionId);
      console.log('Current session ID:', sessionId);
    } else {
      console.log('No active session');
    }
  }, [storageType]);

  const handleTestApiCall = async () => {
    setLoading(true);
    try {
      // sessify库应该通过SimpleHttpInterceptor自动注入tracestate头
      console.log('Making API call - SimpleHttpInterceptor should automatically inject tracestate header');
      
      const res = await fetch('http://localhost:3003/api/test');
      const data = await res.json();
      setResponse(data);
      console.log('API Response:', data);
    } catch (error) {
      console.error('API call failed:', error);
      setResponse({ error: 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = () => {
    console.log('Starting new session...');
    startSession();
    const sessionId = getSessionId();
    setSessionActive(true);
    setCurrentSessionId(sessionId);
    console.log('New session started with ID:', sessionId);
  };

  const handleEndSession = () => {
    console.log('Ending current session...');
    endSession();
    setSessionActive(false);
    setCurrentSessionId('');
    console.log('Session ended');
  };

  const handleStorageTypeChange = (type: StorageType) => {
    console.log('Changing storage type to:', type);
    setStorageType(type);
    
    // 如果当前有活跃session，需要重新初始化
    if (sessionActive) {
      console.log('Active session detected, ending current session before switching storage type');
      endSession();
      setSessionActive(false);
      setCurrentSessionId('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TraceState Test Application</h1>
        
        {/* Storage Level Configuration Section */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ffa500', borderRadius: '8px', backgroundColor: '#282c34' }}>
          <h2>Storage Level Configuration</h2>
          <div style={{ marginBottom: '15px' }}>
            <p><strong>Current Storage Type:</strong> 
              <span style={{ 
                color: storageType === 'session' ? '#61dafb' : '#ffa500',
                fontWeight: 'bold',
                marginLeft: '10px'
              }}>
                {storageType === 'session' ? 'Session Storage (浏览器标签页级别)' : 'Local Storage (全局级别)'}
              </span>
            </p>
            <p style={{ fontSize: '14px', color: '#ccc', marginTop: '10px' }}>
              {storageType === 'session' 
                ? 'Session Storage: 数据在当前浏览器标签页有效，关闭标签页后数据丢失' 
                : 'Local Storage: 数据在浏览器全局有效，关闭浏览器后数据仍然保留'
              }
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={() => handleStorageTypeChange('session')} 
              className="storage-button"
              disabled={storageType === 'session'}
              style={{ 
                backgroundColor: storageType === 'session' ? '#61dafb' : '#666',
                color: storageType === 'session' ? '#282c34' : '#999'
              }}
            >
              Use Session Storage
            </button>
            <button 
              onClick={() => handleStorageTypeChange('local')} 
              className="storage-button"
              disabled={storageType === 'local'}
              style={{ 
                backgroundColor: storageType === 'local' ? '#ffa500' : '#666',
                color: storageType === 'local' ? '#282c34' : '#999'
              }}
            >
              Use Local Storage
            </button>
          </div>
        </div>
        
        {/* Session Management Section */}
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #61dafb', borderRadius: '8px', backgroundColor: '#282c34' }}>
          <h2>Session Management</h2>
          <div style={{ marginBottom: '15px' }}>
            <p><strong>Session Status:</strong> {sessionActive ? 'Active' : 'Inactive'}</p>
            {sessionActive && (
              <p><strong>Current Session ID:</strong> {currentSessionId}</p>
            )}
            <p style={{ fontSize: '14px', color: '#ccc', marginTop: '10px' }}>
              Session ID will be stored in: <strong>{storageType === 'session' ? 'sessionStorage' : 'localStorage'}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={handleStartSession} 
              className="session-button"
              disabled={sessionActive}
              style={{ 
                backgroundColor: sessionActive ? '#666' : '#61dafb',
                color: sessionActive ? '#999' : '#282c34'
              }}
            >
              Start New Session
            </button>
            <button 
              onClick={handleEndSession} 
              className="session-button"
              disabled={!sessionActive}
              style={{ 
                backgroundColor: !sessionActive ? '#666' : '#ff6b6b',
                color: !sessionActive ? '#999' : '#282c34'
              }}
            >
              End Current Session
            </button>
          </div>
        </div>

        {/* API Test Section */}
        <div style={{ marginBottom: '30px' }}>
          <p>Click the button below to test automatic tracestate generation and propagation</p>
          <p>@softprobe/sessify will automatically generate and inject tracestate headers</p>
          <button 
            onClick={handleTestApiCall} 
            className="test-button"
            disabled={loading || !sessionActive}
            style={{ 
              backgroundColor: !sessionActive ? '#666' : '#61dafb',
              color: !sessionActive ? '#999' : '#282c34'
            }}
          >
            {loading ? 'Loading...' : 'Test API Call with TraceState'}
          </button>
          {!sessionActive && (
            <p style={{ color: '#ff6b6b', fontSize: '14px', marginTop: '10px' }}>
              Please start a session first to test API calls
            </p>
          )}
        </div>
        
        {response && (
          <div style={{ marginTop: '20px', textAlign: 'left', fontSize: '14px' }}>
            <h3>Response:</h3>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(response, null, 2)}
            </pre>
            <p>Check the tracestate field above - it should contain x-sp-site and x-sp-session-id values</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;