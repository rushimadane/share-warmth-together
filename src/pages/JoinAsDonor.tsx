
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Users, Utensils, MapPin, Phone, Mail, Clock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const JoinAsDonor = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    foodTypes: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    liabilityAccepted: false,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const validateForm = () => {
    const required = ['restaurantName', 'contactPerson', 'phone', 'email', 'address', 'pincode', 'password', 'confirmPassword'];
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast({
          title: "Error",
          description: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
          variant: "destructive",
        });
        return false;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.termsAccepted || !formData.liabilityAccepted) {
      toast({
        title: "Error",
        description: "Please accept all terms and conditions",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Store additional data in Firestore
      await setDoc(doc(db, "donors", user.uid), {
        restaurantName: formData.restaurantName,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        pincode: formData.pincode,
        foodTypes: formData.foodTypes,
        createdAt: new Date().toISOString(),
        approved: false, // Will need manual approval
      });

      toast({
        title: "Success!",
        description: "Registration successful! Please wait for approval.",
      });

      // Redirect to login or dashboard
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Restaurant Information */}
              <div className="space-y-2">
                <Label htmlFor="restaurantName" className="text-gray-700 font-medium">Restaurant Name *</Label>
                <Input 
                  id="restaurantName" 
                  value={formData.restaurantName}
                  onChange={handleInputChange}
                  placeholder="Enter your restaurant name"
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="text-gray-700 font-medium">Contact Person Name *</Label>
                  <Input 
                    id="contactPerson" 
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    placeholder="Full name of contact person"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
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
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="restaurant@example.com"
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              {/* Address and Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address" className="text-gray-700 font-medium">Restaurant Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea 
                      id="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Full address including street, city, state"
                      className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      rows={3}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-gray-700 font-medium">Pincode *</Label>
                  <Input 
                    id="pincode" 
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="123456"
                    maxLength={6}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                  <p className="text-xs text-gray-500">This helps match you with nearby recipients</p>
                </div>
              </div>

              {/* Food Information */}
              <div className="space-y-2">
                <Label htmlFor="foodTypes" className="text-gray-700 font-medium">Type of Food Donatable (Optional)</Label>
                <Textarea 
                  id="foodTypes" 
                  value={formData.foodTypes}
                  onChange={handleInputChange}
                  placeholder="e.g., Fresh meals, baked goods, packaged items, beverages..."
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  rows={3}
                />
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password *</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a secure password"
                      className="pr-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password *</Label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword" 
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="pr-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Agreement */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="termsAccepted" 
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) => handleCheckboxChange('termsAccepted', checked as boolean)}
                    className="mt-1" 
                  />
                  <Label htmlFor="termsAccepted" className="text-sm text-gray-600 leading-relaxed">
                    I agree to follow all food safety guidelines and understand that all donations must comply with local health regulations. I accept the terms of service and privacy policy.
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="liabilityAccepted" 
                    checked={formData.liabilityAccepted}
                    onCheckedChange={(checked) => handleCheckboxChange('liabilityAccepted', checked as boolean)}
                    className="mt-1" 
                  />
                  <Label htmlFor="liabilityAccepted" className="text-sm text-gray-600 leading-relaxed">
                    I understand that FoodShare facilitates connections but does not assume liability for food quality or safety after pickup.
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button 
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg mb-4"
                >
                  {isLoading ? "Registering..." : "Register Restaurant"}
                </Button>
                <p className="text-sm text-gray-500 mb-4">
                  Registration takes 24-48 hours for approval
                </p>
                <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                  Already Registered? Login
                </Link>
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
