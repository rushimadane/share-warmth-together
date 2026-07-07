import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200/70 bg-white/50 px-6 py-10 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-orange-400">
            <Heart className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-gray-800">FoodShare</span>
        </Link>
        <p className="text-sm text-gray-500">
          Reducing food waste, one shared meal at a time.
        </p>
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} FoodShare
        </p>
      </div>
    </footer>
  );
};

export default Footer;
