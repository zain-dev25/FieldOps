import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CLIENT');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signup(name, email, password, role);
      if (user.role === 'ADMIN') navigate('/admin');
      if (user.role === 'TECHNICIAN') navigate('/technician');
      if (user.role === 'CLIENT') navigate('/client');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <div className="layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Create Account</h2>
        <p style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--text-secondary)' }}>Join FieldOps today</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
          />
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
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="CLIENT">Client</option>
            <option value="TECHNICIAN">Technician</option>
          </select>
          <button type="submit" className="btn" style={{ width: '100%' }}>Sign Up</button>
        </form>
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: '500' }}>Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
