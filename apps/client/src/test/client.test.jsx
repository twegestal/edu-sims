import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, beforeEach } from 'vitest';
import Confirm from '../components/Confirm';

describe('Confirm component tests', () => {
  const mockOnClose = vi.fn();
  const mockHandleConfirm = vi.fn();
  const props = {
    isOpen: true,
    onClose: mockOnClose,
    header: 'Confirm Action',
    body: 'Are you sure you want to proceed?',
    handleConfirm: mockHandleConfirm,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders correctly when open', () => {
    render(<Confirm {...props} />);
    expect(screen.getByText(props.header)).toBeInTheDocument();
    expect(screen.getByText(props.body)).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    render(<Confirm {...props} />);
    const cancelButton = screen.getByText('Avbryt');
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls handleConfirm when confirm button is clicked', () => {
    render(<Confirm {...props} />);
    const confirmButton = screen.getByText('Bekräfta');
    fireEvent.click(confirmButton);
    expect(mockHandleConfirm).toHaveBeenCalledTimes(1);
  });
});
