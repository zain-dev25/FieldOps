import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import api from '../utils/apiConfig.js';
import useAuth from '../hooks/useAuth.js';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch all notifications for the current user
  const fetchNotifications = useCallback(async (showLoading = true) => {
    if (!user) {
      setNotifications([]);
      return;
    }

    try {
      if (showLoading) setLoading(true);
      const { data } = await api.get('/api/notifications');
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err.response?.data?.message || err.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [user]);

  // Mark a single notification as read
  const markAsRead = useCallback(async (id) => {
    try {
      const { data } = await api.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: data.read } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err.response?.data?.message || err.message);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await api.put('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err.response?.data?.message || err.message);
    }
  }, []);

  // Delete a notification
  const deleteNotification = useCallback(async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err.response?.data?.message || err.message);
    }
  }, []);

  // Poll for notifications every 5 seconds while user is logged in,
  // so new messages appear in-app without needing to open the bell.
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(false), 5000);

    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for easy consumption
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
