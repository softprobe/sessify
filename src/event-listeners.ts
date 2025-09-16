// event-listeners.ts - 自动事件监听器
import {
  recordPageUnload,
  recordRouteChange,
  recordPageZoom,
  recordMouseMove,
  recordHoverEvent,
  recordDragEvent,
  recordKeyboardShortcut,
  recordFormCancel,
  recordScrollEvent,
} from "./environment-recorder";

// Global scroll recording state
let isGlobalScrollRecordingEnabled = false;
let globalScrollEventHandler: ((event: Event) => void) | null = null;

type Configs = {
  /** 是否开启滚动监听, 默认不开启 */
  observeScroll?: boolean;
};
// 初始化所有事件监听器
export function initializeEventListeners({ observeScroll }: Configs) {
  if (typeof window === "undefined") {
    console.log("⚠️ Skipping event listeners initialization on server side");
    return;
  }

  console.log("🎧 Initializing event listeners...");

  // 配置是否开启滚动监听
  disableGlobalScrollRecording();
  if (observeScroll === true) {
    enableGlobalScrollRecording();
  }

  // 页面卸载监听
  window.addEventListener("beforeunload", () => {
    recordPageUnload();
  });

  // 页面缩放监听
  let lastZoom = window.devicePixelRatio;
  const zoomObserver = new ResizeObserver(() => {
    const currentZoom = window.devicePixelRatio;
    if (Math.abs(currentZoom - lastZoom) > 0.1) {
      recordPageZoom(currentZoom);
      lastZoom = currentZoom;
    }
  });
  zoomObserver.observe(document.body);

  // 滚动事件监听
  globalScrollEventHandler = () => {
    // Only record if global scroll recording is enabled
    if (isGlobalScrollRecordingEnabled) {
      recordScrollEvent(window.scrollX, window.scrollY, window);
    }
  };
  window.addEventListener("scroll", globalScrollEventHandler, {
    passive: true,
  });
  console.log("📜 Global scroll event listener initialized");

  // 鼠标移动监听（节流）
  document.addEventListener("mousemove", (event) => {
    recordMouseMove(event.clientX, event.clientY);
  });

  // Hover 事件监听
  document.addEventListener(
    "mouseenter",
    (event) => {
      if (event.target instanceof HTMLElement) {
        recordHoverEvent("enter", event.target);
      }
    },
    true,
  );

  document.addEventListener(
    "mouseleave",
    (event) => {
      if (event.target instanceof HTMLElement) {
        recordHoverEvent("leave", event.target);
      }
    },
    true,
  );

  // 拖拽事件监听
  document.addEventListener("dragstart", (event) => {
    if (event.target instanceof HTMLElement) {
      recordDragEvent("start", event.target, {
        data_transfer: event.dataTransfer?.types.join(",") || "",
      });
    }
  });

  document.addEventListener("drag", (event) => {
    if (event.target instanceof HTMLElement) {
      recordDragEvent("move", event.target, {
        client_x: event.clientX,
        client_y: event.clientY,
      });
    }
  });

  document.addEventListener("dragend", (event) => {
    if (event.target instanceof HTMLElement) {
      recordDragEvent("end", event.target);
    }
  });

  // 键盘快捷键监听
  document.addEventListener("keydown", (event) => {
    const modifiers: string[] = [];
    if (event.ctrlKey) modifiers.push("Ctrl");
    if (event.metaKey) modifiers.push("Cmd");
    if (event.altKey) modifiers.push("Alt");
    if (event.shiftKey) modifiers.push("Shift");

    // 只记录有修饰键的快捷键
    if (modifiers.length > 0) {
      recordKeyboardShortcut(event.key, modifiers, event.target as HTMLElement);
    }
  });

  // 表单取消监听
  document.addEventListener("reset", (event) => {
    if (event.target instanceof HTMLFormElement) {
      recordFormCancel(event.target, "reset");
    }
  });

  // SPA 路由变化监听（History API）
  let currentUrl = window.location.href;

  // 监听 popstate 事件（浏览器前进/后退）
  window.addEventListener("popstate", () => {
    const newUrl = window.location.href;
    recordRouteChange(currentUrl, newUrl, "back");
    currentUrl = newUrl;
  });

  // 重写 pushState 和 replaceState 方法
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    const newUrl = window.location.href;
    originalPushState.apply(this, args);
    recordRouteChange(currentUrl, newUrl, "push");
    currentUrl = newUrl;
  };

  history.replaceState = function (...args) {
    const newUrl = window.location.href;
    originalReplaceState.apply(this, args);
    recordRouteChange(currentUrl, newUrl, "replace");
    currentUrl = newUrl;
  };

  // 双击和右键监听
  document.addEventListener("dblclick", (event) => {
    if (event.target instanceof HTMLElement) {
      const tracer = trace.getTracer("web-interaction");
      tracer.startActiveSpan("user.interaction.double_click", (span) => {
        try {
          const target = event.target as HTMLElement;
          span.setAttribute("user.action", "double_click");
          span.setAttribute("target.tag_name", target.tagName);
          span.setAttribute("target.id", target.id || "");
          span.setAttribute("target.class_name", target.className || "");
          span.setAttribute("user.action.timestamp", new Date().toISOString());
          span.setAttribute("page.url", window.location.href);

          const rect = target.getBoundingClientRect();
          span.setAttribute("target.position.x", rect.x);
          span.setAttribute("target.position.y", rect.y);

          console.log("🖱️ Double click recorded");
        } catch (error) {
          console.error("❌ Failed to record double click:", error);
          span.recordException(error as Error);
        } finally {
          span.end();
        }
      });
    }
  });

  document.addEventListener("contextmenu", (event) => {
    if (event.target instanceof HTMLElement) {
      const tracer = trace.getTracer("web-interaction");
      tracer.startActiveSpan("user.interaction.right_click", (span) => {
        try {
          const target = event.target as HTMLElement;
          span.setAttribute("user.action", "right_click");
          span.setAttribute("target.tag_name", target.tagName);
          span.setAttribute("target.id", target.id || "");
          span.setAttribute("target.class_name", target.className || "");
          span.setAttribute("user.action.timestamp", new Date().toISOString());
          span.setAttribute("page.url", window.location.href);

          const rect = target.getBoundingClientRect();
          span.setAttribute("target.position.x", rect.x);
          span.setAttribute("target.position.y", rect.y);

          console.log("🖱️ Right click recorded");
        } catch (error) {
          console.error("❌ Failed to record right click:", error);
          span.recordException(error as Error);
        } finally {
          span.end();
        }
      });
    }
  });

  console.log("✅ Event listeners initialized successfully");
}

