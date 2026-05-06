import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') navigate('/admin');
      if (user.role === 'TECHNICIAN') navigate('/technician');
      if (user.role === 'CLIENT') navigate('/client');
    } catch (err) {
      alert('Login failed. Check credentials.');
    }
  };

  return (
    <div className="layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>FieldOps Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <button type="submit" className="btn" style={{ width: '100%' }}>Sign In</button>
        </form>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
          <Link to="/signup" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '500' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
