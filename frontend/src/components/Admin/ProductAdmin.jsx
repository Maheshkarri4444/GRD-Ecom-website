import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Upload, Image, ChevronLeft, ChevronRight } from 'lucide-react';
import Allapi from '../../common';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blobs, setBlobs] = useState([]);
  const [displayingBlobs, setDisplayingBlobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBlob, setSelectedBlob] = useState(null);

  const [previewUrls, setPreviewUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    mrp: '',
    salePrice: '',
    description: '',
    category: '',
    blobId: '',
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchDisplayingBlobs();
  }, []);

  // Fetch blobs when category changes
  useEffect(() => {
    if (formData.category) {
      fetchBlobsByCategory(formData.category);
    }
  }, [formData.category]);

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setImageFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const removePreviewImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const nextImage = (productId) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] + 1) % products.find(p => p._id === productId).images.length
    }));
  };

  const prevImage = (productId) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] - 1 + products.find(p => p._id === productId).images.length) % products.find(p => p._id === productId).images.length
    }));
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(Allapi.getAllProducts.url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        // Initialize image indices
        const initialIndices = {};
        data.products.forEach(product => {
          initialIndices[product._id] = 0;
        });
        setCurrentImageIndex(initialIndices);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchDisplayingBlobs = async()=>{
    try {
      const response = await fetch(Allapi.getAllBlobs.url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        // console.log("displaying blobs: ",data)
        setDisplayingBlobs(data);
      }
    }catch(err){
      setError('Failed to fetch blobs');
    }

  }
  const fetchBlobsByCategory = async (categoryId) => {
    try {
      const response = await fetch(Allapi.getAllBlobs.url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        const filteredBlobs = data.filter(blob => blob.categoryId === categoryId);
        setBlobs(filteredBlobs);
      }
    } catch (err) {
      setError('Failed to fetch blobs');
    }
  };

  // Remove image from formData.images
  const removeImage = (index, isExistingImage) => {
    if (isExistingImage) {
      // Remove from existing images
      setFormData((prevFormData) => ({
        ...prevFormData,
        images: prevFormData.images.filter((_, i) => i !== index),
      }));
    } else {
      // Remove from previewUrls and imageFiles
      setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
      setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(Allapi.getAllCategories.url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const excludedCategories = ["Non Product Category", "Protocols"];
        const filteredCategories = data.categories.filter(  category => !excludedCategories.includes(category.name));
        setCategories(filteredCategories);
      }
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  // Handle image upload to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'grd-website-ecommerce');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dcpxmuyvp/image/upload`,
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
    setError(null);

    try {
      // Upload new images to Cloudinary
      const uploadedImageUrls = await Promise.all(
        imageFiles.map((file) => uploadToCloudinary(file))
      );

      const productData = {
        ...formData,
        images: [...(formData.images || []), ...uploadedImageUrls],
      };

      const url = isEditing
        ? `${Allapi.editProduct.url}/${editingProduct._id}`
        : Allapi.addProduct.url;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchProducts();
        resetForm();
      } else {
        setError(data.message || 'Failed to save product');
      }
    } catch (err) {
      setError('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(Allapi.deleteProduct.url(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setProducts(products.filter(product => product._id !== id));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  // Handle edit mode
  const handleEdit = (product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setFormData({
      name: product.name,
      mrp: product.mrp,
      salePrice: product.salePrice,
      description: product.description,
      category: product.category._id,
      blobId: product.blobId._id || '',
      images: product.images || []
    });
    setPreviewUrls([]);
    setImageFiles([]);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      mrp: '',
      salePrice: '',
      description: '',
      category: '',
      blobId: '',
      images: []
    });
    setPreviewUrls([]);
    setImageFiles([]);
    setIsEditing(false);
    setEditingProduct(null);
    setError(null);
  };

  // Modal Component for ViewFullBlob
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
            <div className="relative z-30 mb-6 aspect-video">
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
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Products Management</h2>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="block w-full mt-1 bg-white border border-green-400 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
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

          {formData.category && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Associated Blob</label>
              <select
                value={formData.blobId}
                onChange={(e) => setFormData({...formData, blobId: e.target.value})}
                className="block w-full mt-1 bg-white border border-green-400 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
                
              >
                <option value="">Select Blob</option>
                {blobs.map(blob => (
                  <option key={blob._id} value={blob._id}>
                    {blob.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">MRP</label>
            <input
              type="number"
              value={formData.mrp}
              onChange={(e) => setFormData({...formData, mrp: e.target.value})}
              className="block w-full mt-1 bg-white border border-green-400 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sale Price</label>
            <input
              type="number"
              value={formData.salePrice}
              onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
              className="block w-full mt-1 bg-white border border-green-400 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className="block w-full mt-1 bg-white border border-green-400 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Images</label>
          
          {/* Preview Section */}
          <div className="mb-4">
            {/* Existing Images Section */}
            {formData.images.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">Existing Images</h4>
                <div className="grid grid-cols-4 gap-4">
                  {formData.images.map((url, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <img
                        src={url}
                        alt={`Existing Image ${index + 1}`}
                        className="object-cover w-full h-32 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, true)}
                        className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Preview Images Section */}
            {previewUrls.length > 0 && (
              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">New Images</h4>
                <div className="grid grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={`preview-${index}`} className="relative">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-32 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, false)}
                        className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            disabled={loading}
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isEditing ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
          {error}
        </div>
      )}

      {/* Products List */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Products List</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product._id} className="overflow-hidden transition-shadow border rounded-lg shadow-sm hover:shadow-md">
              {product.images.length > 0 && (
                <div className="relative">
                  <img
                    src={product.images[currentImageIndex[product._id] || 0]}
                    alt={product.name}
                    className="object-cover w-full h-48"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => prevImage(product._id)}
                        className="absolute p-1 text-white -translate-y-1/2 rounded-full left-2 top-1/2 bg-black/50 hover:bg-black/70"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => nextImage(product._id)}
                        className="absolute p-1 text-white -translate-y-1/2 rounded-full right-2 top-1/2 bg-black/50 hover:bg-black/70"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute flex gap-1 -translate-x-1/2 bottom-2 left-1/2">
                        {product.images.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentImageIndex[product._id]
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
                <h4 className="mb-2 text-lg font-semibold">{product.name}</h4>
                <p className="mb-2 text-sm text-gray-600">{product.category.name}</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 line-through">₹{product.mrp}</span>
                  <span className="font-semibold text-green-600">₹{product.salePrice}</span>
                </div>
                <div className="flex items-center justify-between">
                  {product.blobId && (
                    <button
                      onClick={() => {
                        console.log("blobs are",displayingBlobs);
                        console.log("product blob id: ", product.blobId._id);
                        const blob = displayingBlobs.find(b => b._id === product.blobId._id);                        
                        if (blob) {
                          setSelectedBlob(blob);
                          setShowModal(true);
                        }
                      }}
                      className="px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                      View Full Blob
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-1 text-gray-500 hover:text-green-600"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
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

export default ProductsAdmin;