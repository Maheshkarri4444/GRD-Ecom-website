import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, X, Plus, Minus, Home, ChevronLeft, ChevronRight } from 'lucide-react';
import grdcirclelogo from '../../assets/logos/grdlogo.png';
import Allapi from '../../common';
import { Link } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showBlobModal, setShowBlobModal] = useState(false);
  const [selectedBlob, setSelectedBlob] = useState(null);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // Initialize image indices for products
  useEffect(() => {
    const initialIndices = {};
    products.forEach(product => {
      initialIndices[product._id] = 0;
    });
    setCurrentImageIndex(initialIndices);
  }, [products]);

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

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch(Allapi.getAllBanners.url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setBanners(data);
      } else if (data.success && Array.isArray(data.banners)) {
        setBanners(data.banners);
      }
    } catch (err) {
      console.error('Fetch banners error:', err);
    }
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(Allapi.getCart.url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      if (response.ok) {
        setCart(data.cart.products);
      }
    } catch (err) {
      console.error('Fetch cart error:', err);
      setError('Failed to fetch cart');
    }
  };

  // Fetch products and categories and banners
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch(Allapi.getAllProducts.url, {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(Allapi.getAllCategories.url, {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data from server');
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        if (productsData.success) {
          setProducts(productsData.products);
        }
        if (categoriesData.success) {
          const filteredCategories = categoriesData.categories.filter(category => category.name !== "Non Product Category");
          setCategories(filteredCategories);
        }

        await Promise.all([fetchBanners(), fetchCart()]);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      const existingItem = cart.find(item => item.productId._id === product._id);
      const quantity = existingItem ? existingItem.quantity + 1 : 1;

      const response = await fetch(Allapi.updateCart.url, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      const data = await response.json();
      if (response.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      setError('Failed to add to cart');
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(Allapi.updateCart.url, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          quantity: newQuantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const data = await response.json();
      if (response.ok) {
        await fetchCart();
      }
    } catch (err) {
      console.error('Update quantity error:', err);
      setError('Failed to update cart');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.productId.salePrice * item.quantity), 0);
  };

  // Filter products based on search query and category
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!selectedCategory || product.category._id === selectedCategory)
  );

  // Modal Component for ViewFullBlob
  const BlobModal = ({ blob, onClose }) => {
    const [modalImageIndex, setModalImageIndex] = useState(0);

    const nextModalImage = () => {
      setModalImageIndex((prev) => (prev + 1) % blob.images.length);
    };

    const prevModalImage = () => {
      setModalImageIndex((prev) => (prev - 1 + blob.images.length) % blob.images.length);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-full max-w-3xl p-6 mx-4 bg-white rounded-lg max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute z-50 p-1 text-gray-500 transition-colors duration-150 rounded-full size-10 hover:bg-gray-100 top-4 right-4"
          >
            <X size={24} />
          </button>
          
          {/* Image Carousel */}
          {blob.images.length > 0 && (
            <div className="relative z-30 mb-6 aspect-video">
              <img
                src={blob.images[modalImageIndex]}
                alt={blob.title}
                className="object-contain w-full h-full rounded-lg"
              />
              {blob.images.length > 1 && (
                <>
                  <button
                    onClick={prevModalImage}
                    className="absolute p-2 text-white -translate-y-1/2 rounded-full left-2 top-1/2 bg-black/50 hover:bg-black/70"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextModalImage}
                    className="absolute p-2 text-white -translate-y-1/2 rounded-full right-2 top-1/2 bg-black/50 hover:bg-black/70"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute flex gap-2 -translate-x-1/2 bottom-4 left-1/2">
                    {blob.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === modalImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <h2 className="mb-4 text-2xl font-bold text-gray-800">{blob.title}</h2>
          
          <div className="space-y-6">
            {blob.content.map((section, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-50">
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  {section.heading}
                </h3>
                <p className="text-gray-600 whitespace-pre-line">{section.paragraph}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="w-12 h-12 border-b-2 border-green-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 shadow-md bg-green-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="items-center hidden sm:flex"> 
              <img src={grdcirclelogo} alt="GRD Naturals" className="w-auto h-12" />
            </div>
            <Link
              to="/"
              className="inline-flex items-center px-1.5 py-1.5 text-sm font-medium text-green-700 bg-green-50 rounded-md shadow-lg left-2 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Home className="relative w-8 h-8" />
            </Link>
            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-white border border-green-400 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
                <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              </div>
            </div>

            {/* Filter and Cart */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-green-400 rounded-lg hover:text-green-700 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 w-48 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSelectedCategory('');
                          setIsFilterOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-green-50 hover:text-green-700"
                      >
                        All Categories
                      </button>
                      {categories.map(category => (
                        <button
                          key={category._id}
                          onClick={() => {
                            setSelectedCategory(category._id);
                            setIsFilterOpen(false);
                          }}
                          className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-green-50 hover:text-green-700"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-green-700"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-green-600 rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl md:w-96">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500">Your cart is empty</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.productId._id} className="flex items-center space-x-4">
                        <img
                          src={item.productId.images[0]}
                          alt={item.productId.name}
                          className="object-cover w-16 h-16 rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.productId.name}</h3>
                          <p className="text-sm text-gray-500">₹{item.productId.salePrice}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-semibold">₹{calculateTotal()}</span>
                </div>
                <Link
                  to="/checkout"
                  className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                  disabled={cart.length === 0}
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Products Grid */}
      <div className="pt-16">
        {/* Banners Carousel */}
        <div className="relative w-full overflow-hidden bg-black">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ 
              transform: `translateX(-${currentBanner * 100}%)`
            }}
          >
            {banners.map((banner) => (
              <div
                key={banner._id}
                className="relative flex-shrink-0 w-full md:h-[500px]"
              >
                <img
                  src={banner.banner}
                  alt={banner.title}
                  className="w-full h-full "
                />
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/40 hover:opacity-100">
                  <h3 className="text-4xl font-bold text-white">{banner.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevBanner}
            className="absolute left-0 p-2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 top-1/2"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-0 p-2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 top-1/2"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  currentBanner === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
              {error}
            </div>
          )}

          <h2 className="mb-6 text-2xl font-bold text-gray-900">Our Products</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="overflow-hidden transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md">
                {product.images && product.images.length > 0 && (
                  <div className="relative overflow-hidden group">
                    <img
                      src={product.images[currentImageIndex[product._id] || 0]}
                      alt={product.name}
                      className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                    />
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            prevImage(product._id);
                          }}
                          className="absolute p-1 text-white transition-opacity -translate-y-1/2 rounded-full opacity-0 left-2 top-1/2 bg-black/50 hover:bg-black/70 group-hover:opacity-100"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            nextImage(product._id);
                          }}
                          className="absolute p-1 text-white transition-opacity -translate-y-1/2 rounded-full opacity-0 right-2 top-1/2 bg-black/50 hover:bg-black/70 group-hover:opacity-100"
                        >
                          <ChevronRight size={20} />
                        </button>
                        <div className="absolute flex gap-1 transition-opacity -translate-x-1/2 opacity-0 bottom-2 left-1/2 group-hover:opacity-100">
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
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex flex-col justify-between mb-4">
                {/* Price Section */}
                <div>
                  <span className="text-sm text-gray-500 line-through">₹{product.mrp}</span>
                  <span className="ml-2 text-lg font-bold text-green-600">₹{product.salePrice}</span>
                </div>

                {/* Buttons Section */}
                <div className="flex justify-between mt-4">
                  <div>
                    {product.blobId && (
                      <button
                        onClick={() => {
                          setSelectedBlob(product.blobId);
                          setShowBlobModal(true);
                        }}
                        className="px-3 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                  <div>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blob Modal */}
      {showBlobModal && selectedBlob && (
        <BlobModal
          blob={selectedBlob}
          onClose={() => {
            setShowBlobModal(false);
            setSelectedBlob(null);
          }}
        />
      )}
    </div>
  );
};

export default Shop;