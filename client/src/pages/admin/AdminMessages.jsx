import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { messageAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/admin.css';

const AdminMessages = () => {
  const { getAuthToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
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

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const allMessages = await messageAPI.getAll();
      setMessages(Array.isArray(allMessages) ? allMessages : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
      // Set empty array if API doesn't exist or fails
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (messageId, status, adminNotes = '') => {
    try {
      await messageAPI.updateStatus(messageId, status, adminNotes);
      toast.success('Message status updated successfully!');
      fetchMessages();
    } catch (error) {
      console.error('Error updating message status:', error);
      toast.error('Failed to update message status. Please try again.');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await messageAPI.delete(messageId);
      toast.success('Message deleted successfully!');
      fetchMessages();
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message. Please try again.');
    }
  };

  const getFilteredMessages = () => {
    switch (activeTab) {
      case 'unread':
        return messages.filter(m => !m.read || m.status === 'unread');
      case 'replied':
        return messages.filter(m => m.status === 'replied' || m.status === 'responded');
      case 'archived':
        return messages.filter(m => m.status === 'archived');
      default:
        return messages;
    }
  };

  const filteredMessages = getFilteredMessages();
  const unreadCount = messages.filter(m => !m.read || m.status === 'unread').length;
  const repliedCount = messages.filter(m => m.status === 'replied' || m.status === 'responded').length;
  const archivedCount = messages.filter(m => m.status === 'archived').length;

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
            {[
              { key: 'all', label: 'All', count: messages.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'replied', label: 'Replied', count: repliedCount },
              { key: 'archived', label: 'Archived', count: archivedCount },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '12px 20px',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '2px solid #135bec' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  color: activeTab === tab.key ? '#135bec' : '#616f89',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.key ? 600 : 500,
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

          {/* Messages List */}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredMessages.map((message) => {
                  const isUnread = !message.read || message.status === 'unread';
                  return (
                    <div
                      key={message._id || message.id}
                      style={{
                        padding: '16px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        backgroundColor: isUnread ? '#f0f7ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f6f6f8';
                        e.currentTarget.style.borderColor = '#135bec';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isUnread ? '#f0f7ff' : '#ffffff';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            {isUnread && (
                              <div
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: '#135bec',
                                }}
                              />
                            )}
                            <h3
                              style={{
                                fontSize: '14px',
                                fontWeight: isUnread ? 600 : 500,
                                color: '#111318',
                                margin: 0,
                              }}
                            >
                              {message.name || message.fullName || 'Anonymous'}
                            </h3>
                            <span
                              style={{
                                fontSize: '12px',
                                color: '#616f89',
                              }}
                            >
                              {message.email || message.phone || ''}
                            </span>
                          </div>
                          <p
                            style={{
                              fontSize: '14px',
                              color: '#616f89',
                              margin: 0,
                              marginBottom: '8px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {message.message || message.subject || 'No message content'}
                          </p>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span
                              style={{
                                fontSize: '12px',
                                color: '#616f89',
                              }}
                            >
                              {new Date(message.createdAt || message.date).toLocaleDateString()}
                            </span>
                            {message.status && (
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '0.25rem 0.625rem',
                                  borderRadius: '9999px',
                                  fontSize: '11px',
                                  fontWeight: 500,
                                  backgroundColor: message.status === 'replied' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                                  color: message.status === 'replied' ? '#047857' : '#b45309',
                                }}
                              >
                                {message.status}
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                          {message.status !== 'replied' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(message._id || message.id, 'replied');
                              }}
                              style={{
                                padding: '6px 12px',
                                border: '1px solid #135bec',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: 'pointer',
                                fontFamily: 'Inter, sans-serif',
                                backgroundColor: 'transparent',
                                color: '#135bec',
                              }}
                            >
                              Reply
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(message._id || message.id, 'archived');
                            }}
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
                            Archive
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111318', margin: 0 }}>
                Message Details
              </h2>
              <button
                onClick={() => setSelectedMessage(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#616f89',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#111318' }}>From:</strong>{' '}
              <span style={{ color: '#616f89' }}>
                {selectedMessage.name || selectedMessage.fullName || 'Anonymous'}
              </span>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#111318' }}>Email:</strong>{' '}
              <span style={{ color: '#616f89' }}>{selectedMessage.email || 'N/A'}</span>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#111318' }}>Phone:</strong>{' '}
              <span style={{ color: '#616f89' }}>{selectedMessage.phone || 'N/A'}</span>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <strong style={{ color: '#111318' }}>Date:</strong>{' '}
              <span style={{ color: '#616f89' }}>
                {new Date(selectedMessage.createdAt || selectedMessage.date).toLocaleString()}
              </span>
            </div>
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f6f6f8', borderRadius: '8px' }}>
              <strong style={{ color: '#111318', display: 'block', marginBottom: '8px' }}>Message:</strong>
              <p style={{ color: '#616f89', margin: 0, lineHeight: '1.6' }}>
                {selectedMessage.message || selectedMessage.subject || 'No message content'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => handleDeleteMessage(selectedMessage._id || selectedMessage.id)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #dc2626',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  backgroundColor: 'transparent',
                  color: '#dc2626',
                }}
              >
                Delete
              </button>
              {selectedMessage.status !== 'replied' && (
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedMessage._id || selectedMessage.id, 'replied');
                    setSelectedMessage(null);
                  }}
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
                  }}
                >
                  Mark as Replied
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;

