import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import KPIWidget from '../../components/admin/KPIWidget';
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const { getAuthToken } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsTablet(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
      const [ordersRes, productsRes] = await Promise.all([
        axios.get(`${apiUrl}/orders`, { headers }),
        axios.get(`${apiUrl}/products?admin=true`, { headers }),
      ]);

      const orders = ordersRes.data.data || [];
      const products = productsRes.data.data || [];

      const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const pending = orders.filter((order) => order.status === 'pending').length;

      setStats({
        totalOrders: orders.length,
        totalRevenue: revenue,
        totalProducts: products.length,
        pendingOrders: pending,
      });

      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

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
              Dashboard
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#616f89',
                margin: 0,
              }}
            >
              Welcome back, Alex! Here's what's happening with your store today.
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
              title="Total Products"
              value={stats.totalProducts}
              icon={Package}
              trend={5}
            />
            <KPIWidget
              title="Pending Orders"
              value={stats.pendingOrders}
              icon={TrendingUp}
              trend={-3}
            />
          </div>

          {/* Recent Orders Table */}
          <div
            className="admin-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: isTablet ? '16px' : '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              overflowX: 'auto',
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
              Recent Orders
            </h2>
            {loading ? (
              <p style={{ color: '#616f89', textAlign: 'center', padding: '40px' }}>
                Loading...
              </p>
            ) : recentOrders.length === 0 ? (
              <p style={{ color: '#616f89', textAlign: 'center', padding: '40px' }}>
                No orders yet
              </p>
            ) : (
              <div
                style={{
                  overflowX: 'auto',
                  minWidth: isMobile ? '600px' : 'auto',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        backgroundColor: '#f6f6f8',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <th
                        style={{
                          padding: '0.8rem 1rem',
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#111318',
                          display: isMobile ? 'none' : 'table-cell',
                        }}
                      >
                        Customer
                      </th>
                      <th
                        style={{
                          padding: '0.8rem 1rem',
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#111318',
                        }}
                      >
                        Product
                      </th>
                      <th
                        style={{
                          padding: '0.8rem 1rem',
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#111318',
                        }}
                      >
                        Amount
                      </th>
                      <th
                        style={{
                          padding: '0.8rem 1rem',
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#111318',
                        }}
                      >
                        Status
                      </th>
                      <th
                        style={{
                          padding: '0.8rem 1rem',
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#111318',
                          display: isMobile ? 'none' : 'table-cell',
                        }}
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                        }}
                      >
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#111318',
                            display: isMobile ? 'none' : 'table-cell',
                          }}
                        >
                          {order.fullName}
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#111318',
                          }}
                        >
                          {order.productName}
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#111318',
                          }}
                        >
                          ${order.totalAmount}
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.625rem',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: 500,
                              backgroundColor:
                                order.status === 'pending'
                                  ? 'rgba(251, 191, 36, 0.1)'
                                  : order.status === 'shipped'
                                  ? 'rgba(59, 130, 246, 0.1)'
                                  : order.status === 'delivered'
                                  ? 'rgba(16, 185, 129, 0.1)'
                                  : 'rgba(16, 185, 129, 0.1)',
                              color:
                                order.status === 'pending'
                                  ? '#b45309'
                                  : order.status === 'shipped'
                                  ? '#1d4ed8'
                                  : order.status === 'delivered'
                                  ? '#047857'
                                  : '#047857',
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#616f89',
                            display: isMobile ? 'none' : 'table-cell',
                          }}
                        >
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
