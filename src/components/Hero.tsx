import { Button } from "@/components/ui/button";
import { Heart, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-orange-50 to-green-50 opacity-70"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Share Surplus,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-600">
              Spread Smiles
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect restaurants with surplus food to NGOs, charities, and individuals in need. 
            Together, we can reduce waste and fight hunger in our communities.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
          <Link to="/join-as-donor">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Join as a Donor
            </Button>
          </Link>
          <Link to="/find-food-nearby">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-orange-400 text-orange-600 hover:bg-orange-400 hover:text-white px-8 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Find Food Nearby
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="text-3xl font-bold text-green-600">10,000+</div>
            <div className="text-gray-600">Meals Donated</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="text-3xl font-bold text-orange-600">150+</div>
            <div className="text-gray-600">Partner Restaurants</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="text-3xl font-bold text-green-600">50+</div>
            <div className="text-gray-600">NGO Partners</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
