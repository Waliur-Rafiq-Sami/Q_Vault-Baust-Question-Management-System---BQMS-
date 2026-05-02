"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Vault", href: "/vault" },
    { label: "Notes", href: "/notes" },
    { label: "Bookmark", href: "/bookmark" },
    { label: "upload", href: "/questions/upload" },
    { label: "ALL Q", href: "/all-questions" },
  ];

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/auth");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* LEFT SECTION - Logo and Name */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white transition-transform group-hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <rect x="3" y="11" width="7" height="7" />
              <path d="M14 11h7v7h-7z" />
              <path d="M14 3h7v7h-7z" />
              <path d="M3 3h7v7H3z" />
            </svg>
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Q-Vault
          </span>
        </Link>

        {/* MIDDLE SECTION - Navigation Links */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-muted-foreground transition-all hover:text-green-600 hover:font-semibold px-3 py-2 rounded-full before:absolute before:inset-0 before:rounded-full before:border-2 before:border-green-400 before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 before:-z-10"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT SECTION - User Profile or Login */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm font-medium text-foreground">
              {user.name}
            </span>

            {/* Profile Dropdown */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white font-semibold text-sm transition-all duration-300 hover:ring-4 hover:ring-green-300 hover:ring-offset-2 cursor-pointer relative">
                  {getInitials(user.name)}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-semibold">
                  {user.name}
                </DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal text-muted-foreground text-xs py-1">
                  {user.email}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleLogout}
                  className="cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="relative px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-green-400/50 hover:scale-105 before:absolute before:inset-0 before:rounded-full before:border-2 before:border-green-400 before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
