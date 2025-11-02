import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import JoinAsDonor from "./pages/JoinAsDonor";
import FindFoodNearby from "./pages/FindFoodNearby";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DonorFoodList from "./pages/DonorFoodList";
import NgoRegistration from "./pages/NgoRegistration";
import Feed from "./pages/Feed";
import Chat from "./pages/Chat";
import Inbox from "./pages/Inbox";
import CreateRequest from "./pages/CreateRequest"; // Add this import

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/join-as-donor" element={<JoinAsDonor />} />
          <Route path="/find-food-nearby" element={<FindFoodNearby />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donor-food-list" element={<DonorFoodList />} />
          <Route path="/ngo-register" element={<NgoRegistration />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/create-request" element={<CreateRequest />} /> {/* Add this route */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;