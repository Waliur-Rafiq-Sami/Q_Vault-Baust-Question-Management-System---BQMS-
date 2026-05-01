"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const router = useRouter();

  const SUPER_ADMINS = [
    {
      id: "SA-0802410205101088",
      name: "Md. Waliur Rafiq Sami",
      pass: "sami-802139",
    },
    {
      id: "SA-0802410205101051",
      name: "Md. Tamim Hasan Siam",
      pass: "siam123",
    },
    { id: "SA-0802410205101061", name: "Milon Vai", pass: "milonTheMC" },
  ];

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    type: "login" | "signup",
  ) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      if (type === "login") {
        // Use the login function from context
        await login(data.email as string, data.password as string);
      } else {
        // Use the signup function from context
        await signup(data);
      }

      // 🔥 SUCCESS ALERT
      await Swal.fire({
        icon: "success",
        title: type === "login" ? "Welcome Back!" : "Account Created!",
        text: "Redirecting to home page...",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      // 🔥 NAVIGATE TO HOME
      router.push("/");
      router.refresh(); // Refresh to ensure Navbar detects the new session
    } catch (error: any) {
      // 🔥 ERROR ALERT
      Swal.fire({
        icon: "error",
        title: "Authentication Failed",
        text: error.message || "Something went wrong!",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Tabs defaultValue="login" className="w-full max-w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        {/* --- LOGIN TAB --- */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your email to access Q-Vault.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => handleSubmit(e, "login")}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input name="password" type="password" required />
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- SIGNUP TAB --- */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Join the platform and select your role.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => handleSubmit(e, "signup")}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input name="name" placeholder="Waliur Rafiq" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input name="password" type="password" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Birthdate</Label>
                    <Input name="birthdate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input name="phone" placeholder="017..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <select
                    name="role"
                    className="w-full border rounded-md p-2 bg-background"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="subAdmin">Sub Admin</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* 🔥 MASTER PASSWORD FIELD (Conditional) */}
                {/* 🔥 IMPROVED MASTER AUTHORIZATION FIELD */}
                {(selectedRole === "admin" || selectedRole === "subAdmin") && (
                  <div className="space-y-4 p-4 border-2 border-amber-500/50 bg-amber-500/5 rounded-xl animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-2 text-amber-600">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Security Authorization Required
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Select Authorizing Super Admin
                      </Label>
                      <select
                        name="superAdminId"
                        required
                        className="w-full border rounded-md p-2 bg-background text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                      >
                        <option value="">-- Select Super Admin --</option>
                        {SUPER_ADMINS.map((sa) => (
                          <option key={sa.id} value={sa.id}>
                            {sa.name} ({sa.id})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Authorizer Password
                      </Label>
                      <Input
                        name="masterPassword"
                        type="password"
                        placeholder="Enter your unique master key"
                        required
                        className="border-amber-200 focus-visible:ring-amber-500"
                      />
                    </div>

                    <p className="text-[10px] text-amber-600/70 italic">
                      Creating an Admin/Sub-Admin account requires direct
                      authorization from one of the three Super Admins.
                    </p>
                  </div>
                )}
                <Button className="w-full" type="submit" disabled={loading}>
                  {loading ? "Registering..." : "Sign Up"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
