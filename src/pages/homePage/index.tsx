import { useState } from 'react';
import Modal from '@components/modal';
import ControlledForm from '@components/controlledForm';
import UncontrolledForm from '@components/uncontrolledForm';

type modalState = 'close' | 'controlled' | 'uncontrolled';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<modalState>('close');

  return (
    <div id="homePage">
      <h1>React Forms</h1>

      <button onClick={() => setIsModalOpen('uncontrolled')}>
        Open Uncontrolled Form
      </button>

      <button onClick={() => setIsModalOpen('controlled')}>
        Open Controlled Form
      </button>

      <Modal
        isOpen={isModalOpen !== 'close'}
        onClose={() => setIsModalOpen('close')}
      >
        {isModalOpen === 'uncontrolled' ? (
          <UncontrolledForm />
        ) : (
          <ControlledForm />
        )}
      </Modal>
    </div>
  );
};

export default HomePage;
