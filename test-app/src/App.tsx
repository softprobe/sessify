import { useState, useEffect } from 'react';
import { initSessify, getSessionId } from '@softprobe/sessify';
import './App.css';

function App() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 初始化sessify库
  useEffect(() => {
    console.log('App component mounted');
    
    // 初始化sessify库
    console.log('Initializing sessify library...');
    initSessify({
      siteName: 'tracestate-test-app'
    });
    
    console.log('Sessify library initialization completed');
    
    // 测试会话ID生成
    const sessionId = getSessionId();
    console.log('Generated session ID:', sessionId);
  }, []);

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>TraceState Test Application</h1>
        <p>Click the button below to test automatic tracestate generation and propagation</p>
        <p>@softprobe/sessify will automatically generate and inject tracestate headers</p>
        <button 
          onClick={handleTestApiCall} 
          className="test-button"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Test API Call with TraceState'}
        </button>
        
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