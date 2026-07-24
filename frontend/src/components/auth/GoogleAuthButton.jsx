// frontend/src/components/auth/GoogleAuthButton.jsx
import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/**
 * Renders Google's official Sign-In button.
 * - role: role to assign IF this creates a brand-new account (ignored for existing users)
 * - expectedRole: if set, the resulting account's role must match, or we
 *   sign the user back out (e.g. don't let a customer land on lab-owner login)
 * - redirectTo: where to send the user on success (defaults by role)
 */
const GoogleAuthButton = ({ role = 'customer', expectedRole, redirectTo }) => {
  const { googleLogin, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSuccess = async (credentialResponse) => {
    setError(null);
    try {
      const user = await googleLogin({ credential: credentialResponse.credential, role });

      if (expectedRole && user.role !== expectedRole) {
        await logout();
        setError(
          `This Google account is registered as a ${
            user.role === 'lab_owner' ? 'lab owner' : 'customer'
          }. Please use the correct sign-in page.`
        );
        return;
      }

      const dashboardPath = user.role === 'lab_owner' ? '/lab-owner/dashboard' : '/dashboard';
      navigate(redirectTo || dashboardPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="lb-google-auth">
      {error && <div className="lb-auth-form__error">{error}</div>}
      <div className="lb-google-auth__btn">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError('Google sign-in failed. Please try again.')}
          text="continue_with"
          shape="pill"
          width="100%"
        />
      </div>
    </div>
  );
};

export default GoogleAuthButton;