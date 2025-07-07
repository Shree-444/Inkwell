import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import { EditBlogSkeleton } from "@/components/ui/skeleton";
import BlogEditor from "@/components/ui/BlogEditor";
import { AiTools } from "@/components/ui/aiTools";
import GenTitle from "@/components/ui/GenTitle";

export function EditBlog() {
  const apiBaseUrl = import.meta.env.VITE_API_URL
  const params = useParams();
  const blogId = params.id;
  const [editor, setEditor] = useState<any>(null);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [, setPlainTextContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const Navigate = useNavigate();

  const token = localStorage.getItem("token");
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));
  
  useEffect(() => {
    if (!blogId) {
      toast.error("Invalid blog ID");
      Navigate("/dashboard");
      return;
    }
    if (!token) {
      toast.error("Session expired, please log in");
      Navigate("/");
      return;
    }

    setIsLoading(true);
    axios
      .get(`${apiBaseUrl}/blog/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFormData({
          title: res.data.blog.title,
          content: res.data.blog.content,
        });
      })
      .catch(() => {
        toast.error("Failed to fetch blog");
        Navigate("/dashboard");
      })
      .finally(() => setIsLoading(false));
  }, [blogId, Navigate, token]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Session expired, please log in");
      return;
    }

    setIsSaving(true);
    axios
      .put(
        `${apiBaseUrl}/blog/${blogId}/update`,
        { title: formData.title, content: formData.content },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (!res.data.updatedBlog) {
          toast.error("Blog update failed");
          Navigate(-1);
          return;
        }
        toast.success("Blog updated successfully");
        Navigate(-1);
      })
      .catch(() => toast.error("Failed to update blog"))
      .finally(() => setIsSaving(false));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                onClick={() => Navigate(`/blog/${blogId}`)}
                variant="ghost"
                size="sm"
                className="mr-1 text-foreground hover:opacity-80 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="sm:text-lg text-md font-medium text-foreground">
                Edit Blog
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="bg-primary text-primary-foreground hover:opacity-80 cursor-pointer"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <EditBlogSkeleton />
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-lg font-medium text-foreground">
                    Title
                  </Label>
                  <div className="flex">
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      autoFocus
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                      placeholder="Enter your blog post title..."
                      className="sm:text-2xl md:text-lg lg:text-lg font-medium border-none p-0 focus:ring-0 placeholder:text-muted-foreground h-auto"
                    />
                    <GenTitle 
                      content={formData.content} 
                      setTitle={(title) => setFormData((prev) => ({ ...prev, title }))} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium text-foreground">
                      Content
                    </Label>
                    <div className="text-xs text-muted-foreground">
                      {wordCount} words · {estimatedReadTime} min read
                    </div>
                  </div>

                  {editor && <AiTools editor={editor} />}

                  <BlogEditor
                    content={formData.content}
                    setContent={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                    setPlainText={setPlainTextContent}
                    setWordCount={setWordCount}
                    getEditor={setEditor}
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        )}
      </main>
    </div>
  );
}
