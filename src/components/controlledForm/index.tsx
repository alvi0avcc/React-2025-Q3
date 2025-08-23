import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addFormSubmission } from '@/store/formSlice';
import styles from '@components/uncontrolledForm/form.module.css';
import classNames from 'classnames';
import { convertToBase64 } from '@/utils/convertToBase64';
import type { Gender, MyFormData } from '@/types/types';
import { isGenderResult } from '@/utils/valid';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '@/schemas/formSchema';

interface ControlledFormProps {
  onClose: () => void;
}

interface FormInputs {
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
  acceptTerms: boolean;
  picture?: File;
  country: string;
}

const ControlledForm = ({ onClose }: ControlledFormProps) => {
  const dispatch = useAppDispatch();
  const { countries } = useAppSelector(state => state.forms);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    setValue,
    watch,
  } = useForm<FormInputs>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const [passwordStrength, setPasswordStrength] = useState('');
  const pictureValue = watch('picture');

  const onSubmit = async (data: FormInputs) => {
    let pictureBase64 = null;
    if (data.picture) {
      pictureBase64 = await convertToBase64(data.picture);
    }

    const submissionData: MyFormData = {
      type: 'controlled',
      name: data.name,
      age: data.age,
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

    void trigger('confirmPassword');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('picture', file);
      void trigger('picture');
    } else {
      setValue('picture', undefined);
    }
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
            {...register('name')}
            className={errors.name ? styles.error : ''}
          />
          {errors.name && (
            <span className={styles.errorMessage}>
              {String(errors.name.message)}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            {...register('age', { valueAsNumber: true })}
            className={errors.age ? styles.error : ''}
          />
          {errors.age && (
            <span className={styles.errorMessage}>
              {String(errors.age.message)}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={errors.email ? styles.error : ''}
          />
          {errors.email && (
            <span className={styles.errorMessage}>
              {String(errors.email.message)}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            {...register('password')}
            onChange={handlePasswordChange}
            className={errors.password ? styles.error : ''}
          />
          {passwordStrength && (
            <div className={styles.passwordStrength}>
              Strength: {passwordStrength}
            </div>
          )}
          {errors.password && (
            <span className={styles.errorMessage}>
              {String(errors.password.message)}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? styles.error : ''}
          />
          {errors.confirmPassword && (
            <span className={styles.errorMessage}>
              {String(errors.confirmPassword.message)}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Gender:</label>
          <div className={styles.radioGroup}>
            <label>
              <input type="radio" value="male" {...register('gender')} />
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
            <span className={styles.errorMessage}>
              {String(errors.gender.message)}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" {...register('acceptTerms')} />I accept Terms
            and Conditions
          </label>
          {errors.acceptTerms && (
            <span className={styles.errorMessage}>
              {String(errors.acceptTerms.message)}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="picture">Upload Picture (PNG, JPEG):</label>
          <input
            type="file"
            id="picture"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          <p className={styles.fileHint}>Supported formats: PNG, JPEG, JPG</p>
          {pictureValue && (
            <div className={styles.fileInfo}>
              Selected: {pictureValue.name} (
              {Math.round(pictureValue.size / 1024)} KB)
            </div>
          )}
          {errors.picture && (
            <span className={styles.errorMessage}>
              {String(errors.picture.message)}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="country">Country:</label>
          <select
            id="country"
            {...register('country')}
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
              {String(errors.country.message)}
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
