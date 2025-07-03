import React, { useState, useContext } from 'react';
import '../styles/Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthCont';
import AuthAlert from '../components/AuthAlert';
import { API } from '../utils/api';

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 3000);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSendOtp = async () => {
    if (!formData.email) return showAlert('warning', 'Please enter email first');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const result = await res.json();
      setLoading(false);
      if (res.ok) {
        showAlert('success', result.message);
        setOtpSent(true);
      } else {
        showAlert('danger', result.message);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      showAlert('danger', 'Error sending OTP.');
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      const result = await res.json();
      setLoading(false);
      if (res.ok) {
        showAlert('success', result.message);
        setOtpVerified(true);
      } else {
        showAlert('danger', result.message);
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      showAlert('danger', 'OTP verification failed.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!otpVerified) return showAlert('warning', 'Please verify OTP first.');

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      setLoading(false);
      if (res.ok) {
        showAlert('success', result.message || 'Registration successful');
        login({ username: formData.username, email: formData.email });
        navigate('/profile');
      } else {
        showAlert('danger', result.message || 'Registration failed');
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      showAlert('danger', 'Registration failed.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Create an Account</h2>
        <AuthAlert {...alert} />
        <label>Username</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        <button type="button" className="auth-button" onClick={handleSendOtp} disabled={otpSent || loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
        {otpSent && !otpVerified && (
          <>
            <label>Enter OTP</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <button type="button" className="auth-button" onClick={handleVerifyOtp} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}
        {otpVerified && (
          <>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </>
        )}
        <p className="switch-link">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default Register;
