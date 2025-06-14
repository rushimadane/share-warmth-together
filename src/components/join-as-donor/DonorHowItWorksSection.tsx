
const steps = [
  {
    number: 1,
    color: "bg-green-500",
    title: "Register",
    description: "Sign up your restaurant and provide details about your food donations.",
  },
  {
    number: 2,
    color: "bg-orange-500",
    title: "Schedule Pickup",
    description: "Set a convenient pickup time for your surplus food.",
  },
  {
    number: 3,
    color: "bg-green-500",
    title: "Donate Food",
    description: "Our team will pick up the food and distribute it to those in need.",
  },
  {
    number: 4,
    color: "bg-orange-500",
    title: "Impact",
    description: "Reduce food waste and make a positive impact on your community.",
  },
];

const DonorHowItWorksSection = () => (
  <section className="py-16 px-6 bg-gradient-to-r from-green-100 to-orange-100">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">How It Works for Donors</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step) => (
          <div className="text-center" key={step.number}>
            <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <span className="text-white font-bold text-xl">{step.number}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
            <p className="text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default DonorHowItWorksSection;
