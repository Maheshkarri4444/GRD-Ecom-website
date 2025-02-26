import React, { useState, useEffect } from 'react';
import Allapi from '../../common/index';

function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(Allapi.getPromotions.url);
        const data = await response.json();
        setPromotions(data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="w-12 h-12 border-4 border-green-700 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const images = promotions.filter(p => p.type === 'image');
  const videos = promotions.filter(p => p.type === 'video');

  return (
    <div className="min-h-screen p-8 bg-green-50">
      <div className="mx-auto space-y-12 max-w-7xl">
        {/* Images Section */}
        {images.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Featured Images</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {images.map((promotion) => (
                <div
                  key={promotion._id}
                  className="overflow-hidden transition-transform bg-white rounded-lg shadow-md hover:scale-105 w-full max-w-[300px] mx-auto"
                >
                  <div className="relative pt-[100%]">
                    <img
                      src={promotion.link}
                      alt="Promotion"
                      className="absolute inset-0 object-cover w-full h-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Featured Videos</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {videos.map((promotion) => (
                <div
                  key={promotion._id}
                  className="overflow-hidden bg-white rounded-lg shadow-md"
                >
                  <iframe
                    src={promotion.link.replace('watch?v=', 'embed/')}
                    title="YouTube video"
                    className="w-full aspect-video"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {promotions.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No promotions available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Promotions;