import { render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import useGetFarms from '../../src/hooks/useGetFarms';
import GetAllFarmsUseCase from '../../src/usecases/farms/getAllFarms';
import Farm from '../../src/domain/entities/Farm';

jest.mock('../../src/usecases/farms/getAllFarms');

const mockFarms = [
  new Farm('1', 'Farm A', { _lat: 10, _long: 20 }, []),
  new Farm('2', 'Farm B', { _lat: 30, _long: 40 }, []),
];

const TestComponent = () => {
  const { farms, loading } = useGetFarms();

  return (
    <div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <ul data-testid="farm-list">
        {farms.map((farm) => (
          <li key={farm.id}>{farm.name}</li>
        ))}
      </ul>
    </div>
  );
};

describe('useGetFarms() hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and display farms', async () => {
    (GetAllFarmsUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockResolvedValue(mockFarms),
    }));

    render(<TestComponent />);

    expect(screen.getByTestId('loading').textContent).toBe('true');

    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false')
    );

    expect(screen.getByText('Farm A')).toBeInTheDocument();
    expect(screen.getByText('Farm B')).toBeInTheDocument();
  });

  it('should show toast on fetch error', async () => {
    (GetAllFarmsUseCase as jest.Mock).mockImplementation(() => ({
      execute: jest.fn().mockRejectedValue(new Error('fail')),
    }));

    render(<TestComponent />);

    expect(screen.getByTestId('loading').textContent).toBe('true');

    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false')
    );

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith('Erro ao carregar as fazendas');
  });
});
