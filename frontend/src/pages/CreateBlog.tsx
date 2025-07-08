import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import BlogEditor from '@/components/ui/BlogEditor';
import { AiTools } from "@/components/ui/aiTools";
import GenTitle from "@/components/ui/GenTitle";


export default function CreateBlog() {

  const apiBaseUrl = import.meta.env.VITE_API_URL
  const [editor, setEditor] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [plainTextContent, setPlainTextContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const Navigate = useNavigate();
  const token = localStorage.getItem("token");
  const canPublish = formData.title.trim().length > 0 && plainTextContent.trim().length > 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  const handlePublish = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!token) {
    toast.error("Unauthorized. Please login again.");
    Navigate("/login");
    return;
  }

  setIsLoading(true);

  try {
    const res = await axios.post(
       `${apiBaseUrl}/blog`,
      {
        title: formData.title,
        content: formData.content,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.data.newBlog) {
      toast.error("Blog post failed");
      Navigate("/dashboard");
      return;
    }

    toast.success("Blog posted successfully");
    Navigate("/dashboard");
    
  } catch (err) {
    console.error(err);
    toast.error("Failed to post blog");
  } finally {
    setIsLoading(false);
  }
};


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                onClick={() => Navigate("/dashboard")}
                variant="ghost"
                size="sm"
                className="mr-1 text-foreground hover:opacity-80 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="sm:text-lg text-md font-medium text-foreground">
                Create New Blog
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                onClick={handlePublish}
                disabled={isLoading || !canPublish}
                className="bg-primary text-primary-foreground hover:opacity-80 cursor-pointer dark:hover:shadow-md dark:transition-shadow dark:hover:shadow-gray-600 duration-200"
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "Publishing..." : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handlePublish} className="space-y-6">
          {/* Title */}
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-lg font-medium text-foreground"
                >
                  Title
                </Label>
                <div className="flex">
                  <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
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

          {/* Content */}
          <Card className="border-border">
            <CardContent className="p-6 space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="content"
                  className="text-lg font-medium text-foreground"
                >
                  Content
                </Label>
                <div className="text-xs text-muted-foreground">
                  {wordCount} words · {estimatedReadTime} min read
                </div>
              </div>
              
              {editor?.view && <AiTools editor={editor} />}

              <BlogEditor
                content={formData.content}
                setContent={(value) =>
                  setFormData((prev) => ({ ...prev, content: value }))
                }
                setPlainText={setPlainTextContent}
                setWordCount={setWordCount}
                getEditor={setEditor}
              />
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
