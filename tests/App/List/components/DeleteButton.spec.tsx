import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import DeleteButton from '../../../../src/App/List/components/DeleteButton';
import Goal from '../../../../src/domain/entities/Goal';
import Farm from '../../../../src/domain/entities/Farm';
import Product from '../../../../src/domain/entities/Product';
import DeleteGoalUseCase from '../../../../src/usecases/goals/deleteGoal';

jest.mock('../../../../src/usecases/goals/deleteGoal');

jest.mock('../../../../src/App/context', () => ({
  useGoalContext: () => ({
    dispatch: jest.fn(),
  }),
}));

const goal = new Goal(
  'goal123',
  'MONTHLY',
  new Farm('farm1', 'Test Farm', { _lat: 0, _long: 0 }, []),
  [{ product: new Product('p1', 'Corn', 2.5, 90), amount: 10 }],
  new Date()
);

describe('DeleteButton component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the delete icon button', () => {
    render(<DeleteButton goal={goal} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should open confirmation dialog on icon click', () => {
    render(<DeleteButton goal={goal} />);
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText(/Tem certeza que deseja excluir a meta/i)).toBeInTheDocument();
    expect(screen.getByText(/Excluir/)).toBeInTheDocument();
    expect(screen.getByText(/Cancelar/)).toBeInTheDocument();
  });

  it('should delete the goal and dispatch when confirmed', async () => {
    (DeleteGoalUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(undefined),
    }));

    render(<DeleteButton goal={goal} />);
    fireEvent.click(screen.getByRole('button'));

    const deleteButton = screen.getByText(/Excluir/);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(DeleteGoalUseCase).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Meta excluída com sucesso!');
    });
  });

  it('should show error toast if delete fails', async () => {
    (DeleteGoalUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error('fail')),
    }));

    render(<DeleteButton goal={goal} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText(/Excluir/));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao excluir a meta. Tente novamente.');
    });
  });
});
