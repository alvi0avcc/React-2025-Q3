import './App.css';
import { Wrapper } from '@/components/wrapper/wrapper';

import { ErrorBoundary } from '@/components/error-boundary/error-boundary';
import { Route, Routes } from 'react-router';
import HomePage from '@/pages/HomePage/HomePage';
import About from '@/pages/About/About';
import Page404 from '@/pages/Page404/Page404';
import Header from '@/components/header/header';
import { Details } from '@/components/results/details/details';

const App = () => {
  return (
    <ErrorBoundary>
      <Wrapper>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />}>
            <Route path="details" element={<Details />} />
          </Route>
          <Route path="about" element={<About />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Wrapper>
    </ErrorBoundary>
  );
};

export default App;
