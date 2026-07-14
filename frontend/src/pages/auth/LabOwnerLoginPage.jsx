import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthCard from '../../components/auth/AuthCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

/**
 * Same auth backend as customer login (login has no role param) —
 * this page just frames the flow for lab owners and always redirects
 * to the lab-owner dashboard on success.
 */
const LabOwnerLoginPage = () => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(form);
      if (user.role !== 'lab_owner') {
        await logout();
        setError('This account is registered as a customer. Use the customer sign-in instead.');
        return;
      }
      navigate('/lab-owner/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Lab Owner Sign In"
      subtitle="Manage your tests, pricing, and bookings."
      footer={
        <>
          New lab partner? <Link to="/lab-owner/register">Register your lab</Link>
        </>
      }
    >
      <form className="lb-auth-form" onSubmit={handleSubmit}>
        {error && <div className="lb-auth-form__error">{error}</div>}

        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div className="lb-auth-form__links">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          Sign In
        </Button>
      </form>
    </AuthCard>
  );
};

export default LabOwnerLoginPage;
