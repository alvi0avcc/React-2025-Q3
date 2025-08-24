import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { Store } from '@reduxjs/toolkit';
import type { Gender, MyFormData } from '@/types/types';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { convertToBase64 } from '@/utils/convertToBase64';
import { isString, isGenderResult, isFileResult } from '@/utils/valid';
import { validateFormData, validateFile } from '@/schemas/formSchema';
import React from 'react';
import formSlice from '@/store/formSlice';

vi.mock('@/hooks/redux', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('@/utils/convertToBase64', () => ({
  convertToBase64: vi.fn(),
}));

vi.mock('@/utils/valid', () => ({
  isString: vi.fn((value: unknown) => (typeof value === 'string' ? value : '')),
  isGenderResult: vi.fn((value: unknown) => value as Gender),
  isFileResult: vi.fn((value: unknown) =>
    value instanceof File ? value : null
  ),
}));

vi.mock('@/schemas/formSchema', () => ({
  validateFormData: vi.fn(),
  validateFile: vi.fn(),
}));

vi.mock('classnames', () => ({
  default: vi.fn(() => 'mock-class'),
}));

vi.mock('@components/uncontrolledForm/form.module.css', () => ({
  default: {
    formContainer: 'formContainer',
    title: 'title',
    form: 'form',
    formGroup: 'formGroup',
    error: 'error',
    errorMessage: 'errorMessage',
    radioGroup: 'radioGroup',
    checkboxLabel: 'checkboxLabel',
    fileHint: 'fileHint',
    fileInfo: 'fileInfo',
    buttonGroup: 'buttonGroup',
    formButton: 'formButton',
    submitButton: 'submitButton',
    cancelButton: 'cancelButton',
    disabled: 'disabled',
    passwordStrength: 'passwordStrength',
  },
}));

let UncontrolledForm: React.ComponentType<{ onClose: () => void }>;

beforeAll(async () => {
  const UncontrolledFormModule = await import('@/components/uncontrolledForm');
  UncontrolledForm = UncontrolledFormModule.default;
});

describe('UncontrolledForm', () => {
  let store: Store;
  let mockDispatch: ReturnType<typeof vi.fn>;
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockDispatch = vi.fn();

    (useAppDispatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDispatch
    );
    (useAppSelector as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (
        selector: (state: {
          forms: { submissions: MyFormData[]; countries: string[] };
        }) => unknown
      ) =>
        selector({
          forms: {
            submissions: [],
            countries: ['United States', 'Canada', 'United Kingdom'],
          },
        })
    );

    (convertToBase64 as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      'base64string'
    );
    (isString as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (value: unknown) => (typeof value === 'string' ? value : '')
    );
    (isGenderResult as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (value: unknown) => value as Gender
    );
    (isFileResult as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (value: unknown) => (value instanceof File ? value : null)
    );

    (validateFormData as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      success: true,
      data: {
        name: 'Test User',
        age: 25,
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male' as Gender,
        acceptTerms: true,
        country: 'United States',
      },
    });

    (validateFile as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      success: true,
    });

    store = configureStore({
      reducer: {
        forms: formSlice,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      React.createElement(
        Provider as unknown as React.ComponentType<
          React.PropsWithChildren<{ store: Store }>
        >,
        { store },
        React.createElement(UncontrolledForm, { onClose: mockOnClose })
      )
    );

  const fillForm = async () => {
    await userEvent.type(screen.getByLabelText('Name:'), 'John Doe');
    await userEvent.type(screen.getByLabelText('Age:'), '25');
    await userEvent.type(screen.getByLabelText('Email:'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Password:'), 'Password123!');
    await userEvent.type(
      screen.getByLabelText('Confirm Password:'),
      'Password123!'
    );
    await userEvent.click(screen.getByLabelText('Male'));
    await userEvent.click(screen.getByLabelText(/i accept terms/i));
    await userEvent.selectOptions(
      screen.getByLabelText('Country:'),
      'United States'
    );
  };

  it('should render form with all fields', () => {
    renderComponent();

    expect(screen.getByText('Uncontrolled Form')).toBeInTheDocument();
    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
    expect(screen.getByLabelText('Age:')).toBeInTheDocument();
    expect(screen.getByLabelText('Email:')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password:')).toBeInTheDocument();
    expect(screen.getByLabelText(/i accept terms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload picture/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Country:')).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    renderComponent();

    const cancelButton = screen.getByText('Cancel');
    await userEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should handle form submission with valid data', async () => {
    renderComponent();
    await fillForm();

    const submitButton = screen.getByText('Submit');
    await userEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should handle password strength calculation', async () => {
    renderComponent();

    const passwordInput = screen.getByLabelText('Password:');
    await userEvent.type(passwordInput, 'Test123!');

    expect(screen.getByText(/Strength:/)).toBeInTheDocument();
  });

  it('should handle file change and validation', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    renderComponent();

    const fileInput = screen.getByLabelText(/upload picture/i);
    await userEvent.upload(fileInput, file);

    expect(screen.getByText('test.png')).toBeInTheDocument();
  });

  it('should show file validation error', async () => {
    (validateFile as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      success: false,
      error: {
        issues: [{ message: 'File too large' }],
      },
    });

    const file = new File(['test'], 'test.png', { type: 'image/png' });

    renderComponent();

    const fileInput = screen.getByLabelText(/upload picture/i);
    await userEvent.upload(fileInput, file);

    expect(screen.getByText('File too large')).toBeInTheDocument();
  });

  it('should render all country options from store', () => {
    renderComponent();

    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });
});

describe('UncontrolledForm - Edge Cases', () => {
  const mockOnClose = vi.fn();
  const mockDispatch = vi.fn();
  let store: Store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        forms: formSlice,
      },
    });

    (useAppDispatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDispatch
    );
    (useAppSelector as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (
        selector: (state: {
          forms: { submissions: MyFormData[]; countries: string[] };
        }) => unknown
      ) =>
        selector({
          forms: {
            submissions: [],
            countries: [],
          },
        })
    );

    (validateFormData as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      success: true,
      data: {
        name: 'Test User',
        age: 25,
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'male' as Gender,
        acceptTerms: true,
        country: 'United States',
      },
    });
  });

  const ProviderWithStore = Provider as unknown as React.ComponentType<
    React.PropsWithChildren<{ store: Store }>
  >;

  const renderWithEmptyCountries = () => {
    return render(
      React.createElement(
        ProviderWithStore,
        { store },
        React.createElement(UncontrolledForm, { onClose: mockOnClose })
      )
    );
  };

  it('should handle empty countries list', () => {
    renderWithEmptyCountries();
    expect(screen.getByText('Select country')).toBeInTheDocument();
    expect(screen.queryByText('United States')).not.toBeInTheDocument();
  });
});
