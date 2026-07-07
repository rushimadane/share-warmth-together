import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      {/* Soft glow accents behind the glass content */}
      <div className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full bg-green-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-400 to-orange-400 shadow-lg">
            <Heart className="h-10 w-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
          Share surplus food with{" "}
          <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
            people nearby
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
          FoodShare connects restaurants that have surplus food with NGOs and
          shelters within 15&nbsp;km — so good food reaches people who need it
          instead of the bin.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/join-as-donor">
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-green-500 to-green-600 px-8 text-base hover:from-green-600 hover:to-green-700"
            >
              Donate surplus food
            </Button>
          </Link>
          <Link to="/find-food-nearby">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-2 border-orange-300 bg-white/50 px-8 text-base text-orange-700 backdrop-blur hover:bg-orange-50"
            >
              Register as an NGO
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Free to join · Coordinate pickups directly over WhatsApp
        </p>
      </div>
    </section>
  );
};

export default Hero;
