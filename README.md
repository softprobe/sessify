# @softprobe/sessify

A lightweight library with powerful session lifecycle management for web applications, with built-in HTTP request tracestate header injection.

## 📋 Project Introduction

@softprobe/sessify is a lightweight library with its core strength in powerful session lifecycle management capabilities. It automatically creates, maintains, expires, and manages user sessions while providing flexible storage options and custom request header information injection functionality, making session management in web applications simple and efficient.

### Key Features

- 🚀 **Powerful Session Lifecycle Management** - Automatically creates, maintains, expires, and manages user sessions, supporting session creation, validation, update, and destruction
- 💾 **Flexible Storage Options** - Supports sessionStorage (session-level) and localStorage (persistent) for storing session information
- 🎯 **Custom Request Information** - Supports custom key-value pairs as part of tracestate to enhance request tracking capabilities
- 🔍 **HTTP Request Interception** - Automatically intercepts fetch requests and injects session information into tracestate headers
- 📱 **Smart Environment Detection** - Automatically detects the runtime environment and skips execution in non-browser environments
- 🔒 **Zero Dependencies** - Does not rely on any external libraries, keeping the package size small

## 🚀 Installation

Install with npm:

```bash
npm install @softprobe/sessify
```

Install with yarn:

```bash
yarn add @softprobe/sessify
```

Install with pnpm:

```bash
pnpm add @softprobe/sessify
```

## 💻 Usage

### Basic Usage

```javascript
import { initSessify, getSessionId, startSession, endSession, isSessionActive } from '@softprobe/sessify';

// 初始化库
initSessify({});

// 或使用最少配置
initSessify({
  // 所有配置项都是可选的
});

// 获取当前会话ID
const sessionId = getSessionId();
console.log('Current session ID:', sessionId);

// 检查会话是否活跃
const active = isSessionActive();
console.log('Session active:', active);

// 强制开始新会话
const newSessionId = startSession();
console.log('New session started:', newSessionId);

// 结束当前会话
endSession();
```

### Using Custom Trace State

```javascript
import { initSessify } from '@softprobe/sessify';

// 使用自定义键值对
initSessify({
  customTraceState: {
    'x-sp-site': 'my-awesome-app',
    'x-sp-environment': 'production',
    'x-sp-version': '1.0.0',
    'x-sp-custom-data': 'custom-value'
  },
  sessionStorageType: 'local' // 使用localStorage持久化会话
});
```

## 📚 API Documentation

### Session Lifecycle Management Core Functions

#### `initSessify(config: SessifyConfig): void`

初始化会话管理库。这是使用库的第一步，必须先调用此函数来配置会话管理行为。

**参数：**
- `config`: 配置对象，包含以下可选属性：
  - `sessionStorageType?: 'session' | 'local'`: 会话存储类型，默认为 'session'
  - `siteName?: string`: 站点名称，将作为 tracestate 的一部分
  - `customTraceState?: Record<string, string>`: 自定义键值对，将作为 tracestate 的一部分

#### `getSessionId(): string`

**[Lifecycle Core]** Gets the current session ID. If the session does not exist or has expired, it will automatically create a new session; if the session exists but is nearing expiration, it will update the session activity time.

**Returns:** The current valid session ID string

#### `startSession(): string`

**[Lifecycle Core]** Forces the start of a new session, immediately invalidating the current session and creating a brand new one.

**Returns:** The newly created session ID string

#### `endSession(): void`

**[Lifecycle Core]** Ends the current session, completely clearing the session storage and immediately invalidating the session.

#### `isSessionActive(): boolean`

**[Lifecycle Core]** Checks if there is an active and unexpired session.

**Returns:** Returns true if the session is active; otherwise returns false

### Configuration Options

```typescript
interface SessifyConfig {
  // Site name
  siteName?: string;
  
  // Custom key-value pairs, will override siteName
  customTraceState?: Record<string, string>;

  // Session storage type
  sessionStorageType?: 'session' | 'local';

  // Enable trace data reporting
  enableTrace?: boolean;

  // Custom data reporting endpoint
  endpoint?: string;

  // Enable console logging
  enableConsole?: boolean;

  // Auto-detection configuration
  instrumentations?: {
    // Monitor network requests
    network?: boolean;
    // Monitor user interaction events
    interaction?: boolean;
    // Record page environment information
    environment?: boolean;
  };

  // Enable scroll monitoring
  observeScroll?: boolean;
}
```

## 🔧 Technical Details

### Session Lifecycle Management

- **Complete Lifecycle Support**: Automatically handles the entire process of session creation, validation, update, and destruction
- **Intelligent Session Expiration Mechanism**: Automatically expires after 30 minutes of inactivity to ensure security
- **Unique Session Identifier**: Uses timestamp (base36) + random string to generate a unique session ID of approximately 16 characters
- **Session Activity Tracking**: Automatically updates the last activity time each time the session is accessed
- **Session Validation**: Automatically checks validity when getting the session ID, and automatically creates a new session when invalid or expired
- **Flexible Storage Options**: Supports sessionStorage (session-level) and localStorage (persistent) for storing session information

### HTTP Interception

- Automatically intercepts the browser's `fetch` API
- Injects the `tracestate` field into request headers in the format `key1=value1,key2=value2,...`
- Automatically includes the session ID in the format `x-sp-session-id=session_id`

### Environment Detection

- Automatically detects the runtime environment and skips execution in non-browser environments (e.g., server-side rendering)
- Determines the runtime environment by checking if the `window` object exists

## 🛠️ Development Guide

### Clone Repository

```bash
git clone https://github.com/softprobe/web-inspector.git
cd web-inspector
```

### Install Dependencies

```bash
npm install
```

### Build Project

```bash
npm run build
```

### Run Tests

```bash
npm test
```

### Code Quality Checks

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复 ESLint 问题
npm run lint:fix

# 格式化代码
npm run format

# 检查代码格式
npm run format:check
```

## 🧪 Test Application

The project includes a test application located in the `test-app` directory, which can be used to test the library's functionality:

### Start Test Application

```bash
cd test-app
npm install
npm run dev
```

Then visit `http://localhost:3000` in your browser

## 📦 Publishing

### Version Update

1. Update the version number in `package.json`
2. Run the build command: `npm run build`
3. Publish to npm: `npm publish`

## 📝 License

MIT License © 2024 Softprobe

## 🤝 Contribution

Contributions via Issues and Pull Requests are welcome!

## 👥 Authors

[Softprobe](https://github.com/softprobe)