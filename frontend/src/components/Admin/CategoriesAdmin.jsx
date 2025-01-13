import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import Allapi from '../../common';

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(null); // loading for editing a category
  const [deleteLoading, setDeleteLoading] = useState(null); // loading for deleting a category
  const [error, setError] = useState(null);

  // Fetch all categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(Allapi.getAllCategories.url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.categories);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setAddLoading(true);
    try {
      const response = await fetch(Allapi.addCategory.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: newCategory })
      });
      const data = await response.json();

      if (data.success) {
        setCategories([...categories, data.category]);
        setNewCategory('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to add category');
    } finally {
      setAddLoading(false);
    }
  };

  // Edit category
  const handleEditCategory = async (id, newName) => {
    setEditLoading(id);
    try {
      const response = await fetch(Allapi.editCategory.url(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: newName })
      });
      const data = await response.json();

      if (data.success) {
        setCategories(categories.map(cat => 
          cat._id === id ? data.category : cat
        ));
        setEditingCategory(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to update category');
    } finally {
      setEditLoading(null);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    setDeleteLoading(id);
    try {
      const response = await fetch(Allapi.deleteCategory.url(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setCategories(categories.filter(cat => cat._id !== id));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to delete category');
    } finally {
      setDeleteLoading(null);
    }
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
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Categories Management</h2>
      
      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category name"
            className="flex-1 px-4 py-2 text-gray-900 bg-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {addLoading ? (
              <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
            ) : (
              <Plus size={20} />
            )}
            Add Category
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
          {error}
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-md">
        {categories.length === 0 ? (
          <p className="py-4 text-center text-gray-500">No categories found</p>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div
                key={category._id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              >
{editingCategory === category._id ? (
  <div className="flex items-center flex-1 gap-2">
    <input
      type="text"
      id={`category-input-${category._id}`} // Added id here
      defaultValue={category.name}
      className="flex-1 px-3 py-1 text-green-100 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 "
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          handleEditCategory(category._id, e.target.value);
        }
      }}
    />
    <button
      onClick={() => setEditingCategory(null)}
      className="p-1 text-gray-500 hover:text-gray-700"
    >
      <X size={20} />
    </button>
    <button
      onClick={() => handleEditCategory(category._id, document.getElementById(`category-input-${category._id}`).value)}
      className="p-1 text-green-600 hover:text-green-700"
    >
      {editLoading === category._id ? (
        <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
      ) : (
        <Check size={20} />
      )}
    </button>
  </div>
) : (
  <>
    <span className="text-gray-700">{category.name}</span>
    <div className="flex items-center gap-2">
      <button
        onClick={() => setEditingCategory(category._id)}
        className="p-1 text-gray-500 hover:text-green-600"
      >
        <Pencil size={20} />
      </button>
      <button
        onClick={() => handleDeleteCategory(category._id)}
        className="p-1 text-gray-500 hover:text-red-600"
      >
        {deleteLoading === category._id ? (
          <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
        ) : (
          <Trash2 size={20} />
        )}
      </button>
    </div>
  </>
)}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesAdmin;
