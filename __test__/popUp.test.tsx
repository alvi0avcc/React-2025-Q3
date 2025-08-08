import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { SelectedItemsPopUp } from '@/components/selectedItemsPopUp/selectedItemsPopUp';
import { describe, it, expect, vi } from 'vitest';

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useRef: vi.fn().mockReturnValue({ current: { click: vi.fn() } }),
  };
});

global.URL.createObjectURL = vi.fn();

describe('SelectedItemsPopUp Component', () => {
  const mockItems = [
    {
      uid: '1',
      name: 'Enterprise',
      spacecraftClass: { name: 'Constitution' },
      status: 'Active',
      registry: 'NCC-1701',
      species: 'Human',
    },
    {
      uid: '2',
      name: 'Voyager',
      spacecraftClass: { name: 'Intrepid' },
      status: 'Lost',
      registry: 'NCC-74656',
      species: 'Mixed',
    },
  ];

  const createStore = (items = mockItems) => {
    return configureStore({
      reducer: {
        selectedSpacecraft: () => ({
          selectedItems: items,
        }),
      },
    });
  };

  it('does not render when no items are selected', () => {
    const emptyStore = configureStore({
      reducer: {
        selectedSpacecraft: () => ({
          selectedItems: [],
        }),
      },
    });

    const { container } = render(
      <Provider store={emptyStore}>
        <SelectedItemsPopUp />
      </Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders correctly with selected items', () => {
    const store = createStore();

    render(
      <Provider store={store}>
        <SelectedItemsPopUp />
      </Provider>
    );

    expect(
      screen.getByText(`${mockItems.length} items selected`)
    ).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });
});
