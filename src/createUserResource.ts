import { resourceFromAttributes } from '@opentelemetry/resources';

type Options = {
  apiKey: string;
  userId: string;
  sessionId: string;
};
// 创建用户资源信息（Mock 数据）
export function createUserResource({ apiKey, userId, sessionId }: Options) {
  // 模拟用户信息 - 在实际应用中这些数据应该来自认证系统
  const mockUserInfo = {
    email: 'harry@example.com',
    username: 'john_doe',
    apiKey,
    userId,
    sessionId,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    language: typeof navigator !== 'undefined' ? navigator.language : 'en-US',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution:
      typeof screen !== 'undefined' ? `${screen.width}x${screen.height}` : 'unknown',
    referrer: typeof document !== 'undefined' ? document.referrer : 'direct',
  };

  const resource = resourceFromAttributes({
    // 用户特定属性
    'user.email': mockUserInfo.email,
    'user.username': mockUserInfo.username,
    'user.id': mockUserInfo.userId,
    'user.session_id': mockUserInfo.sessionId,
  });

  console.log('👤 Created user resource with attributes:', resource.attributes);
  return resource;
}
