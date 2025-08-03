import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from '@/store/store.ts';
import { ErrorBoundary } from '@/components/error-boundary/error-boundary';
import { ThemeProvider } from '@/context/themeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </Provider>
);
