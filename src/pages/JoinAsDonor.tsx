import MainHeader from "@/components/MainHeader";
import DonorHeroSection from "@/components/join-as-donor/DonorHeroSection";
import DonorRegistrationForm from "@/components/join-as-donor/DonorRegistrationForm";
import DonorHowItWorksSection from "@/components/join-as-donor/DonorHowItWorksSection";

const JoinAsDonor = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50">
      <MainHeader />
      <DonorHeroSection />
      <DonorRegistrationForm />
      <DonorHowItWorksSection />
    </div>
  );
};

export default JoinAsDonor;
