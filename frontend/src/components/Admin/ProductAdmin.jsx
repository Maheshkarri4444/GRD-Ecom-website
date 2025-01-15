import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Upload, Image , ChevronLeft, ChevronRight } from 'lucide-react';
import Allapi from '../../common';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  const [previewUrls, setPreviewUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    mrp: '',
    salePrice: '',
    description: '',
    category: '',
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

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
        method:"GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
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
    // Remove from previewUrls and update formData.images to ensure sync
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: prevFormData.images.filter((_, i) => i !== index),
    }));
  }
};



  const fetchCategories = async () => {
    try {
      const response = await fetch(Allapi.getAllCategories.url,{
        method:"GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const filteredCategories = data.categories.filter(category => category.name !== "Non Product Category");
        // console.log("categories are : ",filteredCategories)
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
      console.log("cloudinary data: ",data)
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
      // Upload only new images to Cloudinary
      const uploadedImageUrls = await Promise.all(
        imageFiles.map((file) => uploadToCloudinary(file))
      );
  
      const updatedProductData = {
        ...formData,
        images: [...formData.images, ...uploadedImageUrls], // Use only remaining images
      };
  
      const url = isEditing
        ? Allapi.editProduct.url(editingProduct._id)
        : Allapi.addProduct.url;
  
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedProductData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        await fetchProducts();
        resetForm();
      } else {
        setError(data.message);
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

      if (data.success) {
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
      images: product.images
    });
  
    // Populate preview URLs and image files with existing images
    setPreviewUrls(product.images);
    setImageFiles([]); // Reset to avoid confusion with newly uploaded images
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      mrp: '',
      salePrice: '',
      description: '',
      category: '',
      images: [],
    });
    setPreviewUrls([]);
    setImageFiles([]);
    setIsEditing(false);
    setEditingProduct(null);
  };
  useEffect(() => {
    const initialIndices = {};
    products.forEach(product => {
      initialIndices[product._id] = 0;
    });
    setCurrentImageIndex(initialIndices);
  }, [products]); 

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
          </div>
        ))}
      </div>
    </div>
  )}

  {/* New Preview Images Section */}
  {previewUrls.length > 0 && (
    <div className="mt-4">
      <h4 className="mb-2 text-sm font-medium text-gray-700">Preview Images</h4>
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
            className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                    src={product.images[currentImageIndex[product._id]]}
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
                <div className="flex justify-end gap-2">
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsAdmin;