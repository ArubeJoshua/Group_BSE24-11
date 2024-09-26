// jest.setup.js or jest.setup.ts
import '@testing-library/jest-dom';

// jest.setup.ts
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

