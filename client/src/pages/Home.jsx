import React from 'react'
import Hero from '../components/Hero.jsx'
import FeaturedProducts from '../components/FeaturedProducts.jsx'
import BestSeller from '../components/BestSeller.jsx'
import { Star, Truck, Shield, RefreshCw } from 'lucide-react'
import Pack from './Pack.jsx'

function Home() {
  return (
    <div>
      <Hero />
      <BestSeller />
      <FeaturedProducts />
      
      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-[#dcfce7] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-[#4ade80]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#1f2937] mb-2">Free Shipping</h3>
              <p className="text-[#4b5563]">Free shipping on orders over $100 worldwide</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#dcfce7] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="text-[#4ade80]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#1f2937] mb-2">Easy Returns</h3>
              <p className="text-[#4b5563]">30-day hassle-free returns on all products</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#dcfce7] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-[#4ade80]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#1f2937] mb-2">Secure Payment</h3>
              <p className="text-[#4b5563]">100% secure and encrypted payment processing</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#dcfce7] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-[#4ade80]" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#1f2937] mb-2">Premium Quality</h3>
              <p className="text-[#4b5563]">Curated selection of high-quality products</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
export default Home
