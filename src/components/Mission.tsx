
import { Leaf, Heart, Users } from "lucide-react";

const Mission = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Reduce Food Waste, Fight Hunger
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every day, tons of perfectly good food goes to waste while millions go hungry. 
            We're building bridges between abundance and need, one meal at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sustainability</h3>
            <p className="text-gray-600 leading-relaxed">
              Reducing food waste helps protect our environment and creates a more sustainable future for everyone.
            </p>
          </div>

          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Compassion</h3>
            <p className="text-gray-600 leading-relaxed">
              Every shared meal is an act of kindness that brings hope and nourishment to those who need it most.
            </p>
          </div>

          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg transition-all duration-300">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Community</h3>
            <p className="text-gray-600 leading-relaxed">
              Building stronger communities by connecting restaurants, NGOs, and individuals around a common cause.
            </p>
          </div>
        </div>

        <div className="mt-16 relative rounded-2xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Sunlight through green leaves representing sustainability"
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/70 to-orange-600/70 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Together We Can Make a Difference</h3>
              <p className="text-lg md:text-xl opacity-90">Join thousands of restaurants and organizations creating positive change</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
