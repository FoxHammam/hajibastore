import React from 'react';

function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-[#dcfce7] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-[#1f2937] mb-6">About Ayoub Store</h1>
          <p className="text-xl text-[#4b5563] max-w-3xl mx-auto">
            Your trusted destination for premium quality products and exceptional shopping experiences
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1f2937] mb-6">Our Story</h2>
          <div className="space-y-4 text-[#4b5563] text-lg">
            <p>
              Founded with a vision to make high-quality products accessible to everyone, Ayoub Store has been serving customers since 2020.
            </p>
            <p>
              We believe in offering the best value for your money. Every product is carefully curated to meet our high standards of quality.
            </p>
            <p>
              Our commitment to customer satisfaction drives everything we do.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;