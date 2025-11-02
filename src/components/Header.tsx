import React, { useState, useEffect } from "react";
import { Heart, LogOut, User, PlusCircle, Inbox, MessagesSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(auth.currentUser);
  const [userType, setUserType] = useState<"donor" | "recipient" | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const donorRef = doc(db, "donors", currentUser.uid);
        const donorDoc = await getDoc(donorRef);
        if (donorDoc.exists()) {
          setUserType("donor");
          return;
        }

        const recipientRef = doc(db, "recipients", currentUser.uid);
        const recipientDoc = await getDoc(recipientRef);
        if (recipientDoc.exists()) {
          setUserType("recipient");
        }
      } else {
        setUserType(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Logout Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const renderUserActions = () => {
    if (userType === "donor") {
      return (
        <>
          <Button variant="outline" onClick={() => navigate("/donor-food-list")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Post
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            <Inbox className="mr-2 h-4 w-4" />
            NGO Requests
          </Button>
        </>
      );
    }
    if (userType === "recipient") {
      return (
        <>
          <Button variant="outline" onClick={() => navigate("/ngo-request-form")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Request
          </Button>
          <Button variant="outline" onClick={() => navigate("/feed")}>
            <Inbox className="mr-2 h-4 w-4" />
            Available Donations
          </Button>
        </>
      );
    }
    return null;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-orange-400 rounded-full flex items-center justify-center mr-3">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">FoodShare</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              {renderUserActions()}
              <Button variant="outline" onClick={() => navigate("/chat")}>
                <MessagesSquare className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Chats</span>
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button>
                <User className="mr-2 h-4 w-4" />
                Login / Register
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;