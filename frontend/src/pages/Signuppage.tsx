import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import axios from "axios";
import { ArrowLeft, Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export default function Signup() {
  const apiBaseUrl = import.meta.env.VITE_API_URL
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"))

  const navigate = useNavigate();
  const fieldsEmpty1 = !name.trim() || !email.trim() || !password.trim();
  const fieldsEmpty2 = !bio.trim() || !city.trim();

  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    document.documentElement.classList.toggle("dark", saved);
    setDarkMode(saved);
  }, []);

  const toggleTheme = () => {
    const updated = !darkMode;
    document.documentElement.classList.toggle("dark", updated);
    localStorage.setItem("darkMode", updated.toString());
    setDarkMode(updated);
  };

  return (
    <div className="min-h-screen relative bg-background text-foreground transition-colors">

      <Button
        variant="ghost"
        size="sm"
        className="absolute top-8 left-1/2 transform -translate-x-1/2"
        onClick={toggleTheme}
      >
        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      {pageIndex === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md space-y-8 p-8">
            <div className="text-center space-y-2">
              <p>1/2</p>
              <h1 className="text-3xl font-semibold tracking-tight">Join our community</h1>
              <p className="text-md text-muted-foreground">Start sharing your stories with the world</p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-6"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>

              {loading ? (
                <Spinner />
              ) : (
                <Button type="button" className="w-full" onClick={() => setPageIndex(1)} disabled={fieldsEmpty1}>
                  Next
                </Button>
              )}
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link className="font-semibold underline" to="/signin">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-md space-y-9 p-8 mb-48">
            <div className="text-center space-y-3">
              <Button onClick={() => setPageIndex(0)} variant="ghost" size="sm" className="mr-80 mb-10">
                <ArrowLeft className="h-4 w-4" /> Go Back
              </Button>
              <p>2/2</p>
              <h1 className="text-3xl font-semibold tracking-tight">Tell us about yourself</h1>
              <p className="text-md text-muted-foreground">Enter these details to finish setting up your account</p>
            </div>

            <form
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                if (fieldsEmpty1 || fieldsEmpty2) {
                  toast.warning("All fields are required");
                  return;
                }
                try {
                  setLoading(true);
                  const res = await axios.post(`${apiBaseUrl}/user/signup`, {
                    email, name, password, city, bio,
                  });
                  if (res.data.token) {
                    localStorage.setItem("token", res.data.token);
                    localStorage.setItem("thisUser", res.data.user.name);
                    localStorage.setItem("authorId", res.data.user.id);
                    toast.success("Account created successfully");
                    navigate("/dashboard");
                  } else {
                    toast.error("Account creation failed");
                  }
                  setLoading(false);
                } catch {
                  setLoading(false);
                  toast.error("Server error");
                }
              }}
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter your city"
                  />
                </div>
                <div className="space-y-2 mb-8">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe yourself"
                  />
                </div>
              </div>

              {loading ? (
                <Spinner />
              ) : (
                <Button type="submit" className="w-full" disabled={fieldsEmpty2}>
                  Create Account
                </Button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
