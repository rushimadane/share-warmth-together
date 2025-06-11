
import { Heart, Users, Leaf, Star } from "lucide-react";

const Impact = () => {
  const metrics = [
    {
      icon: Heart,
      number: "25,847",
      label: "Meals Served",
      description: "Nutritious meals delivered to families in need",
      color: "from-green-400 to-green-500"
    },
    {
      icon: Users,
      number: "342",
      label: "Partner Restaurants",
      description: "Restaurants actively sharing surplus food",
      color: "from-orange-400 to-orange-500"
    },
    {
      icon: Leaf,
      number: "12.5 tons",
      label: "Food Waste Reduced",
      description: "Food saved from going to landfills",
      color: "from-green-500 to-orange-400"
    },
    {
      icon: Star,
      number: "95%",
      label: "Satisfaction Rate",
      description: "Of partners would recommend our platform",
      color: "from-orange-500 to-green-500"
    }
  ];

  const recentDonations = [
    {
      restaurant: "Green Valley Bistro",
      donation: "50 sandwiches + soup",
      recipient: "Downtown Community Center",
      time: "2 hours ago",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      restaurant: "Sunrise Café",
      donation: "30 pastries + coffee",
      recipient: "Homeless Shelter Network",
      time: "4 hours ago", 
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      restaurant: "Ocean View Restaurant",
      donation: "40 dinner plates",
      recipient: "Senior Community Care",
      time: "6 hours ago",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Growing Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every shared meal creates ripples of positive change. See how our community is making a real difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300 border border-green-100">
              <div className={`w-16 h-16 bg-gradient-to-r ${metric.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <metric.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{metric.number}</div>
              <div className="text-lg font-semibold text-gray-700 mb-2">{metric.label}</div>
              <div className="text-sm text-gray-600">{metric.description}</div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-50 to-orange-50 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Recent Donations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentDonations.map((donation, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <img 
                    src={donation.image}
                    alt="Donated food"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 mb-1">{donation.restaurant}</div>
                    <div className="text-green-600 font-medium mb-1">{donation.donation}</div>
                    <div className="text-sm text-gray-600 mb-2">→ {donation.recipient}</div>
                    <div className="text-xs text-gray-500">{donation.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-6 py-3 rounded-full hover:scale-105 transition-transform duration-300">
              View All Donations
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
