
import { Star, Heart } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      type: "restaurant",
      name: "Maria Rodriguez",
      title: "Owner, Green Garden Restaurant",
      content: "This platform has transformed how we handle surplus food. Instead of throwing away perfectly good meals, we now know they're going to families who really need them. It feels amazing to be part of something so meaningful.",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5
    },
    {
      type: "ngo",
      name: "David Chen",
      title: "Director, Community Food Network",
      content: "The reliability and quality of donations through this platform is exceptional. We can now plan our meal services better, knowing when food will be available. It's made our operations so much more efficient.",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5
    },
    {
      type: "restaurant",
      name: "Sarah Thompson",
      title: "Manager, Urban Eats Café",
      content: "We've been using this service for six months and have donated over 500 meals. The app is so easy to use, and seeing the impact metrics motivates our entire team. Our customers love that we're fighting food waste.",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5
    },
    {
      type: "ngo",
      name: "James Wilson",
      title: "Volunteer Coordinator, Hope Kitchen",
      content: "This platform has been a game-changer for our shelter. We now receive fresh, quality food regularly from local restaurants. The coordination is seamless, and it's helped us serve 40% more people each week.",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-green-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Stories from Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from restaurant owners and NGO partners about how food sharing is making a real difference in their communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-600">{testimonial.title}</p>
                  <div className="flex mt-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <div className={`ml-auto p-2 rounded-full ${
                  testimonial.type === 'restaurant' 
                    ? 'bg-green-100' 
                    : 'bg-orange-100'
                }`}>
                  <Heart className={`w-6 h-6 ${
                    testimonial.type === 'restaurant' 
                      ? 'text-green-600' 
                      : 'text-orange-600'
                  }`} />
                </div>
              </div>
              
              <blockquote className="text-gray-700 leading-relaxed italic">
                "{testimonial.content}"
              </blockquote>
              
              <div className={`mt-4 text-sm font-medium ${
                testimonial.type === 'restaurant' 
                  ? 'text-green-600' 
                  : 'text-orange-600'
              }`}>
                {testimonial.type === 'restaurant' ? '🍽️ Restaurant Partner' : '🤝 NGO Partner'}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Join Our Success Stories</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Become part of a community that's making a real difference. Your restaurant could be the next success story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full hover:scale-105 transition-transform duration-300 font-semibold">
              Share Your Story
            </button>
            <button className="border-2 border-orange-400 text-orange-600 hover:bg-orange-400 hover:text-white px-8 py-3 rounded-full transition-all duration-300 font-semibold">
              Read More Stories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
