import '@testing-library/jest-dom';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock the db module
jest.mock('@/db/db', () => ({
    order: {
      delete: jest.fn(),
    },
  }));
