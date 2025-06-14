
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarIcon, Image as ImageIcon, Package } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

type FoodItem = {
  id: string;
  name: string;
  quantity: number;
  dateMade: Date | null;
  expirationDate: Date | null;
  imageUrl: string | null;
  imageFile?: File | null;
};

const DonorFoodList: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [form, setForm] = useState<Omit<FoodItem, "id" | "imageUrl" | "imageFile">>({
    name: "",
    quantity: 1,
    dateMade: null,
    expirationDate: null,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [calendarType, setCalendarType] = useState<"made" | "expire" | null>(null);

  // Add food item handler
  const handleAddFood = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.quantity || !form.dateMade || !form.expirationDate) return;
    const id = Date.now().toString();
    setFoodItems([
      ...foodItems,
      {
        id,
        ...form,
        imageUrl,
        imageFile,
      },
    ]);
    setForm({ name: "", quantity: 1, dateMade: null, expirationDate: null });
    setImageFile(null);
    setImageUrl(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCalendarChange = (date: Date | undefined, type: "made" | "expire") => {
    if (!date) return;
    setForm((prev) => ({
      ...prev,
      [type === "made" ? "dateMade" : "expirationDate"]: date,
    }));
    setCalendarType(null);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImageUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package size={24} /> Donate Food Item
            </CardTitle>
            <CardDescription>
              Fill the form to add food items you wish to donate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleAddFood}>
              <div>
                <Label htmlFor="name">Food Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Sandwich"
                  required
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  min={1}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      quantity: Math.max(Number(e.target.value), 1),
                    }))
                  }
                  required
                />
              </div>
              <div className="flex gap-4">
                {/* Date Made */}
                <div className="flex-1">
                  <Label htmlFor="dateMade">Date Made</Label>
                  <Popover open={calendarType === "made"} onOpenChange={(open) => setCalendarType(open ? "made" : null)}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full justify-start text-left"
                        onClick={() => setCalendarType("made")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
                        {form.dateMade ? format(form.dateMade, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.dateMade ?? undefined}
                        onSelect={date => handleCalendarChange(date, "made")}
                        initialFocus
                        className="p-3 pointer-events-auto"
                        disabled={date => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Expiration Date */}
                <div className="flex-1">
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Popover open={calendarType === "expire"} onOpenChange={(open) => setCalendarType(open ? "expire" : null)}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full justify-start text-left"
                        onClick={() => setCalendarType("expire")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
                        {form.expirationDate ? format(form.expirationDate, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.expirationDate ?? undefined}
                        onSelect={date => handleCalendarChange(date, "expire")}
                        initialFocus
                        className="p-3 pointer-events-auto"
                        disabled={date => form.dateMade ? date < form.dateMade : false}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
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
                    <img src={imageUrl} alt="Food preview" className="h-12 w-12 object-cover rounded border" />
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Food Item
              </Button>
            </form>
          </CardContent>
        </Card>
        {/* Food items list */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Available to Donate</h2>
          {foodItems.length === 0 ? (
            <p className="text-muted-foreground">No food items added yet.</p>
          ) : (
            <div className="space-y-4">
              {foodItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex items-center gap-4">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} className="h-16 w-16 rounded object-cover border" alt={item.name} />
                    ) : (
                      <div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
                        <ImageIcon className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                      <div className="text-xs text-muted-foreground">
                        Made: {item.dateMade ? format(item.dateMade, "PPP") : "-"}<br />
                        Expires: {item.expirationDate ? format(item.expirationDate, "PPP") : "-"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorFoodList;
