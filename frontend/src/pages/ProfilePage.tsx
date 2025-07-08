import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Edit3, MapPin, Calendar, ThumbsUpIcon, ThumbsDownIcon, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { type userType, type blog } from "@/types/types";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import parse from 'html-react-parser'
import { DotsMenu } from "@/components/ui/dotsMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
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

export default function Profile() {
  const apiBaseUrl = import.meta.env.VITE_API_URL
  const [author, setAuthor] = useState<userType>();
  const [blogs, setBlogs] = useState<blog[]>([]);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { authorId } = useParams();
  const thisUserId = localStorage.getItem("authorId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login required to view this blog");
      Navigate("/login");
    }
    setLoading(true);
    axios
      .get(`${apiBaseUrl}/blog/getBlogs/${authorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const blogsWithReactions = await Promise.all(
          res.data.blogs.map(async (blog: blog) => {
            const counts = await axios.get(
              `${apiBaseUrl}/reaction/blog/${blog.id}/count`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return {
              ...blog,
              likes: counts.data.likes,
              dislikes: counts.data.dislikes,
              userReaction: counts.data.userReaction,
            };
          })
        );
        setBlogs(blogsWithReactions);
        setAuthor(res.data.author);
        setLoading(false);
      }).catch(() => {
          toast.error("Failed to load profile")
          setLoading(false)
        })
  }, [authorId]);

  const deleteBlogHandler = async (id: number) => {
  if (!token) {
    toast.error("Session expired, please log in");
    localStorage.clear()
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

async function handleShare() {
    const shareData = { title: author?.name, text: "Check out this profile!", url: window.location.href };
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


  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex">
              <Button onClick={() => Navigate(-1)} variant="ghost" size="sm" className="mr-4 hover:opacity-80 cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-lg font-medium">Profile</h1>
            </div>
            <div>
              <Button variant='default' size="sm" className="hover:opacity-80 cursor-pointer" onClick={() => {Navigate('/dashboard')}}>
                  Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center mt-12 px-5">
          <DashboardSkeleton />
        </div>
      ) : (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-border mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                
                <Avatar className="h-14 w-14 sm:h-20 sm:w-20 mb-3 sm:mb-0">
                  <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                    {author?.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      <h1 className="text-lg sm:text-xl mr-4 font-medium truncate">{author?.name}</h1>
                      <button onClick={handleShare}>
                        <Share2 size={"18px"}></Share2>
                      </button>
                    </div>
                    
                    {author?.id == thisUserId && (
                      <Button
                        onClick={() => Navigate("/profile/edit-profile")}
                        variant="outline"
                        size="sm"
                        className="dark:hover:shadow-md dark:transition-shadow dark:hover:shadow-gray-800"
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>

                  {author?.bio && (
                    <p className="text-sm sm:text-base text-foreground leading-snug line-clamp-3">{author?.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {author?.city && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {author.city}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Joined {new Date(author?.created_at || "").toDateString().split(" ").slice(1).join(" ")}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          <div className="mb-6">
            <h2 className="text-xl font-medium mb-6">Posts by {author?.name}</h2>
          </div>

          {blogs.length === 0 ? (
            <p className="text-foreground">{author?.name} hasn't posted anything yet.</p>
          ) : (
            <div className="space-y-6">
              {blogs.map((blog) => (
                <Card 
                  key={blog.id} 
                  className="border-border hover:shadow-md transition-shadow cursor-pointer dark:hover:shadow-md dark:transition-shadow dark:hover:shadow-gray-800 duration-200"
                  onClick={() => { 
                    Navigate(`/blog/${blog.id}`);
                    localStorage.setItem("blogId", blog.id.toString());
                  }}
                >
                  <CardContent className="p-4 sm:p-6">
                    
                    <div className="space-y-3">

                      {/* Date & Read Time */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <span>{new Date(blog.created_at).toDateString().split(" ").slice(1).join(" ")}</span>
                          <span>·</span>
                          <span>{Math.max(1, Math.ceil(blog.content.split(" ").length / 200))} min read</span>
                        </div>

                        {author?.id == thisUserId && (
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

                      {/* Title & Content */}
                      <div>
                        <h3 className="text-lg sm:text-xl mb-2 font-medium hover:opacity-80 transition line-clamp-1">{blog.title}</h3>
                        <p className="prose max-w-none prose-invert text-foreground leading-snug line-clamp-3 mb-2 text-sm sm:text-base">
                          {blog.content.split(" ").length < 22 
                            ? parse(blog.content) 
                            : parse(blog.content.split(" ").slice(0, 22).join(" ") + "...")}
                        </p>
                      </div>

                      {/* Reactions and Read More */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2">

                        <div className="flex items-center space-x-3 text-sm">
                          
                          {/* Like */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const token = localStorage.getItem("token");
                              if (blog.userReaction === "LIKE") {
                                setBlogs((prev) =>
                                  prev.map((b) =>
                                    b.id === blog.id ? { ...b, likes: Math.max((b.likes || 0) - 1, 0), userReaction: null } : b
                                  )
                                );
                              } else {
                                setBlogs((prev) =>
                                  prev.map((b) =>
                                    b.id === blog.id ? { 
                                      ...b, 
                                      likes: (b.likes || 0) + 1, 
                                      dislikes: b.userReaction === "DISLIKE" ? Math.max((b.dislikes || 0) - 1, 0) : b.dislikes, 
                                      userReaction: "LIKE" 
                                    } : b
                                  )
                                );
                              }
                              axios.post(`${apiBaseUrl}/reaction/blog/${blog.id}/like`, null, { headers: { Authorization: `Bearer ${token}` } })
                                .catch(() => toast.error("Error reacting"));
                            }}
                            className={`hover:opacity-80 ${blog.userReaction === "LIKE" ? "text-blue-500" : ""}`}
                          >
                            <ThumbsUpIcon size={16} />
                          </button>
                          <div>{Math.max(blog.likes || 0, 0)}</div>

                          {/* Dislike */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const token = localStorage.getItem("token");
                              if (blog.userReaction === "DISLIKE") {
                                setBlogs((prev) =>
                                  prev.map((b) =>
                                    b.id === blog.id ? { ...b, dislikes: Math.max((b.dislikes || 0) - 1, 0), userReaction: null } : b
                                  )
                                );
                              } else {
                                setBlogs((prev) =>
                                  prev.map((b) =>
                                    b.id === blog.id ? { 
                                      ...b, 
                                      dislikes: (b.dislikes || 0) + 1, 
                                      likes: b.userReaction === "LIKE" ? Math.max((b.likes || 0) - 1, 0) : b.likes, 
                                      userReaction: "DISLIKE" 
                                    } : b
                                  )
                                );
                              }
                              axios.post(`${apiBaseUrl}/reaction/blog/${blog.id}/dislike`, null, { headers: { Authorization: `Bearer ${token}` } })
                                .catch(() => toast.error("Error reacting"));
                            }}
                            className={`hover:opacity-80 ${blog.userReaction === "DISLIKE" ? "text-red-500" : ""}`}
                          >
                            <ThumbsDownIcon size={16} />
                          </button>
                          <div>{Math.max(blog.dislikes || 0, 0)}</div>
                        </div>

                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:opacity-80 p-0 h-auto font-normal self-start sm:self-center">
                          {blog.content.split(" ").length < 22 
                            ? '' 
                            : 'Read more'}
                        </Button>
                      </div>

                    </div>
                  </CardContent>
                </Card>

              ))}

              <div className="mt-20 mb-7">
                <div className="text-center">Hey there! You have reached the end of the feed.</div>
                <div className="flex justify-center mt-4">
                  <Button 
                    className="cursor-pointer dark:hover:shadow-md dark:transition-shadow dark:hover:shadow-gray-600 duration-200" 
                    onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }} 
                    variant="default">Scroll back up</Button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
