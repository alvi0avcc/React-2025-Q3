import { useState } from 'react';
import Modal from '@components/modal';
import ControlledForm from '@components/controlledForm';
import UncontrolledForm from '@components/uncontrolledForm';
import { useAppSelector } from '@/hooks/redux';
import FormCard from '@/components/formCard';

type modalState = 'close' | 'controlled' | 'uncontrolled';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<modalState>('close');
  const { submissions } = useAppSelector(state => state.forms);

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
          <UncontrolledForm onClose={() => setIsModalOpen('close')} />
        ) : (
          <ControlledForm onClose={() => setIsModalOpen('close')} />
        )}
      </Modal>

      <div>
        {submissions
          .slice()
          .reverse()
          .map((submission, index) => (
            <FormCard id={index} data={submission} />
          ))}
      </div>
    </div>
  );
};

export default HomePage;
