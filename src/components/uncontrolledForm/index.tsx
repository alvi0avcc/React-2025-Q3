import { useRef, type FormEvent, type ChangeEvent, useState } from 'react';
import styles from './form.module.css';
import classNames from 'classnames';

interface UncontrolledFormProps {
  onClose: () => void;
}

const UncontrolledForm = ({ onClose }: UncontrolledFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData.entries());

    console.log('Form data:', data);

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

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Uncontrolled Form</h2>

      <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="age">Age:</label>
          <input type="number" id="age" name="age" min="0" required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handlePasswordChange}
            required
          />
          {passwordStrength && (
            <div className={styles.passwordStrength}>
              Strength: {passwordStrength}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Gender:</label>
          <div className={styles.radioGroup}>
            <label>
              <input type="radio" name="gender" value="male" />
              Male
            </label>
            <label>
              <input type="radio" name="gender" value="female" />
              Female
            </label>
            <label>
              <input type="radio" name="gender" value="other" />
              Other
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" name="acceptTerms" />I accept Terms and
            Conditions
          </label>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="picture">Upload Picture (PNG, JPEG):</label>
          <input
            type="file"
            id="picture"
            name="picture"
            accept=".png,.jpg,.jpeg"
          />
          <p className={styles.fileHint}>Supported formats: PNG, JPEG, JPG</p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="country">Country:</label>
          <select id="country" name="country" required>
            <option value="">Select country</option>
            <option value="usa">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="germany">Germany</option>
            <option value="france">France</option>
          </select>
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
