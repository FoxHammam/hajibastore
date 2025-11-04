import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings } from 'lucide-react';

const AdminBottomNav = () => {
  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/customers', icon: Users, label: 'Customers' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTop: '2px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px 4px 8px 4px',
        zIndex: 1000,
        boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 16px',
              textDecoration: 'none',
              color: isActive ? '#135bec' : '#616f89',
              transition: 'all 0.2s ease',
              borderRadius: '12px',
              minWidth: '70px',
              backgroundColor: isActive ? 'rgba(19, 91, 236, 0.08)' : 'transparent',
              position: 'relative',
            })}
          >
            {({ isActive }) => (
              <>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon 
                    size={24} 
                    style={{ 
                      color: isActive ? '#135bec' : '#616f89',
                      transition: 'all 0.2s ease',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    }} 
                  />
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#135bec',
                        borderRadius: '50%',
                        border: '2px solid #ffffff',
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: isActive ? 600 : 500,
                    textAlign: 'center',
                    color: isActive ? '#135bec' : '#616f89',
                    marginTop: '4px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default AdminBottomNav;

