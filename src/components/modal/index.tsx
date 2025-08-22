import styles from './modal.module.css';

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRoot = document.getElementById('modal-root');

  const handleOverlayClick = (e: React.MouseEvent) => {
    console.log('click');
    console.log(e.target);
    console.log(e.currentTarget);
    console.log(e.target === e.currentTarget);

    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen || !modalRoot) return null;

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>,
    modalRoot
  );
}

export default Modal;
