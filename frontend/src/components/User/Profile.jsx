import React, { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import { User, Lock, LogOut, Save, X, Edit2 ,Home } from 'lucide-react';
import { useMyContext } from '../../utils/MyContext';
import Allapi from '../../common';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useMyContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    emailAddress: user?.emailAddress || '',
    password: '',
    address: {
      doorNo: user?.address?.doorNo || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      pincode: user?.address?.pincode || '',
      state: user?.address?.state || ''
    }
  });

  console.log("user: ", user);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(Allapi.editPorfile.url, {
        method: Allapi.editPorfile.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Profile updated successfully!');
        updateUser(data.user);
        setIsEditing(false);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(Allapi.logout.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.removeItem('token');
      updateUser(null);
      navigate('/login');
    } catch (err) {
      setError('Failed to logout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
        <Link 
          to="/"
          className="inline-flex items-center px-4 py-2 mb-4 text-sm font-medium text-green-700 bg-white rounded-md shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      <div className="max-w-3xl mx-auto overflow-hidden bg-white rounded-lg shadow-md">
        <div className="px-4 py-5 bg-green-700 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="w-6 h-6 text-white" />
              <h3 className="ml-2 text-lg font-medium text-white">Profile Information</h3>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-white border border-transparent rounded-md hover:bg-green-50"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-1" /> Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-1" /> Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {(error || success) && (
          <div className={`px-4 py-3 ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {error || success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="block w-full mt-1 text-gray-700 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                disabled={!isEditing}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 bg-gray-50"
              />
            </div>

            {isEditing && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm bg-gray-50 focus:border-green-500 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <Lock className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              <h4 className="mb-4 text-lg font-medium text-gray-700">Address</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Door No</label>
                  <input
                    type="text"
                    name="address.doorNo"
                    value={formData.address.doorNo}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Street</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Pincode</label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring-green-500 bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-700 border border-transparent rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Save className="w-4 h-4 mr-1" />
                Save Changes
              </button>
            </div>
          )}
        </form>

        <div className="px-4 py-4 border-t border-gray-200 sm:px-6 bg-gray-50">
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Profile;