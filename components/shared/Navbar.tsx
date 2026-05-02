"use client";

import { useAuth } from "@/context/AuthContext";

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
    <div className="flex justify-between p-4 border-b">
      <h1>Q-Vault</h1>

      {user ? (
        <div className="flex gap-3">
          <span>
            {user.name} ({user.role})
          </span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <span>Not logged in</span>
      )}
    </div>
  );
}
