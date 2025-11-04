import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { Search, Filter, UserPlus } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

const AdminCustomers = () => {
  const { getAuthToken } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
      const response = await axios.get(`${apiUrl}/orders`, { headers });
      const orders = response.data.data || [];

      // Extract unique customers from orders
      const customerMap = new Map();
      
      orders.forEach(order => {
        const key = `${order.phone}-${order.fullName}`;
        if (!customerMap.has(key)) {
          customerMap.set(key, {
            _id: order._id,
            fullName: order.fullName,
            phone: order.phone,
            email: order.email || '',
            city: order.city,
            address: order.address,
            totalOrders: 0,
            totalSpent: 0,
            lastOrder: order.createdAt,
            status: 'active',
          });
        }
        
        const customer = customerMap.get(key);
        customer.totalOrders += 1;
        customer.totalSpent += order.totalAmount || 0;
        
        // Update last order date if this order is more recent
        if (new Date(order.createdAt) > new Date(customer.lastOrder)) {
          customer.lastOrder = order.createdAt;
        }
      });

      const customersArray = Array.from(customerMap.values());
      setCustomers(customersArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.fullName?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.city?.toLowerCase().includes(searchLower)
    );
  });

  const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
              Customers
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#616f89',
                margin: 0,
              }}
            >
              View and manage your registered customer base.
            </p>
          </div>

          {/* Action Bar */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '24px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                flex: 1,
                minWidth: isTablet ? '100%' : '300px',
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
                }}
              />
              <input
                type="text"
                placeholder="Search customers..."
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
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                backgroundColor: '#ffffff',
                color: '#616f89',
                transition: 'all 0.2s ease',
                minWidth: isTablet ? 'auto' : '100px',
                justifyContent: isTablet ? 'center' : 'flex-start',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f6f6f8';
                e.currentTarget.style.borderColor = '#135bec';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <Filter size={18} />
              {!isTablet && <span>Filter</span>}
            </button>
            <button
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
                minWidth: isTablet ? '100%' : 'auto',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0f4bc8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#135bec';
              }}
            >
              <UserPlus size={18} />
              {!isTablet && <span>Add Customer</span>}
            </button>
          </div>

          {/* Customers Table */}
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
            ) : filteredCustomers.length === 0 ? (
              <p style={{ color: '#616f89', textAlign: 'center', padding: '40px' }}>
                No customers found
              </p>
            ) : (
              <div style={{ minWidth: isMobile ? '800px' : 'auto' }}>
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
                        Customer
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
                        Email
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
                        Last Order
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
                        Total Spent
                      </th>
                      <th
                        style={{
                          padding: '0.8rem 1rem',
                          textAlign: 'left',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#111318',
                          display: isTablet ? 'none' : 'table-cell',
                        }}
                      >
                        Orders
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
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer, index) => (
                      <tr
                        key={customer._id || index}
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
                            color: '#111318',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
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
                              fontSize: '14px',
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {getInitials(customer.fullName)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                              {customer.fullName}
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#616f89',
                              }}
                            >
                              {customer.phone}
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#616f89',
                            display: isMobile ? 'none' : 'table-cell',
                          }}
                        >
                          {customer.email || '-'}
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#616f89',
                            display: isMobile ? 'none' : 'table-cell',
                          }}
                        >
                          {new Date(customer.lastOrder).toLocaleDateString()}
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#111318',
                            fontWeight: '500',
                          }}
                        >
                          ${customer.totalSpent.toFixed(2)}
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#616f89',
                            display: isTablet ? 'none' : 'table-cell',
                          }}
                        >
                          {customer.totalOrders}
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
                              backgroundColor: customer.status === 'active' 
                                ? 'rgba(16, 185, 129, 0.1)' 
                                : 'rgba(239, 68, 68, 0.1)',
                              color: customer.status === 'active' 
                                ? '#047857' 
                                : '#dc2626',
                            }}
                          >
                            {customer.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            display: isMobile ? 'none' : 'table-cell',
                          }}
                        >
                          <button
                            style={{
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: 500,
                              color: '#135bec',
                              backgroundColor: 'transparent',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
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
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination Info */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '16px',
              padding: '12px',
              color: '#616f89',
              fontSize: '14px',
            }}
          >
            <span>
              Showing 1 to {filteredCustomers.length} of {customers.length} customers
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{
                  padding: '6px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Previous
              </button>
              <button
                style={{
                  padding: '6px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#135bec',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                1
              </button>
              <button
                style={{
                  padding: '6px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCustomers;
