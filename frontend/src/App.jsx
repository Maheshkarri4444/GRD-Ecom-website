import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Leaf, User, ShoppingBag, Droplets, Brain,Heart, LogIn, Menu, X } from 'lucide-react';
import { FiShoppingCart } from 'react-icons/fi';
import grdcirclelogo from "../src/assets/logos/grdlogo.png";
import { useMyContext } from './utils/MyContext.jsx';
import Home from './components/User/Home';

function Profile() {
  return (
    <div className="flex items-center">
      <span className="">Profile</span>
    </div>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useMyContext();
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Leaf, label: 'Home' },
    { path: '/shop', icon: ShoppingBag, label: 'Shop' },
    { path: '/checkout', icon: FiShoppingCart, label: 'Checkout' },
    { path: '/protocols', icon: Heart, label: 'Protocols' },
    { path: '/blobs', icon: Droplets, label: 'Blobs' },
    { path: '/aichat', icon: Brain, label: 'AI' },
  ];

  // Function to close menu
  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-green-700 shadow-md">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center p-2">
              <img src={grdcirclelogo} alt="GRD Naturals" className="w-auto h-12" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden space-x-4 md:flex">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <div className={`flex items-center px-3 py-2 rounded-md transition duration-100 text-sm font-medium ${
                      isActive
                        ? 'text-green-700 bg-green-50'
                        : 'text-white hover:text-green-700 hover:bg-green-50'
                    }`}>
                      <item.icon className="w-4 h-4 mr-1" />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
              {user ? (
                <Link to="/profile">
                  <div className="flex items-center px-3 py-2 text-sm font-medium text-white transition duration-100 rounded-md hover:text-green-700 hover:bg-green-50">
                    <User className='w-5 h-5 mr-2'/>
                    <Profile className="w-4 h-4 mr-1" />
                  </div>
                </Link>
              ) : (
                <Link to="/login">
                  <div className="flex items-center px-3 py-2 text-sm font-medium text-white transition duration-100 rounded-md hover:text-green-700 hover:bg-green-50">
                    <LogIn className="w-4 h-4 mr-1" />Login
                  </div>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={handleNavigation}
                  >
                    <div className={`flex items-center px-3 py-2 rounded-md transition duration-100 text-base font-medium ${
                      isActive
                        ? 'text-green-700 bg-green-50'
                        : 'text-white hover:text-green-700 hover:bg-green-50'
                    }`}>
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
              {user ? (
                <Link 
                  to="/profile"
                  onClick={handleNavigation}
                >
                  <div className="flex items-center px-2 py-2 text-base font-medium text-white transition duration-100 rounded-md hover:text-green-700 hover:bg-green-50">
                    <User className='w-5 h-5 mr-2 text-white'/>
                    <Profile className="w-4 h-4 mr-2" />
                  </div>
                </Link>
              ) : (
                <Link 
                  to="/login"
                  onClick={handleNavigation}
                >
                  <div className="flex items-center px-3 py-2 text-base font-medium text-white transition duration-100 rounded-md hover:text-green-700 hover:bg-green-50">
                    <LogIn className="w-4 h-4 mr-2" />Login
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow mt-16">
        {location.pathname === '/' ? <Home /> : <Outlet />}
      </main>

      {/* Footer */}
      <footer className="text-white bg-green-800">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold">About GRD Naturals</h3>
              <p className="text-green-100">
                Committed to bringing you the finest natural products,
                sourced responsibly and crafted with care.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-green-100 hover:text-white">About Us</a></li>
                <li><Link to="/shop" className="text-green-100 hover:text-white">Products</Link></li>
                <li><a href="#" className="text-green-100 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
              <ul className="space-y-2 text-green-100">
                <li>Name: Dr T Karunakara Reddy</li>
                <li>Email: grdnaturals@gmail.com</li>
                <li>Phone: +91 9849141105</li>
                <li>Address: Vijayawada, Andhra Pradesh</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 mt-8 text-center text-green-100 border-t border-green-700">
            <p>&copy; {new Date().getFullYear()} GRD Naturals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;