import styles from './modal.module.css';

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRoot = document.getElementById('modal-root');
  const clickStartedOutsideRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    clickStartedOutsideRef.current = e.target === e.currentTarget;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && clickStartedOutsideRef.current) {
      onClose();
    }
  };

  const handleMouseLeave = () => {
    clickStartedOutsideRef.current = false;
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleGlobalMouseUp = () => {
      clickStartedOutsideRef.current = false;
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [onClose]);

  if (!isOpen || !modalRoot) return null;

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.modal} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>,
    modalRoot
  );
}

export default Modal;
