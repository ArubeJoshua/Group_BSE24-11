import { addOrder } from "@/app/actions/orders";
import db from "@/db/db";
import { PrismaClient } from '@prisma/client'
import { mockReset, DeepMockProxy } from 'jest-mock-extended'

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));

describe("addOrder", () => {
  test("should add an order", async () => {
    const mockOrder = { pricePaidInCents: 1999 };
    (db.user.upsert as jest.Mock).mockResolvedValue(mockOrder);

    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('productId', '1');
    formData.append('pricePaidInCents', '1999');

    await addOrder(null, formData);
    
    expect(db.user.upsert).toHaveBeenCalled();
  });

  test("should not add an order and with invalid input", async () => {
    const mockOrder = { pricePaidInCents: 0 };
    (db.user.upsert as jest.Mock).mockResolvedValue(mockOrder);

    const invalidFormData = new FormData();
    invalidFormData.append('email', '');
    invalidFormData.append('productId', '');
    invalidFormData.append('pricePaidInCents', '0');

    await addOrder(null, invalidFormData);
    
    expect(db.user.upsert).not.toHaveBeenCalled();
  });
});
