import React, { useEffect, useState } from 'react';
import { UserCog, UserMinus, Filter } from 'lucide-react';
import Allapi from '../../common';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(Allapi.getAllUsers.url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      // console.log("data get users",response)
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAssignAdmin = async (userId) => {
    try {
      const response = await fetch(`${Allapi.assignAdmin.url}/${userId}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to assign admin role');
      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign admin');
    }
  };

  const handleRemoveAdmin = async (userId) => {
    try {
      const response = await fetch(`${Allapi.removeAdmin.url}/${userId}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to remove admin role');
      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove admin');
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'users') return user.role === 'user';
    if (filter === 'admins') return user.role === 'admin';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-green-50">
        <div className="text-center text-green-800">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-green-50">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-green-50">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-green-800">User Management</h1>
          <div className="relative inline-block">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
              <Filter className="w-5 h-5 text-green-600" />
              <select
                className="text-green-700 bg-transparent border-none focus:ring-0"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="users">Users Only</option>
                <option value="admins">Admins Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-green-200">
            <thead className="bg-green-100">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-green-700 uppercase">Name</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-green-700 uppercase">Email</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-green-700 uppercase">Phone</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-green-700 uppercase">Role</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-green-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-green-100">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="transition-colors hover:bg-green-50">
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{user.emailAddress}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{user.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    {user.role === 'admin' ? (
                      <button
                        onClick={() => handleRemoveAdmin(user._id)}
                        className="flex items-center gap-2 px-3 py-1 text-red-600 transition-colors rounded-md hover:text-red-900 bg-red-50 hover:bg-red-100"
                      >
                        <UserMinus className="w-4 h-4" />
                        Remove Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAssignAdmin(user._id)}
                        className="flex items-center gap-2 px-3 py-1 text-green-600 transition-colors rounded-md hover:text-green-900 bg-green-50 hover:bg-green-100"
                      >
                        <UserCog className="w-4 h-4" />
                        Assign Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersAdmin;