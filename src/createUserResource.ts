import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";

type Options = {
  apiKey: string;
  userId: string;
  serviceName: string;
  spSessionId: string;
};
// Create user resource information (Mock data)
export function createUserResource({ apiKey, userId, serviceName, spSessionId }: Options) {
  // Mock user information - in a real application, this data should come from an authentication system
  const mockUserInfo = {
    // TODO:
    email: "john_doe@example.com",
    username: "john_doe",
    apiKey: apiKey || '',
    userId: userId || '',

    spSessionId,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    language: typeof navigator !== "undefined" ? navigator.language : "en-US",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution:
      typeof screen !== "undefined" ? `${screen.width}x${screen.height}` : "unknown",
    referrer: typeof document !== "undefined" ? document.referrer : "direct",
  };

  const resource = resourceFromAttributes({
    // User-specific attributes
    "user.email": mockUserInfo.email,
    "user.username": mockUserInfo.username,
    "user.id": mockUserInfo.userId,
    "user.sp_session_id": mockUserInfo.spSessionId,
    [ATTR_SERVICE_NAME]: serviceName,
    [ATTR_SERVICE_VERSION]: "0.0.1",
  });

  console.log("👤 Created user resource with attributes:", resource.attributes);
  return resource;
}
