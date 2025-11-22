import express from 'express';
import cors from 'cors';
const app = express();

// 使用CORS中间件允许跨域请求
app.use(cors());

// 解析JSON请求体
app.use(express.json());

// 测试API端点，用于检查tracestate头
app.get('/api/test', (req, res) => {
  // 获取请求头信息
  const headers = req.headers;
  
  // 特别关注tracestate头
  const tracestate = headers['tracestate'] || headers['traceState'] || 'Not found';
  
  // 也获取traceparent头作为参考
  const traceparent = headers['traceparent'] || 'Not found';
  
  // 记录所有请求头到控制台
  console.log('Received request headers:');
  console.log('tracestate:', tracestate);
  console.log('traceparent:', traceparent);
  console.log('All headers:', headers);
  
  // 返回头信息给前端
  res.json({
    message: 'TraceState Test API Response',
    headers: {
      tracestate,
      traceparent,
      // 也返回部分其他重要头信息
      host: headers['host'],
      accept: headers['accept'],
      'user-agent': headers['user-agent']
    },
    timestamp: new Date().toISOString()
  });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
  console.log('Test API: http://localhost:3003/api/test');
  console.log('Health Check: http://localhost:3003/health');
});