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
import { Heart, Users, Clock, Home, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MainHeader from "@/components/MainHeader"; // Import the new header

// ... (PostCard component remains the same) ...
interface Post {
  id: string;
  creatorId: string;
  foodName: string;
  description: string;
  quantity: string;
  expirationDate: Timestamp;
  createdAt: Timestamp;
  // We'll add donor info after fetching it
  donorInfo?: {
    restaurantName: string;
    pincode: string;
  };
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleContactDonor = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: "Please Login",
        description: "You must be logged in to contact a donor.",
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

    // Create a unique chat ID by combining and sorting user IDs
    const chatID = [currentUser.uid, post.creatorId].sort().join("_");
    const chatRef = doc(db, "chats", chatID);

    try {
      const chatDoc = await getDoc(chatRef);
      if (!chatDoc.exists()) {
        // If chat doesn't exist, create it
        await setDoc(chatRef, {
          participants: [currentUser.uid, post.creatorId],
          createdAt: serverTimestamp(),
        });
      }
      // Navigate to the chat room
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

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{post.foodName}</CardTitle>
        <CardDescription>
          From:{" "}
          <span className="font-semibold text-primary">
            {post.donorInfo?.restaurantName || "Loading..."}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-muted-foreground">{post.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" /> Serves: {post.quantity}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Expires:{" "}
            {new Date(post.expirationDate.seconds * 1000).toLocaleDateString()}
          </Badge>
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
        <Button onClick={handleContactDonor}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Contact Donor
        </Button>
      </CardFooter>
    </Card>
  );
};


const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Query for posts that are 'available' and are 'offerings' from donors
    const q = query(
      collection(db, "posts"),
      where("status", "==", "available"),
      where("postType", "==", "offering"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      // Create a list of promises to fetch donor info
      const promises = querySnapshot.docs.map(async (postDoc) => {
        const postData = postDoc.data();
        const post: Post = {
          id: postDoc.id,
          ...postData,
        } as Post;

        // Fetch the donor's information using the creatorId
        if (post.creatorId) {
          const donorDocRef = doc(db, "donors", post.creatorId);
          const donorDoc = await getDoc(donorDocRef);
          if (donorDoc.exists()) {
            post.donorInfo = {
              restaurantName: donorDoc.data().restaurantName,
              pincode: donorDoc.data().pincode,
            };
          }
        }
        return post;
      });

      const resolvedPosts = await Promise.all(promises);
      setPosts(resolvedPosts);
      setIsLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50">
      <MainHeader /> {/* Use the new header */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <Heart className="text-orange-500" />
          Available Donations
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
              No Donations Available Right Now
            </h2>
            <p className="text-muted-foreground mt-2">
              Please check back later for new posts.
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