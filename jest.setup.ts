import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client'
import { mockDeep } from 'jest-mock-extended'

global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock the db module
jest.mock('@/db/db', () => ({
    order: {
      delete: jest.fn(),
    },
  }));

jest.mock('@/db/db', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))
