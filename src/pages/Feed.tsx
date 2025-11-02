import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  Users,
  Clock,
  MessageSquare,
  Package,
  Building,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MainHeader from "@/components/MainHeader";

// Define a unified Post structure
interface Post {
  id: string;
  creatorId: string;
  foodName: string;
  description: string;
  quantity: string;
  expirationDate?: Timestamp; // Optional for requests
  createdAt: Timestamp;
  postType: "offering" | "request";
  
  // Info will be populated based on postType
  userInfo?: {
    name: string;
    pincode: string;
  };
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = auth.currentUser;

  const handleContact = async () => {
    if (!currentUser) {
      toast({
        title: "Please Login",
        description: "You must be logged in to contact a user.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (currentUser.uid === post.creatorId) {
      toast({
        title: "This is your post",
        description: "You cannot start a chat with yourself.",
      });
      return;
    }

    const chatID = [currentUser.uid, post.creatorId].sort().join("_");
    const chatRef = doc(db, "chats", chatID);

    try {
      const chatDoc = await getDoc(chatRef);
      if (!chatDoc.exists()) {
        await setDoc(chatRef, {
          participants: [currentUser.uid, post.creatorId],
          createdAt: serverTimestamp(),
        });
      }
      navigate(`/chat/${chatID}`);
    } catch (error) {
      console.error("Error creating or finding chat:", error);
      toast({
        title: "Error",
        description: "Could not start a chat session.",
        variant: "destructive",
      });
    }
  };

  const isOffering = post.postType === "offering";

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{post.foodName}</CardTitle>
        <CardDescription>
          {isOffering ? "From: " : "Request by: "}
          <span className="font-semibold text-primary">
            {post.userInfo?.name || "Loading..."}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-muted-foreground">{post.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" /> Serves: {post.quantity}
          </Badge>
          {/* Only show expiration for 'offerings' */}
          {isOffering && post.expirationDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Expires:{" "}
              {new Date(post.expirationDate.seconds * 1000).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          Posted{" "}
          {post.createdAt
            ? formatDistanceToNow(new Date(post.createdAt.seconds * 1000), {
                addSuffix: true,
              })
            : "just now"}
        </p>
        <Button onClick={handleContact}>
          <MessageSquare className="mr-2 h-4 w-4" />
          {isOffering ? "Contact Donor" : "Contact Recipient"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<"donor" | "recipient" | null>(null);
  const currentUser = auth.currentUser;

  // 1. Determine User Type
  useEffect(() => {
    const fetchUserType = async () => {
      if (!currentUser) {
        // Default to recipient view if not logged in
        setUserType("recipient");
        return;
      }
      
      const donorDoc = await getDoc(doc(db, "donors", currentUser.uid));
      if (donorDoc.exists()) {
        setUserType("donor");
        return;
      }
      
      const recipientDoc = await getDoc(doc(db, "recipients", currentUser.uid));
      if (recipientDoc.exists()) {
        setUserType("recipient");
        return;
      }
      
      // Fallback for users who are logged in but not in either collection
      setUserType("recipient");
    };
    fetchUserType();
  }, [currentUser]);

  // 2. Subscribe to the correct feed based on User Type
  useEffect(() => {
    if (!userType) return; // Wait until userType is determined

    const postTypeToQuery = userType === "donor" ? "request" : "offering";
    const userTypeToFetch = userType === "donor" ? "recipient" : "donor";
    const userDBCollection = userType === "donor" ? "recipients" : "donors";

    const q = query(
      collection(db, "posts"),
      where("status", "==", "available"),
      where("postType", "==", postTypeToQuery),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const promises = querySnapshot.docs.map(async (postDoc) => {
        const postData = postDoc.data();
        const post: Post = {
          id: postDoc.id,
          ...postData,
        } as Post;

        // Fetch the creator's information
        if (post.creatorId) {
          const userDocRef = doc(db, userDBCollection, post.creatorId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            post.userInfo = {
              name:
                userDoc.data().restaurantName ||
                userDoc.data().fullName ||
                "Unknown",
              pincode: userDoc.data().pincode,
            };
          }
        }
        return post;
      });

      const resolvedPosts = await Promise.all(promises);
      setPosts(resolvedPosts);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userType]); // Re-run this effect when userType changes

  const FeedIcon = userType === "donor" ? Building : Heart;
  const feedTitle =
    userType === "donor" ? "Active NGO Requests" : "Available Donations";
  const emptyFeedMessage =
    userType === "donor"
      ? "No active requests from NGOs right now."
      : "No donations available right now.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50">
      <MainHeader />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <FeedIcon className="text-orange-500" />
          {feedTitle}
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-8 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-700">
              {emptyFeedMessage}
            </h2>
            <p className="text-muted-foreground mt-2">
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;