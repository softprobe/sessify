# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- **Build the project:** `npm run build`
  - Compiles the TypeScript source code in `src/` to JavaScript in `dist/`.

- **Run tests:** `npm test`
  - Executes the test suite using Jest. Test files are located alongside the source files.

- **Lint the code:** `npm run lint`
  - Checks the TypeScript files for code quality and style issues using ESLint.

- **Format the code:** `npm run format`
  - Automatically formats the code using Prettier.

## High-level Architecture

This repository contains the source code for the Softprobe Web SDK, a library designed to be integrated into web applications to capture and report user interactions and performance metrics. The core functionality is built on top of the **OpenTelemetry** framework.

### Initialization Flow

1. The entry point for the SDK is `src/index.ts`, which exports the `initInspector` function.
2. `initInspector` calls `initBrowserInspector` in `src/browser.ts`, which contains the main initialization logic.
3. `initBrowserInspector` sets up the OpenTelemetry `WebTracerProvider`, configures span processors (a `CustomConsoleSpanExporter` for development and an `OTLPTraceExporter` to send data to a collector endpoint), and creates a user resource with metadata like API key, user ID, and a session ID.
4. It registers a series of auto-instrumentations provided by `@opentelemetry/auto-instrumentations-web` to automatically capture events like user interactions (clicks, scrolls), fetch/XHR requests, etc.

### Data Collection

The SDK collects a wide range of data, which can be categorized as follows:

1. **Environment Information (`src/environment-recorder.ts`):**
   - On initialization, it records static information about the user's environment, such as user agent, screen resolution, timezone, and URL parameters (e.g., UTM tags).
   - It also records page load performance metrics from `window.performance.timing`.

2. **Automatic Event Listening (`src/event-listeners.ts`):**
   - This file sets up a comprehensive set of global event listeners to capture user behavior automatically.
   - Events captured include: page unload, page zoom, scroll, mouse movement, hover, drag-and-drop, keyboard shortcuts, form resets, and SPA route changes (by wrapping `history.pushState` and `history.replaceState`).
   - Most of these listeners call corresponding functions in `src/environment-recorder.ts` to create and send OpenTelemetry spans for each action.

3. **Session Management (`src/SessionManager.ts`):**
   - A unique session ID (`spSessionId`) is generated and stored in `sessionStorage` to group all events from a single user session. This ID is added as a custom HTTP header (`x-sp-session-id`) to outgoing requests via a custom propagator (`src/HttpHeaderPropagator.ts`).
