import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Mail, MapPin, LocateFixed, Loader2 } from "lucide-react"; // Import new icons
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/useGeolocation";
import { registerDonor } from "@/services/auth.service";
import type { GeoLocation } from "@/types/models";
import { Button } from "@/components/ui/button";

const DonorRegistrationForm = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(""); // For manual address
  const [location, setLocation] = useState<GeoLocation | null>(null); // Captured coords + geohash
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLocating, detect } = useGeolocation();

  const handleGetLocation = async () => {
    try {
      setLocation(await detect());
      toast({ title: "Success", description: "Location captured!" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to get location: ${error?.message}`,
        variant: "destructive",
      });
    }
  };

 const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !restaurantName ||
      !email ||
      !phone ||
      !address || // Check for manual address
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
      await registerDonor({
        email,
        password,
        restaurantName,
        phone,
        address,
        location,
      });

      toast({
        title: "Registered",
        description:
          "Your registration is complete. You will now be logged in.",
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
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Join as a Food Donor
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Register your restaurant to start donating surplus food
          </p>

          <form onSubmit={handleRegistration} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="restaurant-name"
                className="text-gray-700 font-medium"
              >
                Restaurant Name *
              </Label>
              <Input
                id="restaurant-name"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="Enter restaurant name"
                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ... email and phone inputs ... */}
               <div className="space-y-2">
                <Label
                  htmlFor="donor-email"
                  className="text-gray-700 font-medium"
                >
                  Email Address *
                </Label>
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
                <Label
                  htmlFor="donor-phone"
                  className="text-gray-700 font-medium"
                >
                  Phone Number (for WhatsApp) *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="donor-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91..."
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* === MODIFICATION START: Replaced Pincode with Geolocation === */}
            <div className="space-y-2">
              <Label
                htmlFor="donor-address"
                className="text-gray-700 font-medium"
              >
                Full Address *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="donor-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full restaurant address (e.g., 123 MG Road, Pune)"
                  className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">
                Set Pickup Location *
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
                <Label htmlFor="password" className="text-gray-700 font-medium">
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

            <div className="space-y-4">
              {/* ... terms checkbox ... */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="donor-terms"
                  className="mt-1"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                  required
                />
                <Label
                  htmlFor="donor-terms"
                  className="text-sm text-gray-600 leading-relaxed"
                >
                  I agree to donate surplus food responsibly and comply with food
                  safety guidelines. I accept the terms of service and privacy
                  policy.
                </Label>
              </div>
            </div>

            <div className="text-center pt-6">
              {/* ... submit button ... */}
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-12 py-4 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg mb-4"
              >
                {isLoading ? "Registering..." : "Register as Donor"}
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
  );
};

export default DonorRegistrationForm;