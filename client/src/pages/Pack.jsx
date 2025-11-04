import React, { useState, useEffect } from 'react';
import PackCard from '../components/PackCard';
import { packAPI } from '../services/api';

function Pack() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    try {
      setLoading(true);
      const packsData = await packAPI.getAll();
      console.log('Packs fetched:', packsData);
      setPacks(Array.isArray(packsData) ? packsData : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch packs:', err);
      setError(err.response?.data?.message || 'Failed to load packs. Please try again later.');
      setPacks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4ade80]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchPacks}
          className="mt-4 px-6 py-2 bg-[#4ade80] text-white rounded-lg hover:bg-[#3dd16d]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#f3f4f6]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1f2937] mb-4">
            Special Pack Deals
          </h2>
          <p className="text-lg text-[#4b5563] max-w-2xl mx-auto">
            Get more value with our exclusive bundle packs. Save money by purchasing our specially curated product combinations.
          </p>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {packs.map((pack) => (
            <PackCard key={pack._id} pack={pack} />
          ))}
        </div>

        {packs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">No packs available at the moment.</p>
            <p className="text-gray-400 text-sm">
              To add packs, go to Admin Dashboard → Products and create a new product with type "Pack".
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Pack;
