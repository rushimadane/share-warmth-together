import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MapPin, Clock, Users, Phone, Mail, Search, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import MainHeader from "@/components/MainHeader"; // Import the new header

const FindFoodNearby = () => {
  const [selectedPincode, setSelectedPincode] = useState("");
  const [selectedFoodType, setSelectedFoodType] = useState("");
  const [selectedPickupTime, setSelectedPickupTime] = useState("");
  
  // ... (rest of the component state) ...
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [address, setAddress] = useState("");
  const [recipientPincode, setRecipientPincode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [foodPreferences, setFoodPreferences] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Static pincode data - in a real app, this would come from your backend
  const availablePincodes = [
    "110001", "110002", "110003", "110004", "110005",
    "400001", "400002", "400003", "400004", "400005",
    "560001", "560002", "560003", "560004", "560005",
    "600001", "600002", "600003", "600004", "600005",
    "410218" // ← Added missing pincode
  ];

  const handlePreferenceChange = (preference: string, checked: boolean) => {
    if (checked) {
      setFoodPreferences([...foodPreferences, preference]);
    } else {
      setFoodPreferences(foodPreferences.filter(p => p !== preference));
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !phone || !address || !recipientPincode || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!agreeTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional data in Firestore
      await setDoc(doc(db, "recipients", user.uid), {
        fullName,
        email,
        phone,
        organization: organization || null,
        address,
        pincode: recipientPincode,
        foodPreferences,
        userType: "recipient",
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Registration successful! Welcome to FoodShare.",
      });

      // Redirect to feed
      navigate("/feed");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50">
      {/* Replace old header with MainHeader */}
      <MainHeader />

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Find Food
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-600">
                Nearby
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Access fresh, surplus food from local restaurants. Join our community of recipients and never go hungry again.
            </p>
          </div>
        </div>
      </section>

      {/* ... (rest of the component JSX) ... */}
      
      {/* Enhanced Search Section */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Search Available Food</h2>
            
            <div className="space-y-4">
              {/* Primary Search */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode-search" className="text-gray-700 font-medium">Pincode *</Label>
                  <Select value={selectedPincode} onValueChange={setSelectedPincode}>
                    <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select your pincode" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePincodes.map((pincode) => (
                        <SelectItem key={pincode} value={pincode}>
                          {pincode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    disabled={!selectedPincode}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Find Food Nearby
                  </Button>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="border-t pt-4">
                <div className="flex items-center mb-4">
                  <Filter className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="text-gray-700 font-medium">Optional Filters</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-600">Food Type</Label>
                    <Select value={selectedFoodType} onValueChange={setSelectedFoodType}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Any type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="bakery">Bakery Items</SelectItem>
                        <SelectItem value="beverages">Beverages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">Pickup Time</Label>
                    <Select value={selectedPickupTime} onValueChange={setSelectedPickupTime}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Any time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 6 PM)</SelectItem>
                        <SelectItem value="evening">Evening (6 PM - 10 PM)</SelectItem>
                        <SelectItem value="night">Night (10 PM - 6 AM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedFoodType("");
                        setSelectedPickupTime("");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                Already Registered? Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Available Food Listings */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Available Food Near You</h2>
          {selectedPincode ? (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">
                <MapPin className="w-4 h-4 inline mr-1" />
                Showing results for pincode: <strong>{selectedPincode}</strong>
              </p>
            </div>
          ) : (
            <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-700">
                Please select a pincode to see available food donations in your area.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Food Listing 1 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center">
                <span className="text-orange-600 text-lg font-semibold">Fresh Meals</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Mama's Kitchen</h3>
                <p className="text-gray-600 mb-3">Italian cuisine • Pincode: {selectedPincode || "110001"}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  Available until 8:00 PM
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Users className="w-4 h-4 mr-1" />
                  Serves 15-20 people
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  Request Pickup
                </Button>
              </div>
            </div>

            {/* Food Listing 2 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                <span className="text-green-600 text-lg font-semibold">Baked Goods</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sweet Dreams Bakery</h3>
                <p className="text-gray-600 mb-3">Bakery • Pincode: {selectedPincode || "110002"}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  Available until 9:00 PM
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Users className="w-4 h-4 mr-1" />
                  Serves 30+ people
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  Request Pickup
                </Button>
              </div>
            </div>

            {/* Food Listing 3 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center">
                <span className="text-orange-600 text-lg font-semibold">Prepared Meals</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Golden Dragon</h3>
                <p className="text-gray-600 mb-3">Chinese cuisine • Pincode: {selectedPincode || "110003"}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  Available until 10:00 PM
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Users className="w-4 h-4 mr-1" />
                  Serves 25+ people
                </div>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                  Request Pickup
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-100 to-orange-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Register as a Recipient</h2>
            <p className="text-gray-600 text-center mb-8">
              Join our community to get notified about available food in your area
            </p>
            
            <form onSubmit={handleRegistration} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full-name" className="text-gray-700 font-medium">Full Name *</Label>
                  <Input 
                    id="full-name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient-email" className="text-gray-700 font-medium">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="recipient-email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient-phone" className="text-gray-700 font-medium">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="recipient-phone" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              {/* Organization Information (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="organization" className="text-gray-700 font-medium">Organization/NGO Name (if applicable)</Label>
                <Input 
                  id="organization" 
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Leave blank if individual recipient"
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* Address and Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="recipient-address" className="text-gray-700 font-medium">Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea 
                      id="recipient-address" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Full address for pickup coordination"
                      className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      rows={3}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient-pincode" className="text-gray-700 font-medium">Pincode *</Label>
                  <Select value={recipientPincode} onValueChange={setRecipientPincode} required>
                    <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                      <SelectValue placeholder="Select pincode" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePincodes.map((pincode) => (
                        <SelectItem key={pincode} value={pincode}>
                          {pincode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Must match available donation areas</p>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password *</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-gray-700 font-medium">Confirm Password *</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Food Preferences</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="vegetarian" 
                      checked={foodPreferences.includes("vegetarian")}
                      onCheckedChange={(checked) => handlePreferenceChange("vegetarian", checked as boolean)}
                    />
                    <Label htmlFor="vegetarian" className="text-sm">Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="vegan" 
                      checked={foodPreferences.includes("vegan")}
                      onCheckedChange={(checked) => handlePreferenceChange("vegan", checked as boolean)}
                    />
                    <Label htmlFor="vegan" className="text-sm">Vegan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="halal" 
                      checked={foodPreferences.includes("halal")}
                      onCheckedChange={(checked) => handlePreferenceChange("halal", checked as boolean)}
                    />
                    <Label htmlFor="halal" className="text-sm">Halal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="kosher" 
                      checked={foodPreferences.includes("kosher")}
                      onCheckedChange={(checked) => handlePreferenceChange("kosher", checked as boolean)}
                    />
                    <Label htmlFor="kosher" className="text-sm">Kosher</Label>
                  </div>
                </div>
              </div>

              {/* Agreement */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="recipient-terms" 
                    className="mt-1" 
                    checked={agreeTerms}
                    onCheckedChange={checked => setAgreeTerms(checked === true)}
                    required
                  />
                  <Label htmlFor="recipient-terms" className="text-sm text-gray-600 leading-relaxed">
                    I understand the pickup guidelines and agree to handle donated food safely. I accept the terms of service and privacy policy.
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button 
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg mb-4"
                >
                  {isLoading ? "Registering..." : "Register as Recipient"}
                </Button>
                <div>
                  <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                    Already Registered? Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ... (rest of the component JSX) ... */}
      
    </div>
  );
};

export default FindFoodNearby;