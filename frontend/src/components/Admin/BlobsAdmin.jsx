
import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload, ChevronLeft, ChevronRight} from 'lucide-react';
import Allapi from '../../common';

const BlobsAdmin = () => {
  const [blobs, setBlobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingBlob, setEditingBlob] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [selectedBlob, setSelectedBlob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    images: [],
    content: [{ heading: '', paragraph: '' }]
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchBlobs();
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(Allapi.getAllCategories.url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      // console.log("categories in blob",data)
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  const fetchBlobs = async () => {
    try {
      const response = await fetch(Allapi.getAllBlobs.url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        const filteredBlobs = data.filter(blob => blob.categoryId === selectedCategory);
        setBlobs(filteredBlobs);
        
        // Initialize image indices
        const initialIndices = {};
        filteredBlobs.forEach(blob => {
          initialIndices[blob._id] = 0;
        });
        setCurrentImageIndex(initialIndices);
      }
    } catch (err) {
      setError('Failed to fetch blobs');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setImageFiles(prev => [...prev, ...files]);
    
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removePreviewImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'GRDNATURALS');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/diseea76x/image/upload`,
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

  const handleContentChange = (index, field, value) => {
    const newContent = [...formData.content];
    newContent[index] = { ...newContent[index], [field]: value };
    setFormData({ ...formData, content: newContent });
  };

  const addContentSection = () => {
    setFormData({
      ...formData,
      content: [...formData.content, { heading: '', paragraph: '' }]
    });
  };

  const removeContentSection = (index) => {
    const newContent = formData.content.filter((_, i) => i !== index);
    setFormData({ ...formData, content: newContent });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImageUrls = await Promise.all(
        imageFiles.map((file) => uploadToCloudinary(file))
      );

      const blobData = {
        ...formData,
        images: [...(formData.images || []), ...uploadedImageUrls],
      };

      const url = isEditing ? `${Allapi.updateBlob.url}/${editingBlob._id}` : Allapi.createBlob.url;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(blobData)
      });

      if (response.ok) {
        await fetchBlobs();
        resetForm();
      }
    } catch (err) {
      setError('Failed to save blob');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blob?')) return;

    try {
      const response = await fetch(`${Allapi.deleteBlob.url}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setBlobs(blobs.filter(blob => blob._id !== id));
      }
    } catch (err) {
      setError('Failed to delete blob');
    }
  };

  const handleEdit = (blob) => {
    setIsEditing(true);
    setEditingBlob(blob);
    setFormData({
      categoryId: blob.categoryId,
      title: blob.title,
      images: blob.images,
      content: blob.content
    });
    setPreviewUrls(blob.images);
    setImageFiles([]);
  };

  const resetForm = () => {
    setFormData({
      categoryId: selectedCategory,
      title: '',
      images: [],
      content: [{ heading: '', paragraph: '' }]
    });
    setPreviewUrls([]);
    setImageFiles([]);
    setIsEditing(false);
    setEditingBlob(null);
  };

  const nextImage = (blobId) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [blobId]: (prev[blobId] + 1) % blobs.find(b => b._id === blobId).images.length
    }));
  };

  const prevImage = (blobId) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [blobId]: (prev[blobId] - 1 + blobs.find(b => b._id === blobId).images.length) % blobs.find(b => b._id === blobId).images.length
    }));
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const Modal = ({ blob, onClose }) => {
    const [modalImageIndex, setModalImageIndex] = useState(0);

    const nextModalImage = () => {
      setModalImageIndex((prev) => (prev + 1) % blob.images.length);
    };

    const prevModalImage = () => {
      setModalImageIndex((prev) => (prev - 1 + blob.images.length) % blob.images.length);
    };

    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-full max-w-3xl p-6 mx-4 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute z-50 p-1 text-gray-500 transition-colors duration-150 rounded-full size-10 hover:bg-gray-100 top-4 right-4"
          >
            ✕
          </button>
          
          {/* Image Carousel */}
          {blob.images.length > 0 && (
            <div className="relative mb-6 aspect-video">
              <img
                src={blob.images[modalImageIndex]}
                alt={blob.title}
                className="object-contain w-full h-full rounded-lg"
              />
              {blob.images.length > 1 && (
                <>
                  <button
                    onClick={prevModalImage}
                    className="absolute p-2 text-white -translate-y-1/2 rounded-full left-2 top-1/2 bg-black/50 hover:bg-black/70"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextModalImage}
                    className="absolute p-2 text-white -translate-y-1/2 rounded-full right-2 top-1/2 bg-black/50 hover:bg-black/70"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute flex gap-2 -translate-x-1/2 bottom-4 left-1/2">
                    {blob.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === modalImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <h2 className="mb-4 text-2xl font-bold text-gray-800">{blob.title}</h2>
          
          <div className="space-y-6">
            {blob.content.map((section, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50">
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  {section.heading}
                </h3>
                <p className="text-gray-600 whitespace-pre-line">{section.paragraph}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Blobs Management</h2>

      {/* Category Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Select Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setFormData(prev => ({ ...prev, categoryId: e.target.value }));
          }}
          className="block w-full mt-1 bg-white border border-green-400 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
          required
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          {/* Title */}
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

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Images</label>
            
            {/* Preview Section */}
            <div className="mb-4">
              <div className="grid grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="object-cover w-full h-32 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePreviewImage(index)}
                      className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Section */}
            <div className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative font-medium text-green-600 bg-white rounded-md cursor-pointer hover:text-green-500">
                    <span>Upload files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Content Sections</label>
              <button
                type="button"
                onClick={addContentSection}
                className="flex items-center px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                <Plus size={16} className="mr-1" /> Add Section
              </button>
            </div>

            {formData.content.map((section, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow">
                <div className="flex justify-end mb-2">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeContentSection(index)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={section.heading}
                    onChange={(e) => handleContentChange(index, 'heading', e.target.value)}
                    placeholder="Section Heading"
                    className="block w-full mt-1 bg-white border border-green-400 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                  <textarea
                    value={section.paragraph}
                    onChange={(e) => handleContentChange(index, 'paragraph', e.target.value)}
                    placeholder="Section Content"
                    rows={4}
                    className="block w-full mt-1 bg-white border border-green-400 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2">
            {isEditing && (
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
              {isEditing ? 'Update Blob' : 'Add Blob'}
            </button>
          </div>
        </form>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
          {error}
        </div>
      )}

      {/* Blobs List */}
      {selectedCategory && (
        <div className="mt-8 ">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Blobs List</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blobs.map((blob) => (
              <div key={blob._id} className="overflow-hidden transition-shadow border rounded-lg shadow-sm hover:shadow-md">
                {blob.images.length > 0 && (
                  <div className="relative transition-transform duration-500 ease-in-out">
                    <img
                      src={blob.images[currentImageIndex[blob._id]]}
                      alt={blob.title}
                      className="object-cover w-full h-48"
                    />
                    {blob.images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(blob._id)}
                          className="absolute p-1 text-white -translate-y-1/2 rounded-full left-2 top-1/2 bg-black/50 hover:bg-black/70"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => nextImage(blob._id)}
                          className="absolute p-1 text-white -translate-y-1/2 rounded-full right-2 top-1/2 bg-black/50 hover:bg-black/70"
                        >
                          <ChevronRight size={20} />
                        </button>
                        <div className="absolute flex gap-1 -translate-x-1/2 bottom-2 left-1/2">
                          {blob.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                index === currentImageIndex[blob._id]
                                  ? 'bg-white'
                                  : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <h4 className="mb-2 text-lg font-semibold">{blob.title}</h4>
                  {blob.content.length > 0 && (
                    <div className="p-2 mb-4 rounded bg-gray-50">
                      <h5 className="font-medium">{blob.content[0].heading}</h5>
                      <p className="text-sm text-gray-600">
                        {truncateText(blob.content[0].paragraph, 100)}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => {
                        setSelectedBlob(blob);
                        setShowModal(true);
                      }}
                      className="px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                      View Full Blob
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(blob)}
                        className="p-1 text-gray-500 hover:text-green-600"
                      >
                        <Pencil size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(blob._id)}
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedBlob && (
        <Modal
          blob={selectedBlob}
          onClose={() => {
            setShowModal(false);
            setSelectedBlob(null);
          }}
        />
      )}
    </div>
  );
};

export default BlobsAdmin;