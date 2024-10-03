import { addProduct } from '@/app/admin/_actions/products';
import db from '@/db/db';

jest.mock('@/db/db', () => ({
  product: {
    create: jest.fn(),
  },
}));

describe('addProduct', () => {

  it('should return errors if validation fails', async () => {
    const invalidFormData = new FormData();
    invalidFormData.append('name', '');
    invalidFormData.append('description', '');
    invalidFormData.append('priceInCents', 'not-a-number');

    const result = await addProduct({}, invalidFormData);

    expect(result).toEqual({
      name: ['String must contain at least 1 character(s)'],
      description: ['String must contain at least 1 character(s)'],
      priceInCents: ['Expected number, received nan'],
      file: ['Required'],
      image: ['Required'],
    });

    expect(db.product.create).not.toHaveBeenCalled(); // Ensure no product was created
  });
});
