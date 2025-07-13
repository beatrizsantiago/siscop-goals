import { firebaseGoal } from '../../src/firebase/goal';
import { getDocs, getDoc, addDoc, deleteDoc } from 'firebase/firestore';
import Goal from '../../src/domain/entities/Goal';
import Farm from '../../src/domain/entities/Farm';
import Product from '../../src/domain/entities/Product';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(() => ({})),
  doc: jest.fn((_, path, id) => ({ id })),
  orderBy: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  query: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  Timestamp: {
    fromDate: jest.fn((d) => d),
  },
}));

describe('FirebaseGoal', () => {
  it('should add a new goal and return it with the new id', async () => {
    const mockFarm = new Farm('farm123', 'Test Farm', { _lat: 10, _long: 20 }, []);
    const mockProduct = new Product('p1', 'Corn', 5, 90);
    const mockGoal = new Goal(
      '',
      'monthly',
      mockFarm,
      [{ product: mockProduct, amount: 10 }],
      false,
      new Date('2023-01-01T00:00:00Z')
    );

    const mockDocRef = { id: 'goal456' };
    (addDoc as jest.Mock).mockResolvedValueOnce(mockDocRef);

    const result = await firebaseGoal.add(mockGoal);

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
      kind: 'monthly',
      farm_id: { id: 'farm123' },
      items: [
        {
          product_id: { id: 'p1' },
          amount: 10,
        },
      ],
      finished: false,
      created_at: mockGoal.created_at,
    });

    expect(result).toBeInstanceOf(Goal);
    expect(result.id).toBe('goal456');
    expect(result.kind).toBe('monthly');
    expect(result.farm.name).toBe('Test Farm');
    expect(result.items[0].product.name).toBe('Corn');
  });

  it('should return paginated goals with farm and product details', async () => {
    const mockFarmData = {
      name: 'Farm A',
      geolocation: { _lat: 0, _long: 0 },
      available_products: [
        { id: 'p1', name: 'Corn', unit_value: 5, cycle_days: 90 },
      ],
    };

    const mockProductData = {
      name: 'Corn',
      unit_value: 5,
      cycle_days: 90,
    };

    const mockGoalDoc = {
      id: 'goal123',
      data: () => ({
        kind: 'monthly',
        farm_id: { id: 'farm123' },
        items: [
          { product_id: { id: 'p1' }, amount: 20 },
        ],
        created_at: {
          toDate: () => new Date('2023-01-01T00:00:00Z'),
        },
      }),
    };

    (getDocs as jest.Mock).mockResolvedValueOnce({
      docs: [mockGoalDoc],
    });

    (getDoc as jest.Mock)
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => mockFarmData,
      })
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => mockProductData,
      });

    const result = await firebaseGoal.getAllPaginated();

    expect(result.list).toHaveLength(1);
    expect(result.list[0]).toBeInstanceOf(Goal);
    expect(result.list[0].farm).toBeInstanceOf(Farm);
    expect(result.list[0].farm.name).toBe('Farm A');
    expect(result.list[0].farm.available_products[0].name).toBe('Corn');

    expect(result.list[0].items[0].product).toBeInstanceOf(Product);
    expect(result.list[0].items[0].product.name).toBe('Corn');
    expect(result.list[0].items[0].amount).toBe(20);

    expect(result.hasMore).toBe(false);
    expect(result.lastDoc).toEqual(mockGoalDoc);
  });

  it('should delete the goal by id', async () => {
    await firebaseGoal.delete('goal123');

    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(deleteDoc).toHaveBeenCalledWith({ id: 'goal123' });
  });
});
