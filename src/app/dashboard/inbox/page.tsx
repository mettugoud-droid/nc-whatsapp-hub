"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Phone,
  ShoppingCart,
  Star,
  Clock,
  CheckCheck,
  Check,
  MessageSquare,
  User,
  Package,
  IndianRupee,
  Zap,
  StickyNote,
} from "lucide-react";

// Sample conversations data
const conversations = [
  {
    id: "1",
    name: "Deepika Nair",
    phone: "+91 98765 43210",
    avatar: "DN",
    lastMessage: "When will my order arrive? It's been 3 days.",
    timestamp: "2 min ago",
    unread: 3,
    status: "open" as const,
    segment: "VIP",
    ltv: 78000,
    totalOrders: 22,
  },
  {
    id: "2",
    name: "Rahul Sharma",
    phone: "+91 87654 32109",
    avatar: "RS",
    lastMessage: "Thanks for the cashew recommendation!",
    timestamp: "15 min ago",
    unread: 0,
    status: "resolved" as const,
    segment: "Regular",
    ltv: 45000,
    totalOrders: 12,
  },
  {
    id: "3",
    name: "Neha Singh",
    phone: "+91 76543 21098",
    avatar: "NS",
    lastMessage: "I want to change my order to prepaid",
    timestamp: "32 min ago",
    unread: 1,
    status: "pending" as const,
    segment: "Premium",
    ltv: 62000,
    totalOrders: 15,
  },
  {
    id: "4",
    name: "Amit Patel",
    phone: "+91 65432 10987",
    avatar: "AP",
    lastMessage: "Can I get a bulk order quote?",
    timestamp: "1 hr ago",
    unread: 2,
    status: "open" as const,
    segment: "B2B",
    ltv: 120000,
    totalOrders: 8,
  },
  {
    id: "5",
    name: "Priya Gupta",
    phone: "+91 54321 09876",
    avatar: "PG",
    lastMessage: "Order delivered. Quality is amazing!",
    timestamp: "2 hr ago",
    unread: 0,
    status: "closed" as const,
    segment: "Regular",
    ltv: 28000,
    totalOrders: 6,
  },
  {
    id: "6",
    name: "Vikram Reddy",
    phone: "+91 43210 98765",
    avatar: "VR",
    lastMessage: "Please share the payment link again",
    timestamp: "3 hr ago",
    unread: 1,
    status: "pending" as const,
    segment: "New",
    ltv: 5000,
    totalOrders: 2,
  },
];

const messages = [
  {
    id: "m1",
    sender: "customer",
    text: "Hi, I placed an order 3 days ago and haven't received it yet.",
    timestamp: "10:30 AM",
    status: "read",
    type: "text" as const,
  },
  {
    id: "m2",
    sender: "agent",
    text: "Hello Deepika! Let me check your order status right away. Your order #NC-4521 with Premium Cashews 500g is currently in transit.",
    timestamp: "10:32 AM",
    status: "delivered",
    type: "text" as const,
  },
  {
    id: "m3",
    sender: "customer",
    text: "When will it arrive? I need it for a party tomorrow.",
    timestamp: "10:33 AM",
    status: "read",
    type: "text" as const,
  },
  {
    id: "m4",
    sender: "agent",
    text: "I understand the urgency! Based on the tracking, your order is expected to be delivered by today evening (before 8 PM). I'll send you the live tracking link.",
    timestamp: "10:35 AM",
    status: "delivered",
    type: "text" as const,
  },
  {
    id: "m5",
    sender: "note",
    text: "Customer is VIP with 22 orders. Priority delivery flagged. Follow up if not delivered by 8 PM.",
    timestamp: "10:36 AM",
    status: "",
    type: "note" as const,
  },
  {
    id: "m6",
    sender: "customer",
    text: "That would be great, thanks! Also, do you have any new trail mix options?",
    timestamp: "10:40 AM",
    status: "read",
    type: "text" as const,
  },
  {
    id: "m7",
    sender: "agent",
    text: "Yes! We just launched a new Tropical Trail Mix with dried pineapple, coconut, and macadamia nuts. Would you like me to add it to your next order? VIP members get 15% off!",
    timestamp: "10:42 AM",
    status: "delivered",
    type: "text" as const,
  },
  {
    id: "m8",
    sender: "customer",
    text: "When will my order arrive? It's been 3 days.",
    timestamp: "11:05 AM",
    status: "read",
    type: "text" as const,
  },
];

const quickReplies = [
  "Thanks for reaching out!",
  "Your order is being processed.",
  "Let me check that for you.",
  "Is there anything else I can help with?",
  "Here's your tracking link:",
];

const customerOrders = [
  { id: "NC-4521", product: "Premium Cashews 500g", status: "In Transit", amount: 899, date: "3 days ago" },
  { id: "NC-4398", product: "Organic Almonds 1kg", status: "Delivered", amount: 1450, date: "2 weeks ago" },
  { id: "NC-4201", product: "Trail Mix Combo Pack", status: "Delivered", amount: 1200, date: "1 month ago" },
];

