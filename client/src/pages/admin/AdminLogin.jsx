import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Trim inputs
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    console.log('Attempting login with:', { username: trimmedUsername, passwordLength: trimmedPassword.length });

    const result = await login(trimmedUsername, trimmedPassword);

    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message || 'Login failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F4F7F9',
        fontFamily: "Roboto, 'Segoe UI', Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '24px',
        }}
      >
        {/* Login Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '40px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Logo/Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 188, 212, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <Lock size={32} style={{ color: '#00BCD4' }} />
            </div>
            <h1
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#212121',
                margin: 0,
                marginBottom: '8px',
              }}
            >
              Admin Login
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#757575',
                margin: 0,
              }}
            >
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                backgroundColor: '#FFEBEE',
                color: '#C62828',
                padding: '12px 16px',
                borderRadius: '4px',
                marginBottom: '20px',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#212121',
                  marginBottom: '8px',
                }}
              >
                Username or Email
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#757575',
                  }}
                />
                <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: '1px solid #CFD8DC',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: "Roboto, 'Segoe UI', Arial, sans-serif",
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00BCD4';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#CFD8DC';
                  }}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#212121',
                  marginBottom: '8px',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#757575',
                  }}
                />
                <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    border: '1px solid #CFD8DC',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: "Roboto, 'Segoe UI', Arial, sans-serif",
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00BCD4';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#CFD8DC';
                  }}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backgroundColor: loading ? '#B0BEC5' : '#00BCD4',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "Roboto, 'Segoe UI', Arial, sans-serif",
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#00ACC1';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#00BCD4';
                }
              }}
            >
              <LogIn size={18} />
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '12px',
            color: '#757575',
          }}
        >
          Admin access only. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

