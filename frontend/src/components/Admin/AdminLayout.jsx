import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  Users, 
  Droplets, 
  Image, 
  BarChart3, 
  ChevronLeft,
  Menu,
  Grid,
  LogOut,
  GalleryHorizontalEnd
} from 'lucide-react';
import grdcirclelogo from "../../assets/logos/grdlogo.png";
import Allapi from "../../common";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

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
      navigate('/login');
    } catch (err) {
      setError('Failed to logout. Please try again.');
    }
  };

  const menuItems = [
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/categories', icon: Grid, label: 'Categories' },
    { path: '/admin/promotions', icon: GalleryHorizontalEnd, label: 'Gallery' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/blobs', icon: Droplets, label: 'Blobs' },
    { path: '/admin/banners', icon: Image, label: 'Banners' },
    { path: '/admin/analysis', icon: BarChart3, label: 'Analysis' },
  ];

  return (
    <div className="flex h-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`fixed h-full bg-green-700 text-white transition-all duration-300 ease-in-out flex flex-col ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-green-600">
          <div className="flex items-center space-x-3">
            <img src={grdcirclelogo} alt="GRD Naturals" className={`w-10 h-10 transition-all duration-300 ${collapsed ? 'hidden mr-0' : 'mr-2'}`} />
            <span className={`text-xl font-semibold transition-all duration-300 ${
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
            }`}>
              GRD Admin
            </span>
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 transition-colors rounded-lg hover:bg-green-600"
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-1 mt-6 overflow-y-auto">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 transition-all duration-300 ${
                  isActive 
                    ? 'bg-green-600 text-white' 
                    : 'text-green-100 hover:bg-green-600'
                } ${collapsed ? 'justify-center' : 'space-x-3'}`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span 
                  className={`transition-all duration-300 ${
                    collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center px-4 py-4 transition-all duration-300 text-green-100 hover:bg-green-600 border-t border-green-600 ${
            collapsed ? 'justify-center' : 'space-x-3'
          }`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span 
            className={`transition-all duration-300  ${
              collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
            }`}
          >
            Logout
          </span>
        </button>
        
        {error && (
          <div className="absolute left-0 right-0 p-4 text-sm text-red-800 bg-red-100 bottom-20">
            {error}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <header className="shadow-md bg-green-50">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;