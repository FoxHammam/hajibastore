import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    oldPrice: '',
    category: '',
    inStock: true,
    bestSeller: false,
    productType: 'product',
    size: [],
    itemsIncluded: [],
    multipleImages: [],
    contentSections: [],
  });

  const [sizeInput, setSizeInput] = useState('');
  const [itemInput, setItemInput] = useState('');

  useEffect(() => {
    if (product && product._id) {
      // Editing existing product
      setFormData({
        name: product.name || '',
        image: product.image || '',
        price: product.price || '',
        oldPrice: product.oldPrice || '',
        category: product.category || '',
        inStock: product.inStock !== undefined ? product.inStock : true,
        bestSeller: product.bestSeller || false,
        productType: product.productType || 'product',
        size: product.size || [],
        itemsIncluded: product.itemsIncluded || [],
        multipleImages: product.multipleImages || [],
        contentSections: product.contentSections || [],
      });
    } else {
      // New product - use productType from prop if provided, otherwise default to 'product'
      const defaultProductType = product?.productType || 'product';
      setFormData({
        name: '',
        image: '',
        price: '',
        oldPrice: '',
        category: '',
        inStock: true,
        bestSeller: false,
        productType: defaultProductType,
        size: [],
        itemsIncluded: [],
        multipleImages: [],
        contentSections: [],
      });
    }
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSize = () => {
    if (sizeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        size: [...prev.size, sizeInput.trim()]
      }));
      setSizeInput('');
    }
  };

  const handleRemoveSize = (index) => {
    setFormData(prev => ({
      ...prev,
      size: prev.size.filter((_, i) => i !== index)
    }));
  };

  const handleAddItem = () => {
    if (itemInput.trim()) {
      setFormData(prev => ({
        ...prev,
        itemsIncluded: [...prev.itemsIncluded, itemInput.trim()]
      }));
      setItemInput('');
    }
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      itemsIncluded: prev.itemsIncluded.filter((_, i) => i !== index)
    }));
  };

  // Image compression function - more aggressive compression
  const compressImage = (file, maxSizeKB = 300) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // More aggressive resizing - max 1200px instead of 1920px
          const maxDimension = 1200;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Start with lower quality and reduce further if needed
          const tryCompress = (q) => {
            canvas.toBlob(
              (blob) => {
                const sizeKB = blob.size / 1024;
                if (sizeKB > maxSizeKB && q > 0.1) {
                  tryCompress(q - 0.1);
                } else {
                  const reader2 = new FileReader();
                  reader2.onload = (e) => resolve(e.target.result);
                  reader2.onerror = reject;
                  reader2.readAsDataURL(blob);
                }
              },
              'image/jpeg',
              q
            );
          };
          // Start with 0.7 quality instead of 0.9 for better compression
          tryCompress(0.7);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle main image upload
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Always compress images to reduce payload size
        const fileSizeKB = file.size / 1024;
        let base64;
        if (fileSizeKB > 200) {
          // Compress if larger than 200KB
          base64 = await compressImage(file, 300);
        } else {
          base64 = await fileToBase64(file);
        }
        setFormData((prev) => ({ ...prev, image: base64 }));
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error converting image:', error);
        toast.error('Failed to upload image. Please try again.');
      }
    }
  };

  // Handle multiple images upload
  const handleMultipleImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      try {
        toast.info(`Uploading ${files.length} image(s)...`);
        const base64Promises = files.map(async (file) => {
          const fileSizeKB = file.size / 1024;
          // Always compress if larger than 200KB
          if (fileSizeKB > 200) {
            return await compressImage(file, 300);
          } else {
            return await fileToBase64(file);
          }
        });
        const base64Images = await Promise.all(base64Promises);
        setFormData((prev) => ({
          ...prev,
          multipleImages: [...prev.multipleImages, ...base64Images],
        }));
        toast.success(`${files.length} image(s) uploaded successfully`);
      } catch (error) {
        console.error('Error converting images:', error);
        toast.error('Failed to upload images. Please try again.');
      }
    }
  };

  // Remove multiple image
  const handleRemoveMultipleImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      multipleImages: prev.multipleImages.filter((_, i) => i !== index),
    }));
  };

  // Add content section
  const addContentSection = () => {
    setFormData((prev) => ({
      ...prev,
      contentSections: [...prev.contentSections, { image: '', description: '' }],
    }));
  };

  // Remove content section
  const removeContentSection = (index) => {
    setFormData((prev) => ({
      ...prev,
      contentSections: prev.contentSections.filter((_, i) => i !== index),
    }));
  };

  // Handle content section change
  const handleContentSectionChange = (index, field, value) => {
    setFormData((prev) => {
      const newSections = [...prev.contentSections];
      newSections[index] = { ...newSections[index], [field]: value };
      return { ...prev, contentSections: newSections };
    });
  };

  // Handle content section image upload
  const handleContentSectionImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const fileSizeKB = file.size / 1024;
        let base64;
        // Always compress if larger than 200KB
        if (fileSizeKB > 200) {
          base64 = await compressImage(file, 300);
        } else {
          base64 = await fileToBase64(file);
        }
        handleContentSectionChange(index, 'image', base64);
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error converting image:', error);
        toast.error('Failed to upload image. Please try again.');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data for submission
    const submitData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      oldPrice: formData.oldPrice ? parseFloat(formData.oldPrice) : undefined,
      productType: formData.productType,
      // Explicitly include multipleImages and contentSections
      multipleImages: formData.multipleImages || [],
      contentSections: formData.contentSections || [],
    };

    // Remove empty fields
    if (!submitData.oldPrice) delete submitData.oldPrice;
    if (submitData.productType === 'product') {
      delete submitData.itemsIncluded;
      if (submitData.size.length === 0) delete submitData.size;
    } else {
      delete submitData.size;
    }
    
    // Don't delete multipleImages and contentSections - always send them (even if empty)
    // The backend will handle empty arrays
    
    // Ensure arrays are always arrays (not undefined)
    if (!Array.isArray(submitData.multipleImages)) {
      submitData.multipleImages = [];
    }
    if (!Array.isArray(submitData.contentSections)) {
      submitData.contentSections = [];
    }

    console.log('Submitting product data:', {
      name: submitData.name,
      productType: submitData.productType,
      multipleImagesCount: submitData.multipleImages?.length || 0,
      contentSectionsCount: submitData.contentSections?.length || 0,
      multipleImages: submitData.multipleImages,
      contentSections: submitData.contentSections
    });

    // Validate that data is being sent
    if (submitData.multipleImages.length > 0) {
      console.log('✅ Multiple images will be sent:', submitData.multipleImages.length);
    } else {
      console.log('⚠️ No multiple images to send');
    }
    
    if (submitData.contentSections.length > 0) {
      console.log('✅ Content sections will be sent:', submitData.contentSections.length);
    } else {
      console.log('⚠️ No content sections to send');
    }

    onSave(submitData);
  };

  if (!isOpen) return null;

  const isPack = formData.productType === 'pack';

  return (
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
      onClick={onClose}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111318' }}>
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
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
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Product Type */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111318', marginBottom: '8px' }}>
              Type
            </label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
              }}
            >
              <option value="product">Product</option>
              <option value="pack">Pack</option>
            </select>
          </div>

          {/* Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111318', marginBottom: '8px' }}>
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
              }}
            />
          </div>

          {/* Main Image Upload */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111318', marginBottom: '8px' }}>
              Main Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageUpload}
              style={{ display: 'none' }}
              id="main-image-upload"
            />
            <label
              htmlFor="main-image-upload"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '12px',
                border: '2px dashed #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#f6f6f8',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#135bec';
                e.currentTarget.style.backgroundColor = '#f0f4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = '#f6f6f8';
              }}
            >
              <Upload size={20} style={{ marginRight: '8px', color: '#616f89' }} />
              <span style={{ fontSize: '14px', color: '#616f89' }}>
                {formData.image ? 'Change Main Image' : 'Upload Main Image'}
              </span>
            </label>
            {formData.image && (
              <div style={{ marginTop: '12px' }}>
                <img
                  src={formData.image}
                  alt="Main preview"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                />
              </div>
            )}
          </div>

          {/* Price */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111318', marginBottom: '8px' }}>
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
              }}
            />
          </div>

          {/* Old Price */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111318', marginBottom: '8px' }}>
              Old Price (Optional)
            </label>
            <input
              type="number"
              name="oldPrice"
              value={formData.oldPrice}
              onChange={handleChange}
              min="0"
              step="0.01"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
              }}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111318', marginBottom: '8px' }}>
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
              }}
            />
          </div>

          {/* Size (Products only) */}
          {!isPack && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111318', marginBottom: '8px' }}>
                Sizes
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
                  placeholder="Add size"
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSize}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#135bec',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.size.map((size, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      backgroundColor: '#f6f6f8',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontSize: '16px',
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Items Included (Packs only) */}
          {isPack && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#111318', marginBottom: '8px' }}>
                Items Included *
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={itemInput}
                  onChange={(e) => setItemInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem())}
                  placeholder="Add item"
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddItem}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: '#135bec',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formData.itemsIncluded.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: '#f6f6f8',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#dc2626',
                        cursor: 'pointer',
                        fontSize: '16px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Checkboxes */}
          <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#111318', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              In Stock
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#111318', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              Best Seller
            </label>
          </div>

          {/* Multiple Images (Sub Images) */}
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f6f6f8', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: '#111318' }}>
                Sub Images (Additional Images)
              </label>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleMultipleImagesUpload}
              style={{ display: 'none' }}
              id="multiple-images-upload"
            />
            <label
              htmlFor="multiple-images-upload"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '10px',
                border: '2px dashed #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                marginBottom: '12px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#135bec';
                e.currentTarget.style.backgroundColor = '#f0f4ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <Upload size={18} style={{ marginRight: '8px', color: '#616f89' }} />
              <span style={{ fontSize: '14px', color: '#616f89' }}>Upload Multiple Images</span>
            </label>
            {formData.multipleImages.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                {formData.multipleImages.map((img, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={img}
                      alt={`Sub image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMultipleImage(index)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(220, 38, 38, 0.9)',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content Sections */}
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f6f6f8', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: '#111318' }}>
                Content Sections (Shown in Product Details)
              </label>
              <button
                type="button"
                onClick={addContentSection}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  backgroundColor: '#135bec',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
                Add Section
              </button>
            </div>
            {formData.contentSections.map((section, index) => (
              <div key={index} style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#111318' }}>Section {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeContentSection(index)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(220, 38, 38, 0.1)',
                      color: '#dc2626',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#111318', marginBottom: '6px' }}>
                    Description
                  </label>
                  <textarea
                    value={section.description || ''}
                    onChange={(e) => handleContentSectionChange(index, 'description', e.target.value)}
                    rows={3}
                    placeholder="Enter description for this section..."
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontFamily: 'Inter, sans-serif',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#111318', marginBottom: '6px' }}>
                    Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleContentSectionImageUpload(index, e)}
                    style={{ display: 'none' }}
                    id={`content-section-image-${index}`}
                  />
                  <label
                    htmlFor={`content-section-image-${index}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '8px',
                      border: '2px dashed #e2e8f0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: section.image ? '#f0f4ff' : '#ffffff',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#135bec';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <Upload size={16} style={{ marginRight: '6px', color: '#616f89' }} />
                    <span style={{ fontSize: '13px', color: '#616f89' }}>
                      {section.image ? 'Change Image' : 'Upload Image'}
                    </span>
                  </label>
                  {section.image && (
                    <div style={{ marginTop: '8px' }}>
                      <img
                        src={section.image}
                        alt={`Content section ${index + 1}`}
                        style={{
                          width: '100%',
                          maxHeight: '150px',
                          objectFit: 'contain',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            {formData.contentSections.length === 0 && (
              <p style={{ fontSize: '13px', color: '#616f89', textAlign: 'center', padding: '20px' }}>
                No content sections added. Click "Add Section" to create one.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onClose}
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
              type="submit"
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
              {product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

