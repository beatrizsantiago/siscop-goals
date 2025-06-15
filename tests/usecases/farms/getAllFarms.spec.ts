import GetAllFarmsUseCase from '../../../src/usecases/farms/getAllFarms';
import Farm from '../../../src/domain/entities/Farm';
import Product from '../../../src/domain/entities/Product';

describe('GetAllFarmsUseCase', () => {
  it('should return all farms from the repository', async () => {
    const mockFarm = new Farm(
      'farm123',
      'Test Farm',
      { _lat: 10, _long: 20 },
      [
        new Product('p1', 'Corn', 2.5, 90),
        new Product('p2', 'Wheat', 1.5, 60),
      ]
    );

    const repository = {
      getAll: jest.fn().mockResolvedValue([mockFarm]),
    };

    const useCase = new GetAllFarmsUseCase(repository);
    const result = await useCase.execute();

    expect(repository.getAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Farm);
    expect(result[0].id).toBe('farm123');
    expect(result[0].available_products[0].name).toBe('Corn');
  });
});
