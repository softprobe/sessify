// environment-recorder.ts - 环境信息记录器
import { trace } from "@opentelemetry/api";

export function recordEnvironmentInfo(sessionId?: string) {
  const tracer = trace.getTracer("web-env");
  tracer.startActiveSpan("session.env", (span) => {
    try {
      // 浏览器与系统
      span.setAttribute("browser.user_agent", navigator.userAgent);
      span.setAttribute("browser.platform", navigator.platform); // OS 信息
      span.setAttribute("device.pixel_ratio", window.devicePixelRatio);

      // 屏幕 & 视口
      span.setAttribute("screen.width", window.screen.width);
      span.setAttribute("screen.height", window.screen.height);
      span.setAttribute("viewport.width", window.innerWidth);
      span.setAttribute("viewport.height", window.innerHeight);

      // 网络 & 位置
      const conn = (navigator as any).connection;
      if (conn) {
        span.setAttribute("network.effectiveType", conn.effectiveType); // wifi/4g/…
        span.setAttribute("network.rtt", conn.rtt);
      }
      span.setAttribute("browser.timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
      span.setAttribute("browser.language", navigator.language);

      // 会话信息
      span.setAttribute("page.url", location.href);
      span.setAttribute("page.referrer", document.referrer || "direct");
      if (sessionId) {
        span.setAttribute("session.id", sessionId); // 记得脱敏/加密
      }

      // 也可以解析 URL 中的 UTM 参数
      const urlParams = new URLSearchParams(location.search);
      ["utm_source", "utm_medium", "utm_campaign"].forEach((key) => {
        if (urlParams.get(key)) {
          span.setAttribute(`utm.${key}`, urlParams.get(key)!);
        }
      });

      console.log("🌍 Environment info recorded successfully");
    } catch (error) {
      console.error("❌ Failed to record environment info:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });
}

// 记录页面加载信息
export function recordPageLoadInfo() {
  const tracer = trace.getTracer("web-page");
  tracer.startActiveSpan("page.load", (span) => {
    try {
      // 页面加载性能
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;

        span.setAttribute("page.load_time", loadTime);
        span.setAttribute("page.dom_ready_time", domReadyTime);
        span.setAttribute("page.dns_time", timing.domainLookupEnd - timing.domainLookupStart);
        span.setAttribute("page.tcp_time", timing.connectEnd - timing.connectStart);
        span.setAttribute("page.request_time", timing.responseEnd - timing.requestStart);
      }

      // 页面信息
      span.setAttribute("page.title", document.title);
      span.setAttribute("page.url", window.location.href);
      span.setAttribute("page.path", window.location.pathname);
      span.setAttribute("page.search", window.location.search);
      span.setAttribute("page.hash", window.location.hash);

      // 文档信息
      span.setAttribute("document.ready_state", document.readyState);
      span.setAttribute("document.character_set", document.characterSet);
      span.setAttribute("document.content_type", document.contentType);

      console.log("📄 Page load info recorded successfully");
    } catch (error) {
      console.error("❌ Failed to record page load info:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });
}

// 记录用户交互信息
export function recordUserInteraction(
  action: string,
  target?: HTMLElement,
  details?: Record<string, any>,
) {
  const tracer = trace.getTracer("web-interaction");
  tracer.startActiveSpan(`user.interaction.${action}`, (span) => {
    try {
      // 基础交互信息
      span.setAttribute("user.action", action);
      span.setAttribute("user.action.timestamp", new Date().toISOString());

      // 目标元素信息
      if (target) {
        span.setAttribute("target.tag_name", target.tagName);
        span.setAttribute("target.id", target.id || "");
        span.setAttribute("target.class_name", target.className || "");
        span.setAttribute("target.text_content", target.textContent?.substring(0, 100) || "");

        // 位置信息
        const rect = target.getBoundingClientRect();
        span.setAttribute("target.position.x", rect.x);
        span.setAttribute("target.position.y", rect.y);
        span.setAttribute("target.size.width", rect.width);
        span.setAttribute("target.size.height", rect.height);
      }

      // 页面上下文
      span.setAttribute("page.url", window.location.href);
      span.setAttribute("page.scroll_y", window.scrollY);
      span.setAttribute("page.scroll_x", window.scrollX);

      // 自定义详情
      if (details) {
        Object.entries(details).forEach(([key, value]) => {
          span.setAttribute(`custom.${key}`, String(value));
        });
      }

      console.log(`👆 User interaction recorded: ${action}`, details);
    } catch (error) {
      console.error("❌ Failed to record user interaction:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });
}

// 记录网络请求信息
export function recordNetworkRequest(
  url: string,
  method: string,
  status?: number,
  duration?: number,
  requestData?: {
    headers?: Record<string, string>;
    body?: any;
    contentType?: string;
  },
  responseData?: {
    headers?: Record<string, string>;
    body?: any;
    contentType?: string;
    size?: number;
  },
) {
  const tracer = trace.getTracer("web-network");
  tracer.startActiveSpan("network.request", (span) => {
    try {
      // 基础请求信息
      span.setAttribute("http.method", method);
      span.setAttribute("http.url", url);
      span.setAttribute("http.scheme", new URL(url).protocol.replace(":", ""));
      span.setAttribute("http.host", new URL(url).host);
      span.setAttribute("http.path", new URL(url).pathname);

      if (status) {
        span.setAttribute("http.status_code", status);
        span.setAttribute("http.status_class", Math.floor(status / 100) * 100);
      }

      if (duration) {
        span.setAttribute("http.duration", duration);
      }

      span.setAttribute("request.timestamp", new Date().toISOString());
      span.setAttribute("page.url", window.location.href);

      // 记录请求详情
      if (requestData) {
        if (requestData.headers) {
          // 记录重要的请求头
          const importantHeaders = [
            "content-type",
            "authorization",
            "user-agent",
            "accept",
            "cache-control",
          ];
          importantHeaders.forEach((header) => {
            const value =
              requestData.headers![header] || requestData.headers![header.toLowerCase()];
            if (value) {
              span.setAttribute(`request.header.${header}`, value);
            }
          });
          span.setAttribute("request.headers_count", Object.keys(requestData.headers).length);
        }

        if (requestData.body) {
          // 记录请求体信息（不记录敏感内容）
          const bodyStr =
            typeof requestData.body === "string"
              ? requestData.body
              : JSON.stringify(requestData.body);
          span.setAttribute("request.body_size", bodyStr.length);
          span.setAttribute("request.has_body", true);

          // 只记录非敏感请求体的前100个字符
          if (
            bodyStr.length <= 100 &&
            !bodyStr.toLowerCase().includes("password") &&
            !bodyStr.toLowerCase().includes("token")
          ) {
            span.setAttribute("request.body_preview", bodyStr);
          }
        }

        if (requestData.contentType) {
          span.setAttribute("request.content_type", requestData.contentType);
        }
      }

      // 记录响应详情
      if (responseData) {
        if (responseData.headers) {
          // 记录重要的响应头
          const importantResponseHeaders = [
            "content-type",
            "content-length",
            "cache-control",
            "etag",
            "last-modified",
          ];
          importantResponseHeaders.forEach((header) => {
            const value =
              responseData.headers![header] || responseData.headers![header.toLowerCase()];
            if (value) {
              span.setAttribute(`response.header.${header}`, value);
            }
          });
          span.setAttribute("response.headers_count", Object.keys(responseData.headers).length);
        }

        if (responseData.body) {
          // 记录响应体信息
          const bodyStr =
            typeof responseData.body === "string"
              ? responseData.body
              : JSON.stringify(responseData.body);
          span.setAttribute("response.body_size", bodyStr.length);
          span.setAttribute("response.has_body", true);

          // 只记录响应体的前200个字符
          if (bodyStr.length <= 200) {
            span.setAttribute("response.body_preview", bodyStr);
          } else {
            span.setAttribute("response.body_preview", bodyStr.substring(0, 200) + "...");
          }
        }

        if (responseData.contentType) {
          span.setAttribute("response.content_type", responseData.contentType);
        }

        if (responseData.size) {
          span.setAttribute("response.size_bytes", responseData.size);
        }
      }

      console.log(`🌐 Network request recorded: ${method} ${url}`, {
        status,
        duration,
        requestSize: requestData?.body ? JSON.stringify(requestData.body).length : 0,
        responseSize: responseData?.body ? JSON.stringify(responseData.body).length : 0,
      });
    } catch (error) {
      console.error("❌ Failed to record network request:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });
}

// 记录页面卸载信息
export function recordPageUnload() {
  const tracer = trace.getTracer("web-page");
  tracer.startActiveSpan("page.unload", (span) => {
    try {
      span.setAttribute("page.url", window.location.href);
      span.setAttribute("page.title", document.title);
      span.setAttribute("page.scroll_y", window.scrollY);
      span.setAttribute("page.scroll_x", window.scrollX);
      span.setAttribute("page.unload_timestamp", new Date().toISOString());

      // 记录页面停留时间
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const stayTime = Date.now() - timing.loadEventEnd;
        span.setAttribute("page.stay_time", stayTime);
      }

      console.log("📄 Page unload info recorded successfully");
    } catch (error) {
      console.error("❌ Failed to record page unload info:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });
}

// 记录路由变化（SPA history API）
export function recordRouteChange(
  fromUrl: string,
  toUrl: string,
  method: "push" | "replace" | "back" | "forward",
) {
  const tracer = trace.getTracer("web-navigation");
  tracer.startActiveSpan("navigation.route_change", (span) => {
    try {
      span.setAttribute("navigation.from_url", fromUrl);
      span.setAttribute("navigation.to_url", toUrl);
      span.setAttribute("navigation.method", method);
      span.setAttribute("navigation.timestamp", new Date().toISOString());
      span.setAttribute("page.scroll_y", window.scrollY);
      span.setAttribute("page.scroll_x", window.scrollX);

      console.log(`🧭 Route change recorded: ${fromUrl} → ${toUrl} (${method})`);
    } catch (error) {
      console.error("❌ Failed to record route change:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });
}

// 记录页面缩放
export function recordPageZoom(scale: number) {
  const tracer = trace.getTracer("web-viewport");
  tracer.startActiveSpan("viewport.zoom", (span) => {
    try {
      span.setAttribute("viewport.scale", scale);
      span.setAttribute("viewport.width", window.innerWidth);
      span.setAttribute("viewport.height", window.innerHeight);
      span.setAttribute("viewport.zoom_timestamp", new Date().toISOString());

      console.log(`🔍 Page zoom recorded: ${scale}x`);
    } catch (error) {
      console.error("❌ Failed to record page zoom:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });
}

// 记录鼠标移动轨迹（节流）
let mouseMoveBuffer: Array<{ x: number; y: number; timestamp: number }> = [];
let mouseMoveTimer: NodeJS.Timeout | null = null;
let lastMouseMoveTime = 0;
const MOUSE_MOVE_THROTTLE_MS = 100; // 每100ms最多记录一次
const MOUSE_MOVE_BATCH_SIZE = 10; // 每10个点或每500ms处理一次

export function recordMouseMove(x: number, y: number) {
  // const now = Date.now();
  // // 节流：如果距离上次记录时间太短，直接返回
  // if (now - lastMouseMoveTime < MOUSE_MOVE_THROTTLE_MS) {
  //   return;
  // }
  // lastMouseMoveTime = now;
  // mouseMoveBuffer.push({ x, y, timestamp: now });
  // // 如果缓冲区达到批量大小，立即处理
  // if (mouseMoveBuffer.length >= MOUSE_MOVE_BATCH_SIZE) {
  //   processMouseMoveBuffer();
  //   return;
  // }
  // // 设置定时器，如果500ms内没有达到批量大小，也会处理
  // if (!mouseMoveTimer) {
  //   mouseMoveTimer = setTimeout(() => {
  //     processMouseMoveBuffer();
  //   }, 500);
  // }
}

function processMouseMoveBuffer() {
  if (mouseMoveBuffer.length === 0) {
    return;
  }

  const tracer = trace.getTracer("web-mouse");
  tracer.startActiveSpan("mouse.move_trajectory", (span) => {
    try {
      span.setAttribute("mouse.trajectory_points", mouseMoveBuffer.length);
      span.setAttribute("mouse.start_x", mouseMoveBuffer[0].x);
      span.setAttribute("mouse.start_y", mouseMoveBuffer[0].y);
      span.setAttribute("mouse.end_x", mouseMoveBuffer[mouseMoveBuffer.length - 1].x);
      span.setAttribute("mouse.end_y", mouseMoveBuffer[mouseMoveBuffer.length - 1].y);
      span.setAttribute(
        "mouse.duration",
        mouseMoveBuffer[mouseMoveBuffer.length - 1].timestamp - mouseMoveBuffer[0].timestamp,
      );
      span.setAttribute("page.url", window.location.href);

      // 计算移动距离
      let totalDistance = 0;
      for (let i = 1; i < mouseMoveBuffer.length; i++) {
        const dx = mouseMoveBuffer[i].x - mouseMoveBuffer[i - 1].x;
        const dy = mouseMoveBuffer[i].y - mouseMoveBuffer[i - 1].y;
        totalDistance += Math.sqrt(dx * dx + dy * dy);
      }
      span.setAttribute("mouse.total_distance", totalDistance);

      console.log(
        `🖱️ Mouse trajectory recorded: ${mouseMoveBuffer.length} points, distance: ${totalDistance.toFixed(2)}px`,
      );
    } catch (error) {
      console.error("❌ Failed to record mouse trajectory:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });

  // 清理缓冲区
  mouseMoveBuffer = [];
  if (mouseMoveTimer) {
    clearTimeout(mouseMoveTimer);
    mouseMoveTimer = null;
  }
}

// 记录 hover 事件
export function recordHoverEvent(action: "enter" | "leave", target: HTMLElement) {
  // const tracer = trace.getTracer('web-hover');
  // tracer.startActiveSpan(`hover.${action}`, (span) => {
  //   try {
  //     span.setAttribute('hover.action', action);
  //     span.setAttribute('target.tag_name', target.tagName);
  //     span.setAttribute('target.id', target.id || '');
  //     span.setAttribute('target.class_name', target.className || '');
  //     const rect = target.getBoundingClientRect();
  //     span.setAttribute('target.position.x', rect.x);
  //     span.setAttribute('target.position.y', rect.y);
  //     span.setAttribute('hover.timestamp', new Date().toISOString());
  //     span.setAttribute('page.url', window.location.href);
  //     console.log(`🎯 Hover ${action} recorded on ${target.tagName}`);
  //   } catch (error) {
  //     console.error('❌ Failed to record hover event:', error);
  //     span.recordException(error as Error);
  //   } finally {
  //     span.end();
  //   }
  // });
}

// 记录拖拽事件
export function recordDragEvent(
  action: "start" | "move" | "end",
  target: HTMLElement,
  details?: Record<string, any>,
) {
  const tracer = trace.getTracer("web-drag");
  tracer.startActiveSpan(`drag.${action}`, (span) => {
    try {
      span.setAttribute("drag.action", action);
      span.setAttribute("target.tag_name", target.tagName);
      span.setAttribute("target.id", target.id || "");
      span.setAttribute("drag.timestamp", new Date().toISOString());
      span.setAttribute("page.url", window.location.href);

      if (details) {
        Object.entries(details).forEach(([key, value]) => {
          span.setAttribute(`drag.${key}`, String(value));
        });
      }

      console.log(`🖱️ Drag ${action} recorded on ${target.tagName}`);
    } catch (error) {
      console.error("❌ Failed to record drag event:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });
}

// 记录键盘快捷键
export function recordKeyboardShortcut(key: string, modifiers: string[], target?: HTMLElement) {
  const tracer = trace.getTracer("web-keyboard");
  tracer.startActiveSpan("keyboard.shortcut", (span) => {
    try {
      span.setAttribute("keyboard.key", key);
      span.setAttribute("keyboard.modifiers", modifiers.join("+"));
      span.setAttribute("keyboard.shortcut", [...modifiers, key].join("+"));
      span.setAttribute("keyboard.timestamp", new Date().toISOString());
      span.setAttribute("page.url", window.location.href);

      if (target) {
        span.setAttribute("target.tag_name", target.tagName);
        span.setAttribute("target.id", target.id || "");
      }

      console.log(`⌨️ Keyboard shortcut recorded: ${[...modifiers, key].join("+")}`);
    } catch (error) {
      console.error("❌ Failed to record keyboard shortcut:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });
}

// 记录滚动事件
let scrollBuffer: Array<{ x: number; y: number; timestamp: number }> = [];
let scrollTimer: NodeJS.Timeout | null = null;
let lastScrollTime = 0;
const SCROLL_THROTTLE_MS = 100; // 每100ms最多记录一次
const SCROLL_BATCH_SIZE = 5; // 每5个点或每500ms处理一次

export function recordScrollEvent(x: number, y: number, target?: HTMLElement | Window) {
  const now = Date.now();

  // 节流：如果距离上次记录时间太短，直接返回
  if (now - lastScrollTime < SCROLL_THROTTLE_MS) {
    return;
  }

  lastScrollTime = now;
  scrollBuffer.push({ x, y, timestamp: now });

  // 如果缓冲区达到批量大小，立即处理
  if (scrollBuffer.length >= SCROLL_BATCH_SIZE) {
    processScrollBuffer(target);
    return;
  }

  // 设置定时器，如果500ms内没有达到批量大小，也会处理
  if (!scrollTimer) {
    scrollTimer = setTimeout(() => {
      processScrollBuffer(target);
    }, 500);
  }
}

function processScrollBuffer(target?: HTMLElement | Window) {
  if (scrollBuffer.length === 0) {
    return;
  }

  const tracer = trace.getTracer("web-scroll");
  tracer.startActiveSpan("scroll.event", (span) => {
    try {
      span.setAttribute("scroll.points_count", scrollBuffer.length);
      span.setAttribute("scroll.start_x", scrollBuffer[0].x);
      span.setAttribute("scroll.start_y", scrollBuffer[0].y);
      span.setAttribute("scroll.end_x", scrollBuffer[scrollBuffer.length - 1].x);
      span.setAttribute("scroll.end_y", scrollBuffer[scrollBuffer.length - 1].y);
      span.setAttribute(
        "scroll.duration",
        scrollBuffer[scrollBuffer.length - 1].timestamp - scrollBuffer[0].timestamp,
      );
      span.setAttribute("scroll.timestamp", new Date().toISOString());
      span.setAttribute("page.url", window.location.href);

      // 计算滚动距离
      const deltaX = scrollBuffer[scrollBuffer.length - 1].x - scrollBuffer[0].x;
      const deltaY = scrollBuffer[scrollBuffer.length - 1].y - scrollBuffer[0].y;
      const totalDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      span.setAttribute("scroll.delta_x", deltaX);
      span.setAttribute("scroll.delta_y", deltaY);
      span.setAttribute("scroll.total_distance", totalDistance);

      // 滚动方向
      const direction = deltaY > 0 ? "down" : deltaY < 0 ? "up" : "none";
      span.setAttribute("scroll.direction", direction);

      // 目标信息
      if (target && target !== window) {
        const element = target as HTMLElement;
        span.setAttribute("scroll.target.tag_name", element.tagName);
        span.setAttribute("scroll.target.id", element.id || "");
        span.setAttribute("scroll.target.class_name", element.className || "");
      } else {
        span.setAttribute("scroll.target", "window");
      }

      // 视口信息
      span.setAttribute("viewport.width", window.innerWidth);
      span.setAttribute("viewport.height", window.innerHeight);
      span.setAttribute("document.scroll_width", document.documentElement.scrollWidth);
      span.setAttribute("document.scroll_height", document.documentElement.scrollHeight);

      console.log(
        `📜 Scroll event recorded: ${scrollBuffer.length} points, direction: ${direction}, distance: ${totalDistance.toFixed(2)}px`,
      );
    } catch (error) {
      console.error("❌ Failed to record scroll event:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });

  // 清理缓冲区
  scrollBuffer = [];
  if (scrollTimer) {
    clearTimeout(scrollTimer);
    scrollTimer = null;
  }
}

// 记录表单取消
export function recordFormCancel(form: HTMLFormElement, reason?: string) {
  const tracer = trace.getTracer("web-form");
  tracer.startActiveSpan("form.cancel", (span) => {
    try {
      span.setAttribute("form.action", "cancel");
      span.setAttribute("form.id", form.id || "");
      span.setAttribute("form.class_name", form.className || "");
      span.setAttribute("form.cancel_reason", reason || "unknown");
      span.setAttribute("form.timestamp", new Date().toISOString());
      span.setAttribute("page.url", window.location.href);

      console.log(`📝 Form cancel recorded: ${form.id || "unnamed"} (${reason || "unknown"})`);
    } catch (error) {
      console.error("❌ Failed to record form cancel:", error);
      span.recordException(error as Error);
    } finally {
      span.end();
    }
  });
}
