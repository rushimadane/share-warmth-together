
import { Heart, Mail, Users, Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-orange-400 rounded-full flex items-center justify-center mr-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">FoodShare</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Connecting restaurants with surplus food to NGOs, charities, and individuals in need. 
              Together, we're building a world with less waste and more care.
            </p>
            <div className="flex space-x-4">
              <button className="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300">
                <span className="text-sm font-bold">f</span>
              </button>
              <button className="w-10 h-10 bg-gray-700 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors duration-300">
                <span className="text-sm font-bold">t</span>
              </button>
              <button className="w-10 h-10 bg-gray-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors duration-300">
                <span className="text-sm font-bold">i</span>
              </button>
              <button className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-300">
                <span className="text-sm font-bold">in</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-400" />
              For Restaurants
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#" className="hover:text-green-400 transition-colors duration-300">How to Donate</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors duration-300">Success Stories</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors duration-300">Food Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors duration-300">Tax Benefits</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors duration-300">Restaurant Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-orange-400" />
              For Recipients
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#" className="hover:text-orange-400 transition-colors duration-300">Find Food</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors duration-300">NGO Registration</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors duration-300">Pickup Guidelines</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors duration-300">Community Resources</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors duration-300">Recipient Login</a></li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-green-400" />
              Contact Us
            </h4>
            <div className="text-gray-300 space-y-2">
              <p>Email: hello@foodshare.org</p>
              <p>Phone: (555) 123-4567</p>
              <p>Emergency: (555) 987-6543</p>
              <p>Address: 123 Community St, City, State 12345</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-orange-400" />
              About
            </h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Our Mission</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Team</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Impact Report</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Press Kit</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">Stay updated on our impact and new features.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-l-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button className="bg-gradient-to-r from-green-500 to-orange-500 px-6 py-2 rounded-r-full hover:opacity-90 transition-opacity duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2024 FoodShare. All rights reserved.
            </div>
            <div className="flex space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Cookie Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Food Safety</a>
            </div>
          </div>
          
          <div className="mt-6 text-center text-gray-400 text-sm">
            <p className="mb-2">
              <strong>Legal Disclaimer:</strong> All food donations are subject to local health and safety regulations. 
              FoodShare facilitates connections but does not assume liability for food quality or safety.
            </p>
            <p>
              By using this platform, donors and recipients agree to follow all applicable food safety guidelines 
              and assume responsibility for proper handling and transportation of donated food items.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
