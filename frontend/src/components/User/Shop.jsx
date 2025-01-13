import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, X, Plus, Minus , Home} from 'lucide-react';
import grdcirclelogo from '../../assets/logos/grdlogo.png';
import Allapi from '../../common';
import { Link } from 'react-router-dom';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

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
      console.log("cart get: ",data);
    //   console.log("Data.success:",data.success)
      if (response.ok) {
        setCart(data.cart.products);
      }
    } catch (err) {
      console.error('Fetch cart error:', err);
      setError('Failed to fetch cart');
    }
  };

  // Fetch products and categories
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
          setCategories(categoriesData.categories);
        }

        // Fetch cart data after products and categories
        await fetchCart();
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
      // Find if product already exists in cart
      const existingItem = cart.find(item => item.productId._id === product._id);
      const quantity = existingItem ? existingItem.quantity + 1 : 1;
      console.log("req sent add");
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
        // Fetch fresh cart data after updating
        console.log("req finished add");
        await fetchCart();
        console.log("req finished add");
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
      console.log("req start update");
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
      console.log("req finished update");

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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="items-center hidden sm:flex"> 
              <img src={grdcirclelogo} alt="GRD Naturals" className="w-auto h-12" />
            </div>
            <Link
        to="/"
        className=" inline-flex items-center px-1.5 py-1.5 text-sm font-medium text-green-700 bg-white rounded-md shadow-sm left-2 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <Home className="relative w-8 h-8 " />
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
                <button
                  className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                  disabled={cart.length === 0}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Products Grid */}
      <div className="px-4 pt-20 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="overflow-hidden transition-shadow bg-white border rounded-lg shadow-sm hover:shadow-md">
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-cover w-full h-48"
                />
              )}
              <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-sm text-gray-500 line-through">₹{product.mrp}</span>
                    <span className="ml-2 text-lg font-bold text-green-600">₹{product.salePrice}</span>
                  </div>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;