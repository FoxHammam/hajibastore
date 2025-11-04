import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

const AdminHeader = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className="admin-header"
      style={{
        height: '64px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: isMobile ? '0 16px' : '0 24px',
        fontFamily: 'Inter, sans-serif',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Right Side Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '8px' : '16px',
        }}
      >
        {/* Notifications Icon */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            border: 'none',
            backgroundColor: 'transparent',
            borderRadius: '50%',
            cursor: 'pointer',
            color: '#616f89',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f6f6f8';
            e.currentTarget.style.color = '#111318';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#616f89';
          }}
          title="Notifications"
        >
          <Bell size={20} />
        </button>
        
        {/* User Profile */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f6f6f8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#135bec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            AT
          </div>
          {!isMobile && (
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#111318',
                }}
              >
                Alex Turner
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#616f89',
                }}
              >
                Admin
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
