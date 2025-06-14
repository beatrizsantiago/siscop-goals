import { DocumentSnapshot } from 'firebase/firestore';
import Goal from '@domain/entities/Goal';

export type State = {
  goals: Goal[],
  lastDoc?: DocumentSnapshot,
  hasMore: boolean,
  loading: boolean,
};

export type ActionType = { type: 'SET_GOALS', list: Goal[], lastDoc?: DocumentSnapshot | null, hasMore: boolean }
| { type: 'SET_LOADING', loading: boolean }
| { type: 'ADD_GOAL', item: Goal }
| { type: 'DELETE_GOAL', id: string };

export type GoalProviderType = {
  state: State,
  dispatch: React.Dispatch<ActionType>,
  getMoreGoals: () => Promise<void>,
};

export type GoalProviderProps = {
  children: React.ReactNode,
};
