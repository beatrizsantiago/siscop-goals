import { render, screen, fireEvent } from '@testing-library/react';
import List from '../../../src/App/List';
import Goal from '../../../src/domain/entities/Goal';
import Farm from '../../../src/domain/entities/Farm';
import Product from '../../../src/domain/entities/Product';

jest.mock('../../../src/App/List/components/Goal', () => ({ goal }: any) => (
  <div data-testid="goal-item">{goal.farm.name}</div>
));

const mockGoal = new Goal(
  'goal1',
  'MONTHLY',
  new Farm('farm1', 'Test Farm', { _lat: 0, _long: 0 }, []),
  [{ product: new Product('p1', 'Tomato', 2, 30), amount: 10 }],
  false,
  new Date()
);

const mockUseGoalContext = {
  state: {
    goals: [mockGoal],
    hasMore: false,
    loading: false,
  },
  getMoreGoals: jest.fn(),
};

jest.mock('../../../src/App/context', () => ({
  useGoalContext: () => mockUseGoalContext,
}));

describe('List component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all goals', () => {
    render(<List />);
    expect(screen.getByTestId('goal-item')).toHaveTextContent('Test Farm');
  });

  it('should show loading spinner when loading is true', () => {
    mockUseGoalContext.state.loading = true;

    render(<List />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render "Carregar mais" button and trigger getMoreGoals', () => {
    mockUseGoalContext.state.hasMore = true;
    mockUseGoalContext.state.loading = false;

    render(<List />);
    const button = screen.getByRole('button', { name: /carregar mais/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockUseGoalContext.getMoreGoals).toHaveBeenCalled();
  });

  it('should not show "Carregar mais" button if loading is true', () => {
    mockUseGoalContext.state.hasMore = true;
    mockUseGoalContext.state.loading = true;

    render(<List />);
    expect(screen.queryByRole('button', { name: /carregar mais/i })).not.toBeInTheDocument();
  });
});
