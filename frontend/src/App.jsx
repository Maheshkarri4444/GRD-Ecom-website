import React, { useState } from 'react';
import { Leaf, ShoppingBag, Droplets, Brain, LogIn, Menu, X } from 'lucide-react';
import grdcirclelogo from "../src/assets/logos/grdlogo.png"
import grdfulllogo from "../src/assets/logos/grdfulllogo.png"
import { Link } from 'react-router-dom';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img src={grdcirclelogo} alt="GRD Naturals" className="h-12 w-auto" />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <NavLink active><Leaf className="w-4 h-4 mr-1" />Home</NavLink>
              <NavLink><ShoppingBag className="w-4 h-4 mr-1" />Shop</NavLink>
              <NavLink><Droplets className="w-4 h-4 mr-1" />Blobs</NavLink>
              <NavLink><Brain className="w-4 h-4 mr-1" />AI</NavLink>
              <Link to="/login">
                <NavLink><LogIn className="w-4 h-4 mr-1" />Login</NavLink>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-green-700 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink active><Leaf className="w-4 h-4 mr-2" />Home</MobileNavLink>
              <MobileNavLink><ShoppingBag className="w-4 h-4 mr-2" />Shop</MobileNavLink>
              <MobileNavLink><Droplets className="w-4 h-4 mr-2" />Blobs</MobileNavLink>
              <MobileNavLink><Brain className="w-4 h-4 mr-2" />AI</MobileNavLink>
              <Link to="/login">
                <MobileNavLink><LogIn className="w-4 h-4 mr-2" />Login</MobileNavLink>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
              <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="text-center ">
                  <img 
                    src={grdfulllogo} 
                    alt="GRD Naturals Full Logo" 
                    className="mx-auto  max-w-md w-full mb-8"
                  />
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block text-green-700">Nature's Finest</span>
                    <span className="block text-orange-500">Products for You</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto  md:mt-5 md:text-xl">
                    Discover our range of premium natural products, sourced from the purest ingredients 
                    and crafted with care. From essential oils to organic supplements, we bring nature's 
                    goodness directly to you.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center ">
                    <div className="rounded-md shadow">
                      <a
                        href="#"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 md:py-4 md:text-lg md:px-10"
                      >
                        Shop Now
                      </a>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <a
                        href="#"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 md:py-4 md:text-lg md:px-10"
                      >
                        Learn More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About GRD Naturals</h3>
              <p className="text-green-100">
                Committed to bringing you the finest natural products, 
                sourced responsibly and crafted with care.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-green-100 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-green-100 hover:text-white">Products</a></li>
                <li><a href="#" className="text-green-100 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-green-100 hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-green-100">
                <li>Email: info@grdnaturals.com</li>
                <li>Phone: (555) 123-4567</li>
                <li>Address: 123 Nature Way, Green City</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-green-700 text-center text-green-100">
            <p>&copy; {new Date().getFullYear()} GRD Naturals. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Navigation Components
const NavLink = ({ children, active = false }) => (
  <div
    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
      active
        ? 'text-green-700 bg-green-50'
        : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
    }`}
  >
    {children}
  </div>
);

const MobileNavLink = ({ children, active = false }) => (
  <div
    className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
      active
        ? 'text-green-700 bg-green-50'
        : 'text-gray-700 hover:text-green-700 hover:bg-green-50'
    }`}
  >
    {children}
  </div>
);

export default App;
