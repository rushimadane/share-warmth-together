import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs, // Use getDocs for a one-time fetch
  doc,
  getDoc,
  orderBy,
  Timestamp,
  GeoPoint,
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
  Building,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MainHeader from "@/components/MainHeader";
// Import the correct libraries
import { geohashQueryBounds, distanceBetween } from "geofire-common";

// Define a unified Post structure
interface Post {
  id: string;
  creatorId: string;
  foodName: string;
  description: string;
  quantity: string;
  expirationDate?: Timestamp;
  createdAt: Timestamp;
  postType: "offering" | "request";
  geohash: string; // We query on this
  geoPoint: GeoPoint; // We calculate distance with this
  userInfo?: {
    name: string;
    phone: string;
    geoPoint: GeoPoint;
  };
}

// Define User structure for location
interface AppUser {
  geoPoint: GeoPoint;
  userType: "donor" | "recipient";
}

const PostCard: React.FC<{ post: Post; currentUserLocation: GeoPoint | null }> = ({
  post,
  currentUserLocation,
}) => {
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

    if (!post.userInfo?.phone) {
      toast({
        title: "Contact Not Available",
        description: "This user has not provided a phone number.",
        variant: "destructive",
      });
      return;
    }

    const phoneNumber = post.userInfo.phone.replace(/[\s+()\\-]/g, "");
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const isOffering = post.postType === "offering";

  // Calculate distance
  let distance = null;
  if (currentUserLocation && post.geoPoint) {
    const postLocation: [number, number] = [post.geoPoint.latitude, post.geoPoint.longitude];
    const userLocation: [number, number] = [currentUserLocation.latitude, currentUserLocation.longitude];
    distance = distanceBetween(postLocation, userLocation).toFixed(1); // in km
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{post.foodName}</CardTitle>
          {distance && (
            <Badge variant="outline">{distance} km away</Badge>
          )}
        </div>
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
          Contact on WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const authUser = auth.currentUser;

  // This single useEffect hook fetches the user and then the feed.
  useEffect(() => {
    const fetchFeed = async () => {
      setIsLoading(true);
      setError(null);
      setPosts([]); // Clear previous posts
      
      if (!authUser) {
        setError("Please log in to see posts near you.");
        setIsLoading(false);
        return;
      }

      // 1. Get Current User Data
      let userDoc;
      let userType: "donor" | "recipient" | null = null;
      let geoPoint: GeoPoint | null = null;
      
      const donorDoc = await getDoc(doc(db, "donors", authUser.uid));
      if (donorDoc.exists()) {
        userType = "donor";
        geoPoint = donorDoc.data().geoPoint;
      } else {
        const recipientDoc = await getDoc(doc(db, "recipients", authUser.uid));
        if (recipientDoc.exists()) {
          userType = "recipient";
          geoPoint = recipientDoc.data().geoPoint;
        }
      }

      if (!userType || !geoPoint) {
        setError("Could not find your location. Please update your profile.");
        setIsLoading(false);
        return;
      }
      
      // We have a user and their location. Save it to state for the PostCard.
      setCurrentUser({ userType, geoPoint });

      // 2. Now Fetch Posts based on this user
      try {
        const postTypeToQuery = userType === "donor" ? "request" : "offering";
        const userTypeToFetch = userType === "donor" ? "recipient" : "donor";
        const userDBCollection = userTypeToFetch === "donor" ? "donors" : "recipients";

        const center: [number, number] = [geoPoint.latitude, geoPoint.longitude];
        const radiusInM = 15 * 1000; // 15km
        const bounds = geohashQueryBounds(center, radiusInM);

        const postsCol = collection(db, "posts");
        const queries = bounds.map((b) => {
          return query(
            postsCol,
            orderBy("geohash"),
            where("geohash", ">=", b[0]),
            where("geohash", "<=", b[1]),
            where("postType", "==", postTypeToQuery),
            where("status", "==", "available")
          );
        });

        const snapshots = await Promise.all(queries.map(getDocs));
        const matchingPosts: Post[] = [];

        for (const snap of snapshots) {
          for (const postDoc of snap.docs) {
            const postData = postDoc.data();
            const postGeoPoint = postData.geoPoint as GeoPoint;
            if (!postGeoPoint) continue;

            const postLocation: [number, number] = [postGeoPoint.latitude, postGeoPoint.longitude];
            const distanceInKm = distanceBetween(postLocation, center);
            
            if (distanceInKm <= 15) {
              matchingPosts.push({
                id: postDoc.id,
                ...postData,
              } as Post);
            }
          }
        }

        const uniquePosts = Array.from(new Map(matchingPosts.map((p) => [p.id, p])).values());
        const postsWithUserInfo = await Promise.all(
          uniquePosts.map(async (post) => {
            if (!post.creatorId) return post;
            const userDocRef = doc(db, userDBCollection, post.creatorId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              post.userInfo = {
                name: userDoc.data().restaurantName || userDoc.data().fullName || "Unknown",
                phone: userDoc.data().phone || "",
                geoPoint: userDoc.data().geoPoint,
              };
            }
            return post;
          })
        );

        postsWithUserInfo.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
        setPosts(postsWithUserInfo);
      } catch (err) {
        console.error(err);
        setError("Failed to load feed.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeed();

  }, [authUser]); // This effect now ONLY re-runs when the user logs in or out.

  const FeedIcon = currentUser?.userType === "donor" ? Building : Heart;
  const feedTitle =
    currentUser?.userType === "donor"
      ? "Active NGO Requests (15km)"
      : "Available Donations (15km)";
  const emptyFeedMessage =
    currentUser?.userType === "donor"
      ? "No active requests from NGOs within 15km."
      : "No donations available within 15km right now.";

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
                  <Skeleton className="h-8 w-32" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-2xl font-semibold text-gray-700">
              {error}
            </h2>
            <p className="text-muted-foreground mt-2">
              <Link to="/login" className="text-green-600 hover:underline">
                Please log in
              </Link>{" "}
              or ensure your profile address is set.
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-700">
              {emptyFeedMessage}
            </h2>
            {/* === FIX IS HERE === */}
            {/* Replaced <WELCOME> with </p> */}
            <p className="text-muted-foreground mt-2">
              Please check back later.
            </p>
            {/* === END FIX === */}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserLocation={currentUser?.geoPoint || null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;