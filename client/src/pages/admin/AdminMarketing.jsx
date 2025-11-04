import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import '../../styles/admin.css';

const AdminMarketing = () => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f6f6f8',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <AdminSidebar />
      <div
        style={{
          flex: 1,
          marginLeft: '256px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AdminHeader />
        <main
          style={{
            padding: '24px',
            paddingTop: '88px',
            flex: 1,
          }}
        >
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#111318',
              marginBottom: '24px',
            }}
          >
            Marketing
          </h1>
          <div
            className="admin-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
          >
            <p style={{ color: '#616f89', textAlign: 'center', padding: '40px' }}>
              Marketing feature coming soon...
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminMarketing;

