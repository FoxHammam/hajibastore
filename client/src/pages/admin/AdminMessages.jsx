import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { Search, Trash2, Eye, Archive, Mail, X, CheckCircle } from 'lucide-react';
import { messageAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../styles/admin.css';

const AdminMessages = () => {
  const { getAuthToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 768);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsTablet(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
      const response = await axios.get(`${apiUrl}/messages${activeTab !== 'all' ? `?status=${activeTab}` : ''}`, { headers });
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeTab]);

  const handleStatusUpdate = async (messageId, newStatus) => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
      await axios.put(`${apiUrl}/messages/${messageId}/status`, { status: newStatus }, { headers });
      fetchMessages();
      if (selectedMessage && selectedMessage._id === messageId) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error('Failed to update message status');
    }
  };

  const handleDelete = async (messageId) => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
      await axios.delete(`${apiUrl}/messages/${messageId}`, { headers });
      fetchMessages();
      setDeleteConfirm(null);
      if (selectedMessage && selectedMessage._id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter((message) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      message.name.toLowerCase().includes(searchLower) ||
      message.email.toLowerCase().includes(searchLower) ||
      message.subject.toLowerCase().includes(searchLower) ||
      message.message.toLowerCase().includes(searchLower)
    );
  });

  const getStatusCount = (status) => {
    return messages.filter(m => status === 'all' ? true : m.status === status).length;
  };

  const tabs = [
    { id: 'all', label: 'All', count: getStatusCount('all') },
    { id: 'unread', label: 'Unread', count: getStatusCount('unread') },
    { id: 'read', label: 'Read', count: getStatusCount('read') },
    { id: 'replied', label: 'Replied', count: getStatusCount('replied') },
    { id: 'archived', label: 'Archived', count: getStatusCount('archived') },
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
              Messages
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#616f89',
                margin: 0,
              }}
            >
              Manage and respond to customer inquiries.
            </p>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
              borderBottom: '1px solid #e2e8f0',
              flexWrap: 'wrap',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #135bec' : '2px solid transparent',
                  color: activeTab === tab.id ? '#135bec' : '#616f89',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  bottom: '-1px',
                }}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div
            style={{
              position: 'relative',
              marginBottom: '24px',
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
              placeholder="Search messages..."
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
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            />
          </div>

          {/* Messages Table */}
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
            ) : filteredMessages.length === 0 ? (
              <p style={{ color: '#616f89', textAlign: 'center', padding: '40px' }}>
                No messages found
              </p>
            ) : (
              <div style={{ overflowX: 'auto', minWidth: '600px' }}>
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
                        }}
                      >
                        Sender
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
                        Subject
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
                    {filteredMessages.map((message) => (
                      <tr
                        key={message._id}
                        onClick={() => {
                          setSelectedMessage(message);
                          if (message.status === 'unread') {
                            handleStatusUpdate(message._id, 'read');
                          }
                        }}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          backgroundColor: selectedMessage?._id === message._id ? '#f0f4ff' : '#ffffff',
                          transition: 'background-color 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedMessage?._id !== message._id) {
                            e.currentTarget.style.backgroundColor = '#f6f6f8';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedMessage?._id !== message._id) {
                            e.currentTarget.style.backgroundColor = '#ffffff';
                          }
                        }}
                      >
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#111318',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {message.status === 'unread' && (
                              <div
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: '#135bec',
                                  flexShrink: 0,
                                }}
                              />
                            )}
                            <div>
                              <div style={{ fontWeight: 500, color: '#111318' }}>
                                {message.name}
                              </div>
                              <div style={{ fontSize: '12px', color: '#616f89' }}>
                                {message.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#111318',
                            fontWeight: message.status === 'unread' ? 600 : 400,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{message.subject}</span>
                            {message.images && message.images.length > 0 && (
                              <Mail size={14} color="#616f89" />
                            )}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#616f89',
                            display: isTablet ? 'none' : 'table-cell',
                          }}
                        >
                          {new Date(message.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button
                              onClick={() => {
                                setSelectedMessage(message);
                                if (message.status === 'unread') {
                                  handleStatusUpdate(message._id, 'read');
                                }
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '32px',
                                border: 'none',
                                backgroundColor: '#f6f6f8',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: '#616f89',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#e2e8f0';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f6f6f8';
                              }}
                              title="View Message"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(message)}
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
                              title="Delete Message"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
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

      {/* Message Detail Modal */}
      {selectedMessage && (
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
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="admin-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: isTablet ? '16px' : '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Message Detail */}
            {selectedMessage && (
              <div
                className="admin-card"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: isTablet ? '16px' : '24px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                  <div>
                    <h2
                      style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#111318',
                        margin: 0,
                        marginBottom: '8px',
                      }}
                    >
                      {selectedMessage.subject}
                    </h2>
                    <p style={{ fontSize: '14px', color: '#616f89', margin: '4px 0' }}>
                      <strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0' }}>
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#616f89',
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div
                  style={{
                    padding: '16px',
                    backgroundColor: '#f6f6f8',
                    borderRadius: '8px',
                    marginBottom: '24px',
                    whiteSpace: 'pre-wrap',
                    fontSize: '14px',
                    color: '#111318',
                    lineHeight: '1.6',
                  }}
                >
                  {selectedMessage.message}
                </div>

                {/* Images */}
                {selectedMessage.images && selectedMessage.images.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111318', marginBottom: '12px' }}>
                      Attached Images ({selectedMessage.images.length})
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                        gap: '12px',
                      }}
                    >
                      {selectedMessage.images.map((img, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <img
                            src={img}
                            alt={`Attachment ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              cursor: 'pointer',
                            }}
                            onClick={() => window.open(img, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
                  {selectedMessage.status !== 'read' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedMessage._id, 'read')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: '#f6f6f8',
                        color: '#111318',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      <Eye size={16} />
                      Mark as Read
                    </button>
                  )}
                  {selectedMessage.status !== 'replied' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedMessage._id, 'replied')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '8px',
                        backgroundColor: '#135bec',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                      }}
                    >
                      <CheckCircle size={16} />
                      Mark as Replied
                    </button>
                  )}
                  <button
                    onClick={() => handleStatusUpdate(selectedMessage._id, 'archived')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: '#f6f6f8',
                      color: '#111318',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <Archive size={16} />
                    Archive
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(selectedMessage)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#dc2626',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#111318',
                marginBottom: '12px',
              }}
            >
              Delete Message
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#616f89',
                marginBottom: '24px',
              }}
            >
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: '#ffffff',
                  color: '#616f89',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
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

export default AdminMessages;
