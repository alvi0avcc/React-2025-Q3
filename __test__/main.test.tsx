import { vi } from 'vitest';

declare global {
  var __RENDER_MOCK__: ReturnType<typeof vi.fn>;
}

vi.mock('../src/App', () => ({
  __esModule: true,
  default: () => <div data-testid="app" />,
}));

vi.mock('react-dom/client', () => {
  const renderMock = vi.fn();
  globalThis.__RENDER_MOCK__ = renderMock;
  return {
    createRoot: () => ({
      render: renderMock,
    }),
  };
});

import '../src/main';

describe('main.tsx', () => {
  it('renders App to root', () => {
    expect(globalThis.__RENDER_MOCK__).toHaveBeenCalled();
  });
});
