import React, { useState, FormEvent } from "react";
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
import { Package, AlertCircle, LocateFixed, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useGeolocation } from "@/hooks/useGeolocation";
import { saveUserLocation } from "@/services/users.service";
import { createPost } from "@/services/posts.service";
import type { GeoLocation } from "@/types/models";
import MainHeader from "@/components/MainHeader";

const CreateRequest: React.FC = () => {
  const [requestTitle, setRequestTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("Approx. 10-20 people");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();
  const { isLocating, detect } = useGeolocation();

  // Location comes straight from the profile once it's set.
  const location: GeoLocation | null =
    profile?.geoPoint && profile?.geohash
      ? { geoPoint: profile.geoPoint, geohash: profile.geohash }
      : null;

  const handleDetectLocation = async () => {
    if (!user) return;
    try {
      const captured = await detect();
      await saveUserLocation(user.uid, "recipient", captured);
      await refreshProfile();
      toast({
        title: "Location Saved!",
        description: "You can now create your food request.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to set your location.",
        variant: "destructive",
      });
    }
  };

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
        userType: "recipient",
        foodName: requestTitle,
        description,
        quantity,
        location,
      });

      toast({
        title: "Request Posted!",
        description: "Your food request is now visible to nearby donors.",
      });
      navigate("/feed");
    } catch (error: any) {
      toast({
        title: "Error Creating Request",
        description: error?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // No location yet — let the recipient set it right here.
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
                  Please set your location before posting a request.
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
                  We'll use your device location to show your requests to nearby
                  donors. This is saved to your profile, so you only need to do
                  it once.
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
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
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
