import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, X, Upload } from 'lucide-react';
import { messageAPI } from '../services/api';
import { toast } from 'react-toastify';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result);
          if (newImages.length === files.length) {
            setImages((prev) => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const compressImage = (base64, maxSize = 500000) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1920;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        let compressed = canvas.toDataURL('image/jpeg', quality);

        while (compressed.length > maxSize && quality > 0.1) {
          quality -= 0.1;
          compressed = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(compressed);
      };
      img.onerror = () => resolve(base64);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Compress images if needed
      const compressedImages = await Promise.all(
        images.map((img) => compressImage(img))
      );

      const messageData = {
        ...formData,
        images: compressedImages
      };

      await messageAPI.create(messageData);
      toast.success('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setImages([]);
    } catch (error) {
      console.error('Error submitting message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-[#dcfce7] to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-[#1f2937] mb-4">Get in Touch</h1>
          <p className="text-lg text-[#4b5563]">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-[#1f2937] mb-8">Contact Information</h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="bg-[#dcfce7] rounded-lg p-3 flex-shrink-0">
                    <Mail className="text-[#4ade80]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1f2937] mb-1">Email Us</h3>
                    <p className="text-[#4b5563]">support@hajibastore.com</p>
                    <p className="text-[#4b5563]">info@hajibastore.com</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="bg-[#dcfce7] rounded-lg p-3 flex-shrink-0">
                    <Phone className="text-[#4ade80]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1f2937] mb-1">Call Us</h3>
                    <p className="text-[#4b5563]">+1 (555) 123-4567</p>
                    <p className="text-[#4b5563]">Mon - Fri: 9AM - 6PM</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="bg-[#dcfce7] rounded-lg p-3 flex-shrink-0">
                    <MapPin className="text-[#4ade80]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1f2937] mb-1">Visit Us</h3>
                    <p className="text-[#4b5563]">1234 Commerce Street</p>
                    <p className="text-[#4b5563]">New York, NY 10001</p>
                    <p className="text-[#4b5563]">United States</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4">
                  <div className="bg-[#dcfce7] rounded-lg p-3 flex-shrink-0">
                    <Clock className="text-[#4ade80]" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1f2937] mb-1">Business Hours</h3>
                    <p className="text-[#4b5563]">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-[#4b5563]">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-[#4b5563]">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-md border border-[#e5e7eb] p-8">
              <h2 className="text-2xl font-bold text-[#1f2937] mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm text-[#4b5563] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-[#e5e7eb] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm text-[#4b5563] mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-[#e5e7eb] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm text-[#4b5563] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-[#e5e7eb] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent"
                    placeholder="How can we help?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm text-[#4b5563] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-white border border-[#e5e7eb] rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent resize-none"
                    placeholder="Your message here..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label htmlFor="images" className="block text-sm text-[#4b5563] mb-2">
                    Attach Images (Optional)
                  </label>
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="images"
                    className="flex items-center justify-center w-full border-2 border-dashed border-[#e5e7eb] rounded-lg px-4 py-3 cursor-pointer hover:border-[#4ade80] transition-colors duration-200"
                  >
                    <Upload size={20} className="text-[#4b5563] mr-2" />
                    <span className="text-sm text-[#4b5563]">Upload Images</span>
                  </label>
                  
                  {/* Image Preview */}
                  {images.length > 0 && (
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {images.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-[#e5e7eb]"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#4ade80] hover:bg-[#3dd16d] disabled:bg-[#9ca3af] disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center shadow-lg"
                >
                  <Send size={18} className="mr-2" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-[#f3f4f6]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#1f2937] mb-8 text-center">Find Us on Map</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-96 bg-[#e5e7eb] flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-[#9ca3af] mx-auto mb-4" />
                <p className="text-[#4b5563]">1234 Commerce Street, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;