import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, Star, Truck, Shield } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: "Discover Amazing Products",
      subtitle: "Shop the latest collection of premium items",
      description: "Find everything you need in one place with our curated selection of high-quality products.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      buttonText: "Shop Now",
      buttonLink: "/products",
      features: [
        { icon: Star, text: "Premium Quality" },
        { icon: Truck, text: "Free Shipping" },
        { icon: Shield, text: "Secure Payment" }
      ]
    },
    {
      id: 2,
      title: "Special Pack Deals",
      subtitle: "Get more value with our exclusive packs",
      description: "Save up to 30% when you buy our specially curated product packs.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      buttonText: "View Packs",
      buttonLink: "/pack",
      features: [
        { icon: Star, text: "Best Value" },
        { icon: Truck, text: "Fast Delivery" },
        { icon: Shield, text: "Money Back" }
      ]
    },
    {
      id: 3,
      title: "New Arrivals",
      subtitle: "Fresh products just arrived",
      description: "Be the first to discover our newest additions to the store.",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      buttonText: "Explore New",
      buttonLink: "/products",
      features: [
        { icon: Star, text: "Latest Trends" },
        { icon: Truck, text: "Same Day" },
        { icon: Shield, text: "Warranty" }
      ]
    }
  ];

  // Auto-advance slides every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const currentHero = heroSlides[currentSlide];

  return (
    <div className="relative overflow-hidden">
      <img
        src={currentHero.image}
        alt={currentHero.title}
        className="w-full h-[70vh] object-cover transition-all duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      
      {/* Overlay Content */}
      <div className="absolute bottom-8 left-8 right-8 text-white">
        <h1 className="text-3xl lg:text-5xl font-bold mb-4">
          {currentHero.title}
        </h1>
        <p className="text-xl lg:text-2xl opacity-90 mb-6">
          {currentHero.subtitle}
        </p>
        <Link
          to={currentHero.buttonLink}
          className="inline-flex items-center px-8 py-4 bg-[#4ade80] text-white rounded-lg hover:bg-[#3dd16d] transition-all duration-200 font-medium shadow-lg hover:shadow-xl text-lg"
        >
          <ShoppingBag size={24} className="mr-3" />
          {currentHero.buttonText}
        </Link>
      </div>

      {/* Navigation Arrows - Inside Image */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 rounded-full p-4 shadow-lg hover:shadow-xl z-10"
      >
        <ChevronLeft size={24} className="text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-200 rounded-full p-4 shadow-lg hover:shadow-xl z-10"
      >
        <ChevronRight size={24} className="text-white" />
      </button>

      {/* Slide Indicators - Inside Image */}
      <div className="absolute bottom-8 right-8 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-[#4ade80] scale-110'
                : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;