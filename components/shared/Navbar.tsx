"use client";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

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
