import { GoalRepository } from '@domain/repositories/GoalRepository';
import { DocumentSnapshot } from 'firebase/firestore';

class GetAllPaginatedGoalUseCase {
  constructor(private repository: GoalRepository) {}

  async execute(lastDoc?: DocumentSnapshot) {
    const list = await this.repository.getAllPaginated(lastDoc);
    return list;
  };
};

export default GetAllPaginatedGoalUseCase;
