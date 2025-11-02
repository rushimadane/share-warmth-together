import React, { useState, ChangeEvent, FormEvent } from "react";
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
import { CalendarIcon, PackageOpen } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import Header from "@/components/Header";

const NgoRequestForm: React.FC = () => {
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("10-20 people");
  const [neededBy, setNeededBy] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (!foodName || !quantity || !neededBy) {
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
      const recipientDoc = await getDoc(doc(db, "recipients", currentUser.uid));
      if (!recipientDoc.exists()) {
        throw new Error("Could not find your NGO profile.");
      }

      await addDoc(collection(db, "posts"), {
        creatorId: currentUser.uid,
        userType: "recipient",
        postType: "request", // This is a food 'request' from an NGO
        status: "active", // Initial status
        foodName,
        description,
        quantity,
        neededBy,
        requesterInfo: {
            organizationName: recipientDoc.data().organization,
            pincode: recipientDoc.data().pincode,
        },
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Request Posted!",
        description: "Your food request is now visible to nearby donors.",
      });

      navigate("/"); // Navigate to home page after successful post
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
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50 py-10 px-4">
        <div className="max-w-xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageOpen size={24} /> Create a Food Request
              </CardTitle>
              <CardDescription>
                Describe the food you need. This will be posted for donors to see.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleCreateRequest}>
                <div>
                  <Label htmlFor="foodName">Food Needed / Title *</Label>
                  <Input
                    id="foodName"
                    name="foodName"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="e.g., Cooked Rice, Sandwiches, etc."
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
                    placeholder="e.g., We need cooked meals for our evening distribution drive."
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity (serves approx) *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g., 50-60 people"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="neededBy">Needed By *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
                        {neededBy ? (
                          format(neededBy, "PPP")
                        ) : (
                          <span className="text-muted-foreground">
                            Pick a date
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={neededBy ?? undefined}
                        onSelect={setNeededBy}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Posting..." : "Post Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default NgoRequestForm;