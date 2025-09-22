import "../Login/login.scss";

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>Join the Community</h2>
        <p>Create beautiful UI elements and share them with developers</p>

        <div className="btn-group">
          <button className="github">Continue with GitHub</button>
          <button className="google">Continue with Google</button>
          <button className="x">Continue with X</button>
        </div>

        <p className="footer">
          By continuing, you agree to our <a href="#">Terms</a> and{" "}
          <a href="#">Privacy Policy</a>
        </p>
        <p className="signin">
          Already have an account? <a href="#">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