// Global scroll recording control functions
export function enableGlobalScrollRecording(): boolean {
  if (typeof window === "undefined") {
    console.log("⚠️ Cannot enable scroll recording on server side");
    return false;
  }

  if (isGlobalScrollRecordingEnabled) {
    console.log("📜 Global scroll recording is already enabled");
    return true;
  }

  isGlobalScrollRecordingEnabled = true;
  console.log(
    "📜 Global scroll recording enabled - Real scroll events will be recorded",
  );
  return true;
}

export function disableGlobalScrollRecording(): boolean {
  if (typeof window === "undefined") {
    console.log("⚠️ Cannot disable scroll recording on server side");
    return false;
  }

  if (!isGlobalScrollRecordingEnabled) {
    console.log("📜 Global scroll recording is already disabled");
    return false;
  }

  isGlobalScrollRecordingEnabled = false;
  console.log("📜 Global scroll recording disabled");
  return true;
}

export function isGlobalScrollRecordingActive(): boolean {
  return isGlobalScrollRecordingEnabled;
}

export function toggleGlobalScrollRecording(): boolean {
  if (isGlobalScrollRecordingEnabled) {
    return disableGlobalScrollRecording();
  } else {
    return enableGlobalScrollRecording();
  }
}

// 导入 trace 用于手动记录
import { trace } from "@opentelemetry/api";
