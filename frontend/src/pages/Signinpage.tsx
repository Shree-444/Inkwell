import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";

export default function Signin() {
  const apiBaseUrl = import.meta.env.VITE_API_URL
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"))
  const [showPassword, setShowPassword] = useState(false)
  const Navigate = useNavigate();
  const fieldsEmpty = !email.trim() || !password.trim();

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    if (isDark) document.documentElement.classList.add("dark");
    setDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground relative">

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-8"
        onClick={toggleTheme}
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      {/* Signin Card */}
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground">Your stories await. Sign in to continue</p>
        </div>

        <form
          className="space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!email.trim() || !password.trim()) {
              toast.warning("All fields are required");
              return;
            }
            setLoading(true);
            try {
              const res = await axios.post(`${apiBaseUrl}/user/signin`, {
                email,
                password,
              });

              if (res.data.token && res.data.user) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("thisUser", res.data.user.name);
                localStorage.setItem("authorId", res.data.user.id);
                toast.success("Login successful");
                Navigate("/dashboard");
              } else {
                toast.error("Invalid credentials, login failed");
              }
            } catch (e) {
              toast.error("Server error");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <Button disabled={fieldsEmpty} type="submit" className="w-full">
              Login
            </Button>
          )}
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to={"/signup"} className="font-semibold underline hover:opacity-80">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
