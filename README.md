
# @softprobe/sessify

<div align="left">
  <a href="https://www.npmjs.com/package/@softprobe/sessify">
    <img src="https://img.shields.io/npm/v/@softprobe/sessify?style=flat-square&color=blue" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/@softprobe/sessify">
    <img src="https://img.shields.io/npm/l/@softprobe/sessify?style=flat-square" alt="license" />
  </a>
  <img src="https://img.shields.io/badge/dependencies-0-success?style=flat-square" alt="zero dependencies" />
  <img src="https://img.shields.io/badge/size-lightweight-green?style=flat-square" alt="lightweight" />
</div>

<br />

**A lightweight, zero-dependency library for robust session lifecycle management and W3C-compliant distributed tracing.**

`@softprobe/sessify` simplifies session handling in web applications by automatically managing creation and validation. It seamlessly integrates with your network requests by injecting `tracestate` headers, bridging the gap between frontend sessions and backend observability.

## ✨ Key Features

- **🔄 Automated Lifecycle Management**
  Complete handling of session creation, validation, keep-alive, and expiration logic. No manual timer management required.

- **🔌 W3C Trace Context Injection**
  Automatically intercepts `fetch` requests to inject standard `tracestate` headers, carrying session context across microservices.

- **💾 Flexible Persistence Strategy**
  Choose between ephemeral `sessionStorage` or persistent `localStorage` based on your security and UX requirements.

- **🛡️ Enhanced Security**
  Generates collision-resistant session IDs using the Web Crypto API (Timestamp + Cryptographically Secure Random String).

- **🖥️ SSR & Environment Ready**
  Built-in environment detection ensures safe execution in browser environments while gracefully skipping Server-Side Rendering (SSR) contexts.

- **📦 Zero Dependencies**
  Keep your bundle size minimal. No external bloat.

---

## 🚀 Quick Start

### Installation

```bash
# npm
npm install @softprobe/sessify

# yarn
yarn add @softprobe/sessify

# pnpm
pnpm add @softprobe/sessify
```

### Initialize at Your App Entry Point

Initialize sessify at the earliest entry point of your application (e.g., App.tsx, main.js, or layout.tsx).

#### React / Next.js Example

```tsx
// app/layout.tsx
'use client'
import { useEffect } from 'react';
import { initSessify } from '@softprobe/sessify';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Initialize with default settings
    initSessify({
      sessionStorageType: 'session' 
    });
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

#### Vanilla JS Example

```javascript
import { initSessify } from '@softprobe/sessify';

initSessify({
  enableTrace: true
});
```

## 💻 Core Usage

Once initialized, you can manage sessions anywhere in your application.

```javascript
import { getSessionId, startSession, endSession, isSessionActive } from '@softprobe/sessify';

// 1. Get Current Session
// If expired or missing, this automatically creates a new one.
const sessionId = getSessionId();
console.log('Active Session:', sessionId);

// 2. Check Status
if (isSessionActive()) {
  console.log('User is currently active');
}

// 3. Force Refresh (e.g., on Login)
// Invalidates the old session and starts a fresh one immediately.
const newSessionId = startSession();

// 4. Logout / Cleanup
// Clears storage and invalidates the session.
endSession();
```

## ⚙️ Configuration

The initSessify function accepts a configuration object to tailor behavior to your needs.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| customTraceState | Record<string, string> | {} | Custom key-value pairs to include in tracestate headers.  |
| sessionStorageType | 'session' \| 'local' | 'session' | Controls persistence. 'local' survives browser restarts; 'session' clears when the tab closes. |

### Custom Trace State Example

Enhance your request tracing by adding context like environment or version:

```javascript
initSessify({
  sessionStorageType: 'local',
  customTraceState: {
    'x-sp-env': 'production',
    'x-sp-ver': '1.0.0',
    'x-sp-tier': 'premium'
  }
});
```

Resulting Header: tracestate: x-sp-session-id=...,x-sp-env=production,x-sp-ver=1.0.0...

## 🔧 Technical Details

### Session Lifecycle Strategy

- **Creation**: Uses a base36 timestamp combined with a Web Crypto API random string for a ~16 character unique ID.
- **Expiration**: Defaults to a 30-minute sliding window. Every valid getSessionId() call or intercepted request updates the last active timestamp, keeping the session alive.
- **Validation**: Automatically checks for timeout on every access. If the timeout is exceeded, the old session is discarded and a new one is seamlessly generated.

### HTTP Interception

@softprobe/sessify monkey-patches the global fetch API (safely) to:
- Check if a session is active.
- Inject the tracestate header conforming to W3C standards.
- Append your customTraceState and the current session_id.

## 🛠️ Development

Interested in contributing or modifying the source?

```bash
# Clone
git clone https://github.com/softprobe/web-inspector.git
cd web-inspector

# Install & Build
npm install
npm run build

# Test & Lint
npm test
npm run lint
```

### Run the Example App

We include a full playground in the example folder to test headers and session behavior visually.

```bash
cd example
npm install
npm run dev:frontend
# Visit http://localhost:3000
```

## 📄 License

MIT License © 2024 Softprobe.
