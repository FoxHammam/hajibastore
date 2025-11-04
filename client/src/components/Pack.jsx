import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Award, ShoppingCart, ArrowRight } from "lucide-react";
import { packs } from "../redux/packs";

const Pack = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);

  const updateCardsPerView = () => {
    if (window.innerWidth >= 1024) setCardsPerView(4);
    else setCardsPerView(2);
  };

  useEffect(() => {
    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const displayedPacks = packs.slice(0, 7);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : Math.max(0, displayedPacks.length - cardsPerView)
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev < displayedPacks.length - cardsPerView ? prev + 1 : 0
    );
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap">
          <div>
            <div className="flex items-center mb-2">
              <Award className="text-amber-600 mr-3" size={28} />
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1f2937]">
                Featured Packs
              </h2>
            </div>
            <p className="text-base text-[#4b5563]">
              Curated bundles with great value
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 text-base mt-4 lg:mt-0"
          >
            View All <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 sm:-translate-x-4 bg-white shadow-lg hover:shadow-xl rounded-full p-2 sm:p-3 text-[#4ade80] hover:bg-[#4ade80] hover:text-white transition-all duration-200 z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 sm:translate-x-4 bg-white shadow-lg hover:shadow-xl rounded-full p-2 sm:p-3 text-[#4ade80] hover:bg-[#4ade80] hover:text-white transition-all duration-200 z-10"
          >
            <ChevronRight size={20} />
          </button>

          <div className="overflow-hidden px-6">
            <div
              className="flex gap-4 sm:gap-6 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {displayedPacks.map((pack) => {
                const discountPercentage = pack.oldPrice
                  ? Math.round(((pack.oldPrice - pack.price) / pack.oldPrice) * 100)
                  : 0;

                return (
                  <div
                    key={pack.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex-shrink-0"
                    style={{
                      width: `calc((100% - ${(cardsPerView - 1) * 1.5}rem) / ${cardsPerView})`,
                      minWidth: `calc((100% - ${(cardsPerView - 1) * 1.5}rem) / ${cardsPerView})`,
                    }}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={pack.image}
                        alt={pack.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {pack.oldPrice && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          -{discountPercentage}%
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-[#9ca3af] mb-1">{pack.category}</p>
                      <h3 className="text-lg font-semibold text-[#1f2937] mb-2 line-clamp-2">
                        {pack.name}
                      </h3>
                      <ul className="text-sm text-[#4b5563] mb-3 list-disc list-inside">
                        {pack.itemsIncluded.slice(0, 3).map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                        {pack.itemsIncluded.length > 3 && (
                          <li className="text-[#9ca3af]">
                            +{pack.itemsIncluded.length - 3} more
                          </li>
                        )}
                      </ul>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-[#1f2937]">
                            ${pack.price}
                          </span>
                          {pack.oldPrice && (
                            <span className="text-sm text-[#9ca3af] line-through">
                              ${pack.oldPrice}
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="w-full bg-[#4ade80] hover:bg-[#3dd16d] text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center">
                        <ShoppingCart size={14} className="mr-2" /> Add Pack to Cart
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* View More Card */}
              <Link
                to="/products"
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex-shrink-0 flex flex-col"
                style={{
                  width: `calc((100% - ${(cardsPerView - 1) * 1.5}rem) / ${cardsPerView})`,
                  minWidth: `calc((100% - ${(cardsPerView - 1) * 1.5}rem) / ${cardsPerView})`,
                }}
              >
                <div className="relative overflow-hidden h-48 flex items-center justify-center bg-[#f3f4f6]">
                  <span className="text-lg font-semibold text-[#1f2937]">
                    View More Packs
                  </span>
                </div>
                <div className="p-4 flex flex-col justify-center items-center">
                  <button className="w-full bg-[#4ade80] hover:bg-[#3dd16d] text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                    Go to Packs
                  </button>
                </div>
              </Link>
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="hidden sm:flex justify-center space-x-2 mt-6">
            {Array.from({
              length: Math.ceil((displayedPacks.length + 1) / cardsPerView),
            }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * cardsPerView)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  Math.floor(currentIndex / cardsPerView) === index
                    ? "bg-[#4ade80] scale-125"
                    : "bg-[#9ca3af] hover:bg-[#4b5563]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pack;
