"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  TrendingUp,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Package,
  IndianRupee,
  Clock,
  Target,
  Zap,
} from "lucide-react";

// Sample chat messages
const initialMessages = [
  {
    id: "1",
    role: "assistant" as const,
    content:
      "Hello! I'm your AI Copilot for Nature's Crates. I can help you with analytics, campaign suggestions, customer insights, and more. What would you like to know?",
    timestamp: "10:00 AM",
  },
  {
    id: "2",
    role: "user" as const,
    content: "What's our best performing product this month?",
    timestamp: "10:02 AM",
  },
  {
    id: "3",
    role: "assistant" as const,
    content:
      "Based on this month's data, **Premium Cashews 500g** is your best performer with:\n\n- **234 orders** (up 18% from last month)\n- **₹1,25,000** in revenue\n- **4.8/5** average rating\n- **67%** repeat purchase rate\n\nIt's particularly popular with VIP customers. Would you like me to suggest a campaign to boost sales further?",
    timestamp: "10:02 AM",
  },
  {
    id: "4",
    role: "user" as const,
    content: "What's our COD to prepaid conversion rate?",
    timestamp: "10:05 AM",
  },
  {
    id: "5",
    role: "assistant" as const,
    content:
      "Your COD to Prepaid conversion rate is currently **57.1%** (up 12% from last month). Here's a breakdown:\n\n- **Automated workflow conversions:** 43% success rate\n- **Manual agent follow-ups:** 72% success rate\n- **Discount incentive (10% off):** Best performing trigger\n\n**Insight:** Customers who receive the prepaid offer within 30 minutes of placing a COD order are 2.3x more likely to convert. Your current workflow is set to 30 min delay which is optimal.\n\nWould you like me to suggest improvements to the conversion workflow?",
    timestamp: "10:05 AM",
  },
];

// Suggested questions
const suggestedQuestions = [
  {
    icon: TrendingUp,
    text: "What's this week's revenue trend?",
    category: "Analytics",
  },
  {
    icon: ShoppingCart,
    text: "Which products have low stock?",
    category: "Inventory",
  },
  {
    icon: MessageSquare,
    text: "How many messages are pending response?",
    category: "Inbox",
  },
  {
    icon: Target,
    text: "Suggest a campaign for inactive customers",
    category: "Marketing",
  },
  {
    icon: IndianRupee,
    text: "What's our profit margin this month?",
    category: "Finance",
  },
  {
    icon: Package,
    text: "Show delivery performance by courier",
    category: "Operations",
  },
  {
    icon: Clock,
    text: "What's the average response time today?",
    category: "Support",
  },
  {
    icon: BarChart3,
    text: "Compare this month vs last month",
    category: "Analytics",
  },
];

// AI response templates for demo
const aiResponses: Record<string, string> = {
  "What's this week's revenue trend?":
    "This week's revenue is **₹4,82,000** so far (Mon-Fri), which is **+15%** compared to last week (₹4,19,000).\n\n- **Best day:** Wednesday (₹1,12,000)\n- **Slowest day:** Monday (₹68,000)\n- **Avg daily:** ₹96,400\n\nYou're on track to hit ₹5.5L by end of week if current trends continue.",
  "Which products have low stock?":
    "**3 products** need restocking soon:\n\n1. **Organic Almonds 1kg** — 12 units left (avg 8 orders/day)\n2. **Trail Mix Combo** — 24 units left (avg 6 orders/day)\n3. **Dried Cranberries 250g** — 18 units left (avg 4 orders/day)\n\nAt current rate, Almonds will run out in 1.5 days. Shall I draft a restock notification?",
  "How many messages are pending response?":
    "Currently **23 messages** are pending response:\n\n- **8 high priority** (waiting > 10 min)\n- **10 medium** (waiting 5-10 min)\n- **5 low** (automated replies sufficient)\n\nYour team's average response time today is 2.1 minutes. Vikram has the most active chats (12) — consider redistributing.",
  default:
    "I'll analyze that for you! Based on the available data, I can provide insights on this topic. Let me compile the relevant metrics and get back to you with a detailed answer.",
};

export default function AICopilotPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responseText =
        aiResponses[messageText] || aiResponses.default;
      const aiMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant" as const,
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-brand-primary" />
          AI Copilot
        </h1>
        <p className="text-muted-foreground">
          Your intelligent assistant for business insights and automation
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-220px)]">
        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-9 flex flex-col border rounded-xl bg-card overflow-hidden"
        >
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-brand-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-brand-primary text-white rounded-br-sm"
                        : "bg-accent/50 border rounded-bl-sm"
                    }`}
                  >
                    <div
                      className={`text-sm whitespace-pre-wrap ${
                        message.role === "assistant" ? "prose prose-sm dark:prose-invert max-w-none" : ""
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                    <p
                      className={`text-[10px] mt-1.5 ${
                        message.role === "user" ? "text-white/60" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                  {message.role === "user" && (
                    <div className="h-8 w-8 rounded-full bg-brand-secondary/10 flex items-center justify-center shrink-0 mt-1">
                      <User className="h-4 w-4 text-brand-secondary" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-brand-primary" />
                </div>
                <div className="bg-accent/50 border rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-brand-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 rounded-full bg-brand-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 rounded-full bg-brand-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Ask me anything about your business..."
                  className="pr-12 h-11"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 text-center">
              AI Copilot uses your business data to provide insights. Responses are generated for demonstration purposes.
            </p>
          </div>
        </motion.div>

        {/* Suggested Questions Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-3 border rounded-xl bg-card overflow-y-auto"
        >
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-brand-secondary" />
              Suggested Questions
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Click to ask instantly
            </p>
          </div>
          <div className="p-3 space-y-2">
            {suggestedQuestions.map((question, index) => {
              const QuestionIcon = question.icon;
              return (
                <motion.button
                  key={question.text}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  onClick={() => handleSend(question.text)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-accent/50 hover:border-brand-primary/30 transition-all group"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-brand-primary/10 flex items-center justify-center shrink-0 group-hover:bg-brand-primary/20 transition-colors">
                      <QuestionIcon className="h-3.5 w-3.5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        {question.text}
                      </p>
                      <Badge variant="outline" className="mt-1.5 text-[10px] px-1.5 py-0">
                        {question.category}
                      </Badge>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-t mt-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Quick Stats
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg bg-accent/30">
                <span className="text-xs text-muted-foreground">Queries Today</span>
                <span className="text-sm font-bold">47</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-accent/30">
                <span className="text-xs text-muted-foreground">Insights Generated</span>
                <span className="text-sm font-bold">23</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-accent/30">
                <span className="text-xs text-muted-foreground">Actions Triggered</span>
                <span className="text-sm font-bold">8</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
