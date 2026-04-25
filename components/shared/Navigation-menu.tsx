"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bookmark,
  FileText,
  LayoutDashboard,
  Menu,
  ShieldAlert,
  X,
  LogOut,
  User,
  Settings,
  Bell,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["Student", "Teacher", "CR", "Admin"],
  },
  {
    name: "Vault",
    href: "/vault",
    icon: BookOpen,
    roles: ["Student", "Teacher", "CR", "Admin"],
  },
  {
    name: "Bookmarks",
    href: "/bookmarks",
    icon: Bookmark,
    roles: ["Student", "Teacher", "CR", "Admin"],
  },
  {
    name: "Notes",
    href: "/notes",
    icon: FileText,
    roles: ["Student", "Teacher", "CR", "Admin"],
  },
  { name: "Admin", href: "/admin", icon: ShieldAlert, roles: ["Admin"] },
];

export function Navbar({
  userRole = "Student",
  userName = "Waliur Rafiq",
  userEmail = "sami@baust.edu",
}: {
  userRole?: string;
  userName?: string;
  userEmail?: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/70 backdrop-blur-2xl border-b shadow-lg"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex h-14 items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-500 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <BookOpen className="h-6 w-6" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight">Q-Vault</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Smart Study System
              </p>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-2">
            {filteredNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    isActive
                      ? "text-white bg-gradient-to-r from-primary to-purple-500 shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">
            {/* Notification */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>

            {/* PROFILE POPOVER */}
            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-accent">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>
                      {userName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-64 p-4 mt-3" align="end">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>
                      {userName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-accent hover:scale-[1.02] active:scale-[0.98]">
                    <User className="h-4 w-4 transition-transform group-hover:rotate-6" />
                    Profile
                  </button>

                  <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-all duration-200 hover:bg-accent hover:scale-[1.02] active:scale-[0.98]">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>

                  <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-600 hover:scale-[1.02] active:scale-[0.98]">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* MOBILE BUTTON */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="p-4 space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition",
                  isActive
                    ? "bg-gradient-to-r from-primary to-purple-500 text-white"
                    : "hover:bg-accent",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
