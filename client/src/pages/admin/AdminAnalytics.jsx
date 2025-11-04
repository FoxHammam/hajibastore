import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

const AdminAnalytics = () => {
  const { getAuthToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueByMonth: [],
    orderStatusCounts: {},
    topProducts: [],
  });
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

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
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

      // Calculate total revenue
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      // Calculate revenue by month
      const revenueByMonth = Array.from({ length: 12 }, (_, i) => {
        const monthOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === i;
        });
        return monthOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      });

      // Calculate order status counts
      const orderStatusCounts = orders.reduce((acc, order) => {
        const status = order.status || 'pending';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Get top products
      const productSales = {};
      orders.forEach(order => {
        const productName = order.productName || 'Unknown';
        productSales[productName] = (productSales[productName] || 0) + 1;
      });

      const topProducts = Object.entries(productSales)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate unique customers
      const uniqueCustomers = new Set(orders.map(order => `${order.phone}-${order.fullName}`)).size;

      setAnalytics({
        totalRevenue,
        totalOrders: orders.length,
        totalCustomers: uniqueCustomers,
        totalProducts: products.length,
        revenueByMonth,
        orderStatusCounts,
        topProducts,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  const maxRevenue = Math.max(...analytics.revenueByMonth, 1);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();

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
              Track your store performance and insights.
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#135bec] mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'),
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#616f89', fontWeight: 500 }}>Total Revenue</span>
                    <DollarSign size={20} color="#135bec" />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#111318' }}>
                    ${analytics.totalRevenue.toLocaleString()}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#616f89', fontWeight: 500 }}>Total Orders</span>
                    <ShoppingCart size={20} color="#135bec" />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#111318' }}>
                    {analytics.totalOrders}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#616f89', fontWeight: 500 }}>Total Customers</span>
                    <Users size={20} color="#135bec" />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#111318' }}>
                    {analytics.totalCustomers}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#616f89', fontWeight: 500 }}>Total Products</span>
                    <TrendingUp size={20} color="#135bec" />
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 600, color: '#111318' }}>
                    {analytics.totalProducts}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isTablet ? '1fr' : '2fr 1fr',
                  gap: '24px',
                  marginBottom: '24px',
                }}
              >
                {/* Revenue Chart */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#111318',
                      marginBottom: '20px',
                    }}
                  >
                    Revenue by Month
                  </h2>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-around',
                      height: '200px',
                      gap: '8px',
                    }}
                  >
                    {analytics.revenueByMonth.map((revenue, index) => (
                      <div
                        key={index}
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            backgroundColor: index === currentMonth ? '#135bec' : '#e2e8f0',
                            borderRadius: '4px 4px 0 0',
                            height: `${(revenue / maxRevenue) * 100}%`,
                            minHeight: revenue > 0 ? '4px' : '0',
                            transition: 'all 0.3s ease',
                          }}
                          title={`${monthNames[index]}: $${revenue.toLocaleString()}`}
                        />
                        <span
                          style={{
                            fontSize: '11px',
                            color: '#616f89',
                            fontWeight: 500,
                          }}
                        >
                          {monthNames[index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Status Distribution */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#111318',
                      marginBottom: '20px',
                    }}
                  >
                    Order Status
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {Object.entries(analytics.orderStatusCounts).map(([status, count]) => {
                      const totalOrders = analytics.totalOrders || 1;
                      const percentage = (count / totalOrders) * 100;
                      const statusColors = {
                        pending: '#fbbf24',
                        confirmed: '#3b82f6',
                        processing: '#3b82f6',
                        shipped: '#3b82f6',
                        delivered: '#10b981',
                        cancelled: '#ef4444',
                      };

                      return (
                        <div key={status}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '14px', color: '#111318', fontWeight: 500, textTransform: 'capitalize' }}>
                              {status}
                            </span>
                            <span style={{ fontSize: '14px', color: '#616f89' }}>{count}</span>
                          </div>
                          <div
                            style={{
                              width: '100%',
                              height: '8px',
                              backgroundColor: '#f6f6f8',
                              borderRadius: '4px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${percentage}%`,
                                height: '100%',
                                backgroundColor: statusColors[status] || '#616f89',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                }}
              >
                <h2
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#111318',
                    marginBottom: '20px',
                  }}
                >
                  Top Selling Products
                </h2>
                {analytics.topProducts.length === 0 ? (
                  <p style={{ color: '#616f89', textAlign: 'center', padding: '20px' }}>
                    No sales data available
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {analytics.topProducts.map((product, index) => {
                      const maxSales = analytics.topProducts[0]?.count || 1;
                      const percentage = (product.count / maxSales) * 100;

                      return (
                        <div key={product.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: index === 0 ? '#135bec' : '#e2e8f0',
                              color: index === 0 ? '#ffffff' : '#616f89',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {index + 1}
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '14px', color: '#111318', fontWeight: 500 }}>
                                {product.name}
                              </span>
                              <span style={{ fontSize: '14px', color: '#616f89' }}>{product.count} orders</span>
                            </div>
                            <div
                              style={{
                                width: '100%',
                                height: '8px',
                                backgroundColor: '#f6f6f8',
                                borderRadius: '4px',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  width: `${percentage}%`,
                                  height: '100%',
                                  backgroundColor: '#135bec',
                                  transition: 'width 0.3s ease',
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminAnalytics;
