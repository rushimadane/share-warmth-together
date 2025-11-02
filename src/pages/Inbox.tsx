import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import MainHeader from "@/components/MainHeader";

interface ChatRoom {
  id: string;
  partnerName: string;
  partnerId: string;
}

const Inbox: React.FC = () => {
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const chatPromises = querySnapshot.docs.map(async (chatDoc) => {
        const data = chatDoc.data();
        const partnerId = data.participants.find(
          (p: string) => p !== currentUser.uid
        );
        let partnerName = "Unknown User";

        if (partnerId) {
          // Check both collections for the partner's info
          const donorRef = doc(db, "donors", partnerId);
          const recipientRef = doc(db, "recipients", partnerId);

          const donorDoc = await getDoc(donorRef);
          if (donorDoc.exists()) {
            partnerName = donorDoc.data().restaurantName || "Donor";
          } else {
            const recipientDoc = await getDoc(recipientRef);
            if (recipientDoc.exists()) {
              partnerName = recipientDoc.data().fullName || "Recipient";
            }
          }
        }
        
        return {
          id: chatDoc.id,
          partnerId,
          partnerName,
        };
      });

      const chatRooms = await Promise.all(chatPromises);
      setChats(chatRooms);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-orange-50">
      <MainHeader />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <MessageSquare className="text-orange-500" />
          Your Inbox
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-6 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Messages Yet
            </h2>
            <p className="text-muted-foreground mt-2">
              Start a conversation from a food feed post.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chats.map((chat) => (
              <Link to={`/chat/${chat.id}`} key={chat.id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {chat.partnerName?.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{chat.partnerName}</h3>
                      <p className="text-sm text-muted-foreground">Click to view chat</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;