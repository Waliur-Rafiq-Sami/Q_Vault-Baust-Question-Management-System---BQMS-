"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    birthdate: "",
    phone: "",
    role: "user",
  });

  const handleSubmit = async () => {
    await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    alert("Registered!");
  };

  return (
    <div className="space-y-3 p-4">
      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <input
        placeholder="Birthdate"
        onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
      />
      <input
        placeholder="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      {/* role select */}
      <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="user">User</option>
        <option value="subAdmin">Sub Admin</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}
