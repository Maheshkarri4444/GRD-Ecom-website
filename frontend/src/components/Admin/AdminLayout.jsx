import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  Users, 
  Droplets, 
  Image, 
  BarChart3, 
  ChevronLeft,
  Menu,
  Grid
} from 'lucide-react';
import grdcirclelogo from "../../assets/logos/grdlogo.png";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/categories', icon: Grid, label: 'Categories' },
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
        className={`fixed h-full bg-green-700 text-white transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-green-700">
          <div className="flex items-center space-x-3">

            {!collapsed && (
              
              <span   className={`flex flex-row items-center justify-center gap-1 text-xl font-semibold transition-opacity duration-300 ${
    collapsed ? 'opacity-0 delay-250' : 'opacity-100'
  }`}>
              <img src={grdcirclelogo} alt="GRD Naturals" className="w-10 h-10" />
                GRD Admin
              </span>
            )}
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 transition-colors rounded-lg hover:bg-green-700"
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 transition-colors ${
                  isActive 
                    ? 'bg-green-700 text-white' 
                    : 'text-green-100 hover:bg-green-700'
                } ${collapsed ? 'justify-center' : 'space-x-3'}`}
              >
                <item.icon size={20} />
                {!collapsed && (
                  <span 
                    className="transition-opacity duration-300 opacity-0"
                    style={{ 
                      opacity: collapsed ? '0' : '1',
                      transitionDelay: `${index * 50}ms`
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
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