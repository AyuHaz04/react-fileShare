import React, { useState, useContext } from 'react';
import '../styles/Auth.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthCont';
import AuthAlert from '../components/AuthAlert';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });

  const showAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => setAlert({ show: false, variant: '', message: '' }), 3000);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok && result.user) {
        login(result.user);
        showAlert('success', result.message || 'Login successful');
        navigate('/profile');
      } else {
        showAlert('danger', result.message || 'Invalid login credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      showAlert('danger', 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <AuthAlert {...alert} />
        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        <button type="submit" className="auth-button">Login</button>
        <p className="switch-link">Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

export default Login;
