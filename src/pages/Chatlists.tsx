import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const chatPromises = querySnapshot.docs.map(async (chatDoc) => {
        const chatData = chatDoc.data();
        const partnerId = chatData.participants.find(
          (p) => p !== currentUser.uid
        );

        if (partnerId) {
          const donorRef = doc(db, "donors", partnerId);
          const recipientRef = doc(db, "recipients", partnerId);
          
          const donorDoc = await getDoc(donorRef);
          const recipientDoc = await getDoc(recipientRef);
          
          const partnerName = donorDoc.exists()
            ? donorDoc.data().restaurantName
            : recipientDoc.exists()
            ? recipientDoc.data().organization
            : "Unknown User";

          return {
            id: chatDoc.id,
            partnerName,
          };
        }
        return null;
      });

      const resolvedChats = (await Promise.all(chatPromises)).filter(Boolean);
      setChats(resolvedChats);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div>
      <Header />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Conversations</h1>
        <div className="space-y-3">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-lg border">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                </div>
              </div>
            ))
          ) : chats.length > 0 ? (
            chats.map((chat) => (
              <Link
                key={chat.id}
                to={`/chat/${chat.id}`}
                className="flex items-center p-3 bg-white rounded-lg border shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarFallback>{chat.partnerName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="font-medium text-gray-800">{chat.partnerName}</div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500 py-10">
              You have no active conversations.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;