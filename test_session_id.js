// 测试session id生成逻辑
const { getSessionId, startSession } = require('./dist/index.js');

// 初始化会话管理器
require('./dist/browser.js').initBrowserSessify({ site: 'test-site' });

console.log('=== Session ID 生成测试 ===');

// 测试多次生成，检查是否唯一
const sessionIds = new Set();
for (let i = 0; i < 5; i++) {
  const sessionId = startSession();
  console.log(`测试 ${i + 1}: ${sessionId} (长度: ${sessionId.length})`);
  
  if (sessionIds.has(sessionId)) {
    console.log('❌ 发现重复的session id!');
  }
  sessionIds.add(sessionId);
}

console.log('=== 格式验证 ===');
const sampleId = getSessionId();
console.log('示例ID:', sampleId);
console.log('长度:', sampleId.length);
console.log('字符集验证:', /^[0-9A-Za-z]+$/.test(sampleId) ? '✅ 通过' : '❌ 失败');

console.log('=== 结论 ===');
if (sessionIds.size === 5) {
  console.log('✅ 所有session id都是唯一的');
} else {
  console.log('❌ 发现重复的session id');
}