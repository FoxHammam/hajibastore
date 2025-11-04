import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import ProductModal from '../../components/admin/ProductModal';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../../styles/admin.css';

const AdminProducts = () => {
  const { getAuthToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 768);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'packs'

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsTablet(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchProducts = async () => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
      const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
      
      // Fetch both products and packs for admin
      const [productsResponse, packsResponse] = await Promise.all([
        axios.get(`${apiUrl}/products?admin=true`, { headers }),
        axios.get(`${apiUrl}/packs?admin=true`, { headers })
      ]);
      
      // Combine products and packs
      const allProducts = [
        ...(productsResponse.data.data || []),
        ...(packsResponse.data.data || [])
      ];
      
      setProducts(allProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
            const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
            await axios.delete(`${apiUrl}/products/${productId}`, { headers });
      toast.success('Product deleted successfully!');
      fetchProducts();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      const token = getAuthToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (editingProduct) {
        // Update existing product
            const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
            const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
            await axios.put(`${apiUrl}/products/${editingProduct._id}`, productData, { headers });
        toast.success('Product updated successfully!');
      } else {
        // Create new product
            const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
            const apiUrl = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;
            await axios.post(`${apiUrl}/products`, productData, { headers });
        toast.success('Product created successfully!');
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Failed to save product. Please try again.');
    }
  };

  // Filter products by type and search term
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activeTab === 'products' 
      ? product.productType === 'product' 
      : product.productType === 'pack';
    return matchesSearch && matchesType;
  });

  const productsCount = products.filter(p => p.productType === 'product').length;
  const packsCount = products.filter(p => p.productType === 'pack').length;

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
              Products
            </h1>
            <p
              style={{
                fontSize: '14px',
                color: '#616f89',
                margin: 0,
              }}
            >
              Manage your product catalog, add new items, and update inventory.
            </p>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '24px',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <button
              onClick={() => setActiveTab('products')}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderBottom: activeTab === 'products' ? '2px solid #135bec' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: activeTab === 'products' ? '#135bec' : '#616f89',
                fontSize: '14px',
                fontWeight: activeTab === 'products' ? 600 : 500,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease',
                position: 'relative',
                bottom: '-1px',
              }}
            >
              Products ({productsCount})
            </button>
            <button
              onClick={() => setActiveTab('packs')}
              style={{
                padding: '12px 20px',
                border: 'none',
                borderBottom: activeTab === 'packs' ? '2px solid #135bec' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: activeTab === 'packs' ? '#135bec' : '#616f89',
                fontSize: '14px',
                fontWeight: activeTab === 'packs' ? 600 : 500,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s ease',
                position: 'relative',
                bottom: '-1px',
              }}
            >
              Packs ({packsCount})
            </button>
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
                placeholder={`Search ${activeTab}...`}
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
            <button
              onClick={handleAddProduct}
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
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0f4bc8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#135bec';
              }}
            >
              <Plus size={18} />
              {!isTablet && <span>Add {activeTab === 'products' ? 'Product' : 'Pack'}</span>}
            </button>
          </div>

          {/* Products Table */}
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
            ) : filteredProducts.length === 0 ? (
              <p style={{ color: '#616f89', textAlign: 'center', padding: '40px' }}>
                No {activeTab} found
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
                        Product
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
                        Category
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
                        Price
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
                        Stock
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
                        Status
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
                    {filteredProducts.map((product) => (
                      <tr
                        key={product._id}
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
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                            }}
                          />
                          <span style={{ wordBreak: 'break-word' }}>{product.name}</span>
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#616f89',
                            display: isMobile ? 'none' : 'table-cell',
                          }}
                        >
                          {product.category}
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#111318',
                            fontWeight: 500,
                          }}
                        >
                          ${product.price}
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            fontSize: '14px',
                            color: '#111318',
                            fontWeight: '500',
                          }}
                        >
                          <span
                            style={{
                              color: product.inStock ? '#047857' : '#dc2626',
                              fontWeight: product.inStock ? 500 : 600,
                            }}
                          >
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            display: isTablet ? 'none' : 'table-cell',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.25rem 0.625rem',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: 500,
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              color: '#047857',
                            }}
                          >
                            Active
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '0.8rem 1rem',
                            display: 'flex',
                            gap: '8px',
                          }}
                        >
                          <button
                            onClick={() => handleEditProduct(product)}
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
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(product)}
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
                            title="Delete Product"
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

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct || (isModalOpen ? { productType: activeTab === 'products' ? 'product' : 'pack' } : null)}
        onSave={handleSaveProduct}
      />

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
              Delete Product
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: '#616f89',
                marginBottom: '24px',
              }}
            >
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
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
                onClick={() => handleDeleteProduct(deleteConfirm._id)}
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

export default AdminProducts;
