"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { LayoutDashboard, BookOpenText, Bookmark, FileText, Upload, UserRound, LogOut, Menu } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Vault", href: "/vault" },
    { label: "Notes", href: "/notes" },
    { label: "Bookmark", href: "/bookmark" },
    { label: "upload", href: "/question/upload" },
    { label: "ALL Q", href: "/questions" },
  ];

  const navIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    Home: LayoutDashboard,
    Vault: BookOpenText,
    Notes: FileText,
    Bookmark,
    upload: Upload,
    "ALL Q": FileText,
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/");
  };

  const handleLogin = () => {
    setMobileMenuOpen(false);
    router.push("/auth");
  };

  const navigateTo = (href: string) => {
    setMobileMenuOpen(false);
    router.push(href);
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
          {navLinks.map((link) => {
            const Icon = navIcons[link.label] ?? LayoutDashboard;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-full transition-all ${
                  isActive
                    ? "text-green-600 font-semibold"
                    : "text-muted-foreground hover:text-green-600 hover:font-semibold before:absolute before:inset-0 before:rounded-full before:border-2 before:border-green-400 before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 before:-z-10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT SECTION - Desktop Profile or Login */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              
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
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="relative px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-green-400/50 hover:scale-105 before:absolute before:inset-0 before:rounded-full before:border-2 before:border-green-400 before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100"
            >
              Login
            </button>
          )}
        </div>

        {/* MOBILE MENU */}
        <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="end" sideOffset={8} className="w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
            <DropdownMenuLabel className="px-2 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Menu
            </DropdownMenuLabel>

            {navLinks.map((link) => {
              const Icon = navIcons[link.label] ?? LayoutDashboard;
              const isActive = pathname === link.href;

              return (
                <DropdownMenuItem
                  key={link.href}
                  className={`cursor-pointer rounded-xl px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "text-green-600 font-semibold bg-green-50"
                      : "text-slate-700"
                  }`}
                  onClick={() => navigateTo(link.href)}
                >
                  <Icon className="h-4 w-4 text-emerald-600" />
                  {link.label}
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator className="my-2" />

            {user ? (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-slate-700">
                  <UserRound className="h-4 w-4 text-emerald-600" />
                  Profile
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="min-w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <DropdownMenuLabel className="font-semibold text-slate-900">
                    {user.name}
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-slate-500">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    variant="destructive"
                    className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem
                className="cursor-pointer rounded-xl px-3 py-2 text-sm font-medium text-slate-700"
                onClick={handleLogin}
              >
                <UserRound className="h-4 w-4 text-emerald-600" />
                Login
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
