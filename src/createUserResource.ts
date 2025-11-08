import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";

type Options = {
  publicKey: string;
  sessionId: string;
};

export function createUserResource({ publicKey, sessionId }: Options) {
  const resourceAttributes = {
    "user.session_id": sessionId,
    "user.public_key": publicKey,

    [ATTR_SERVICE_NAME]: "SOFTRPOBE",
    [ATTR_SERVICE_VERSION]: "0.0.1",

    "browser.user_agent": typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    "browser.language": typeof navigator !== "undefined" ? navigator.language : "en-US",
    "browser.referrer": typeof document !== "undefined" ? document.referrer : "direct",
    "browser.timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const resource = resourceFromAttributes(resourceAttributes);

  console.log("👤 Created user resource with attributes:", resource.attributes);
  return resource;
}
