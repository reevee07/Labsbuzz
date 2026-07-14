import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthCard from '../../components/auth/AuthCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      const from = location.state?.from?.pathname;
      const dashboardPath = user.role === 'lab_owner' ? '/lab-owner/dashboard' : '/dashboard';
      navigate(from || dashboardPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Sign In"
      subtitle="Welcome back — compare prices and manage your bookings."
      footer={
        <>
          New to Labsbuzz? <Link to="/register">Create an account</Link>
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

export default LoginPage;
