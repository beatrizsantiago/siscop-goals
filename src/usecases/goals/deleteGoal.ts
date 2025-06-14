import { GoalRepository } from '@domain/repositories/GoalRepository';


class DeleteGoalUseCase {
  constructor(private repository: GoalRepository) {}

  async execute(id: string) {
    return await this.repository.delete(id);
  };
};

export default DeleteGoalUseCase;
