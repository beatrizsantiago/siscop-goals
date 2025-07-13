import AddGoalUseCase from '../../../src/usecases/goals/addGoal';
import Goal from '../../../src/domain/entities/Goal';
import Farm from '../../../src/domain/entities/Farm';
import Product from '../../../src/domain/entities/Product';

describe('AddGoalUseCase', () => {
  it('should create and add a new goal using the repository', async () => {
    const mockFarm = new Farm('farm1', 'Green Farm', { _lat: 0, _long: 0 }, []);
    const mockProduct = new Product('p1', 'Tomato', 2, 30);
    const mockItems = [
      { product: mockProduct, amount: 15 },
    ];

    const mockGoalReturned = new Goal(
      'goal123',
      'MONTHLY',
      mockFarm,
      mockItems,
      false,
      new Date('2023-01-01T00:00:00Z'),
    );

    const mockRepository = {
      add: jest.fn().mockResolvedValue(mockGoalReturned),
    };

    const useCase = new AddGoalUseCase(mockRepository);

    const result = await useCase.execute({
      kind: 'monthly',
      farm: mockFarm,
      items: mockItems,
    });

    expect(mockRepository.add).toHaveBeenCalledTimes(1);
    const goalArg = mockRepository.add.mock.calls[0][0] as Goal;

    expect(goalArg).toBeInstanceOf(Goal);
    expect(goalArg.kind).toBe('MONTHLY');
    expect(goalArg.farm).toEqual(mockFarm);
    expect(goalArg.items).toEqual(mockItems);
    expect(typeof goalArg.created_at.getTime()).toBe('number');

    expect(result).toEqual(mockGoalReturned);
  });
});
