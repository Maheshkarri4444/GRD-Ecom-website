import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload } from 'lucide-react';
import Allapi from '../../common';

const BannersAdmin = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    banner: ''
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const response = await fetch(Allapi.getAllBanners.url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setBanners(data.banners);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'grd-website-ecommerce'); // Replace with your Cloudinary upload preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dcpxmuyvp/image/upload`, // Replace with your Cloudinary cloud name
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      throw new Error('Failed to upload image');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageUrl = formData.banner;

      // Upload new image if selected
      if (imageFile) {
        uploadedImageUrl = await uploadToCloudinary(imageFile);
      }

      const updatedBannerData = {
        ...formData,
        banner: uploadedImageUrl
      };

      const url = editingBanner ? Allapi.editBanner.url(editingBanner._id) : Allapi.addBanner.url;

      const response = await fetch(url, {
        method: editingBanner ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedBannerData)
      });

      const data = await response.json();

      if (data.success) {
        await fetchBanners();
        resetForm();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to save banner');
    } finally {
      setLoading(false);
    }
  };

  // Handle banner deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(Allapi.deleteBanner.url(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setBanners(banners.filter(banner => banner._id !== id));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete banner');
    }
  };

  // Handle edit mode
  const handleEdit = (banner) => {
    setEditingBanner(banner);

    setFormData({
      title: banner.title,
      description: banner.description,
      banner: banner.banner
    });

    setPreviewUrl(banner.banner);
    setImageFile(null); // Reset file input for new image
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      banner: ''
    });
    setPreviewUrl('');
    setImageFile(null);
    setEditingBanner(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-b-2 border-green-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md bg-green-50">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Banners Management</h2>

      {/* Banner Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="block w-full mt-1 bg-white border border-green-400 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="block w-full mt-1 bg-white border border-green-400 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Banner Image</label>

          {/* Preview Section */}
          {previewUrl && (
            <div className="mb-4">
              <img src={previewUrl} alt="Banner Preview" className="object-cover w-full h-32 rounded-lg" />
              <button
                type="button"
                onClick={() => setPreviewUrl('')}
                className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Upload Section */}
          <div className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label className="relative font-medium text-green-600 bg-white rounded-md cursor-pointer hover:text-green-500">
                  <span>Upload files</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setImageFile(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {editingBanner && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {editingBanner ? 'Update Banner' : 'Add Banner'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
          {error}
        </div>
      )}

      {/* Banners List */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Banners List</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <div key={banner._id} className="overflow-hidden transition-shadow border rounded-lg shadow-sm hover:shadow-md">
              {banner.image && (
                <div className="relative">
                  <img
                    src={banner.banner}
                    alt={banner.title}
                    className="object-cover w-full h-48"
                  />
                </div>
              )}
              <div className="p-4">
                <h4 className="mb-2 text-lg font-semibold">{banner.title}</h4>
                <p className="mb-2 text-sm text-gray-600">{banner.description}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="p-1 text-gray-500 hover:text-green-600"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannersAdmin;
