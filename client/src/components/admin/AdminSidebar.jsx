import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Mail, TrendingUp, Megaphone, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
    { path: '/admin/messages', icon: Mail, label: 'Messages', badge: '3' },
    { path: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/admin/marketing', icon: Megaphone, label: 'Marketing' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Menu Button - Hide when menu is open */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            backgroundColor: '#135bec',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(19, 91, 236, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0f4bc8';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#135bec';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className="admin-sidebar"
        style={{
          width: isMobile ? '280px' : '256px',
          height: '100vh',
          backgroundColor: '#101622',
          position: 'fixed',
          left: isMobile && !isOpen ? '-280px' : '0',
          top: 0,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif',
          zIndex: 999,
          transition: 'left 0.3s ease',
          overflowY: 'auto',
          boxShadow: isMobile ? '2px 0 12px rgba(0, 0, 0, 0.3)' : 'none',
        }}
      >
        {/* Logo Area */}
        <div
          className="admin-logo-area"
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: '#101622',
          }}
        >
          <h1
            style={{
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 600,
              margin: 0,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Zenith
          </h1>
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#a0aec0',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#a0aec0';
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Links - Button Style */}
        <nav style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className="admin-sidebar-item"
                onClick={handleLinkClick}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 16px',
                  color: isActive ? '#ffffff' : '#a0aec0',
                  backgroundColor: isActive ? '#135bec' : 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 8px rgba(19, 91, 236, 0.3)' : 'none',
                  width: '100%',
                })}
                onMouseEnter={(e) => {
                  const currentPath = window.location.pathname;
                  const isActive = item.path === '/admin' 
                    ? (currentPath === '/admin' || currentPath === '/admin/')
                    : (currentPath === item.path || currentPath.startsWith(item.path + '/'));
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  const currentPath = window.location.pathname;
                  const isActive = item.path === '/admin' 
                    ? (currentPath === '/admin' || currentPath === '/admin/')
                    : (currentPath === item.path || currentPath.startsWith(item.path + '/'));
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#a0aec0';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <Icon
                  size={20}
                  style={{
                    marginRight: '12px',
                  }}
                />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      backgroundColor: '#135bec',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: '12px',
                      minWidth: '24px',
                      textAlign: 'center',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '14px 16px',
              color: '#a0aec0',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#a0aec0';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <LogOut size={20} style={{ marginRight: '12px' }} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
