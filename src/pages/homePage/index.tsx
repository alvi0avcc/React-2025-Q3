import { Loader } from '@/components/loader';
import { DataContent } from '@/components/dataContent';
import { Suspense } from 'react';

const HomePage = () => {
  return (
    <main>
      <h1>React Performance</h1>

      <Suspense fallback={<Loader />}>
        <DataContent />
      </Suspense>
    </main>
  );
};

export default HomePage;
