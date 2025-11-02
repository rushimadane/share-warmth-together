import React, { useState, FormEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Package, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  GeoPoint, // Import GeoPoint
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import MainHeader from "@/components/MainHeader";

// State for user's location
type UserLocation = {
  geoPoint: GeoPoint;
  geohash: string;
};

const CreateRequest: React.FC = () => {
  const [requestTitle, setRequestTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("Approx. 10-20 people");
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = auth.currentUser;

  // Fetch the recipient's location when component loads
  useEffect(() => {
    const fetchUserLocation = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "recipients", currentUser.uid));
        if (userDoc.exists() && userDoc.data().geoPoint) {
          const data = userDoc.data();
          setUserLocation({
            geoPoint: data.geoPoint,
            geohash: data.geohash,
          });
        } else {
          setLocationError(
            "Please complete your profile with your location before posting."
          );
        }
      }
    };
    fetchUserLocation();
  }, [currentUser]);

  const handleCreateRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!requestTitle || !quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Not Authenticated",
        description: "You must be logged in to create a request.",
        variant: "destructive",
      });
      return;
    }

    // === NEW CHECK ===
    if (!userLocation) {
      toast({
        title: "Location Not Found",
        description: locationError || "Could not find your location.",
        variant: "destructive",
      });
      return;
    }
    // === END CHECK ===

    setIsLoading(true);

    try {
      await addDoc(collection(db, "posts"), {
        creatorId: currentUser.uid,
        userType: "recipient",
        postType: "request",
        status: "available",
        foodName: requestTitle,
        description,
        quantity,
        createdAt: serverTimestamp(),
        // === ADDED LOCATION DATA TO POST ===
        geohash: userLocation.geohash,
        geoPoint: userLocation.geoPoint,
      });

      toast({
        title: "Request Posted!",
        description: "Your food request is now visible to nearby donors.",
      });

      navigate("/feed");
    } catch (error: any) {
      toast({
        title: "Error Creating Request",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user has no location, block the form
  if (locationError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50">
      <MainHeader />
       <div className="py-10 px-4">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle size={24} /> Location Missing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-lg">
                {locationError}
              </p>
              {/* You would add a "Go to Profile" button here */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50">
      <MainHeader />
      <div className="py-10 px-4">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={24} /> Create a Food Request
              </CardTitle>
              <CardDescription>
                Describe the food you are looking for.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleCreateRequest}>
                <div>
                  <Label htmlFor="requestTitle">Request Title *</Label>
                  <Input
                    id="requestTitle"
                    name="requestTitle"
                    value={requestTitle}
                    onChange={(e) => setRequestTitle(e.target.value)}
                    placeholder="e.g., 'Need meals for 50 people'"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., 'Looking for pre-packaged meals for our evening shelter service. Veg preferred.'"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">
                    Quantity (serves approx) *
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g., 10-20 people"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || !userLocation}>
                  {isLoading ? "Posting Request..." : "Post Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;