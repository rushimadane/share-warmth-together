import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  Phone,
  Mail,
  Search,
  Users,
  Clock,
  Heart,
  LocateFixed, // Import new icons
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, GeoPoint } from "firebase/firestore"; // Import GeoPoint
import { geohashForLocation } from "geofire-common"; // Import geohash
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import MainHeader from "@/components/MainHeader";

// Define a type for our location state
type LocationData = {
  lat: number;
  lng: number;
};

const FindFoodNearby = () => {
  // Registration form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [address, setAddress] = useState(""); // For manual address
  const [location, setLocation] = useState<LocationData | null>(null); // New state for coords
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [foodPreferences, setFoodPreferences] = useState<string[]>([]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false); // State for location button

  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePreferenceChange = (preference: string, checked: boolean) => {
    // ... (same as before)
  };
  
  // === NEW FUNCTION: Get Browser Location ===
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
        toast({
          title: "Success",
          description: "Location captured!",
        });
      },
      (error) => {
        setIsLocating(false);
        toast({
          title: "Error",
          description: `Failed to get location: ${error.message}`,
          variant: "destructive",
        });
      }
    );
  };
  // === END NEW FUNCTION ===

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !fullName ||
      !email ||
      !phone ||
      !address ||
      !location || // Check for location coords
      !password
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields and set your location.",
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // --- THIS IS THE FIX ---
      // We explicitly tell TypeScript this is a mutable [number, number] tuple
      const coords: [number, number] = [location.lat, location.lng];
      
      // Now this line will work
      const hash = geohashForLocation(coords); 
      const geoPoint = new GeoPoint(location.lat, location.lng);
      // -------------------

      // Store additional data in Firestore
      await setDoc(doc(db, "recipients", user.uid), {
        fullName,
        email,
        phone,
        organization: organization || null,
        address: address, // Save manual address
        geohash: hash, // Save geohash for querying
        geoPoint: geoPoint, // Save Firestore GeoPoint
        foodPreferences,
        userType: "recipient",
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Registration successful! Welcome to FoodShare.",
      });

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
              Access fresh, surplus food from local restaurants. Register as a
              recipient to see donations near you.
            </p>
          </div>
        </div>
      </section>

      {/* Link to Feed Section */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              See Available Food
            </h2>
            <div className="flex justify-center">
              <Button
                onClick={() => navigate("/feed")}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Go to Live Feed
              </Button>
            </div>
            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Already Registered? Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-100 to-orange-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Register as a Recipient
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Join our community to get notified about available food in your
              area
            </p>

            <form onSubmit={handleRegistration} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... full name and email inputs ... */}
                <div className="space-y-2">
                  <Label
                    htmlFor="full-name"
                    className="text-gray-700 font-medium"
                  >
                    Full Name *
                  </Label>
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
                  <Label
                    htmlFor="recipient-email"
                    className="text-gray-700 font-medium"
                  >
                    Email Address *
                  </Label>
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
                {/* ... phone input ... */}
                <Label
                  htmlFor="recipient-phone"
                  className="text-gray-700 font-medium"
                >
                  Phone Number (for WhatsApp) *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="recipient-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91..."
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                {/* ... organization input ... */}
                <Label
                  htmlFor="organization"
                  className="text-gray-700 font-medium"
                >
                  Organization/NGO Name (if applicable)
                </Label>
                <Input
                  id="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Leave blank if individual recipient"
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              {/* === MODIFICATION START: Replaced Pincode with Geolocation === */}
              <div className="space-y-2">
                <Label
                  htmlFor="recipient-address"
                  className="text-gray-700 font-medium"
                >
                  Full Address *
                </Label>
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
                <Label className="text-gray-700 font-medium">
                  Set Your Location *
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LocateFixed className="mr-2 h-4 w-4" />
                  )}
                  {isLocating
                    ? "Getting Location..."
                    : location
                    ? "Location Captured!"
                    : "Get My Current Location"}
                </Button>
                {location && (
                  <p className="text-sm text-green-600 text-center">
                    Success! Your location coordinates are saved.
                  </p>
                )}
              </div>
              {/* === MODIFICATION END === */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... password fields ... */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Password *
                  </Label>
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
                  <Label
                    htmlFor="confirm-password"
                    className="text-gray-700 font-medium"
                  >
                    Confirm Password *
                  </Label>
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

              <div className="space-y-2">
                {/* ... food preferences checkboxes ... */}
              </div>

              <div className="space-y-4">
                {/* ... terms checkbox ... */}
                 <div className="flex items-start space-x-3">
                  <Checkbox
                    id="recipient-terms"
                    className="mt-1"
                    checked={agreeTerms}
                    onCheckedChange={(checked) =>
                      setAgreeTerms(checked === true)
                    }
                    required
                  />
                  <Label
                    htmlFor="recipient-terms"
                    className="text-sm text-gray-600 leading-relaxed"
                  >
                    I understand the pickup guidelines and agree to handle
                    donated food safely. I accept the terms of service and
                    privacy policy.
                  </Label>
                </div>
              </div>

              <div className="text-center pt-6">
                {/* ... submit button ... */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-12 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg mb-4"
                >
                  {isLoading ? "Registering..." : "Register as Recipient"}
                </Button>
                <div>
                  <Link
                    to="/login"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Already Registered? Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ... How It Works Section ... */}
    </div>
  );
};

export default FindFoodNearby;