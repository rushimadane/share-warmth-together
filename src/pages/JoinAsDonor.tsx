
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Users, Utensils, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const JoinAsDonor = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-orange-400 rounded-full flex items-center justify-center mr-3">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">FoodShare</span>
          </Link>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Utensils className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Join as a 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-600">
                Food Donor
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your surplus food into hope. Register your restaurant to start making a difference in your community today.
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Restaurant Registration</h2>
            
            <form className="space-y-8">
              {/* Restaurant Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-name" className="text-gray-700 font-medium">Restaurant Name *</Label>
                  <Input 
                    id="restaurant-name" 
                    placeholder="Enter your restaurant name"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuisine-type" className="text-gray-700 font-medium">Cuisine Type</Label>
                  <Input 
                    id="cuisine-type" 
                    placeholder="e.g., Italian, Indian, Fast Food"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="owner-name" className="text-gray-700 font-medium">Owner/Manager Name *</Label>
                  <Input 
                    id="owner-name" 
                    placeholder="Full name"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="phone" 
                      placeholder="+1 (555) 123-4567"
                      className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="restaurant@example.com"
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700 font-medium">Restaurant Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea 
                    id="address" 
                    placeholder="Full address including street, city, state, zip code"
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    rows={3}
                  />
                </div>
              </div>

              {/* Operating Hours */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Operating Hours *
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="open-time" className="text-sm text-gray-600">Opening Time</Label>
                    <Input 
                      id="open-time" 
                      type="time"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="close-time" className="text-sm text-gray-600">Closing Time</Label>
                    <Input 
                      id="close-time" 
                      type="time"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Food Information */}
              <div className="space-y-2">
                <Label htmlFor="food-types" className="text-gray-700 font-medium">Types of Food You Plan to Donate</Label>
                <Textarea 
                  id="food-types" 
                  placeholder="e.g., Fresh meals, baked goods, packaged items, beverages..."
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  rows={3}
                />
              </div>

              {/* Agreement */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox id="terms" className="mt-1" />
                  <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                    I agree to follow all food safety guidelines and understand that all donations must comply with local health regulations. I accept the terms of service and privacy policy.
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox id="liability" className="mt-1" />
                  <Label htmlFor="liability" className="text-sm text-gray-600 leading-relaxed">
                    I understand that FoodShare facilitates connections but does not assume liability for food quality or safety after pickup.
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Register Restaurant
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  Registration takes 24-48 hours for approval
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-100 to-orange-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">Why Join FoodShare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Make a Difference</h3>
              <p className="text-gray-600">Transform surplus food into meals for those in need in your community.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Tax Benefits</h3>
              <p className="text-gray-600">Receive tax deductions for your charitable food donations.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reduce Waste</h3>
              <p className="text-gray-600">Help the environment by reducing food waste and your disposal costs.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinAsDonor;
