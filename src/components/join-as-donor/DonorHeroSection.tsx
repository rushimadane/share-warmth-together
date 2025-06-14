
import { Heart } from "lucide-react";

const DonorHeroSection = () => (
  <section className="py-16 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <div className="animate-fade-in">
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Join as a
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-600">
            Food Donor
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Register your restaurant to start donating surplus food to those in need.
          Help us reduce food waste and feed the hungry.
        </p>
      </div>
    </div>
  </section>
);

export default DonorHeroSection;
