import "../Login/style.scss";

interface LoginModalProps {
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  // Hàm xử lý đăng nhập bằng Google
  const handleGoogleLogin = () => {
    // URL này trỏ đến backend NestJS của bạn đã làm ở các bước trước
    window.location.href = "http://localhost:3000/auth/google";
  };

  // (Tương tự cho GitHub nếu bạn đã làm)
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:3000/auth/github";
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>Join the Community</h2>
        <p>Create beautiful UI elements and share them with developers</p>
        <div className="btn-group">
          {/* Thêm onClick handler vào các nút */}
          <button className="github" onClick={handleGitHubLogin}>
            Continue with GitHub
          </button>
          <button className="google" onClick={handleGoogleLogin}>
            Continue with Google
          </button>
          <button className="x" disabled>
            Continue with X
          </button>
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
