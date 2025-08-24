import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '@/components/modal';
import React from 'react';

vi.mock('@/components/modal/modal.module.css', () => ({
  default: {
    overlay: 'overlay',
    modal: 'modal',
  },
}));

vi.mock('react-dom', () => ({
  createPortal: (children: React.ReactNode) => children,
}));

describe('Modal', () => {
  const mockOnClose = vi.fn();
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';

  beforeEach(() => {
    document.body.appendChild(modalRoot);
    mockOnClose.mockClear();
  });

  afterEach(() => {
    document.body.removeChild(modalRoot);
  });

  const ModalWithChildren = Modal as unknown as React.ComponentType<
    React.PropsWithChildren<{ isOpen: boolean; onClose: () => void }>
  >;

  it('should not render when isOpen is false', () => {
    render(
      React.createElement(
        ModalWithChildren,
        { isOpen: false, onClose: mockOnClose },
        React.createElement('div', null, 'Modal Content')
      )
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('should render children when isOpen is true and modal root exists', () => {
    render(
      React.createElement(
        ModalWithChildren,
        { isOpen: true, onClose: mockOnClose },
        React.createElement('div', null, 'Modal Content')
      )
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should call onClose when Escape key is pressed', () => {
    render(
      React.createElement(
        ModalWithChildren,
        { isOpen: true, onClose: mockOnClose },
        React.createElement('div', null, 'Modal Content')
      )
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not call onClose for other keys', () => {
    render(
      React.createElement(
        ModalWithChildren,
        { isOpen: true, onClose: mockOnClose },
        React.createElement('div', null, 'Modal Content')
      )
    );

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should have correct accessibility attributes', () => {
    const { container } = render(
      React.createElement(
        ModalWithChildren,
        { isOpen: true, onClose: mockOnClose },
        React.createElement('div', null, 'Modal Content')
      )
    );

    const modal = container.querySelector('[role="dialog"]');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('aria-modal', 'true');
  });
});
