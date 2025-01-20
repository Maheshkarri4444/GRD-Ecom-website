import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Allapi from '../../common';
import { Link } from 'react-router-dom';

// Category icons/symbols
const categoryIcons = {
  'Oils': '🫒',
  'Millets': '🌾',
  'Pulses': '🫘',
  'Spices': '🌶️',
  'Sweets':'🍬',
  'Protocols': '😊',
  'default': '📦'
};

const Blobs = () => {
  const [categories, setCategories] = useState([]);
  const [blobs, setBlobs] = useState([]);
  const [nonProductBlobs, setNonProductBlobs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedBlob, setSelectedBlob] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchNonProductBlobs();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchBlobs(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(Allapi.getAllCategories.url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        // Filter out "Non Product Category"
        const filteredCategories = data.categories.filter(
          cat => cat.name !== "Non Product Category"
        );
        setCategories(filteredCategories);
      }
    } catch (err) {
      setError('Failed to fetch categories');
    }
  };

  const fetchBlobs = async (categoryId) => {
    try {
      const response = await fetch(Allapi.getAllBlobs.url, {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        const filteredBlobs = data.filter(blob => blob.categoryId === categoryId);
        setBlobs(filteredBlobs);
        
        // Initialize image indices
        const initialIndices = {};
        filteredBlobs.forEach(blob => {
          initialIndices[blob._id] = 0;
        });
        setCurrentImageIndex(initialIndices);
      }
    } catch (err) {
      setError('Failed to fetch blobs');
    }
  };

  const fetchNonProductBlobs = async () => {
    try {
        const categoriesResponse = await fetch(Allapi.getAllCategories.url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
      
          if (!categoriesResponse.ok) {
            throw new Error("Failed to fetch categories");
          }
      
          const categoriesData = await categoriesResponse.json();
          const nonProductCategory = categoriesData.categories.find(
            (cat) => cat.name === "Non Product Category"
          );
      
          if (!nonProductCategory) {
            throw new Error("Non Product Category not found");
          }
      
          // Fetch all blobs
          const blobsResponse = await fetch(Allapi.getAllBlobs.url, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
      
          if (!blobsResponse.ok) {
            throw new Error("Failed to fetch blobs");
          }
      
          const blobsData = await blobsResponse.json();
          const filteredBlobs = blobsData.filter(
            (blob) => blob.categoryId === nonProductCategory._id
          );
      
          setNonProductBlobs(filteredBlobs);
        } catch (err) {
          console.error(err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }
  };

  const nextImage = (blobId, blobsList) => {
    const blob = blobsList.find(b => b._id === blobId);
    setCurrentImageIndex(prev => ({
      ...prev,
      [blobId]: (prev[blobId] + 1) % blob.images.length
    }));
  };

  const prevImage = (blobId, blobsList) => {
    const blob = blobsList.find(b => b._id === blobId);
    setCurrentImageIndex(prev => ({
      ...prev,
      [blobId]: (prev[blobId] - 1 + blob.images.length) % blob.images.length
    }));
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const Modal = ({ blob, onClose }) => {
    const [modalImageIndex, setModalImageIndex] = useState(0);

    const nextModalImage = () => {
      setModalImageIndex((prev) => (prev + 1) % blob.images.length);
    };

    const prevModalImage = () => {
      setModalImageIndex((prev) => (prev - 1 + blob.images.length) % blob.images.length);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50">
        <div className="relative w-full max-w-3xl p-6 mx-4 bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto border border-green-100">
          <button
            onClick={onClose}
            className="absolute z-50 p-2 text-green-700 rounded-full hover:bg-green-50 top-4 right-4"
          >
            ✕
          </button>
          
          {blob.images.length > 0 && (
            <div className="relative mb-6 aspect-video">
              <img
                src={blob.images[modalImageIndex]}
                alt={blob.title}
                className="object-contain w-full h-full rounded-lg"
              />
              {blob.images.length > 1 && (
                <>
                  <button
                    onClick={prevModalImage}
                    className="absolute p-2 text-white -translate-y-1/2 rounded-full left-2 top-1/2 bg-green-700/70 hover:bg-green-800/70"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextModalImage}
                    className="absolute p-2 text-white -translate-y-1/2 rounded-full right-2 top-1/2 bg-green-700/70 hover:bg-green-800/70"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="absolute flex gap-2 -translate-x-1/2 bottom-4 left-1/2">
                    {blob.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === modalImageIndex ? 'bg-green-600' : 'bg-green-200'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <h2 className="mb-4 text-2xl font-bold text-gray-900">{blob.title}</h2>
          
          <div className="space-y-6">
            {blob.content.map((section, index) => (
              <div key={index} className="p-4 bg-gray-100 border border-green-100 rounded-lg">
                <h3 className="mb-2 text-xl font-semibold text-gray-800">
                  {section.heading}
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{section.paragraph}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const BlobsList = ({ blobs, title }) => (
    <div className="mt-8">
      {title && <h3 className="mb-4 text-xl font-semibold text-green-900">{title}</h3>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blobs.map((blob) => (
          <div key={blob._id} className="overflow-hidden transition-shadow bg-white border border-green-100 rounded-lg shadow-sm hover:shadow-md">
            {blob.images.length > 0 && (
              <div className="relative transition-transform duration-500 ease-in-out">
                <img
                  src={blob.images[currentImageIndex[blob._id] || 0]}
                  alt={blob.title}
                  className="object-cover w-full h-48"
                />
                {blob.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage(blob._id, blobs);
                      }}
                      className="absolute p-1 text-white -translate-y-1/2 rounded-full left-2 top-1/2 bg-green-700/70 hover:bg-green-800/70"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage(blob._id, blobs);
                      }}
                      className="absolute p-1 text-white -translate-y-1/2 rounded-full right-2 top-1/2 bg-green-700/70 hover:bg-green-800/70"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute flex gap-1 -translate-x-1/2 bottom-2 left-1/2">
                      {blob.images.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === (currentImageIndex[blob._id] || 0)
                              ? 'bg-green-600'
                              : 'bg-green-200'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="p-4">
              <h4 className="mb-2 text-lg font-semibold text-green-900">{blob.title}</h4>
              {blob.content.length > 0 && (
                <div className="p-2 mb-4 border border-green-100 rounded bg-green-50">
                  <h5 className="font-medium text-green-800">{blob.content[0].heading}</h5>
                  <p className="text-sm text-green-700">
                    {truncateText(blob.content[0].paragraph, 100)}
                  </p>
                </div>
              )}
              <button
                onClick={() => {
                  setSelectedBlob(blob);
                  setShowModal(true);
                }}
                className="px-3 py-1 text-sm text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="w-12 h-12 border-b-2 border-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-green-50">

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-green-900">Product Categories</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`p-6 text-center transition-all rounded-lg shadow-sm hover:shadow-md ${
                selectedCategory === category._id
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-white border border-green-100'
              }`}
            >
              <div className="mb-3 text-4xl">
                {categoryIcons[category.name] || categoryIcons.default}
              </div>
              <h3 className="text-lg font-medium text-green-800">{category.name}</h3>
            </button>
          ))}
        </div>
      </section>

      {/* Selected Category Blobs */}
      {selectedCategory && (
        <section>
          <BlobsList 
            blobs={blobs} 
            title={`${categories.find(c => c._id === selectedCategory)?.name} Products`} 
          />
        </section>
      )}

      {/* Non-Product Category Blobs */}
      {nonProductBlobs.length > 0 && (
        <section className="pt-12 mt-12 border-t border-green-200">
          <BlobsList 
            blobs={nonProductBlobs} 
            title="Our GRD Blobs" 
          />
        </section>
      )}

      {/* Modal */}
      {showModal && selectedBlob && (
        <Modal
          blob={selectedBlob}
          onClose={() => {
            setShowModal(false);
            setSelectedBlob(null);
          }}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 mt-4 text-red-700 border border-red-200 rounded-md bg-red-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default Blobs;