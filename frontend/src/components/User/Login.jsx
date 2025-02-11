import React, { useState, useEffect } from 'react';
import { LogIn, Mail, Lock, ArrowLeft, User, Phone, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import grdcirclelogo from "../../assets/logos/grdlogo.png";
import Allapi from '../../common';
import { useMyContext } from '../../utils/MyContext.jsx';
import { checkAndRemoveExpiredToken } from '../checkAndRemoveExpiredToken.js';

function Login() {
  const navigate = useNavigate();
  const { updateUser } = useMyContext(); 
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    emailAddress: '',
    password: '',
    address: {
      doorNo: '',
      street: '',
      city: '',
      pincode: '',
      state: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load remembered credentials on component mount
  useEffect(() => {
    checkAndRemoveExpiredToken()
    const rememberedCredentials = localStorage.getItem('rememberedCredentials');
    if (rememberedCredentials) {
      const { emailAddress, password } = JSON.parse(rememberedCredentials);
      setFormData(prev => ({
        ...prev,
        emailAddress,
        password
      }));
      setRememberMe(true);
    }
  }, []);

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
    setLoading(true);
  
    try {
      
      const endpoint = isLogin ? Allapi.login.url : Allapi.signup.url;
      const response = await fetch(endpoint, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData) 
      });
  
      const data = await response.json(); 
  
      if (!response.ok) {
        throw new Error(data.message || `${isLogin ? 'Login' : 'Signup'} failed`);
      }
  
      // Handle remember me
      if (isLogin) {
        if (rememberMe) {
          localStorage.setItem('rememberedCredentials', JSON.stringify({
            emailAddress: formData.emailAddress,
            password: formData.password
          }));
        } else {
          localStorage.removeItem('rememberedCredentials');
        }
      }

      // Store token and user data for both login and signup
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      updateUser(data.user);
  
      // Navigate based on user role for both login and signup
      if (data.user.role === "admin") {
        navigate('/admin');  // Redirect to admin panel for admin users
      } else {
        navigate('/');  // Redirect to home page for regular users
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      phoneNumber: '',
      emailAddress: '',
      password: '',
      address: {
        doorNo: '',
        street: '',
        city: '',
        pincode: '',
        state: ''
      }
    });
    setRememberMe(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-50">
      <div className="p-3 sm:p-4">
        <Link to="/" className="inline-flex items-center text-sm text-green-700 hover:text-green-800 sm:text-base">
          <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2} />
          Back to Home
        </Link>
      </div>

      <div className="flex items-center justify-center flex-grow px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
        <div className="w-full max-w-md p-6 space-y-6 bg-white rounded-lg shadow-md sm:space-y-8 sm:p-8">
          <div>
            <img
              className="w-auto h-12 mx-auto sm:h-16"
              src={grdcirclelogo}
              alt="GRD Naturals"
            />
            <h2 className="mt-4 text-2xl font-extrabold text-center text-gray-900 sm:mt-6 sm:text-3xl">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-sm text-center text-gray-600">
              {isLogin ? 'Sign in to your GRD Naturals account' : 'Join GRD Naturals today'}
            </p>
          </div>

          {error && (
            <div className="relative px-3 py-2 text-sm text-red-700 border border-red-200 rounded bg-red-50 sm:px-4 sm:py-3" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="mt-6 space-y-4 sm:mt-8 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3 rounded-md shadow-sm sm:space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="name" className="sr-only">Full Name</label>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-900" strokeWidth={2} />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required={!isLogin}
                        className="relative block w-full px-3 py-2 pl-3 text-sm text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md appearance-none bg-slate-50 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-base"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="sr-only">Phone Number</label>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-900" strokeWidth={2} />
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required={!isLogin}
                        className="relative block w-full px-3 py-2 pl-3 text-sm text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md appearance-none bg-slate-50 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-base"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="emailAddress" className="sr-only">Email address</label>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-900" strokeWidth={2} />
                  <input
                    id="emailAddress"
                    name="emailAddress"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full px-3 py-2 pl-3 text-sm text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md appearance-none bg-slate-50 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-base"
                    placeholder="Email address"
                    value={formData.emailAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-gray-900" strokeWidth={2} />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    className="relative block w-full px-3 py-2 pl-3 text-sm text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md appearance-none bg-slate-50 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-base"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-3 ">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-900" strokeWidth={2} />
                    <input
                      name="address.doorNo"
                      type="text"
                      required={!isLogin}
                      className="relative block w-full px-3 py-2 pl-3 text-sm text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md appearance-none bg-slate-50 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-base"
                      placeholder="Door No"
                      value={formData.address.doorNo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-900" strokeWidth={2} />
                    <input
                      name="address.street"
                      type="text"
                      required={!isLogin}
                      className="relative block w-full px-3 py-2 pl-3 text-sm text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md appearance-none bg-slate-50 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-base"
                      placeholder="Street"
                      value={formData.address.street}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-900" strokeWidth={2} />
                      <input
                        name="address.city"
                        type="text"
                        required={!isLogin}
                        className="relative block w-full px-3 py-2 pl-3 text-sm text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md appearance-none bg-slate-50 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-base"
                        placeholder="City"
                        value={formData.address.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-900" strokeWidth={2} />
                      <input
                        name="address.pincode"
                        type="text"
                        required={!isLogin}
                        className="relative block w-full px-3 py-2 pl-3 text-sm text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md appearance-none bg-slate-50 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-base"
                        placeholder="Pincode"
                        value={formData.address.pincode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-900" strokeWidth={2} />
                    <input
                      name="address.state"
                      type="text"
                      required={!isLogin}
                      className="relative block w-full px-3 py-2 pl-3 text-sm text-gray-700 placeholder-gray-500 border border-gray-300 rounded-md appearance-none bg-slate-50 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-base"
                      placeholder="State"
                      value={formData.address.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </div>

            {isLogin && (
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 sm:py-2.5 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LogIn className="w-5 h-5 text-green-500 group-hover:text-green-500" strokeWidth={2} />
                </span>
                {loading ? (isLogin ? 'Signing in...' : 'Signing up...') : (isLogin ? 'Sign in' : 'Sign up')}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={toggleMode}
                className="font-medium text-green-600 hover:text-green-500"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <footer className="py-3 mt-auto text-white bg-green-800 sm:py-4">
        <div className="text-sm text-center text-green-100 sm:text-base">
          <p>&copy; {new Date().getFullYear()} GRD Naturals. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Login;