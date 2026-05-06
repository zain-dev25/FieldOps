import React, { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../context/NotificationContext.jsx';

/**
 * NotificationBell — drop-in bell icon with dropdown for any dashboard nav-bar.
 *
 * Usage:
 *   import NotificationBell from '../components/NotificationBell.jsx';
 *   <NotificationBell />
 */
const NotificationBell = () => {
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Fetch on first open
  useEffect(() => {
    if (open) fetchNotifications();
  }, [open, fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Notifications"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '6px',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Bell SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              background: 'var(--danger-color)',
              color: '#fff',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              fontSize: '10px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: '340px',
            background: 'var(--surface-color)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--surface-border)',
            borderRadius: 'var(--border-radius)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            zIndex: 999,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 16px',
              borderBottom: '1px solid var(--surface-border)',
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Notifications
              {unreadCount > 0 && (
                <span
                  style={{
                    marginLeft: '8px',
                    background: 'var(--accent-color)',
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '1px 7px',
                    fontSize: '11px',
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--accent-color)',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: '340px', overflowY: 'auto' }}>
            {loading && (
              <li style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                Loading…
              </li>
            )}

            {!loading && notifications.length === 0 && (
              <li style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                No notifications
              </li>
            )}

            {!loading &&
              notifications.map((n) => (
                <li
                  key={n._id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--surface-border)',
                    background: n.read ? 'transparent' : 'rgba(59,130,246,0.08)',
                    transition: 'background 0.2s',
                  }}
                >
                  {/* Unread dot */}
                  <span
                    style={{
                      flexShrink: 0,
                      marginTop: '5px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: n.read ? 'transparent' : 'var(--accent-color)',
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '13px', lineHeight: 1.5 }}>
                      {n.message}
                    </p>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        title="Mark as read"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--accent-color)',
                          fontSize: '18px',
                          lineHeight: 1,
                          padding: 0,
                        }}
                      >
                        ✓
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(n._id)}
                      title="Delete"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--danger-color)',
                        fontSize: '16px',
                        lineHeight: 1,
                        padding: 0,
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
