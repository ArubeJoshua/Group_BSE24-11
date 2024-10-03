import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock the db module
jest.mock('@/db/db', () => ({
    order: {
      delete: jest.fn(),
    },
  }));
