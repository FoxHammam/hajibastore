import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { Search, Filter, Download, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/admin.css';

const AdminOrders = () => {
  const { getAuthToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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

  const fetchOrders = async () => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
      const response = await axios.get(`${apiUrl}/orders`, { headers });
      setOrders(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
      await axios.put(`${apiUrl}/orders/${orderId}/status`, { status: newStatus }, { headers });
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status. Please try again.');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
      await axios.delete(`${apiUrl}/orders/${orderId}`, { headers });
      
      // Remove from local state
      setOrders(orders.filter(order => order._id !== orderId));
      setDeleteConfirm(null);
      toast.success('Order deleted successfully!');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order. Please try again.');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Phone', 'Product', 'Amount', 'Status', 'Date'],
      ...filteredOrders.map(order => [
        order._id.slice(-8),
        order.fullName,
        order.phone,
        order.productName,
        `$${order.totalAmount}`,
        order.status || 'pending',
        new Date(order.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getDateFilter = (order) => {
    if (!dateFilter) return true;
    
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (dateFilter) {
      case 'today':
        return orderDate >= today;
      case 'last7days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return orderDate >= sevenDaysAgo;
      case 'last30days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return orderDate >= thirtyDaysAgo;
      default:
        return true;
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesDate = getDateFilter(order);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const statusColors = {
    pending: { bg: 'rgba(251, 191, 36, 0.1)', color: '#b45309' },
    confirmed: { bg: 'rgba(59, 130, 246, 0.1)', color: '#1d4ed8' },
    processing: { bg: 'rgba(59, 130, 246, 0.1)', color: '#1d4ed8' },
    shipped: { bg: 'rgba(59, 130, 246, 0.1)', color: '#1d4ed8' },
    delivered: { bg: 'rgba(16, 185, 129, 0.1)', color: '#047857' },
    cancelled: { bg: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' },
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
              Orders
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#616f89',
                margin: 0,
              }}
            >
              Manage and track all customer orders.
            </p>
          </div>

          {/* Action Bar */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                flex: 1,
                minWidth: isTablet ? '100%' : '250px',
              }}
            >
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#616f89',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                placeholder="Search by customer, product, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
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
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Filter
                size={20}
                style={{
                  position: 'absolute',
                  left: '12px',
                  color: '#616f89',
                }}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '10px 12px 10px 40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif',
                  outline: 'none',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
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
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {!isTablet && (
              <>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
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
                >
                  <option value="">Filter by Date</option>
                  <option value="today">Today</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                </select>
                <button
                  onClick={handleExport}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#135bec',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
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
                  <Download size={18} />
                  {!isMobile && <span>Export</span>}
                </button>
              </>
            )}
          </div>

          {/* Orders Table */}
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
            {loading ? (
              <p style={{ color: '#616f89', textAlign: 'center', padding: '40px' }}>
                Loading...
              </p>
            ) : filteredOrders.length === 0 ? (
              <p style={{ color: '#616f89', textAlign: 'center', padding: '40px' }}>
                No orders found
              </p>
            ) : (
              <div style={{ overflowX: 'auto', minWidth: isMobile ? '700px' : 'auto' }}>
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
                          width: '40px',
                        }}
                      >
                        <input
                          type="checkbox"
                          style={{
                            cursor: 'pointer',
                          }}
                        />
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
                        Order ID
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
                      <th
                        style={{
                          padding: '0.8rem 1rem',
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#111318',
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                        }}
                      >
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                          }}
                        >
                          <input
                            type="checkbox"
                            style={{
                              cursor: 'pointer',
                            }}
                          />
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#616f89',
                            fontFamily: 'monospace',
                          }}
                        >
                          {order._id.slice(-8)}
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#111318',
                            display: isMobile ? 'none' : 'table-cell',
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: '500' }}>{order.fullName}</div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#616f89',
                                marginTop: '2px',
                              }}
                            >
                              {order.phone}
                            </div>
                          </div>
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
                            fontWeight: '500',
                          }}
                        >
                          ${order.totalAmount}
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                          }}
                        >
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => {
                              handleStatusUpdate(order._id, e.target.value);
                            }}
                            style={{
                              padding: '0.25rem 0.625rem',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: 500,
                              border: 'none',
                              cursor: 'pointer',
                              backgroundColor:
                                statusColors[order.status]?.bg || '#f6f6f8',
                              color: statusColors[order.status]?.color || '#111318',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
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
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            display: 'flex',
                            gap: '8px',
                          }}
                        >
                          <button
                            onClick={() => setDeleteConfirm(order._id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '32px',
                              height: '32px',
                              border: 'none',
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              color: '#dc2626',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                            }}
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
              maxWidth: '400px',
              width: '100%',
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111318', marginBottom: '15px' }}>
              Confirm Delete
            </h2>
            <p style={{ fontSize: '16px', color: '#616f89', marginBottom: '30px' }}>
              Are you sure you want to delete this order? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e2e8f0',
                  color: '#111318',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(deleteConfirm)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
