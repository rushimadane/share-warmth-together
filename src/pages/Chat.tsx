import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { ArrowLeft, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

interface ChatParticipant {
  id: string;
  name: string;
}

const Chat: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatPartner, setChatPartner] = useState<ChatParticipant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;
  const { toast } = useToast();

  useEffect(() => {
    if (!chatId || !currentUser) return;

    const fetchChatPartner = async () => {
      const chatDocRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatDocRef);

      if (chatDoc.exists()) {
        const participants = chatDoc.data().participants;
        const partnerId = participants.find((p: string) => p !== currentUser.uid);
        
        if (partnerId) {
          // Check both donors and recipients collections for the partner's info
          const donorRef = doc(db, "donors", partnerId);
          const recipientRef = doc(db, "recipients", partnerId);

          const donorDoc = await getDoc(donorRef);
          if (donorDoc.exists()) {
            setChatPartner({ id: partnerId, name: donorDoc.data().restaurantName });
            return;
          }

          const recipientDoc = await getDoc(recipientRef);
          if (recipientDoc.exists()) {
            setChatPartner({ id: partnerId, name: recipientDoc.data().fullName });
            return;
          }
        }
      }
      setIsLoading(false);
    };

    fetchChatPartner();

    const messagesQuery = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Message)
      );
      setMessages(msgs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [chatId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !chatId || !currentUser) return;

    try {
      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: newMessage,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
      toast({
        title: "Error",
        description: "Could not send message.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex items-center p-4 border-b bg-white shadow-sm sticky top-0 z-10">
        <Button asChild variant="ghost" size="icon" className="mr-2">
          <Link to="/feed">
            <ArrowLeft />
          </Link>
        </Button>
        <Avatar className="h-9 w-9 mr-3">
          <AvatarFallback>
            {chatPartner?.name ? chatPartner.name.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-lg font-semibold">
          {chatPartner?.name || "Chat"}
        </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && <p>Loading chat...</p>}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.senderId === currentUser?.uid ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-2xl ${
                msg.senderId === currentUser?.uid
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-white border rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 bg-white border-t sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;