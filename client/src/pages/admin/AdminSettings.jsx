import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import '../../styles/admin.css';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsTablet(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'store', label: 'Store' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f6f6f8',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
      }}
    >
      <AdminSidebar />
      <div
        style={{
          flex: 1,
          marginLeft: isMobile ? '0' : '256px',
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.3s ease',
          width: isMobile ? '100%' : 'auto',
          paddingLeft: isMobile ? '72px' : '0',
        }}
      >
        <AdminHeader />
        <main
          style={{
            padding: isTablet ? '16px' : '24px',
            paddingTop: isTablet ? '80px' : '88px',
            paddingBottom: isMobile ? '80px' : (isTablet ? '16px' : '24px'),
            flex: 1,
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h1
              style={{
                fontSize: isTablet ? '20px' : '24px',
                fontWeight: 600,
                color: '#111318',
                margin: 0,
                marginBottom: '8px',
              }}
            >
              Settings
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#616f89',
                margin: 0,
              }}
            >
              Manage your account, store details, and security preferences.
            </p>
          </div>

          {/* Two Column Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 3fr',
              gap: '24px',
            }}
          >
            {/* Vertical Navigation */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #e2e8f0',
                height: 'fit-content',
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: activeTab === tab.id ? '#f6f6f8' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    textAlign: 'left',
                    color: activeTab === tab.id ? '#135bec' : '#616f89',
                    fontSize: '14px',
                    fontWeight: activeTab === tab.id ? 600 : 400,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '4px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = '#f6f6f8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
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
              {activeTab === 'profile' && (
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111318', marginBottom: '24px' }}>
                    Profile Settings
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111318', marginBottom: '8px' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Alex Turner"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none',
                          transition: 'border-color 0.2s ease',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#135bec';
                          e.currentTarget.style.outline = '2px solid #135bec';
                          e.currentTarget.style.outlineOffset = '0';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.outline = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111318', marginBottom: '8px' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue="alex@example.com"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none',
                          transition: 'border-color 0.2s ease',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#135bec';
                          e.currentTarget.style.outline = '2px solid #135bec';
                          e.currentTarget.style.outlineOffset = '0';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.outline = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'store' && (
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111318', marginBottom: '24px' }}>
                    Store Settings
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#111318', marginBottom: '4px' }}>
                          Maintenance Mode
                        </div>
                        <div style={{ fontSize: '12px', color: '#616f89' }}>
                          Temporarily disable your store
                        </div>
                      </div>
                      <button
                        onClick={() => setMaintenanceMode(!maintenanceMode)}
                        style={{
                          width: '48px',
                          height: '24px',
                          borderRadius: '9999px',
                          backgroundColor: maintenanceMode ? '#135bec' : '#e2e8f0',
                          border: 'none',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: '#ffffff',
                            position: 'absolute',
                            top: '2px',
                            left: maintenanceMode ? '26px' : '2px',
                            transition: 'left 0.2s ease',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111318', marginBottom: '24px' }}>
                    Security Settings
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111318', marginBottom: '8px' }}>
                        Current Password
                      </label>
                      <input
                        type="password"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none',
                          transition: 'border-color 0.2s ease',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#135bec';
                          e.currentTarget.style.outline = '2px solid #135bec';
                          e.currentTarget.style.outlineOffset = '0';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.outline = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111318', marginBottom: '8px' }}>
                        New Password
                      </label>
                      <input
                        type="password"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontFamily: 'Inter, sans-serif',
                          outline: 'none',
                          transition: 'border-color 0.2s ease',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#135bec';
                          e.currentTarget.style.outline = '2px solid #135bec';
                          e.currentTarget.style.outlineOffset = '0';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#e2e8f0';
                          e.currentTarget.style.outline = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111318', marginBottom: '24px' }}>
                    Notification Settings
                  </h2>
                  <p style={{ color: '#616f89', fontSize: '14px' }}>
                    Configure your notification preferences.
                  </p>
                </div>
              )}

              {/* Footer Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '32px',
                  paddingTop: '24px',
                  borderTop: '1px solid #e2e8f0',
                }}
              >
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: '#616f89',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f6f6f8';
                    e.currentTarget.style.borderColor = '#135bec';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#135bec',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0f4bc8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#135bec';
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminSettings;

