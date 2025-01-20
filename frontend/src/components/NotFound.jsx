import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import grdcirclelogo from "../assets/logos/grdlogo.png";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-green-50">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white rounded-full shadow-lg">
            <img src={grdcirclelogo} alt="GRD Naturals" className="w-24 h-24" />
          </div>
        </div>
        
        <h1 className="mb-4 text-6xl font-bold text-green-700">404</h1>
        <h2 className="mb-4 text-3xl font-semibold text-gray-900">Page Not Found</h2>
        <p className="mb-8 text-lg text-gray-600">
          Oops! The page you're looking for doesn't seem to exist.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white transition-colors duration-200 bg-green-700 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;