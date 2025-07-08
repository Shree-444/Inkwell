import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { type userType } from "@/types/types";
import { toast } from "sonner";
import { EditProfileSkeleton } from "@/components/ui/skeleton";

export default function EditProfile() {
  const apiBaseUrl = import.meta.env.VITE_API_URL
  const Navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState<userType>({
    name: "",
    email: "",
    password: "",
    bio: "",
    city: "",
    created_at: "",
  });

  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio,
    city: user.city,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login required to view this blog");
      Navigate("/login");
    }
    setLoading(true);
    axios
      .get(`${apiBaseUrl}/user/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
        setFormData((prev) => ({
          ...prev,
          name: res.data.user.name,
          bio: res.data.user.bio,
          city: res.data.user.city,
        }));
      })
      .catch(() => {
        toast.error("Failed to load profile");
        Navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [Navigate, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: any = {
      name: formData.name,
      bio: formData.bio,
      city: formData.city,
    };

    if (formData.currentPassword && formData.newPassword && formData.confirmPassword) {
      payload.currentPassword = formData.currentPassword;
      payload.newPassword = formData.newPassword;
      payload.confirmPassword = formData.confirmPassword;
    }

    try {
      const res = await axios.put(
        `${apiBaseUrl}/user/profile/update`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.data.updatedUser) {
        toast.error(res.data.msg);
        return;
      }
      toast.success("Profile updated!");
      setFormData({
        name: res.data.updatedUser.name,
        bio: res.data.updatedUser.bio,
        city: res.data.updatedUser.city,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      Navigate(-1)
    } catch (err) {
      console.error("internal error: ", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      bio: user.bio,
      city: user.city,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    Navigate(-1)
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              onClick={() => Navigate(-1)}
              variant="ghost"
              size="sm"
              className="mr-4 text-foreground hover:opacity-80"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg font-medium text-foreground">Edit Profile</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {Loading ? (
          <EditProfileSkeleton />
        ) : (
          <Card className="border-border">
            <CardHeader className="pb-2 pt-3">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xl">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-medium text-foreground">
                    Update Your Profile
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Make changes to your account information
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-muted text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support to update email.
                  </p>
                </div>

                {/* Bio Field */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-foreground">
                    Bio
                  </Label>
                  <Input
                    id="bio"
                    name="bio"
                    type="text"
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                    placeholder="Describe yourself"
                  />
                </div>

                {/* City Field */}
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-foreground">
                    City
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your city"
                  />
                </div>

                {/* Password Section */}
                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium text-foreground mb-4">
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="currentPassword"
                        className="text-sm font-medium text-foreground"
                      >
                        Current Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter your password to enable password change.
                      </p>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="newPassword"
                        className="text-sm font-medium text-foreground"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={formData.newPassword}
                          disabled={!formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium text-foreground"
                      >
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          disabled={!formData.currentPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Leave password fields empty to keep your current password.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-border">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="bg-primary text-primary-foreground">
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
