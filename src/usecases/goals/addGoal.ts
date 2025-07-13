import { GoalRepository } from '@domain/repositories/GoalRepository';
import Goal from '@domain/entities/Goal';
import Farm from '@domain/entities/Farm';
import Product from '@domain/entities/Product';

type AddGoalParams = {
  kind: string;
  farm: Farm;
  items: {
    product: Product;
    amount: number;
  }[];
};

class AddGoalUseCase {
  constructor(private repository: GoalRepository) {}

  async execute(params: AddGoalParams) {
    const goal = new Goal(
      '',
      params.kind.trim().toUpperCase(),
      params.farm,
      params.items,
      false,
      new Date()
    );
  
    return await this.repository.add(goal);
  }
};

export default AddGoalUseCase;