import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addFormSubmission } from '@/store/formSlice';
import styles from '@components/uncontrolledForm/form.module.css';
import classNames from 'classnames';
import { convertToBase64 } from '@/utils/convertToBase64';
import type { MyFormData } from '@/types/types';
import { isGenderResult, isGender } from '@/utils/valid';

interface ControlledFormProps {
  onClose: () => void;
}
interface FormInputs {
  name: string;
  age: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  acceptTerms: boolean;
  picture: FileList;
  country: string;
}

const ControlledForm = ({ onClose }: ControlledFormProps) => {
  const dispatch = useAppDispatch();
  const { countries } = useAppSelector(state => state.forms);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setError,
    clearErrors,
  } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: {
      acceptTerms: false,
    },
  });

  const [passwordStrength, setPasswordStrength] = useState('');

  const onSubmit = async (data: FormInputs) => {
    if (!isGender(data.gender)) {
      setError('gender', { message: 'Invalid gender value' });
      return;
    }

    let pictureBase64 = null;
    if (data.picture && data.picture.length > 0) {
      pictureBase64 = await convertToBase64(data.picture[0]);
    }

    const submissionData: MyFormData = {
      type: 'controlled',
      name: data.name,
      age: Number.parseInt(data.age),
      email: data.email,
      gender: isGenderResult(data.gender),
      acceptTerms: data.acceptTerms,
      pictureBase64,
      country: data.country,
      password: data.password,
    };

    dispatch(addFormSubmission(submissionData));
    onClose();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    let strength = '';
    if (/[0-9]/.test(password)) strength += '✓ number ';
    if (/[A-Z]/.test(password)) strength += '✓ uppercase ';
    if (/[a-z]/.test(password)) strength += '✓ lowercase ';
    if (/[^A-Za-z0-9]/.test(password)) strength += '✓ special char';

    setPasswordStrength(strength || 'Weak password');

    const confirmPassword = watch('confirmPassword');
    if (confirmPassword && confirmPassword !== password) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      });
    } else {
      clearErrors('confirmPassword');
    }
  };

  const validatePasswordMatch = (value: string) => {
    const password = watch('password');
    return value === password || 'Passwords do not match';
  };

  const validateName = (value: string) => {
    return /^[A-Z]/.test(value) || 'Name must start with capital letter';
  };

  const validateAge = (value: string) => {
    const age = Number.parseInt(value);
    return (age >= 0 && !Number.isNaN(age)) || 'Age cannot be negative';
  };

  const validateFile = (files: FileList) => {
    if (files.length === 0) return 'Picture is required';

    const file = files[0];
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const maxSize5MB = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      return 'Only PNG and JPEG files are allowed';
    }

    if (file.size > maxSize5MB) {
      return 'File size must be less than 5MB';
    }

    return true;
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Controlled Form</h2>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            autoFocus
            {...register('name', {
              required: 'Name is required',
              validate: validateName,
            })}
            className={errors.name ? styles.error : ''}
          />
          {errors.name && (
            <span className={styles.errorMessage}>{errors.name.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            {...register('age', {
              required: 'Age is required',
              validate: validateAge,
            })}
            className={errors.age ? styles.error : ''}
          />
          {errors.age && (
            <span className={styles.errorMessage}>{errors.age.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
            className={errors.email ? styles.error : ''}
          />
          {errors.email && (
            <span className={styles.errorMessage}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              onChange: handlePasswordChange,
            })}
            className={errors.password ? styles.error : ''}
          />
          {passwordStrength && (
            <div className={styles.passwordStrength}>
              Strength: {passwordStrength}
            </div>
          )}
          {errors.password && (
            <span className={styles.errorMessage}>
              {errors.password.message}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: validatePasswordMatch,
            })}
            className={errors.confirmPassword ? styles.error : ''}
          />
          {errors.confirmPassword && (
            <span className={styles.errorMessage}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Gender:</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="male"
                {...register('gender', { required: 'Gender is required' })}
              />
              Male
            </label>
            <label>
              <input type="radio" value="female" {...register('gender')} />
              Female
            </label>
            <label>
              <input type="radio" value="other" {...register('gender')} />
              Other
            </label>
          </div>
          {errors.gender && (
            <span className={styles.errorMessage}>{errors.gender.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              {...register('acceptTerms', {
                required: 'You must accept terms and conditions',
              })}
            />
            I accept Terms and Conditions
          </label>
          {errors.acceptTerms && (
            <span className={styles.errorMessage}>
              {errors.acceptTerms.message}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="picture">Upload Picture (PNG, JPEG):</label>
          <input
            type="file"
            id="picture"
            accept=".png,.jpg,.jpeg"
            {...register('picture', {
              validate: validateFile,
            })}
          />
          <p className={styles.fileHint}>Supported formats: PNG, JPEG, JPG</p>
          {errors.picture && (
            <span className={styles.errorMessage}>
              {errors.picture.message}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="country">Country:</label>
          <select
            id="country"
            {...register('country', { required: 'Country is required' })}
            className={errors.country ? styles.error : ''}
          >
            <option value="">Select country</option>
            {countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && (
            <span className={styles.errorMessage}>
              {errors.country.message}
            </span>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            disabled={!isValid}
            className={classNames(styles.formButton, styles.submitButton, {
              [styles.disabled]: !isValid,
            })}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className={classNames(styles.formButton, styles.cancelButton)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ControlledForm;
