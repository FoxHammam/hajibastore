import React, { useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { Megaphone, Mail, Bell, TrendingUp } from 'lucide-react';
import '../../styles/admin.css';

const AdminMarketing = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 768);
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'Summer Sale', status: 'active', reach: 1250, conversions: 45 },
    { id: 2, name: 'New Product Launch', status: 'draft', reach: 0, conversions: 0 },
    { id: 3, name: 'Holiday Special', status: 'paused', reach: 890, conversions: 32 },
  ]);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsTablet(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
              Marketing
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#616f89',
                margin: 0,
              }}
            >
              Manage your marketing campaigns and promotional activities.
            </p>
          </div>

          {/* Marketing Tools */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div
              className="admin-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#135bec';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Megaphone size={32} style={{ color: '#135bec', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111318', marginBottom: '8px' }}>
                Email Campaigns
              </h3>
              <p style={{ fontSize: '14px', color: '#616f89', margin: 0 }}>
                Create and send email campaigns
              </p>
            </div>

            <div
              className="admin-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#135bec';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Bell size={32} style={{ color: '#135bec', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111318', marginBottom: '8px' }}>
                Push Notifications
              </h3>
              <p style={{ fontSize: '14px', color: '#616f89', margin: 0 }}>
                Send notifications to customers
              </p>
            </div>

            <div
              className="admin-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#135bec';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <TrendingUp size={32} style={{ color: '#135bec', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111318', marginBottom: '8px' }}>
                Promotions
              </h3>
              <p style={{ fontSize: '14px', color: '#616f89', margin: 0 }}>
                Manage discounts and offers
              </p>
            </div>

            <div
              className="admin-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#135bec';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Mail size={32} style={{ color: '#135bec', marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111318', marginBottom: '8px' }}>
                Newsletter
              </h3>
              <p style={{ fontSize: '14px', color: '#616f89', margin: 0 }}>
                Manage newsletter subscriptions
              </p>
            </div>
          </div>

          {/* Campaigns List */}
          <div
            className="admin-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: isTablet ? '16px' : '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            }}
          >
            <h2
              style={{
                fontSize: isTablet ? '18px' : '20px',
                fontWeight: 600,
                color: '#111318',
                marginBottom: '20px',
              }}
            >
              Active Campaigns
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  style={{
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111318', marginBottom: '4px' }}>
                      {campaign.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#616f89' }}>
                      <span>Reach: {campaign.reach}</span>
                      <span>Conversions: {campaign.conversions}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: 500,
                        backgroundColor:
                          campaign.status === 'active'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : campaign.status === 'paused'
                            ? 'rgba(251, 191, 36, 0.1)'
                            : 'rgba(107, 114, 128, 0.1)',
                        color:
                          campaign.status === 'active'
                            ? '#047857'
                            : campaign.status === 'paused'
                            ? '#b45309'
                            : '#6b7280',
                      }}
                    >
                      {campaign.status}
                    </span>
                    <button
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        backgroundColor: '#ffffff',
                        color: '#616f89',
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminMarketing;

