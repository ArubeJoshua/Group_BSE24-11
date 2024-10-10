import { addProduct } from '@/app/admin/_actions/products';
import { PrismaClient } from '@prisma/client'
import { mockReset, DeepMockProxy } from 'jest-mock-extended'

import db from '@/db/db'

export const prismaMock = db as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});

jest.mock('uuid', () => ({ v4: () => '123456789' }));
jest.mock('node-fetch', () => jest.fn());

// jest.mock('@/db/db', () => ({
//   product: {
//     create: jest.fn(),
//   },
// }));

// describe('addProduct', () => {

//   it('should return errors if validation fails', async () => {
//     const invalidFormData = new FormData();
//     invalidFormData.append('name', '');
//     invalidFormData.append('description', '');
//     invalidFormData.append('priceInCents', 'not-a-number');

//     const result = await addProduct({}, invalidFormData);

//     expect(result).toEqual({
//       name: ['String must contain at least 1 character(s)'],
//       description: ['String must contain at least 1 character(s)'],
//       priceInCents: ['Expected number, received nan'],
//       file: ['Required'],
//       image: ['Required'],
//     });

//     expect(db.product.create).not.toHaveBeenCalled(); // Ensure no product was created
//   });
// });


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

// test('should update a users name ', async () => {
//   const user = {
//     id: 1,
//     name: 'Rich Haines',
//     email: 'hello@prisma.io',
//     acceptTermsAndConditions: true,
//   }

//   prismaMock.user.update.mockResolvedValue(user)

//   await expect(updateUsername(user)).resolves.toEqual({
//     id: 1,
//     name: 'Rich Haines',
//     email: 'hello@prisma.io',
//     acceptTermsAndConditions: true,
//   })
// })

// test('should fail if user does not accept terms', async () => {
//   const user = {
//     id: 1,
//     name: 'Rich Haines',
//     email: 'hello@prisma.io',
//     acceptTermsAndConditions: false,
//   }

//   prismaMock.user.create.mockImplementation()

//   await expect(createUser(user)).resolves.toEqual(
//     new Error('User must accept terms!')
//   )
// })