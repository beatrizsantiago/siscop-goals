import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import FormContainer from '../../../../src/App/Add/components/Form';
import Farm from '../../../../src/domain/entities/Farm';
import Product from '../../../../src/domain/entities/Product';
import Goal from '../../../../src/domain/entities/Goal';
import AddGoalUseCase from '../../../../src/usecases/goals/addGoal';

const mockFarm = new Farm('f1', 'Test Farm', { _lat: 0, _long: 0 }, [
  new Product('p1', 'Tomato', 2, 30),
]);

jest.mock('../../../../src/hooks/useGetFarms', () => () => ({
  farms: [mockFarm],
  loading: false,
}));

jest.mock('../../../../src/App/context', () => ({
  useGoalContext: () => ({
    dispatch: jest.fn(),
  }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../../../../src/usecases/goals/addGoal');

describe('FormContainer', () => {
  const handleCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render farm and kind selectors', () => {
    render(<FormContainer handleClose={handleCloseMock} />);
    expect(screen.getByLabelText(/Selecione a fazenda/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tipo/i)).toBeInTheDocument();
  });

  it('should call AddGoalUseCase and dispatch on valid submit', async () => {
    const mockGoal = new Goal('g1', 'MONTHLY', mockFarm, [], false, new Date());

    (AddGoalUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(mockGoal),
    }));

    render(<FormContainer handleClose={handleCloseMock} />);

    const farmInput = screen.getByLabelText(/Selecione a fazenda/i);
    fireEvent.change(farmInput, { target: { value: 'Test Farm' } });
    fireEvent.keyDown(farmInput, { key: 'ArrowDown' });
    fireEvent.keyDown(farmInput, { key: 'Enter' });

    fireEvent.mouseDown(screen.getByLabelText(/Tipo/i));
    fireEvent.click(screen.getByText(/Produção/i));

    await waitFor(() => {
      expect(screen.getByLabelText(/Selecione o produto/i)).toBeInTheDocument();
    });

    const productInput = screen.getByLabelText(/Selecione o produto/i);
    fireEvent.change(productInput, { target: { value: 'Tomato' } });
    fireEvent.keyDown(productInput, { key: 'ArrowDown' });
    fireEvent.keyDown(productInput, { key: 'Enter' });

    const amountInput = screen.getByLabelText(/Quantidade/i);
    fireEvent.change(amountInput, { target: { value: '10' } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Meta criada com sucesso!');
      expect(handleCloseMock).toHaveBeenCalled();
    });
  });

  it('should show error toast on failure', async () => {
    (AddGoalUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error('fail')),
    }));

    render(<FormContainer handleClose={handleCloseMock} />);

    const farmInput = screen.getByLabelText(/Selecione a fazenda/i);
    fireEvent.change(farmInput, { target: { value: 'Test Farm' } });
    fireEvent.keyDown(farmInput, { key: 'ArrowDown' });
    fireEvent.keyDown(farmInput, { key: 'Enter' });

    fireEvent.mouseDown(screen.getByLabelText(/Tipo/i));
    fireEvent.click(screen.getByText(/Produção/i));

    await waitFor(() => {
      expect(screen.getByLabelText(/Selecione o produto/i)).toBeInTheDocument();
    });

    const productInput = screen.getByLabelText(/Selecione o produto/i);
    fireEvent.change(productInput, { target: { value: 'Tomato' } });
    fireEvent.keyDown(productInput, { key: 'ArrowDown' });
    fireEvent.keyDown(productInput, { key: 'Enter' });

    fireEvent.change(screen.getByLabelText(/Quantidade/i), { target: { value: '10' } });

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Erro ao criar a meta. Tente novamente mais tarde.');
    });
  });
});
