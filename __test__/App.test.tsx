import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '@/App';
import { Provider } from 'react-redux';
import { store } from '@/store';
import Wrapper from '@/components/wrapper';

describe('App', () => {
  it('should render the main application structure with wrapper id', () => {
    render(
      <Provider store={store}>
        <Wrapper>
          <App />
        </Wrapper>
      </Provider>
    );

    const wrapperElement = document.getElementById('wrapper');
    expect(wrapperElement).toBeInTheDocument();
    expect(wrapperElement).toBeInstanceOf(HTMLElement);
  });

  it('should render the main application structure with homePage id', () => {
    render(
      <Provider store={store}>
        <Wrapper>
          <App />
        </Wrapper>
      </Provider>
    );

    const wrapperElement = document.getElementById('homePage');
    expect(wrapperElement).toBeInTheDocument();
    expect(wrapperElement).toBeInstanceOf(HTMLElement);
  });
});
