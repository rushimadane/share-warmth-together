
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const NgoRegistration = () => {
  const [form, setForm] = useState({
    ngoName: "",
    pocName: "",
    email: "",
    password: "",
    darpanId: "",
    address: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Dummy register; actual authentication/DB would need Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Validation (Darpan ID is required)
    if (!form.darpanId) {
      toast({
        title: "NGO Darpan ID is required",
        description: "Please enter your NGO's Darpan ID (NITI Aayog).",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    // You would send data to backend here
    toast({
      title: "Registration Successful",
      description: "Thank you for registering your NGO. You may now log in.",
    });
    setLoading(false);
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-orange-50 py-10 px-2">
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
              <Label htmlFor="ngoName">NGO Name</Label>
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
              <Label htmlFor="pocName">POC Name</Label>
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
              <Label htmlFor="email">Contact Email</Label>
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
              <Label htmlFor="password">Password</Label>
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
              <Label htmlFor="darpanId">NGO Darpan ID (NITI Aayog)</Label>
              <Input
                required
                id="darpanId"
                name="darpanId"
                value={form.darpanId}
                onChange={handleChange}
                placeholder="Enter Darpan ID"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                required
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Postal Address"
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                required
                id="pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                pattern="\d{6}"
                maxLength={6}
              />
            </div>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NgoRegistration;
