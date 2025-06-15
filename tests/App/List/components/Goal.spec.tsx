import { render, screen, fireEvent } from '@testing-library/react';
import GoalItem from '../../../../src/App/List/components/Goal';
import Goal from '../../../../src/domain/entities/Goal';
import Farm from '../../../../src/domain/entities/Farm';
import Product from '../../../../src/domain/entities/Product';

jest.mock('../../../../src/App/List/components/DeleteButton', () => () => <div data-testid="delete-button" />);

const mockGoal = new Goal(
  'goal1',
  'MONTHLY',
  new Farm('farm1', 'Green Farm', { _lat: 0, _long: 0 }, []),
  [
    { product: new Product('p1', 'Tomato', 2, 30), amount: 10 },
    { product: new Product('p2', 'Lettuce', 1, 15), amount: 5 },
  ],
  new Date('2023-01-01T10:30:00Z')
);

describe('GoalItem component', () => {
  it('should render the goal summary and date', () => {
    render(<GoalItem goal={mockGoal} />);

    expect(screen.getByText(/Meta de/i)).toBeInTheDocument();
    expect(screen.getByText(/Green Farm/i)).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  it('should toggle and display product details on click', () => {
    render(<GoalItem goal={mockGoal} />);

    const header = screen.getByText(/Meta de/i);
    fireEvent.click(header);

    expect(screen.getByText('Tomato')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Lettuce')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
