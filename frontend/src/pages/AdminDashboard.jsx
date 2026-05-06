import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth.js';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchJobs();
    fetchUsers();
  }, []);

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get('/api/jobs', config);
      setJobs(data);
    } catch (err) { console.error('Error fetching jobs', err); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
    } catch (err) { console.error('Error fetching users', err); }
  };

  const handleAssign = async (jobId, technicianId) => {
    try {
      await axios.put(`/api/jobs/${jobId}`, { technician: technicianId }, config);
      fetchJobs();
    } catch (err) { alert('Failed to assign'); }
  };

  // Calculate KPI metrics
  const totalClients = users.filter(u => u.role === 'CLIENT').length;
  const totalTechnicians = users.filter(u => u.role === 'TECHNICIAN').length;
  const totalJobs = jobs.length;
  const pendingJobs = jobs.filter(job => job.status === 'PENDING').length;
  const inProgressJobs = jobs.filter(job => job.status === 'IN_PROGRESS').length;
  const completedJobs = jobs.filter(job => job.status === 'COMPLETED').length;

  return (
    <div className="layout">
      <div className="nav-bar" style={{ marginBottom: '40px' }}>
        <div className="nav-brand">FieldOps Admin</div>
        <div className="nav-links">
          <span>{user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        {/* Total Jobs Card */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px' }}>{totalJobs}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Jobs</div>
        </div>

        {/* Pending Jobs Card */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', color: '#f59e0b' }}>{pendingJobs}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pending Jobs</div>
        </div>

        {/* In Progress Jobs Card */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', color: '#3b82f6' }}>{inProgressJobs}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>In Progress</div>
        </div>

        {/* Completed Jobs Card */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', color: '#10b981' }}>{completedJobs}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Completed Jobs</div>
        </div>

        {/* Total Clients Card */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', color: '#8b5cf6' }}>{totalClients}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Clients</div>
        </div>

        {/* Total Technicians Card */}
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '8px', color: '#ec489a' }}>{totalTechnicians}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Technicians</div>
        </div>
      </div>

      <h3>All Jobs Overview</h3>
      <div className="grid">
        {jobs.length === 0 ? <p>No actively registered core jobs.</p> : jobs.map(job => (
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
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Assign Technician:</label>
              <select 
                value={job.technician?._id || ''} 
                onChange={(e) => handleAssign(job._id, e.target.value)}
                style={{ marginTop: '8px' }}
              >
                <option value="">Not Assigned</option>
                {users.filter(u => u.role === 'TECHNICIAN').map(tech => (
                  <option key={tech._id} value={tech._id}>{tech.name}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;