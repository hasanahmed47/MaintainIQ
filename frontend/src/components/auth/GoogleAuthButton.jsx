import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { googleAuth } from '../../redux/authSlice';
import './GoogleAuthButton.css';

const ROLE_HOME = {
  admin: '/admin',
  supervisor: '/supervisor',
  technician: '/technician',
};

const GoogleAuthButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    const result = await dispatch(googleAuth(credentialResponse.credential));
    if (googleAuth.fulfilled.match(result)) {
      navigate(ROLE_HOME[result.payload.role] || '/technician');
    }
  };

  return (
    <div className="google-auth-block">
      <div className="google-auth-divider">
        <span>or continue with</span>
      </div>
      <div className="google-auth-btn-wrapper">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.error('Google sign-in failed')}
          theme="filled_black"
          shape="pill"
          size="large"
          text="continue_with"
          width="100%"
        />
      </div>
    </div>
  );
};

export default GoogleAuthButton;