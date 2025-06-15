import GetAllPaginatedGoalUseCase from '../../../src/usecases/goals/getAllPaginated';
import Goal from '../../../src/domain/entities/Goal';
import Farm from '../../../src/domain/entities/Farm';
import Product from '../../../src/domain/entities/Product';

describe('GetAllPaginatedGoalUseCase', () => {
  const mockFarm = new Farm('farm1', 'Farm A', { _lat: 0, _long: 0 }, []);
  const mockProduct = new Product('p1', 'Tomato', 2.5, 30);
  const mockGoal = new Goal('goal123', 'MONTHLY', mockFarm, [{ product: mockProduct, amount: 10 }], new Date());

  const paginatedResult = {
    list: [mockGoal],
    lastDoc: { id: 'goal123' } as any,
    hasMore: true,
  };

  it('should return paginated goals from repository without lastDoc', async () => {
    const mockRepository = {
      getAllPaginated: jest.fn().mockResolvedValue(paginatedResult),
    };

    const useCase = new GetAllPaginatedGoalUseCase(mockRepository);
    const result = await useCase.execute();

    expect(mockRepository.getAllPaginated).toHaveBeenCalledTimes(1);
    expect(mockRepository.getAllPaginated).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(paginatedResult);
  });

  it('should pass lastDoc to the repository when provided', async () => {
    const lastDoc = { id: 'prevGoal' } as any;

    const mockRepository = {
      getAllPaginated: jest.fn().mockResolvedValue(paginatedResult),
    };

    const useCase = new GetAllPaginatedGoalUseCase(mockRepository);
    const result = await useCase.execute(lastDoc);

    expect(mockRepository.getAllPaginated).toHaveBeenCalledWith(lastDoc);
    expect(result).toEqual(paginatedResult);
  });
});
