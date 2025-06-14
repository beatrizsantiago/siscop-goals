import { DocumentSnapshot } from 'firebase/firestore';
import Goal from '@domain/entities/Goal';

export interface GoalRepository {
  add(goal: Goal): Promise<Goal>;
  getAllPaginated(lastDoc?: DocumentSnapshot): Promise<{
    list: Goal[];
    lastDoc?: DocumentSnapshot;
    hasMore: boolean;
  }>;
  delete(id: string): Promise<void>;
};
