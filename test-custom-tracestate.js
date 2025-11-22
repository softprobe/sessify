// Test script to verify custom tracestate functionality
import { initSessify, getSessionId, startSession, endSession, isSessionActive } from './dist/index.js';

console.log('=== Testing Custom TraceState Functionality ===\n');

// Test 1: Custom key-value pairs
console.log('Test 1: Custom key-value pairs');
const customConfig = {
  sessionStorageType: 'session',
  customTraceState: {
    'x-sp-site': 'test-site',
    'x-sp-user': 'test-user',
    'x-sp-version': '1.0.0'
  }
};

console.log('Initializing with custom trace state:', customConfig.customTraceState);
initSessify(customConfig);

// Start a session
console.log('Starting session...');
startSession();
const sessionId = getSessionId();
console.log('Session ID:', sessionId);
console.log('Session active:', isSessionActive());

// Test fetch interception (simulate)
console.log('\nSimulating fetch interception...');
console.log('Expected tracestate header:');
const expectedParts = [];
for (const [key, value] of Object.entries(customConfig.customTraceState)) {
  expectedParts.push(`${key}=${value}`);
}
expectedParts.push(`x-sp-session-id=${sessionId}`);
console.log('  ' + expectedParts.join(','));

// Test 2: String format (backward compatibility)
console.log('\nTest 2: String format (siteName)');
const stringConfig = {
  sessionStorageType: 'session',
  siteName: 'test-app'
};

console.log('Reinitializing with siteName:', stringConfig.siteName);
initSessify(stringConfig);

console.log('Simulating fetch interception...');
console.log('Expected tracestate header:');
console.log('  x-sp-site=test-app,x-sp-session-id=' + sessionId);

// Test 3: No custom trace state
console.log('\nTest 3: No custom trace state');
const basicConfig = {
  sessionStorageType: 'session'
};

console.log('Reinitializing without custom trace state');
initSessify(basicConfig);

console.log('Simulating fetch interception...');
console.log('Expected tracestate header:');
console.log('  x-sp-session-id=' + sessionId);

// End session
console.log('\nEnding session...');
endSession();
console.log('Session active:', isSessionActive());

console.log('\n=== Test Complete ===');