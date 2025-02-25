import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Plus } from 'lucide-react';
import Allapi from '../../common/index';

function PromotionsAdmin() {
  const [promotions, setPromotions] = useState([]);
  const [type, setType] = useState('image');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch(Allapi.getPromotions.url);
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'GRDNATURALS');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/diseea76x/image/upload',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalLink = link;
      if (type === 'image' && file) {
        finalLink = await uploadToCloudinary(file);
      }
      const response = await fetch(Allapi.createPromotion.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, link: finalLink }),
      });

      if (response.ok) {
        setType('image');
        setLink('');
        setFile(null);
        setImagePreview(null);
        fetchPromotions();
      }
    } catch (error) {
      console.error('Error creating promotion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(Allapi.deletePromotion.url(id), {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
      });
      fetchPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-green-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-grey-500">Promotions Management</h1>

        {/* Create Form */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Create New Promotion</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>

            {type === 'image' ? (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload Image
                </label>
                <div className="flex flex-col items-center justify-center w-full p-4 border-2 border-gray-300 border-dashed rounded-md">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  {imagePreview ? (
                    <div className="w-full space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover w-full h-48 rounded-lg"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            setImagePreview(null);
                          }}
                          className="px-3 py-1 text-sm text-red-600 rounded-full bg-red-50 hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="w-8 h-8 mb-2 text-green-600" />
                      <span className="text-sm text-gray-600">
                        Click to upload image
                      </span>
                    </label>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 ">
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Paste YouTube video URL here"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full px-4 py-2 text-white bg-green-700 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Promotion
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Promotions */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Existing Promotions</h2>
          
          <div className="space-y-6">
            {/* Images */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-700">Images</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
                {promotions.filter(p => p.type === 'image').map((promotion) => (
                  <div key={promotion._id} className="relative group">
                    <img
                      src={promotion.link}
                      alt="Promotion"
                      className="object-cover w-full h-48 rounded-lg"
                    />
                    <button
                      onClick={() => handleDelete(promotion._id)}
                      className="absolute p-2 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-700">Videos</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {promotions.filter(p => p.type === 'video').map((promotion) => (
                  <div key={promotion._id} className="relative group">
                    <iframe
                      src={promotion.link.replace('watch?v=', 'embed/')}
                      title="YouTube video"
                      className="w-full rounded-lg aspect-video"
                      allowFullScreen
                    />
                    <button
                      onClick={() => handleDelete(promotion._id)}
                      className="absolute p-2 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionsAdmin;