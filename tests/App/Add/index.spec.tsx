import { render, screen, fireEvent } from '@testing-library/react';
import Add from '../../../src/App/Add';

jest.mock('../../../src/App/Add/components/Form', () => (props: any) => (
  <div data-testid="mock-form">
    Form component - close: {typeof props.handleClose}
  </div>
));

describe('Add component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the "Adicionar" button', () => {
    render(<Add />);
    expect(screen.getByRole('button', { name: /Adicionar/i })).toBeInTheDocument();
  });

  it('should open dialog with form when button is clicked', () => {
    render(<Add />);

    fireEvent.click(screen.getByRole('button', { name: /Adicionar/i }));

    expect(screen.getByText(/Nova meta/i)).toBeInTheDocument();
    expect(screen.getByTestId('mock-form')).toHaveTextContent('Form component - close: function');
  });
});
