import MainHeader from "@/components/MainHeader";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-orange-50">
      <MainHeader />
      <Hero />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
