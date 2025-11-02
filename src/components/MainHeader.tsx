import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageSquare,
  Package,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown, // Import ChevronDown
  Search,      // Import Search for Recipient icon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import Dropdown components
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const MainHeader = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<"donor" | "recipient" | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is a donor
        const donorDoc = await getDoc(doc(db, "donors", currentUser.uid));
        if (donorDoc.exists()) {
          setUserType("donor");
          return;
        }
        // Check if user is a recipient
        const recipientDoc = await getDoc(
          doc(db, "recipients", currentUser.uid)
        );
        if (recipientDoc.exists()) {
          setUserType("recipient");
          return;
        }
      }
      setUserType(null);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
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
        <nav className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/feed">Feed</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/inbox">
                  <MessageSquare className="w-4 h-4 mr-0 sm:mr-2" />
                  <span className="hidden sm:inline">Inbox</span>
                </Link>
              </Button>
              {userType === "donor" && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/donor-food-list">
                    <Package className="w-4 h-4 mr-0 sm:mr-2" />
                    <span className="hidden sm:inline">Create Post</span>
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>

              {/* === MODIFICATION START === */}
              {/* Replaced single Register button with a Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/join-as-donor">
                      <Heart className="w-4 h-4 mr-2" />
                      Register as Donor
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/find-food-nearby">
                      <Search className="w-4 h-4 mr-2" />
                      Register as Recipient
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* === MODIFICATION END === */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default MainHeader;