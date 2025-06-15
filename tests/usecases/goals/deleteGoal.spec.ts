import DeleteGoalUseCase from '../../../src/usecases/goals/deleteGoal';

describe('DeleteGoalUseCase', () => {
  it('should call repository.delete with the correct id', async () => {
    const mockRepository = {
      delete: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new DeleteGoalUseCase(mockRepository);

    const goalId = 'goal123';
    await useCase.execute(goalId);

    expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockRepository.delete).toHaveBeenCalledWith(goalId);
  });
});
