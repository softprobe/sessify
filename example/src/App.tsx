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
  const [useCustomTraceState, setUseCustomTraceState] = useState(true);
  const [customTraceState, setCustomTraceState] = useState<Record<string, string>>({
    'x-sp-site': 'tracestate-test-app',
    'x-sp-environment': 'development',
    'x-sp-version': '1.0.0'
  });

  // Initialize sessify library
  useEffect(() => {
    console.log('App component mounted');
    
    // Initialize sessify library
    console.log('Initializing sessify library...');
    console.log('Current configuration:');
    console.log('- Storage type:', storageType);
    console.log('- Use custom trace state:', useCustomTraceState);
    console.log('- Custom trace state:', customTraceState);
    
    const config: any = {
      sessionStorageType: storageType
    };
    
    if (useCustomTraceState) {
      config.customTraceState = customTraceState;
      console.log('Using custom trace state configuration');
    } 
    
    console.log('Final config passed to initSessify:', config);
    
    initSessify(config);
    
    console.log('Sessify library initialization completed');
    
    // Check current session status
    const active = isSessionActive();
    setSessionActive(active);
    
    if (active) {
      const sessionId = getSessionId();
      setCurrentSessionId(sessionId);
      console.log('Current session ID:', sessionId);
    } else {
      console.log('No active session');
    }
  }, [storageType, useCustomTraceState, customTraceState]);

  const handleTestApiCall = async () => {
    setLoading(true);
    try {
      // sessify library should automatically inject tracestate headers via SimpleHttpInterceptor
      console.log('Making API call - SimpleHttpInterceptor should automatically inject tracestate header');
      
      // Use a public test API that echoes back headers
      const res = await fetch('https://httpbin.org/headers');
      const data = await res.json();
      
      // Create a mock response that shows what headers were sent
      const mockResponse = {
        success: true,
        message: 'API call completed - check browser console for tracestate injection logs',
        headersSent: data.headers,
        tracestateInjected: 'Check browser console for SimpleHttpInterceptor logs'
      };
      
      setResponse(mockResponse);
      console.log('API Response:', mockResponse);
    } catch (error) {
      console.error('API call failed:', error);
      setResponse({ 
        error: 'Failed to fetch data', 
        suggestion: 'Check browser console for SimpleHttpInterceptor logs to verify tracestate injection'
      });
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
    
    // If there is an active session, need to reinitialize
    if (sessionActive) {
      console.log('Active session detected, ending current session before switching storage type');
      endSession();
      setSessionActive(false);
      setCurrentSessionId('');
    }
  };

  const handleCustomTraceStateToggle = () => {
    const newValue = !useCustomTraceState;
    console.log('Toggling custom trace state mode to:', newValue);
    setUseCustomTraceState(newValue);
    
    // If there is an active session, need to reinitialize
    if (sessionActive) {
      console.log('Active session detected, ending current session before switching trace state mode');
      endSession();
      setSessionActive(false);
      setCurrentSessionId('');
    }
  };

  const handleCustomTraceStateChange = (key: string, value: string) => {
    setCustomTraceState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleAddCustomKey = () => {
    const newKey = `x-sp-custom-${Object.keys(customTraceState).length + 1}`;
    setCustomTraceState(prev => ({
      ...prev,
      [newKey]: 'custom-value'
    }));
  };

  const handleRemoveCustomKey = (key: string) => {
    setCustomTraceState(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TraceState Test Application</h1>
        
        <div className="config-section">
          <h3>Storage Configuration</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="session"
                checked={storageType === 'session'}
                onChange={(e) => handleStorageTypeChange(e.target.value as StorageType)}
              />
              Session Storage
            </label>
            <label>
              <input
                type="radio"
                value="local"
                checked={storageType === 'local'}
                onChange={(e) => handleStorageTypeChange(e.target.value as StorageType)}
              />
              Local Storage
            </label>
          </div>
        </div>

        <div className="config-section">
          <h3>Trace State Configuration</h3>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={useCustomTraceState}
                onChange={handleCustomTraceStateToggle}
              />
              Use Custom Key-Value Pairs
            </label>
          </div>
          
          {useCustomTraceState && (
            <div className="custom-trace-state">
              <h4>Custom Trace State Key-Value Pairs</h4>
              {Object.entries(customTraceState).map(([key, value]) => (
                <div key={key} className="key-value-pair">
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => handleCustomTraceStateChange(key, e.target.value)}
                    placeholder="Key"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleCustomTraceStateChange(key, e.target.value)}
                    placeholder="Value"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveCustomKey(key)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={handleAddCustomKey}
                className="add-btn"
              >
                Add Custom Key
              </button>
            </div>
          )}
        </div>
        
        {/* Session Management Section */}
        <div className="status-section">
          <h2>Session Management</h2>
          <div className="status-content">
            <p><strong>Session Status:</strong> {sessionActive ? 'Active' : 'Inactive'}</p>
            {sessionActive && (
              <p><strong>Current Session ID:</strong> {currentSessionId}</p>
            )}
            <p><strong>Storage Type:</strong> {storageType === 'session' ? 'Session Storage' : 'Local Storage'}</p>
            <p><strong>Trace State Mode:</strong> {useCustomTraceState ? 'Custom Key-Value Pairs' : 'Simple Site Name'}</p>
            {useCustomTraceState ? (
              <div>
                <p><strong>Custom Trace State:</strong></p>
                <pre>
                  {JSON.stringify(customTraceState, null, 2)}
                </pre>
              </div>
            ) : (
              <p><strong>Site Name:</strong> tracestate-test-app</p>
            )}
            <p className="storage-info">
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