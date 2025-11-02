import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import HowItWorks from "@/components/HowItWorks";
import Impact from "@/components/Impact";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import MainHeader from "@/components/MainHeader"; // Add this import

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50">
      <MainHeader /> {/* Add this line */}
      <Hero />
      <Mission />
      <HowItWorks />
      <Impact />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;