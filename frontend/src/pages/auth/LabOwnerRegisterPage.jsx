import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthCard from '../../components/auth/AuthCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import GoogleAuthButton from '../../components/auth/GoogleAuthButton';

// Mirrors backend/src/schemas/authSchemas.js registerSchema exactly.
const validate = ({ name, email, phone, password }) => {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email address';
  if (!/^[6-9]\d{9}$/.test(phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number';
  if (!password || password.length < 8) errors.password = 'Password must be at least 8 characters';
  return errors;
};

/**
 * Creates the account only (role: lab_owner). Building the actual lab
 * profile (name, address, tests, pricing) happens in a follow-up
 * onboarding step against POST /labs, once that page is built.
 */
const LabOwnerRegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await register({ ...form, role: 'lab_owner' });
      navigate('/lab-owner/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Could not create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Register Your Lab"
      subtitle="List your lab, set your prices, and reach more patients."
      footer={
        <>
          Already registered? <Link to="/lab-owner/login">Sign in</Link>
        </>
      }
    >
      <form className="lb-auth-form" onSubmit={handleSubmit} noValidate>
        {apiError && <div className="lb-auth-form__error">{apiError}</div>}

        <Input
          label="Contact Person Name"
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          error={fieldErrors.name}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />
        <Input
          label="Mobile Number"
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          value={form.phone}
          onChange={handleChange}
          error={fieldErrors.phone}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          hint="At least 8 characters"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />

        <Button type="submit" fullWidth loading={loading}>
          Create Lab Account
        </Button>
      </form>
      <div className="lb-auth-divider"><span>or</span></div>
        <GoogleAuthButton role="lab_owner" redirectTo="/lab-owner/dashboard" />
    </AuthCard>
  );
};

export default LabOwnerRegisterPage;
