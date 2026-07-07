import React, { useEffect, useState } from "react";
import { GeoPoint } from "firebase/firestore";
import { distanceBetween } from "geofire-common";
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
import { useAuth } from "@/hooks/useAuth";
import { getNearbyPosts, feedPostTypeFor } from "@/services/posts.service";
import type { Post } from "@/types/models";
import MainHeader from "@/components/MainHeader";

const PostCard: React.FC<{ post: Post; currentUserLocation: GeoPoint | null }> = ({
  post,
  currentUserLocation,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleContact = () => {
    if (!user) {
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
    window.open(`https://wa.me/${phoneNumber}`, "_blank", "noopener,noreferrer");
  };

  const isOffering = post.postType === "offering";

  let distance: string | null = null;
  if (currentUserLocation && post.geoPoint) {
    distance = distanceBetween(
      [post.geoPoint.latitude, post.geoPoint.longitude],
      [currentUserLocation.latitude, currentUserLocation.longitude]
    ).toFixed(1);
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{post.foodName}</CardTitle>
          {distance && <Badge variant="outline">{distance} km away</Badge>}
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
  const { profile, userType, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = profile?.geoPoint ?? null;

  useEffect(() => {
    if (authLoading) return;

    if (!userType || !location) {
      setError("Could not find your location. Please update your profile.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    getNearbyPosts(location, feedPostTypeFor(userType))
      .then(setPosts)
      .catch((err) => {
        console.error(err);
        // Surface the real reason (e.g. a missing Firestore index link).
        setError(err?.message || "Failed to load feed.");
      })
      .finally(() => setIsLoading(false));
    // location is a GeoPoint object; key on its coordinates so we don't refetch
    // on every render from a new-but-equal reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, userType, location?.latitude, location?.longitude]);

  const FeedIcon = userType === "donor" ? Building : Heart;
  const feedTitle =
    userType === "donor"
      ? "Active NGO Requests (15km)"
      : "Available Donations (15km)";
  const emptyFeedMessage =
    userType === "donor"
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
            <p className="text-muted-foreground mt-2">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserLocation={location}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
