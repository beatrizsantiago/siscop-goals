import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import { GoalProvider, useGoalContext } from '../../src/App/context';
import GetAllGoalsUseCase from '../../src/usecases/goals/getAllPaginated';
import Goal from '../../src/domain/entities/Goal';
import Farm from '../../src/domain/entities/Farm';
import Product from '../../src/domain/entities/Product';

jest.mock('../../src/usecases/goals/getAllPaginated');

const mockGoal = new Goal(
  'goal123',
  'MONTHLY',
  new Farm('farm1', 'Test Farm', { _lat: 0, _long: 0 }, []),
  [{ product: new Product('p1', 'Corn', 2.5, 90), amount: 10 }],
  false,
  new Date('2023-01-01')
);

const mockData = {
  list: [mockGoal],
  lastDoc: { id: 'doc123' } as any,
  hasMore: true,
};

const TestComponent = () => {
  const { state } = useGoalContext();
  return (
    <>
      <div data-testid="goal-count">{state.goals.length}</div>
      <div data-testid="loading">{state.loading.toString()}</div>
    </>
  );
};

const TestGetMoreComponent = () => {
  const { getMoreGoals } = useGoalContext();

  React.useEffect(() => {
    getMoreGoals();
  }, [getMoreGoals]);

  return <div>Test</div>;
};

describe('GoalProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch goals on mount and update state', async () => {
    (GetAllGoalsUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(mockData),
    }));

    render(
      <GoalProvider>
        <TestComponent />
      </GoalProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('goal-count').textContent).toBe('1');
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
  });

  it('should show toast on fetch error', async () => {
    (GetAllGoalsUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error('failed')),
    }));

    render(
      <GoalProvider>
        <TestComponent />
      </GoalProvider>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao carregar as metas');
    });
  });

  it('should not call getMoreGoals if hasMore is false', () => {
    const dispatchMock = jest.fn();
    const customState = {
      goals: [],
      hasMore: false,
      loading: false,
      lastDoc: undefined,
    };

    jest.spyOn(React, 'useReducer').mockImplementation(() => [customState, dispatchMock]);

    render(
      <GoalProvider>
        <TestGetMoreComponent />
      </GoalProvider>
    );

    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('should not call getMoreGoals if loading is true', () => {
    const dispatchMock = jest.fn();
    const customState = {
      goals: [],
      hasMore: true,
      loading: true,
      lastDoc: undefined,
    };

    jest.spyOn(React, 'useReducer').mockImplementation(() => [customState, dispatchMock]);

    render(
      <GoalProvider>
        <TestGetMoreComponent />
      </GoalProvider>
    );

    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it('should call getMoreGoals and dispatch SET_LOADING and SET_GOALS', async () => {
    const dispatchMock = jest.fn();
    const customState = {
      goals: [],
      hasMore: true,
      loading: false,
      lastDoc: { id: 'prevDoc' },
    };

    (GetAllGoalsUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(mockData),
    }));

    jest.spyOn(React, 'useReducer').mockImplementation(() => [customState, dispatchMock]);

    render(
      <GoalProvider>
        <TestGetMoreComponent />
      </GoalProvider>
    );

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith({ type: 'SET_LOADING', loading: true });
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'SET_GOALS',
        ...mockData,
      });
    });
  });

  it('should show toast on getMoreGoals failure', async () => {
    const dispatchMock = jest.fn();
    const customState = {
      goals: [],
      hasMore: true,
      loading: false,
      lastDoc: { id: 'doc' },
    };

    (GetAllGoalsUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error('fail')),
    }));

    jest.spyOn(React, 'useReducer').mockImplementation(() => [customState, dispatchMock]);

    render(
      <GoalProvider>
        <TestGetMoreComponent />
      </GoalProvider>
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Erro ao carregar mais metas. Tente novamente mais tarde.'
      );
    });
  });
});
