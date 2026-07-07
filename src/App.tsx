import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import JoinAsDonor from "./pages/JoinAsDonor";
import FindFoodNearby from "./pages/FindFoodNearby";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DonorFoodList from "./pages/DonorFoodList";
import NgoRegistration from "./pages/NgoRegistration";
import Feed from "./pages/Feed";
import CreateRequest from "./pages/CreateRequest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/join-as-donor" element={<JoinAsDonor />} />
            <Route path="/find-food-nearby" element={<FindFoodNearby />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ngo-register" element={<NgoRegistration />} />

            {/* Authenticated routes */}
            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donor-food-list"
              element={
                <ProtectedRoute>
                  <DonorFoodList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-request"
              element={
                <ProtectedRoute>
                  <CreateRequest />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;