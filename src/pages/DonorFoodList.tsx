import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // New import
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
import { CalendarIcon, Image as ImageIcon, Package } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const CreateDonationPost: React.FC = () => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("10-20 people"); // Changed to string for flexibility
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImageUrl(e.target?.result as string);
      reader.readAsDataURL(file);
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

    if (!auth.currentUser) {
      toast({
        title: "Not Authenticated",
        description: "You must be logged in to create a post.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, you would upload the imageFile to Firebase Storage first
      // and get a URL. For now, we'll proceed without image upload logic.

      await addDoc(collection(db, "posts"), {
        creatorId: auth.currentUser.uid,
        userType: "donor",
        postType: "offering", // This is a food 'offering' from a donor
        status: "available", // Initial status
        foodName,
        description,
        quantity,
        expirationDate,
        imageUrl: null, // Placeholder for actual image URL from storage
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Post Created!",
        description: "Your food donation is now visible to nearby NGOs.",
      });

      navigate("/"); // Navigate to home page after successful post
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={24} /> Create a Donation Post
            </CardTitle>
            <CardDescription>
              Describe the surplus food you would like to donate. This will be
              posted for NGOs to see.
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
                      disabled={(date) => date < new Date()}
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Posting..." : "Create Post"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateDonationPost;