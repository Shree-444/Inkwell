import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Share2, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import type { blog } from "@/types/types";
import { PostProfileAvatar } from "@/components/ui/profileAvatar";
import { formatDistanceToNow } from "date-fns";
import { ShowBlogSkeleton } from "@/components/ui/skeleton";
import parse from 'html-react-parser';
import { toast } from "sonner";
import { DotsMenu } from "@/components/ui/dotsMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ShowBlog() {
  const apiBaseUrl = import.meta.env.VITE_API_URL
  const [blog, setBlog] = useState<blog>();
  const [publishedAt, setPublishedAt] = useState("");
  const [readTime, setReadTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<"LIKE" | "DISLIKE" | null>(null);

  const Navigate = useNavigate();
  const token = localStorage.getItem("token");
  const params = useParams()
  const thisUserId = localStorage.getItem("authorId") || "";
  const id = parseInt(params.id || '')

  const fetchReactions = async () => {
    axios.get(`${apiBaseUrl}/reaction/blog/${id}/count`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
      setUserReaction(res.data.userReaction);
    }).catch(() => {
      toast.error("Failed to load blog");
      setLoading(false);
    })
  };

  const handleShare = async () => {
    const shareData = { title: blog?.title, text: "Check out this blog!", url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } 
      catch (err) { console.error("internal error: ", err); }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast.success("Link copied to clipboard");
      } catch (err) {
        console.error("internal error: ", err);
        toast.error("Server error");
      }
    }
  };

  const deleteBlogHandler = async (id: number) => {
  if (!token) {
    toast.error("Session expired, please log in");
    Navigate("/login");
    return;
  }

  try {
    const res = await axios.delete(`${apiBaseUrl}/blog/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 200 || res.data?.success) {
      toast.success("Blog deleted successfully");
      setTimeout(() => Navigate(-1), 500);
    } else {
      toast.error("Failed to delete blog");
    }
    
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete blog");
  }
};


  const handleLike = async () => {
    setLikes((prev) => (userReaction === "LIKE" ? Math.max(prev - 1, 0) : prev + 1));
    setDislikes((prev) => (userReaction === "DISLIKE" ? Math.max(prev - 1, 0) : prev));
    setUserReaction((prev) => (prev === "LIKE" ? null : "LIKE"));

    try {
      await axios.post(`${apiBaseUrl}/reaction/blog/${id}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      toast.error("Error reacting");
    }
  };

  const handleDislike = async () => {
    setDislikes((prev) => (userReaction === "DISLIKE" ? Math.max(prev - 1, 0) : prev + 1));
    setLikes((prev) => (userReaction === "LIKE" ? Math.max(prev - 1, 0) : prev));
    setUserReaction((prev) => (prev === "DISLIKE" ? null : "DISLIKE"));

    try {
      await axios.post(`${apiBaseUrl}/reaction/blog/${id}/dislike`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      toast.error("Error reacting");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login required to view this blog");
      Navigate("/login");
    }
    setLoading(true);
    axios
      .get(`${apiBaseUrl}/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const result = res.data.blog;
        setBlog(result);
        const isoSafe = result.created_at.replace(" ", "T");
        const parsedDate = new Date(isoSafe);
        setPublishedAt(formatDistanceToNow(parsedDate, { addSuffix: true }));
        setReadTime(Math.max(Math.ceil(result.content.split(" ").length / 200), 1));
        fetchReactions();
        setLoading(false);
      }).catch(() => {
        toast.error("Failed to show blog")
        setLoading(false)
      });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button onClick={() => { localStorage.removeItem("blogId"); Navigate(-1); }} variant="ghost" size="sm" className="hover:opacity-80 cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="ghost" size="sm" className="hover:opacity-80 cursor-pointer" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Copy link to share
            </Button>
          </div>
        </div>
      </header>

      {loading ? <ShowBlogSkeleton /> : (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <article className="bg-card rounded-lg border border-border mb-8">
            <div className="p-8">
              <header className="mb-8">
                <div className="flex justify-between">
                  <h1 className="text-2xl sm:text-4xl font-semibold leading-tight">{blog?.title}</h1>
                  {blog?.authorId == parseInt(thisUserId) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="cursor-pointer"><DotsMenu /></DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <button onClick={(e) => { e.stopPropagation(); Navigate(`/blog/${blog.id}/edit-blog`); }}>
                            Edit Blog
                          </button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button onClick={(e) => e.stopPropagation()}>Delete</button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. It will permanently delete your blog.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive hover:bg-destructive/80">
                                  <button onClick={() => deleteBlogHandler(blog.id)}>Delete</button>
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4 mt-4">
                  <div className="flex items-center space-x-4">
                    <button className="cursor-pointer" onClick={() => Navigate(`/profile/${blog?.authorId}`)}>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          <PostProfileAvatar />
                        </AvatarFallback>
                      </Avatar>
                    </button>
                    <button className="cursor-pointer" onClick={() => Navigate(`/profile/${blog?.authorId}`)}>
                      <p className="font-medium">{blog?.author.name}</p>
                    </button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{publishedAt}</span>
                    <span className="mx-2">·</span>
                    <span>{readTime} min read</span>
                  </div>
                </div>
              </header>

              <div className="prose max-w-none prose-invert">
                <div className="whitespace-pre-line leading-relaxed text-base">{parse(blog?.content || '')}</div>
              </div>
            </div>

            <footer className="border-t border-border p-6 flex items-center space-x-6">
              <div className="flex space-x-4 items-center">
                <button onClick={handleLike} className={`cursor-pointer ${userReaction === "LIKE" ? "text-blue-500" : ""}`}>
                  <ThumbsUpIcon size={18} />
                </button>
                <span>{likes}</span>
                <button onClick={handleDislike} className={`cursor-pointer ${userReaction === "DISLIKE" ? "text-red-500" : ""}`}>
                  <ThumbsDownIcon size={18} />
                </button>
                <span>{dislikes}</span>
              </div>

              <Button variant="ghost" size="sm" className="hover:opacity-80 cursor-pointer ml-auto" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Copy link to share
              </Button>
            </footer>
          </article>

          <Card className="border-border mb-8">
            <CardContent className="sm:p-6 p-3">
              <div className="flex items-start space-x-4">
                <button className="cursor-pointer" onClick={() => Navigate(`/profile/${blog?.authorId}`)}>
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
                      {blog?.author.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </button>
                <div className="flex-1 mt-1">
                  <button className="cursor-pointer" onClick={() => Navigate(`/profile/${blog?.authorId}`)}>
                    <h3 className="font-medium">{blog?.author.name}</h3>
                  </button>
                  <p className="text-muted-foreground text-sm">{blog?.author.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      )}
    </div>
  );
}
