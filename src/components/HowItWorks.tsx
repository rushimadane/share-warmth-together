
import { Users, Heart, Check, Share } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Users,
      title: "Register Your Restaurant",
      description: "Sign up and tell us about your restaurant. It's quick, easy, and completely free to join our community.",
      color: "from-green-400 to-green-500"
    },
    {
      icon: Share,
      title: "Post Available Food",
      description: "Upload details about surplus food including quantity, type, and pickup time. Include photos to help recipients.",
      color: "from-orange-400 to-orange-500"
    },
    {
      icon: Heart,
      title: "Connect with Recipients",
      description: "NGOs, charities, and individuals can browse and request your donations. We facilitate the connection.",
      color: "from-green-500 to-orange-400"
    },
    {
      icon: Check,
      title: "Arrange Pickup",
      description: "Coordinate safe pickup times and locations. Track your impact and see the difference you're making.",
      color: "from-orange-500 to-green-500"
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-green-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sharing surplus food is simple and rewarding. Follow these easy steps to start making a difference today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className={`w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {index + 1}
                  </div>
                </div>
                
                <div className="mt-8 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-green-300 to-orange-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">Join our community of restaurants making a positive impact every day.</p>
            <button className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-8 py-3 rounded-full hover:scale-105 transition-transform duration-300 font-semibold">
              Start Sharing Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
