import express from 'express';
import cors from 'cors';
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Test API endpoint for checking tracestate headers
app.get('/api/test', (req, res) => {
  // Get request header information
  const headers = req.headers;
  
  // Pay special attention to tracestate header
  const tracestate = headers['tracestate'] || headers['traceState'] || 'Not found';
  
  // Also get traceparent header for reference
  const traceparent = headers['traceparent'] || 'Not found';
  
  // Log all request headers to console
  console.log('Received request headers:');
  console.log('tracestate:', tracestate);
  console.log('traceparent:', traceparent);
  console.log('All headers:', headers);
  
  // Return header information to frontend
  res.json({
    message: 'TraceState Test API Response',
    headers: {
      tracestate,
      traceparent,
      // Also return some other important headers
      host: headers['host'],
      accept: headers['accept'],
      'user-agent': headers['user-agent']
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
  console.log('Test API: http://localhost:3003/api/test');
  console.log('Health Check: http://localhost:3003/health');
});