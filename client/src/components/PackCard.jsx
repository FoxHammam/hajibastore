import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const PackCard = ({ pack }) => {
  const discountPercentage = pack.oldPrice
    ? Math.round(((pack.oldPrice - pack.price) / pack.oldPrice) * 100)
    : 0;

  return (
    <Link to={`/pack/${pack._id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <img
            src={pack.image}
            alt={pack.name}
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Discount Badge */}
          {pack.oldPrice && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold">
              -{discountPercentage}%
            </div>
          )}

          {/* Pack Badge */}
          <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold flex items-center">
            <Package size={12} className="mr-0.5 sm:mr-1" />
            Bundle Pack
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold">
              View Details
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-5">
          {/* Category */}
          <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">{pack.category}</p>

          {/* Pack Name */}
          <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
            {pack.name}
          </h3>

          {/* Items Included */}
          {pack.itemsIncluded && pack.itemsIncluded.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Includes:</p>
              <div className="flex flex-wrap gap-1">
                {pack.itemsIncluded.slice(0, 3).map((item, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                  >
                    {item}
                  </span>
                ))}
                {pack.itemsIncluded.length > 3 && (
                  <span className="text-xs text-gray-400 px-2 py-1">
                    +{pack.itemsIncluded.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-lg sm:text-2xl font-bold text-gray-900">
              ${pack.price}
            </span>
            {pack.oldPrice && (
              <span className="text-sm sm:text-base text-gray-400 line-through">
                ${pack.oldPrice}
              </span>
            )}
          </div>

          {/* Savings */}
          {pack.oldPrice && (
            <p className="text-xs sm:text-sm text-green-600 font-medium mt-1">
              Save ${(pack.oldPrice - pack.price).toFixed(2)}!
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PackCard;

