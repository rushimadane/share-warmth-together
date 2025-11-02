import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Clock, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const Home = () => {
  const [userType, setUserType] = useState(null);
  const [ngoRequests, setNgoRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const donorRef = doc(db, "donors", user.uid);
        const donorDoc = await getDoc(donorRef);
        if (donorDoc.exists()) {
          setUserType("donor");
        } else {
          setUserType("recipient");
        }
      }
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (userType === "donor") {
      const q = query(collection(db, "posts"), where("postType", "==", "request"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const requests = [];
        querySnapshot.forEach((doc) => {
          requests.push({ id: doc.id, ...doc.data() });
        });
        setNgoRequests(requests);
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, [userType]);

  const handleNavigateToChat = () => {
    navigate("/chat");
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-10 w-1/3" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">
          {userType === "donor" ? "NGO Requests" : "Your Dashboard"}
        </h1>

        {userType === "donor" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ngoRequests.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.foodName}</CardTitle>
                  <CardDescription>
                    Requested by:{" "}
                    <span className="font-semibold text-primary">
                      {post.requesterInfo?.organizationName || "An NGO"}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{post.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> Serves: {post.quantity}
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Needed By:{" "}
                      {new Date(post.neededBy.seconds * 1000).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => navigate(`/chat/${[auth.currentUser.uid, post.creatorId].sort().join('_')}`)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;