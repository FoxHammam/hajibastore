import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import KPIWidget from '../../components/admin/KPIWidget';
import { DollarSign, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

const AdminAnalytics = () => {
  const { getAuthToken } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
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

  const fetchAnalytics = async () => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
      
      const ordersResponse = await axios.get(`${apiUrl}/orders`, { headers });
      const orders = ordersResponse.data.data || [];

      const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const customerSet = new Set(orders.map(order => `${order.phone}-${order.fullName}`));
      const avgOrderValue = orders.length > 0 ? revenue / orders.length : 0;

      setStats({
        totalRevenue: revenue,
        totalOrders: orders.length,
        totalCustomers: customerSet.size,
        averageOrderValue: avgOrderValue,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
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
              Analytics
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#616f89',
                margin: 0,
              }}
            >
              View detailed analytics and insights about your store performance.
            </p>
          </div>

          {/* KPI Widgets */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <KPIWidget
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              trend={12}
            />
            <KPIWidget
              title="Total Orders"
              value={stats.totalOrders}
              icon={ShoppingCart}
              trend={8}
            />
            <KPIWidget
              title="Total Customers"
              value={stats.totalCustomers}
              icon={Users}
              trend={15}
            />
            <KPIWidget
              title="Average Order Value"
              value={`$${stats.averageOrderValue.toFixed(2)}`}
              icon={TrendingUp}
              trend={5}
            />
          </div>

          {/* Charts Placeholder */}
          <div
            className="admin-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: isTablet ? '16px' : '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              marginBottom: '24px',
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
              Sales Trends
            </h2>
            <div
              style={{
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#616f89',
                backgroundColor: '#f6f6f8',
                borderRadius: '8px',
              }}
            >
              Chart visualization would go here
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;

