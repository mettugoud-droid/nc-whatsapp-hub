"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Bell,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, setTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: "Campaign 'Festival Offer' completed", time: "2m ago", unread: true },
    { id: 2, text: "15 new COD conversions today", time: "1h ago", unread: true },
    { id: 3, text: "Payment received: ₹2,450", time: "3h ago", unread: false },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-card/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-3 sm:px-6">
        {/* Mobile menu + Search */}
        <div className="flex items-center gap-2 flex-1">
          <button onClick={onMenuClick} className="p-2 rounded-md hover:bg-accent lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <div className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-accent/50 border-0 focus-visible:ring-brand-primary/30"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                2
              </span>
            </Button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 rounded-xl border bg-card shadow-lg p-4 animate-fade-in">
                <h3 className="font-semibold mb-3">Notifications</h3>
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "flex items-start gap-3 p-2 rounded-lg",
                        n.unread && "bg-brand-primary/5"
                      )}
                    >
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full mt-2 flex-shrink-0",
                          n.unread ? "bg-brand-primary" : "bg-transparent"
                        )}
                      />
                      <div>
                        <p className="text-sm">{n.text}</p>
                        <p className="text-xs text-muted-foreground">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 rounded-full p-1 pl-1 pr-3 hover:bg-accent transition-colors"
            >
              <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-sm font-bold text-white">NC</span>
              </div>
              <span className="text-sm font-medium hidden md:block">Admin</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 w-56 rounded-xl border bg-card shadow-lg p-2 animate-fade-in">
                <div className="px-3 py-2 border-b mb-1">
                  <p className="font-medium text-sm">Nature&apos;s Crates</p>
                  <p className="text-xs text-muted-foreground">admin@naturescrates.in</p>
                </div>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                  <User className="h-4 w-4" /> Profile
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
                  <Settings className="h-4 w-4" /> Settings
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-accent text-red-500 transition-colors">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
