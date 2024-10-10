import { addProduct, updateProduct } from '@/app/admin/_actions/products';
import { PrismaClient } from '@prisma/client'
import { mockReset, DeepMockProxy } from 'jest-mock-extended'

import db from '@/db/db'

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

jest.mock('uuid', () => ({ v4: () => '123456789' }));
jest.mock('node-fetch', () => jest.fn());

describe('addProduct', () => {

  test('should create new product ', async () => {
    const mockFile = new File(['file content'], 'sample-product.png', { type: 'image/png' });
    const mockImage = new File(['image content'], 'sample-product.png', { type: 'image/png' });

    mockFile.arrayBuffer = jest.fn().mockResolvedValue(Buffer.from('file content'));
    mockImage.arrayBuffer = jest.fn().mockResolvedValue(Buffer.from('image content'));

    const formData = new FormData();
    formData.append('name', 'Sample Product');
    formData.append('description', 'This is a sample product used for testing purposes.');
    formData.append('priceInCents', '1999');
    formData.append('file', mockFile);
    formData.append('image', mockImage);
    formData.append('isAvailableForPurchase', 'false');

    const product = {
      id: '1',
      name: 'Sample Product',
      description: 'This is a sample product used for testing purposes.',
      priceInCents: 1999,
      filePath: `products/123456789-sample-product.png`,
      imagePath: `/products/123456789-sample-product.png`,
      isAvailableForPurchase: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.product.create.mockResolvedValue(product)

    await expect(addProduct(null, formData)).resolves.toEqual({
      name: 'Sample Product',
      description: 'This is a sample product used for testing purposes.',
      priceInCents: 1999,
      filePath: `products/123456789-sample-product.png`,
      imagePath: `/products/123456789-sample-product.png`,
      isAvailableForPurchase: false,
    })
  })

  test('should fail to create new product with invalid data', async () => {
    const mockFile = new File(['file content'], 'sample-product.png', { type: 'image/png' });
    const mockImage = new File(['image content'], 'sample-product.png', { type: 'image/png' });
  
    mockFile.arrayBuffer = jest.fn().mockResolvedValue(Buffer.from('file content'));
    mockImage.arrayBuffer = jest.fn().mockResolvedValue(Buffer.from('image content'));
  
    const formData = new FormData();
    formData.append('name', ''); 
    formData.append('description', ''); 
    formData.append('priceInCents', '-100');
    formData.append('file', mockFile);
    formData.append('image', mockImage);
    formData.append('isAvailableForPurchase', 'false');
  
    expect(db.product.create).not.toHaveBeenCalled();
  });

});
