
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DonorHeader = () => (
  <header className="bg-white shadow-sm">
    <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-orange-400 rounded-full flex items-center justify-center mr-3">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-800">FoodShare</span>
      </Link>
      <Link to="/">
        <Button variant="outline">Back to Home</Button>
      </Link>
    </div>
  </header>
);

export default DonorHeader;
