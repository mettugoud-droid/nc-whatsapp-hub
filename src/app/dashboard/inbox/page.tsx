"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  Inbox as InboxIcon,
} from "lucide-react";

const quickReplies = [
  "Thanks for reaching out!",
  "Your order is being processed.",
  "Let me check that for you.",
  "Is there anything else I can help with?",
  "Here's your tracking link:",
];

const statusColors: Record<string, string> = {
  open: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  resolved: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

export default function InboxPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredConversations = conversations.filter(
    (c: any) =>
      (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.lastMessage || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Empty state - No conversations
  if (!loading && conversations.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
          <p className="text-muted-foreground">
            Manage all WhatsApp conversations in one place
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-brand-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            When customers message your WhatsApp Business number, their conversations will appear here. Connect your WhatsApp Business API to get started.
          </p>
        </div>
      </div>
    );
  }

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
            {filteredConversations.map((conversation: any) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-3 border-b cursor-pointer transition-colors hover:bg-accent/50 ${
                  selectedConversation?.id === conversation.id
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
                      <p className="text-sm font-semibold truncate">{conversation.name}</p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{conversation.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{conversation.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[conversation.status] || ""}`}>
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
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b flex items-center justify-between bg-card">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-brand-primary">{selectedConversation.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{selectedConversation.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedConversation.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-accent/20">
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    No messages in this conversation
                  </div>
                )}
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
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0"><Smile className="h-5 w-5 text-muted-foreground" /></Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0"><Paperclip className="h-5 w-5 text-muted-foreground" /></Button>
                  <Input
                    placeholder="Type a message..."
                    className="flex-1 h-9"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") setMessageInput(""); }}
                  />
                  <Button size="icon" className="h-9 w-9 shrink-0"><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose a conversation from the left panel to view messages</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Panel - Customer Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-3 border rounded-xl bg-card overflow-y-auto"
        >
          {selectedConversation ? (
            <>
              <div className="p-4 border-b text-center">
                <div className="h-16 w-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold text-brand-primary">{selectedConversation.avatar}</span>
                </div>
                <h3 className="font-semibold">{selectedConversation.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedConversation.phone}</p>
                <Badge variant="default" className="mt-2">{selectedConversation.segment || "Customer"}</Badge>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 rounded-lg bg-accent/50">
                    <ShoppingCart className="h-4 w-4 mx-auto text-brand-primary mb-1" />
                    <p className="text-lg font-bold">{selectedConversation.totalOrders || 0}</p>
                    <p className="text-[10px] text-muted-foreground">Orders</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-accent/50">
                    <IndianRupee className="h-4 w-4 mx-auto text-brand-primary mb-1" />
                    <p className="text-lg font-bold">₹{((selectedConversation.ltv || 0) / 1000).toFixed(0)}K</p>
                    <p className="text-[10px] text-muted-foreground">LTV</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4 text-center">
              Select a conversation to view customer details
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
