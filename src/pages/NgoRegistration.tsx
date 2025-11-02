import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LocateFixed, Loader2 } from "lucide-react"; // Import new icons
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import MainHeader from "@/components/MainHeader";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, GeoPoint } from "firebase/firestore"; // Import GeoPoint
import { geohashForLocation } from "geofire-common"; // Import geohash
import { auth, db } from "@/lib/firebase";

// Define a type for our location state
type LocationData = {
  lat: number;
  lng: number;
};

const NgoRegistration = () => {
  const [form, setForm] = useState({
    ngoName: "",
    pocName: "",
    email: "",
    password: "",
    darpanId: "",
    address: "", // Use Textarea for full address
    phone: "",
  });
  const [location, setLocation] = useState<LocationData | null>(null); // New state for coords
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false); // State for location button
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.ngoName ||
      !form.pocName ||
      !form.email ||
      !form.password ||
      !form.darpanId ||
      !form.phone ||
      !form.address ||
      !location // Check for location
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields and set your location.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
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
        fullName: form.pocName, // Use POC name as fullName
        email: form.email,
        phone: form.phone,
        organization: form.ngoName,
        darpanId: form.darpanId,
        address: form.address,
        geohash: hash,
        geoPoint: geoPoint,
        userType: "recipient",
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Registration Successful",
        description: "Thank you for registering your NGO. You may now log in.",
      });

      navigate("/feed"); // Navigate to feed
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50">
      <MainHeader />
      <div className="flex items-center justify-center py-10 px-2">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle>Register as NGO</CardTitle>
            <CardDescription>
              Please fill in your NGO details to access the food finder portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="ngoName">NGO Name *</Label>
                <Input
                  required
                  id="ngoName"
                  name="ngoName"
                  value={form.ngoName}
                  onChange={handleChange}
                  placeholder="Your organization name"
                />
              </div>
              <div>
                <Label htmlFor="pocName">POC Name *</Label>
                <Input
                  required
                  id="pocName"
                  name="pocName"
                  value={form.pocName}
                  onChange={handleChange}
                  placeholder="Point of Contact"
                />
              </div>
              <div>
                <Label htmlFor="email">Contact Email *</Label>
                <Input
                  required
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone (for WhatsApp) *</Label>
                <Input
                  required
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91..."
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  required
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="darpanId">NGO Darpan ID (NITI Aayog) *</Label>
                <Input
                  required
                  id="darpanId"
                  name="darpanId"
                  value={form.darpanId}
                  onChange={handleChange}
                  placeholder="Enter Darpan ID"
                />
              </div>
              
              {/* === MODIFICATION START: Replaced Pincode with Geolocation === */}
              <div>
                <Label htmlFor="address">Full Address *</Label>
                <Textarea
                  required
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Full postal address"
                  rows={3}
                />
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
              
              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NgoRegistration;