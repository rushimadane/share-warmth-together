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
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import MainHeader from "@/components/MainHeader";

const CreateRequest: React.FC = () => {
  const [requestTitle, setRequestTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("Approx. 10-20 people");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

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

    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Not Authenticated",
        description: "You must be logged in to create a request.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await addDoc(collection(db, "posts"), {
        creatorId: currentUser.uid,
        userType: "recipient", // This is from a recipient
        postType: "request", // This is a food 'request'
        status: "available", // Initial status
        foodName: requestTitle, // Use the same field as donors for simplicity
        description,
        quantity,
        // Requests don't have an expiration date, but they have a creation date
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Request Posted!",
        description: "Your food request is now visible to nearby donors.",
      });

      navigate("/feed"); // Navigate to feed after successful post
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
                Describe the food you are looking for. This will be posted for
                donors to see.
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
                <Button type="submit" className="w-full" disabled={isLoading}>
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