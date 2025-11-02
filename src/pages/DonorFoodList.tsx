import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CalendarIcon, Package, AlertCircle } from "lucide-react";
import { format } from "date-fns";
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

const CreateDonationPost: React.FC = () => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("10-20 people");
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = auth.currentUser;

  // Fetch the donor's location when component loads
  useEffect(() => {
    const fetchUserLocation = async () => {
      if (currentUser) {
        const donorDoc = await getDoc(doc(db, "donors", currentUser.uid));
        if (donorDoc.exists() && donorDoc.data().geoPoint) {
          const data = donorDoc.data();
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    // ... (same as before)
  };

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!foodName || !quantity || !expirationDate) {
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
        description: "You must be logged in to create a post.",
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
        userType: "donor",
        postType: "offering",
        status: "available",
        foodName,
        description,
        quantity,
        expirationDate,
        imageUrl: null, // Placeholder
        createdAt: serverTimestamp(),
        // === ADDED LOCATION DATA TO POST ===
        geohash: userLocation.geohash,
        geoPoint: userLocation.geoPoint,
      });

      toast({
        title: "Post Created!",
        description: "Your food donation is now visible to nearby NGOs.",
      });

      navigate("/feed");
    } catch (error: any) {
      toast({
        title: "Error Creating Post",
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
                <Package size={24} /> Create a Donation Post
              </CardTitle>
              <CardDescription>
                Describe the surplus food you would like to donate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleCreatePost}>
                 <div>
                  <Label htmlFor="foodName">Food Name / Title *</Label>
                  <Input
                    id="foodName"
                    name="foodName"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="e.g., 20 Sandwiches, Leftover Pizza"
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
                    placeholder="e.g., Assorted vegetable and cheese sandwiches. Made fresh today."
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity (serves approx) *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g., 10-20 people"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="expirationDate">Best Before *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
                        {expirationDate ? (
                          format(expirationDate, "PPP")
                        ) : (
                          <span className="text-muted-foreground">
                            Pick an expiration date
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={expirationDate ?? undefined}
                        onSelect={setExpirationDate}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="imageFile">Image (optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="Food preview"
                        className="h-12 w-12 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || !userLocation}>
                  {isLoading ? "Posting..." : "Create Post"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateDonationPost;