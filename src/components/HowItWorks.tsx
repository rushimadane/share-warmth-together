import { UserPlus, Utensils, MapPinned, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: UserPlus,
    title: "Create an account",
    description:
      "Sign up as a restaurant with surplus food, or as an NGO or shelter looking for donations.",
  },
  {
    icon: Utensils,
    title: "Post or request",
    description:
      "Donors list surplus meals with quantity and a best-before date. NGOs post what they need.",
  },
  {
    icon: MapPinned,
    title: "See what's nearby",
    description:
      "Your feed shows matching posts within 15 km, sorted by distance — no endless scrolling.",
  },
  {
    icon: MessageCircle,
    title: "Arrange on WhatsApp",
    description:
      "Message the other party directly to coordinate a pickup that works for both of you.",
  },
];

const HowItWorks = () => {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Four simple steps from surplus to shared meal.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-white/60 bg-white/60 p-6 shadow-sm backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-orange-400 text-white">
                <step.icon className="h-6 w-6" />
              </div>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-sm font-semibold text-orange-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Honest closing call-to-action */}
        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-white/60 bg-white/60 p-8 text-center shadow-sm backdrop-blur-md">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">
            Ready to share?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-gray-600">
            It takes a couple of minutes to sign up, and it's free.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/join-as-donor">
              <Button
                size="lg"
                className="rounded-full bg-gradient-to-r from-green-500 to-green-600 px-8 hover:from-green-600 hover:to-green-700"
              >
                Join as a donor
              </Button>
            </Link>
            <Link to="/find-food-nearby">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-orange-300 px-8 text-orange-700 hover:bg-orange-50"
              >
                Register as an NGO
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
