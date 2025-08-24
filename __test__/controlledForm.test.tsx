import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useForm } from 'react-hook-form';
import ControlledForm from '@/components/controlledForm';
import formSlice, { addFormSubmission } from '@/store/formSlice';
import type { Store } from '@reduxjs/toolkit';
import type { Gender } from '@/types/types';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { convertToBase64 } from '@/utils/convertToBase64';
import { isGenderResult } from '@/utils/valid';

vi.mock('react-hook-form', () => ({
  useForm: vi.fn(),
}));

vi.mock('@/hooks/redux', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock('@/utils/convertToBase64', () => ({
  convertToBase64: vi.fn(),
}));

vi.mock('@/utils/valid', () => ({
  isGenderResult: vi.fn((value: unknown) => value as Gender),
}));

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: vi.fn(),
}));

vi.mock('@/schemas/formSchema', () => ({
  formSchema: {},
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

type MockUseFormReturn = {
  register: ReturnType<typeof vi.fn>;
  handleSubmit: ReturnType<typeof vi.fn>;
  formState: { errors: Record<string, unknown>; isValid: boolean };
  trigger: ReturnType<typeof vi.fn>;
  setValue: ReturnType<typeof vi.fn>;
  watch: ReturnType<typeof vi.fn>;
};

describe('ControlledForm', () => {
  let store: Store;
  let mockDispatch: ReturnType<typeof vi.fn>;
  let mockUseForm: MockUseFormReturn;
  let mockTrigger: ReturnType<typeof vi.fn>;
  let mockSetValue: ReturnType<typeof vi.fn>;
  let mockWatch: ReturnType<typeof vi.fn>;

  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockTrigger = vi.fn().mockResolvedValue(true);
    mockSetValue = vi.fn();
    mockWatch = vi.fn();

    mockUseForm = {
      register: vi.fn((name: string) => ({
        name,
        onChange: vi.fn(),
        onBlur: vi.fn(),
        ref: vi.fn(),
      })),
      handleSubmit: vi.fn(callback =>
        vi.fn((e: Event) => {
          e.preventDefault();
          callback({});
        })
      ),
      formState: { errors: {}, isValid: true },
      trigger: mockTrigger,
      setValue: mockSetValue,
      watch: mockWatch,
    };

    mockDispatch = vi.fn();

    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockUseForm
    );
    (useAppDispatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDispatch
    );
    (useAppSelector as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      selector =>
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
    (isGenderResult as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (value: unknown) => value as Gender
    );

    store = configureStore({
      reducer: {
        forms: formSlice,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <ControlledForm onClose={mockOnClose} />
      </Provider>
    );
  };

  it('should render form with all fields', () => {
    renderComponent();

    expect(screen.getByText('Controlled Form')).toBeInTheDocument();
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
    const mockHandleSubmit = vi.fn(callback =>
      vi.fn(async (e: Event) => {
        e.preventDefault();
        await callback({
          name: 'John Doe',
          age: 25,
          email: 'john@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          gender: 'male' as Gender,
          acceptTerms: true,
          country: 'United States',
        });
      })
    );

    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockUseForm,
      handleSubmit: mockHandleSubmit,
    });

    renderComponent();

    const submitButton = screen.getByText('Submit');
    await userEvent.click(submitButton);

    expect(mockHandleSubmit).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should show error messages when fields are invalid', () => {
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockUseForm,
      formState: {
        errors: {
          name: { message: 'Name is required' },
          email: { message: 'Invalid email' },
        },
        isValid: false,
      },
    });

    renderComponent();

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('should handle password strength calculation and trigger confirmPassword validation', async () => {
    renderComponent();

    const passwordInput = document.getElementById(
      'password'
    ) as HTMLInputElement;
    expect(passwordInput).toBeInTheDocument();

    await userEvent.type(passwordInput, 'Test123!');

    expect(mockTrigger).toHaveBeenCalledWith('confirmPassword');
  });

  it('should handle file change and trigger validation', async () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    renderComponent();

    const fileInput = screen.getByLabelText(/upload picture/i);
    await userEvent.upload(fileInput, file);

    expect(mockSetValue).toHaveBeenCalledWith('picture', file);
    expect(mockTrigger).toHaveBeenCalledWith('picture');
  });

  it('should display selected file info when picture is selected', () => {
    const mockFile = {
      name: 'test.png',
      size: 1024,
    };

    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockUseForm,
      watch: vi.fn((field: string) =>
        field === 'picture' ? mockFile : undefined
      ),
    });

    renderComponent();

    expect(screen.getByText(/selected: test.png/i)).toBeInTheDocument();
    expect(screen.getByText(/1 kb/i)).toBeInTheDocument();
  });

  it('should render all country options from store', () => {
    renderComponent();

    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });

  it('should disable submit button when form is invalid', () => {
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockUseForm,
      formState: {
        errors: {},
        isValid: false,
      },
    });

    renderComponent();

    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', () => {
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockUseForm,
      formState: {
        errors: {},
        isValid: true,
      },
    });

    renderComponent();

    const submitButton = screen.getByText('Submit');
    expect(submitButton).not.toBeDisabled();
  });

  it('should convert picture to base64 on submission', async () => {
    const testFile = new File(['test'], 'test.png', { type: 'image/png' });
    const mockHandleSubmit = vi.fn(callback =>
      vi.fn(async (e: Event) => {
        e.preventDefault();
        await callback({
          picture: testFile,
          name: 'Test User',
          age: 30,
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          gender: 'female' as Gender,
          acceptTerms: true,
          country: 'Canada',
        });
      })
    );

    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockUseForm,
      handleSubmit: mockHandleSubmit,
    });

    renderComponent();

    const submitButton = screen.getByText('Submit');
    await userEvent.click(submitButton);

    expect(convertToBase64).toHaveBeenCalledWith(testFile);
  });

  it('should dispatch addFormSubmission with correct data', async () => {
    const submissionData = {
      name: 'Jane Doe',
      age: 28,
      email: 'jane@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
      gender: 'female' as Gender,
      acceptTerms: true,
      country: 'United Kingdom',
    };

    const mockHandleSubmit = vi.fn(callback =>
      vi.fn(async (e: Event) => {
        e.preventDefault();
        await callback(submissionData);
      })
    );

    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      ...mockUseForm,
      handleSubmit: mockHandleSubmit,
    });

    renderComponent();

    const submitButton = screen.getByText('Submit');
    await userEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      addFormSubmission({
        type: 'controlled',
        name: submissionData.name,
        age: submissionData.age,
        email: submissionData.email,
        gender: submissionData.gender,
        acceptTerms: submissionData.acceptTerms,
        country: submissionData.country,
        password: submissionData.password,
        pictureBase64: null,
      })
    );
  });
});

