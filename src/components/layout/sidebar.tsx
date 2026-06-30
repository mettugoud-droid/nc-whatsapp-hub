"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, MessageSquare, Users, FileText, BarChart3,
  PieChart, Settings, CreditCard, ArrowLeftRight, Image,
  Leaf, Send, X,
} from "lucide-react";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inbox", href: "/dashboard/inbox", icon: MessageSquare },
  { name: "Messages", href: "/dashboard/messages", icon: Send },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Send },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Customer CRM", href: "/dashboard/crm", icon: Users },
  { name: "Tickets", href: "/dashboard/tickets", icon: FileText },
  { name: "Templates", href: "/dashboard/templates", icon: FileText },
  { name: "Template Builder", href: "/dashboard/template-builder", icon: FileText },
  { name: "Workflows", href: "/dashboard/workflows", icon: ArrowLeftRight },
  { name: "Recovery", href: "/dashboard/recovery", icon: ArrowLeftRight },
  { name: "Upload Data", href: "/dashboard/upload", icon: ArrowLeftRight },
  { name: "COD Conversion", href: "/dashboard/cod-conversion", icon: ArrowLeftRight },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Finance", href: "/dashboard/finance", icon: CreditCard },
  { name: "Employees", href: "/dashboard/employees", icon: Users },
  { name: "AI Copilot", href: "/dashboard/ai-copilot", icon: PieChart },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Analytics", href: "/dashboard/analytics", icon: PieChart },
  { name: "Site Visitors", href: "/dashboard/site-analytics", icon: PieChart },
  { name: "Infographics", href: "/dashboard/infographics", icon: Image },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-[260px] border-r bg-card flex flex-col transition-transform duration-300",
        "lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-brand-primary whitespace-nowrap">
            Nature&apos;s Crates
          </span>
        </Link>
        <button onClick={onClose} className="p-1.5 rounded-md hover:bg-accent lg:hidden">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-brand-primary text-white shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground text-center">
          <p>WhatsApp Hub v2.0</p>
          <p className="text-brand-primary font-medium">Nature&apos;s Crates</p>
        </div>
      </div>
    </aside>
  );
}
