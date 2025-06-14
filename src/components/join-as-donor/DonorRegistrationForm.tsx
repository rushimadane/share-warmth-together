import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MapPin, Clock, Users, Phone, Mail } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const availablePincodes = [
  "110001", "110002", "110003", "110004", "110005",
  "400001", "400002", "400003", "400004", "400005",
  "560001", "560002", "560003", "560004", "560005",
  "600001", "600002", "600003", "600004", "600005",
  "410218"
];

const DonorRegistrationForm = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [foodType, setFoodType] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Registration] Submitted");

    if (!restaurantName || !email || !phone || !address || !pincode || !foodType || !pickupTime || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      console.log("[Registration] Missing required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      console.log("[Registration] Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      toast({
        title: "Error",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      console.log("[Registration] Terms not agreed");
      return;
    }

    setIsLoading(true);

    try {
      console.log("[Registration] Creating user...");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("[Registration] User created:", user.uid);

      await setDoc(doc(db, "donors", user.uid), {
        restaurantName,
        email,
        phone,
        address,
        pincode,
        foodType,
        pickupTime,
        userType: "donor",
        createdAt: new Date().toISOString(),
      });

      console.log("[Registration] Donor data written to Firestore");

      toast({
        title: "Registered",
        description: "Your registration is complete and recorded in our system.",
      });

      // Add timeout to see if navigate maybe runs "too early"
      setTimeout(() => {
        console.log("[Registration] Navigating to /donor-food-list");
        navigate("/donor-food-list");
      }, 400);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register",
        variant: "destructive",
      });
      console.error("[Registration] Error:", error);
    } finally {
      setIsLoading(false);
      console.log("[Registration] Finished handling registration");
    }
  };

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Join as a Food Donor</h2>
          <p className="text-gray-600 text-center mb-8">
            Register your restaurant to start donating surplus food to those in need
          </p>
          
          <form onSubmit={handleRegistration} className="space-y-6">
            {/* Restaurant Information */}
            <div className="space-y-2">
              <Label htmlFor="restaurant-name" className="text-gray-700 font-medium">Restaurant Name *</Label>
              <Input 
                id="restaurant-name" 
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Enter restaurant name"
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="donor-email" className="text-gray-700 font-medium">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="donor-email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="restaurant@email.com"
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="donor-phone" className="text-gray-700 font-medium">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    id="donor-phone" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address and Pincode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="donor-address" className="text-gray-700 font-medium">Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea 
                    id="donor-address" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full restaurant address"
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    rows={3}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="donor-pincode" className="text-gray-700 font-medium">Pincode *</Label>
                <Select value={pincode} onValueChange={setPincode} required>
                  <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Select pincode" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePincodes.map((availablePincode) => (
                      <SelectItem key={availablePincode} value={availablePincode}>
                        {availablePincode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Must match service areas</p>
              </div>
            </div>

            {/* Food Donation Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Type of Food *</Label>
                <Select value={foodType} onValueChange={setFoodType} required>
                  <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Select food type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Preferred Pickup Time *</Label>
                <Select value={pickupTime} onValueChange={setPickupTime} required>
                  <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500">
                    <SelectValue placeholder="Select pickup time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12 PM - 6 PM)</SelectItem>
                    <SelectItem value="evening">Evening (6 PM - 10 PM)</SelectItem>
                    <SelectItem value="night">Night (10 PM - 6 AM)</SelectItem>
                  </SelectContent>
                </Select>
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

            {/* Agreement */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="donor-terms" 
                  className="mt-1" 
                  checked={agreeTerms}
                  onCheckedChange={checked => setAgreeTerms(checked === true)}
                  required
                />
                <Label htmlFor="donor-terms" className="text-sm text-gray-600 leading-relaxed">
                  I agree to donate surplus food responsibly and comply with food safety guidelines. I accept the terms of service and privacy policy.
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <Button 
                type="submit"
                size="lg"
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg mb-4"
              >
                {isLoading ? "Registering..." : "Register as Donor"}
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
  );
};

export default DonorRegistrationForm;