describe('ControlledForm - Edge Cases', () => {
  const mockOnClose = vi.fn();
  const mockDispatch = vi.fn();

  beforeEach(() => {
    (useAppDispatch as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockDispatch
    );
    (useAppSelector as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      selector =>
        selector({
          forms: {
            submissions: [],
            countries: [],
          },
        })
    );
  });

  it('should handle empty countries list', () => {
    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      register: vi.fn((name: string) => ({ name })),
      handleSubmit: vi.fn(),
      formState: { errors: {}, isValid: true },
      trigger: vi.fn(),
      setValue: vi.fn(),
      watch: vi.fn(),
    });

    render(
      <Provider store={configureStore({ reducer: { forms: formSlice } })}>
        <ControlledForm onClose={mockOnClose} />
      </Provider>
    );

    expect(screen.getByText('Select country')).toBeInTheDocument();
    expect(screen.queryByText('United States')).not.toBeInTheDocument();
  });

  it('should handle file conversion error gracefully', async () => {
    const mockHandleSubmit = vi.fn(callback =>
      vi.fn(async (e: Event) => {
        e.preventDefault();
        try {
          await callback({
            picture: new File([], 'test.png'),
            name: 'Test User',
            age: 30,
            email: 'test@example.com',
            password: 'Password123!',
            confirmPassword: 'Password123!',
            gender: 'male' as Gender,
            acceptTerms: true,
            country: 'USA',
          });
        } catch (error) {}
      })
    );

    (useForm as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      register: vi.fn((name: string) => ({ name })),
      handleSubmit: mockHandleSubmit,
      formState: { errors: {}, isValid: true },
      trigger: vi.fn(),
      setValue: vi.fn(),
      watch: vi.fn(),
    });

    (convertToBase64 as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Conversion failed')
    );

    render(
      <Provider store={configureStore({ reducer: { forms: formSlice } })}>
        <ControlledForm onClose={mockOnClose} />
      </Provider>
    );

    const submitButton = screen.getByText('Submit');
    await userEvent.click(submitButton);

    expect(convertToBase64).toHaveBeenCalled();
  });
});
