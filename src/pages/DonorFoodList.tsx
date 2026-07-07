import React, { useState, FormEvent } from "react";
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
import {
  CalendarIcon,
  Package,
  AlertCircle,
  LocateFixed,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { saveUserLocation } from "@/services/users.service";
import { createPost } from "@/services/posts.service";
import type { GeoLocation } from "@/types/models";
import MainHeader from "@/components/MainHeader";

const CreateDonationPost: React.FC = () => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("10-20 people");
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();
  const { isLocating, detect } = useGeolocation();

  const location: GeoLocation | null =
    profile?.geoPoint && profile?.geohash
      ? { geoPoint: profile.geoPoint, geohash: profile.geohash }
      : null;

  const handleDetectLocation = async () => {
    if (!user) return;
    try {
      const captured = await detect();
      await saveUserLocation(user.uid, "donor", captured);
      await refreshProfile();
      toast({
        title: "Location Saved!",
        description: "You can now create your donation post.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to set your location.",
        variant: "destructive",
      });
    }
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

    if (!user || !location) {
      toast({
        title: "Not Ready",
        description: "You must be logged in with a location set.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createPost({
        creatorId: user.uid,
        userType: "donor",
        foodName,
        description,
        quantity,
        location,
        expirationDate,
      });

      toast({
        title: "Post Created!",
        description: "Your food donation is now visible to nearby NGOs.",
      });
      navigate("/feed");
    } catch (error: any) {
      toast({
        title: "Error Creating Post",
        description: error?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // No location yet — let the donor set it right here.
  if (!location) {
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
              <CardContent className="space-y-4">
                <p className="text-center text-lg">
                  Please set your location before posting a donation.
                </p>
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                >
                  {isLocating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <LocateFixed className="mr-2 h-4 w-4" />
                  )}
                  {isLocating ? "Getting Location..." : "Detect My Location"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  We'll use your device location to show your donations to nearby
                  NGOs. This is saved to your profile, so you only need to do it
                  once.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
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
                        onSelect={(date) => setExpirationDate(date ?? null)}
                        initialFocus
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
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
