import { firebaseFarm } from '../../src/firebase/farm';
import { getDocs, getDoc } from 'firebase/firestore';
import Farm from '../../src/domain/entities/Farm';
import Product from '../../src/domain/entities/Product';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
}));

describe('FirebaseFarm', () => {
  it('should return all farms with their available products', async () => {
    const mockProductRef = { id: 'prod1' } as any;
    const mockProductData = {
      name: 'Tomato',
      unit_value: 2.5,
      cycle_days: 10,
    };

    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [
        {
          id: 'farm123',
          data: () => ({
            name: 'Green Field',
            geolocation: { _lat: 10, _long: 20 },
            available_products: [mockProductRef],
          }),
        },
      ],
    });

    (getDoc as jest.Mock).mockResolvedValueOnce({
      exists: () => true,
      id: 'prod1',
      data: () => mockProductData,
    });

    const farms = await firebaseFarm.getAll();

    expect(farms).toHaveLength(1);
    expect(farms[0]).toBeInstanceOf(Farm);
    expect(farms[0].id).toBe('farm123');
    expect(farms[0].name).toBe('Green Field');
    expect(farms[0].geolocation).toEqual({ _lat: 10, _long: 20 });

    expect(farms[0].available_products).toHaveLength(1);
    expect(farms[0].available_products[0]).toBeInstanceOf(Product);
    expect(farms[0].available_products[0].name).toBe('Tomato');
    expect(farms[0].available_products[0].unit_value).toBe(2.5);
    expect(farms[0].available_products[0].cycle_days).toBe(10);
  });
});
