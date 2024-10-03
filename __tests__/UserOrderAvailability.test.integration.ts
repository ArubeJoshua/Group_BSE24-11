import { userOrderExists } from '@/app/actions/orders';
import db from '@/db/db'

// Mock the database module
jest.mock('@/db/db', () => ({
  order: {
    findFirst: jest.fn(),
  },
}));

describe('userOrderExists', () => {
  const email = 'test@example.com';
  const productId = 'product-123';

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mock calls
  });

  it('should return true if the order exists', async () => {
    // Mock the response of findFirst to simulate an existing order
    (db.order.findFirst as jest.Mock).mockResolvedValue({ id: 'order-id' });

    const exists = await userOrderExists(email, productId);

    expect(exists).toBe(true); // Assert that the order exists
    expect(db.order.findFirst).toHaveBeenCalledWith({
      where: { user: { email }, productId },
      select: { id: true },
    }); // Verify that findFirst was called with the correct parameters
  });

  it('should return false if the order does not exist', async () => {
    // Mock the response of findFirst to simulate no existing order
    (db.order.findFirst as jest.Mock).mockResolvedValue(null);

    const exists = await userOrderExists(email, productId);

    expect(exists).toBe(false); // Assert that the order does not exist
    expect(db.order.findFirst).toHaveBeenCalledWith({
      where: { user: { email }, productId },
      select: { id: true },
    }); // Verify that findFirst was called with the correct parameters
  });
});
