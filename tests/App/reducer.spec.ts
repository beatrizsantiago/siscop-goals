import reducer from '../../src/App/reducer';
import { State } from '../../src/App/types';
import Goal from '../../src/domain/entities/Goal';

const initialState: State = {
  goals: [],
  lastDoc: undefined,
  hasMore: false,
  loading: true,
};

const mockGoal: Goal = {
  id: 'goal1',
  kind: 'MONTHLY',
  farm: { id: 'farm1', name: 'Farm A', geolocation: { _lat: 0, _long: 0 }, available_products: [] },
  items: [],
  created_at: new Date(),
};

describe('Goal reducer', () => {
  it('should set goals with SET_GOALS action', () => {
    const action = {
      type: 'SET_GOALS',
      list: [mockGoal],
      lastDoc: { id: 'doc123' },
      hasMore: true,
    } as const;

    const result = reducer(initialState, action);

    expect(result.goals).toEqual([mockGoal]);
    expect(result.lastDoc).toEqual({ id: 'doc123' });
    expect(result.hasMore).toBe(true);
    expect(result.loading).toBe(false);
  });

  it('should set loading with SET_LOADING action', () => {
    const action = {
      type: 'SET_LOADING',
      loading: true,
    } as const;

    const result = reducer(initialState, action);
    expect(result.loading).toBe(true);
  });

  it('should add a goal with ADD_GOAL action', () => {
    const stateWithOne = { ...initialState, goals: [mockGoal] };
    const newGoal = { ...mockGoal, id: 'goal2' };

    const action = {
      type: 'ADD_GOAL',
      item: newGoal,
    } as const;

    const result = reducer(stateWithOne, action);
    expect(result.goals).toEqual([newGoal, mockGoal]);
  });

  it('should delete a goal with DELETE_GOAL action', () => {
    const stateWithGoals = { ...initialState, goals: [mockGoal] };

    const action = {
      type: 'DELETE_GOAL',
      id: 'goal1',
    } as const;

    const result = reducer(stateWithGoals, action);
    expect(result.goals).toEqual([]);
  });

  it('should throw an error for unknown action', () => {
    const action = {
      type: 'UNKNOWN_ACTION',
    } as any;

    expect(() => reducer(initialState, action)).toThrow('Unhandled action');
  });
});
