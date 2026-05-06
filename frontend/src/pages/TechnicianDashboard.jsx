import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';

const TechnicianDashboard = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get('/api/jobs', config);
      setJobs(data);
    } catch (err) { console.error('Error fetching jobs', err); }
  };

  const updateStatus = async (jobId, newStatus) => {
    try {
      await axios.put(`/api/jobs/${jobId}`, { status: newStatus }, config);
      fetchJobs();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="layout">
      <div className="nav-bar" style={{ marginBottom: '40px' }}>
        <div className="nav-brand">FieldOps Technician</div>
        <div className="nav-links">
          <span>{user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <h3>My Assigned Jobs</h3>
      <div className="grid">
        {jobs.length === 0 ? <p>No jobs assigned.</p> : jobs.map(job => (
          <div key={job._id} className="glass-panel job-card">
            <h4>{job.title}</h4>
            <p style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>{job.description}</p>
            <div style={{ marginBottom: '12px' }}>
              <span className={`status-badge status-${job.status}`}>{job.status}</span>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
              <strong>Client:</strong> {job.client?.name || 'Unknown'}
            </p>
            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Update Status:</label>
              <select 
                value={job.status} 
                onChange={(e) => updateStatus(job._id, e.target.value)}
                style={{ marginTop: '8px' }}
              >
                <option value="PENDING">PENDING</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="EN_ROUTE">EN_ROUTE</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicianDashboard;
