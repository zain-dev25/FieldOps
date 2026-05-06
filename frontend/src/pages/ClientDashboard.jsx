import React, { useEffect, useState } from 'react';
import axios from '../utils/apiConfig.js';
import useAuth from '../hooks/useAuth.js';
import NotificationBell from '../components/NotificationBell.jsx';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  // Note: Authorization header is automatically added by the apiConfig interceptor.

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get('/api/jobs');
      setJobs(data);
    } catch (err) { console.error('Error fetching jobs', err); }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/jobs', { title, description });
      setTitle(''); setDescription('');
      alert('Job requested successfully!');
      fetchJobs();
    } catch (err) { alert('Failed to create job'); }
  };

  return (
    <div className="layout">
      <div className="nav-bar" style={{ marginBottom: '40px' }}>
        <div className="nav-brand">FieldOps Client</div>
        <div className="nav-links">
          <span>{user.name}</span>
          <NotificationBell />
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: '40px' }}>
        <h3>Request New Service Job</h3>
        <form onSubmit={handleCreateJob}>
          <input placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <button type="submit" className="btn">Submit Request</button>
        </form>
      </div>

      <h3>My Service Jobs</h3>
      <div className="grid">
        {jobs.length === 0 ? <p>You have no service jobs recorded.</p> : jobs.map(job => (
          <div key={job._id} className="glass-panel job-card">
            <h4>{job.title}</h4>
            <p style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>{job.description}</p>
            <div style={{ marginBottom: '12px' }}>
              <span className={`status-badge status-${job.status}`}>{job.status}</span>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
              <strong>Technician:</strong> {job.technician ? job.technician.name : 'Not yet assigned'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;
