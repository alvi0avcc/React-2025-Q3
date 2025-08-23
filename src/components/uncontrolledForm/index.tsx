import { useRef, type FormEvent, type ChangeEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addFormSubmission } from '@/store/formSlice';
import styles from './form.module.css';
import classNames from 'classnames';
import { convertToBase64 } from '@/utils/convertToBase64';
import type { MyFormData } from '@/types/types';
import {
  validateFormData,
  validateFile,
  type FormSchemaType,
} from '@/schemas/formSchema';
import { isString, isGenderResult, isFileResult } from '@/utils/valid';

interface UncontrolledFormProps {
  onClose: () => void;
}

const UncontrolledForm = ({ onClose }: UncontrolledFormProps) => {
  const dispatch = useAppDispatch();
  const { countries } = useAppSelector(state => state.forms);
  const formRef = useRef<HTMLFormElement>(null);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    const rawData: FormSchemaType = {
      name: isString(formData.get('name')),
      age: Number.parseInt(isString(formData.get('age')) || '0', 10),
      email: isString(formData.get('email')),
      password: isString(formData.get('password')),
      confirmPassword: isString(formData.get('confirmPassword')),
      gender: isGenderResult(formData.get('gender')),
      acceptTerms: formData.get('acceptTerms') === 'on',
      country: isString(formData.get('country')),
      picture: isFileResult(formData.get('picture')) || undefined,
    };

    const validationResult = validateFormData(rawData);

    if (!validationResult.success) {
      const errors: { [key: string]: string } = {};
      validationResult.error.issues.forEach(error => {
        const fieldName = error.path[0];
        if (typeof fieldName === 'string') {
          errors[fieldName] = error.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    let pictureBase64 = null;
    if (rawData.picture && rawData.picture.size > 0) {
      pictureBase64 = await convertToBase64(rawData.picture);
    }

    const submissionData: MyFormData = {
      type: 'uncontrolled',
      name: rawData.name,
      age: rawData.age,
      email: rawData.email,
      gender: rawData.gender,
      acceptTerms: rawData.acceptTerms,
      pictureBase64,
      country: rawData.country,
      password: rawData.password,
    };

    dispatch(addFormSubmission(submissionData));
    onClose();
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    let strength = '';
    if (/[0-9]/.test(password)) strength += '✓ number ';
    if (/[A-Z]/.test(password)) strength += '✓ uppercase ';
    if (/[a-z]/.test(password)) strength += '✓ lowercase ';
    if (/[^A-Za-z0-9]/.test(password)) strength += '✓ special char';

    setPasswordStrength(strength || 'Weak password');
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFileName(file ? file.name : '');

    if (file) {
      const validationResult = validateFile(file);

      if (!validationResult.success) {
        setFormErrors({ picture: validationResult.error.issues[0].message });
      } else {
        setFormErrors(prev => ({ ...prev, picture: '' }));
      }
    }
  };

  const clearError = (fieldName: string) => {
    setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Uncontrolled Form</h2>

      <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            autoFocus
            onChange={() => clearError('name')}
            className={formErrors.name ? styles.error : ''}
          />
          {formErrors.name && (
            <span className={styles.errorMessage}>{formErrors.name}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            min="0"
            required
            onChange={() => clearError('age')}
            className={formErrors.age ? styles.error : ''}
          />
          {formErrors.age && (
            <span className={styles.errorMessage}>{formErrors.age}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={() => clearError('email')}
            className={formErrors.email ? styles.error : ''}
          />
          {formErrors.email && (
            <span className={styles.errorMessage}>{formErrors.email}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={e => {
              handlePasswordChange(e);
              clearError('password');
            }}
            required
            className={formErrors.password ? styles.error : ''}
          />
          {passwordStrength && (
            <div className={styles.passwordStrength}>
              Strength: {passwordStrength}
            </div>
          )}
          {formErrors.password && (
            <span className={styles.errorMessage}>{formErrors.password}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            onChange={() => clearError('confirmPassword')}
            className={formErrors.confirmPassword ? styles.error : ''}
          />
          {formErrors.confirmPassword && (
            <span className={styles.errorMessage}>
              {formErrors.confirmPassword}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Gender:</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="gender"
                value="male"
                required
                onChange={() => clearError('gender')}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="female"
                onChange={() => clearError('gender')}
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="other"
                onChange={() => clearError('gender')}
              />
              Other
            </label>
          </div>
          {formErrors.gender && (
            <span className={styles.errorMessage}>{formErrors.gender}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="acceptTerms" required />I accept Terms
            and Conditions
          </label>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="picture">Upload Picture (PNG, JPEG):</label>
          <input
            type="file"
            id="picture"
            name="picture"
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          <p className={styles.fileHint}>
            {selectedFileName || 'Supported formats: PNG, JPEG, JPG'}
          </p>
          {formErrors.picture && (
            <span className={styles.errorMessage}>{formErrors.picture}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="country">Country:</label>
          <select
            id="country"
            name="country"
            required
            onChange={() => clearError('country')}
            className={formErrors.country ? styles.error : ''}
          >
            <option value="">Select country</option>
            {countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {formErrors.country && (
            <span className={styles.errorMessage}>{formErrors.country}</span>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={classNames(styles.formButton, styles.submitButton)}
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

export default UncontrolledForm;
