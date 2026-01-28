import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineUserGroup, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      login(username);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon">
            <HiOutlineUserGroup />
          </div>
          <h1>Workforce Manager</h1>
          <p>Streamline your team management with our comprehensive workforce solution</p>
        </div>
        <div className="login-features">
          <div className="login-feature">
            <span className="login-feature-icon">+</span>
            <span>Add and manage users efficiently</span>
          </div>
          <div className="login-feature">
            <span className="login-feature-icon">+</span>
            <span>Create and organize teams</span>
          </div>
          <div className="login-feature">
            <span className="login-feature-icon">+</span>
            <span>Assign roles and team leads</span>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <div className="input-with-icon">
                <HiOutlineUser className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-with-icon">
                <HiOutlineLockClosed className="input-icon" />
                <input
                  type="password"
                  className="form-input"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary login-btn">
              Sign In
            </button>
          </form>

          <div className="login-footer">
            <p>Enter any username and password to login</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
