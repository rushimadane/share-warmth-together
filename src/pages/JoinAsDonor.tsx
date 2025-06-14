import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MapPin, Clock, Users, Phone, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import DonorHeader from "@/components/join-as-donor/DonorHeader";
import DonorHeroSection from "@/components/join-as-donor/DonorHeroSection";
import DonorRegistrationForm from "@/components/join-as-donor/DonorRegistrationForm";
import DonorHowItWorksSection from "@/components/join-as-donor/DonorHowItWorksSection";

const JoinAsDonor = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50">
      <DonorHeader />
      <DonorHeroSection />
      <DonorRegistrationForm />
      <DonorHowItWorksSection />
    </div>
  );
};

export default JoinAsDonor;
