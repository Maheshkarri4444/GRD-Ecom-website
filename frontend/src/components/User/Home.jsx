import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Sprout, ShoppingBag } from 'lucide-react';
import grdfulllogo from "../../assets/logos/grdfulllogo.png";
import Allapi from '../../common';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(Allapi.getAllProducts.url);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        if (data.success) {
          setProducts(data.products.slice(0, 4)); // Only take first 4 products
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative bg-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 pb-8 bg-green-50 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <div className="px-4 mx-auto mt-10 max-w-7xl sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <img
                  src={grdfulllogo}
                  alt="GRD Naturals Full Logo"
                  className="w-full max-w-md mx-auto mb-8"
                />
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                
                  <span className="block text-orange-500">గోరంత దీపం నాచురల్స్ </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Discover our range of premium natural products, sourced from the purest ingredients
                  and crafted with care. From essential oils to organic supplements, we bring nature's
                  goodness directly to you.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                  <div className="rounded-md shadow">
                    <Link
                      to="/shop"
                      className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-green-700 border border-transparent rounded-md hover:bg-green-800 md:py-4 md:text-lg md:px-10"
                    >
                      Shop Now
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/blobs"
                      className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-green-700 bg-green-100 border border-transparent rounded-md hover:bg-green-200 md:py-4 md:text-lg md:px-10"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story & Values Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Story & Values
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Committed to bringing you the finest natural products
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-3">
            <div className="relative p-6 transition-transform rounded-lg bg-green-50 hover:scale-105">
              <div className="absolute -top-4 left-4">
                <span className="inline-flex items-center justify-center p-3 bg-green-700 rounded-md shadow-lg">
                  <Leaf className="w-6 h-6 text-white" />
                </span>
              </div>
              <h3 className="mt-8 text-xl font-medium text-gray-900">Natural & Pure</h3>
              <p className="mt-4 text-base text-gray-500">
                We source only the purest natural ingredients, ensuring every product meets our high standards.
              </p>
            </div>

            <div className="relative p-6 transition-transform rounded-lg bg-green-50 hover:scale-105">
              <div className="absolute -top-4 left-4">
                <span className="inline-flex items-center justify-center p-3 bg-green-700 rounded-md shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </span>
              </div>
              <h3 className="mt-8 text-xl font-medium text-gray-900">Sustainably Sourced</h3>
              <p className="mt-4 text-base text-gray-500">
                Every product is ethically sourced and environmentally conscious, supporting local communities.
              </p>
            </div>

            <div className="relative p-6 transition-transform rounded-lg bg-green-50 hover:scale-105">
              <div className="absolute -top-4 left-4">
                <span className="inline-flex items-center justify-center p-3 bg-green-700 rounded-md shadow-lg">
                  <Sprout className="w-6 h-6 text-white" />
                </span>
              </div>
              <h3 className="mt-8 text-xl font-medium text-gray-900">Chemical-Free</h3>
              <p className="mt-4 text-base text-gray-500">
                We guarantee our products are free from harmful chemicals and synthetic additives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Our Collections Section */}
      <section className="py-16 bg-green-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-extrabold text-center text-gray-900 sm:text-4xl">
            Explore Our Collections
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="relative group">
              <div className="relative w-full overflow-hidden bg-white rounded-lg h-80 group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
                <img
                  src="https://images.unsplash.com/photo-1564149504298-00c351fd7f16?ixlib=rb-4.0.3"
                  alt="Herbal Products"
                  className="object-cover object-center w-full h-full"
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                <Link to="/shop" className="hover:text-green-700">
                  <span className="absolute inset-0" />
                  Herbal Products
                </Link>
              </h3>
              <p className="text-base text-gray-500">Natural remedies and supplements for your wellbeing.</p>
            </div>

            <div className="relative group">
              <div className="relative w-full overflow-hidden bg-white rounded-lg h-80 group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
                <img
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3"
                  alt="Organic Groceries"
                  className="object-cover object-center w-full h-full"
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                <Link to="/shop" className="hover:text-green-700">
                  <span className="absolute inset-0" />
                  Organic Groceries
                </Link>
              </h3>
              <p className="text-base text-gray-500">Fresh, organic produce and pantry essentials.</p>
            </div>

            <div className="relative group">
              <div className="relative w-full overflow-hidden bg-white rounded-lg h-80 group-hover:opacity-75 sm:aspect-w-2 sm:aspect-h-1 sm:h-64 lg:aspect-w-1 lg:aspect-h-1">
                <img
                  src="https://images.unsplash.com/photo-1601049676869-702ea24cfd58?ixlib=rb-4.0.3"
                  alt="Natural Skincare"
                  className="object-cover object-center w-full h-full"
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                <Link to="/shop" className="hover:text-green-700">
                  <span className="absolute inset-0" />
                  Natural Skincare
                </Link>
              </h3>
              <p className="text-base text-gray-500">Clean, natural products for radiant skin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop & Save Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Shop & Save
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Discover our latest offers and bestselling products
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {loading ? (
              <div className="flex items-center justify-center h-64 col-span-4">
                <div className="w-12 h-12 border-4 border-green-700 rounded-full border-t-transparent animate-spin"></div>
              </div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="relative p-4 transition-shadow bg-white rounded-lg shadow-sm group hover:shadow-md">
                  <div className="relative w-full h-64 overflow-hidden bg-gray-200 rounded-lg group-hover:opacity-75">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover object-center w-full h-full"
                    />
                    <div className="absolute px-2 py-1 text-sm text-white bg-green-600 rounded top-2 right-2">
                      Save {Math.round(((product.mrp - product.salePrice) / product.mrp) * 100)}%
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="font-medium text-green-600">₹{product.salePrice}</span>
                        <span className="ml-2 text-sm text-gray-500 line-through">₹{product.mrp}</span>
                      </div>
                      <Link
                        to="/shop"
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200"
                      >
                        <ShoppingBag className="w-4 h-4 mr-1" />
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-green-700 border border-transparent rounded-md shadow-sm hover:bg-green-800"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;