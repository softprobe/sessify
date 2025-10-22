import { trace } from "@opentelemetry/api";
import { getElementXPath } from "./getElementXPath";

// Handle change events for select elements
const handleSelectChange = (target: HTMLSelectElement) => {
  const spanType = "select_change";
  const tracer = trace.getTracer("web-interaction");
  tracer.startActiveSpan(`user.interaction.${spanType}`, (span) => {
    try {
      span.setAttribute("user.action", spanType);
      span.setAttribute("target.tag_name", target.tagName);
      span.setAttribute("target.id", target.id || "");
      span.setAttribute("target.class_name", target.className || "");
      span.setAttribute("user.action.timestamp", new Date().toISOString());
      span.setAttribute("selected.value", target.value);
      span.setAttribute("selected.text", target.options[target.selectedIndex].text);
      span.setAttribute("xpath", getElementXPath(target));
      console.log("🖱️ Select change recorded");
    } catch (error) {
      console.error("❌ Failed to record select change:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });
};

// Handle change events for input[type='date'] elements
const handleInputDateChange = (target: HTMLInputElement) => {
  const spanType = "input_date_change";
  const tracer = trace.getTracer("web-interaction");
  tracer.startActiveSpan(`user.interaction.${spanType}`, (span) => {
    try {
      span.setAttribute("user.action", spanType);
      span.setAttribute("target.tag_name", target.tagName);
      span.setAttribute("target.id", target.id || "");
      span.setAttribute("target.type", target.type || "");
      span.setAttribute("target.class_name", target.className || "");
      span.setAttribute("user.action.timestamp", new Date().toISOString());
      span.setAttribute("input.value", target.value);
      span.setAttribute("xpath", getElementXPath(target));
      console.log("🖱️ Input change recorded");
    } catch (error) {
      console.error("❌ Failed to record input change:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });
};

export const recordChangeEvent = (event: Event) => {
  if (event.target instanceof HTMLSelectElement) {
    handleSelectChange(event.target);
    return;
  }
  if (event.target instanceof HTMLInputElement && event.target.type === "date") {
    handleInputDateChange(event.target);
    return;
  }
  return;
};
