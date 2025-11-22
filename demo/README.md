# @softprobe/sessify Demo Application

This directory contains a demo application for testing and demonstrating the functionality of the `@softprobe/sessify` library.

## Overview

The demo application provides a simple interface to test all the core features of `@softprobe/sessify`, including:
- Session lifecycle management
- Session ID retrieval
- Session activation and termination
- Custom trace state usage
- HTTP request interception

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm, yarn, or pnpm

### Installation

1. Navigate to the demo directory:

```bash
cd demo
```

2. Install dependencies:

```bash
npm install
```

### Running the Demo

```bash
npm run dev:frontend
```

This will start the Vite development server on port 3000.

### Access the Demo

Open your browser and navigate to:

```
http://localhost:3000
```

## Demo Features

### Session Management

- **Get Session ID**: Displays the current session ID
- **Check Session Status**: Shows if the current session is active
- **Start New Session**: Creates a new session and invalidates the current one
- **End Session**: Terminates the current session

### Custom Trace State

You can test the custom trace state functionality by modifying the configuration in `src/App.tsx` and restarting the frontend.

### HTTP Interception

The demo includes functionality to demonstrate how session information is automatically injected into the `tracestate` header of HTTP requests.

## Project Structure

```
demo/
├── src/              # Frontend source code
│   ├── App.tsx       # Main application component
│   ├── main.tsx      # Application entry point
│   └── App.css       # Styling
├── index.html        # HTML entry point
├── package.json      # Project dependencies and scripts
└── vite.config.ts    # Vite configuration
```

## Troubleshooting

### Common Issues

- **Session not being created**: Ensure you've called `initSessify()` before using any other functions
- **Headers not being intercepted**: Check that `fetch` requests are being used (the library only intercepts `fetch`)

### Viewing Session Information

You can inspect the session data in your browser's developer tools:

1. Open Developer Tools (F12)
2. Go to the Application/Storage tab
3. Check either Session Storage or Local Storage (depending on your configuration) for `sp-session-data`

## License

MIT License © 2024 Softprobe