import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";

type Options = {
  siteName: string;
  sessionId: string;
};

export function createUserResource({ siteName, sessionId }: Options) {
  const resourceAttributes: { [key: string]: any } = {
    "user.session_id": sessionId,

    [ATTR_SERVICE_NAME]: siteName,
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