const statusColors: Record<string, string> = {
  open: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  resolved: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
        <p className="text-muted-foreground">
          Manage all WhatsApp conversations in one place
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-220px)]">
        {/* Left Panel - Conversation List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-3 flex flex-col border rounded-xl bg-card overflow-hidden"
        >
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-3 border-b cursor-pointer transition-colors hover:bg-accent/50 ${
                  selectedConversation.id === conversation.id
                    ? "bg-brand-primary/5 border-l-2 border-l-brand-primary"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-brand-primary">
                      {conversation.avatar}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold truncate">
                        {conversation.name}
                      </p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          statusColors[conversation.status]
                        }`}
                      >
                        {conversation.status}
                      </span>
                      {conversation.unread > 0 && (
                        <span className="h-4 w-4 rounded-full bg-brand-primary text-white text-[10px] flex items-center justify-center font-bold">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Center Panel - Chat View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-6 flex flex-col border rounded-xl bg-card overflow-hidden"
        >
          {/* Chat Header */}
          <div className="p-3 border-b flex items-center justify-between bg-card">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-brand-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-brand-primary">
                  {selectedConversation.avatar}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold">{selectedConversation.name}</p>
                <p className="text-xs text-muted-foreground">{selectedConversation.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-accent/20">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${
                    message.type === "note"
                      ? "justify-center"
                      : message.sender === "customer"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  {message.type === "note" ? (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-3 py-2 max-w-[80%]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <StickyNote className="h-3 w-3 text-yellow-600" />
                        <span className="text-[10px] font-semibold text-yellow-700 dark:text-yellow-400">
                          Internal Note
                        </span>
                      </div>
                      <p className="text-xs text-yellow-800 dark:text-yellow-300">
                        {message.text}
                      </p>
                    </div>
                  ) : (
                    <div
                      className={`max-w-[70%] rounded-2xl px-3.5 py-2 ${
                        message.sender === "customer"
                          ? "bg-card border shadow-sm rounded-bl-sm"
                          : "bg-brand-primary text-white rounded-br-sm"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <div
                        className={`flex items-center justify-end gap-1 mt-1 ${
                          message.sender === "customer"
                            ? "text-muted-foreground"
                            : "text-white/70"
                        }`}
                      >
                        <span className="text-[10px]">{message.timestamp}</span>
                        {message.sender === "agent" && (
                          <CheckCheck className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick Replies */}
          <div className="px-3 py-2 border-t flex gap-2 overflow-x-auto">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => setMessageInput(reply)}
                className="text-[11px] px-2.5 py-1 rounded-full border bg-accent/50 hover:bg-accent whitespace-nowrap transition-colors"
              >
                <Zap className="h-3 w-3 inline mr-1 text-brand-secondary" />
                {reply}
              </button>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-3 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                <Smile className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Input
                placeholder="Type a message..."
                className="flex-1 h-9"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setMessageInput("");
                }}
              />
              <Button size="icon" className="h-9 w-9 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Customer Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-3 border rounded-xl bg-card overflow-y-auto"
        >
          <div className="p-4 border-b text-center">
            <div className="h-16 w-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-lg font-bold text-brand-primary">
                {selectedConversation.avatar}
              </span>
            </div>
            <h3 className="font-semibold">{selectedConversation.name}</h3>
            <p className="text-sm text-muted-foreground">{selectedConversation.phone}</p>
            <Badge variant="default" className="mt-2">
              {selectedConversation.segment}
            </Badge>
          </div>

          <div className="p-4 space-y-4">
            {/* Customer Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 rounded-lg bg-accent/50">
                <ShoppingCart className="h-4 w-4 mx-auto text-brand-primary mb-1" />
                <p className="text-lg font-bold">{selectedConversation.totalOrders}</p>
                <p className="text-[10px] text-muted-foreground">Orders</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-accent/50">
                <IndianRupee className="h-4 w-4 mx-auto text-brand-primary mb-1" />
                <p className="text-lg font-bold">
                  ₹{(selectedConversation.ltv / 1000).toFixed(0)}K
                </p>
                <p className="text-[10px] text-muted-foreground">LTV</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Package className="h-4 w-4" /> Recent Orders
              </h4>
              <div className="space-y-2">
                {customerOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-2 rounded-lg border text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{order.id}</span>
                      <Badge
                        variant={
                          order.status === "In Transit" ? "warning" : "success"
                        }
                        className="text-[10px] px-1.5 py-0"
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-0.5">{order.product}</p>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">{order.date}</span>
                      <span className="font-semibold">₹{order.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <Star className="h-4 w-4" /> Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="text-[10px]">VIP Customer</Badge>
                <Badge variant="outline" className="text-[10px]">High LTV</Badge>
                <Badge variant="outline" className="text-[10px]">Repeat Buyer</Badge>
                <Badge variant="outline" className="text-[10px]">Cashew Lover</Badge>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
