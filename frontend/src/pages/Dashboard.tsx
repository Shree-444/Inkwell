import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { PlusCircle, Search, Share2, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProfileAvatar } from "@/components/ui/profileAvatar";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router";
import type { blog } from "@/types/types";
import parse from 'html-react-parser';
import { Dropdown } from "@/components/ui/dropdown";
import { ThemeToggleButton } from "@/components/ui/ThemeToggle";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function Dashboard() {
  const apiBaseUrl = import.meta.env.VITE_API_URL
  const [blogs, setBlogs] = useState<blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [searching, setSearching] = useState(false);
  const Navigate = useNavigate();
  const user = localStorage.getItem('thisUser') || ""

  const fetchBlogsWithReactions = async (filter = "") => {
    const token = localStorage.getItem("token");

    const blogRes = await axios.get(`${apiBaseUrl}/blog/bulk${filter ? `?filter=${filter}` : ""}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const fetchedBlogs = blogRes.data.blogs || blogRes.data.filteredBlogs || [];

    if (fetchedBlogs.length === 0) return [];

    const blogIds = fetchedBlogs.map((b: blog) => b.id).join(",");

    const reactionRes = await axios.get(`${apiBaseUrl}/reaction/blog/bulk?ids=${blogIds}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const reactionMap: Record<number, { likes: number; dislikes: number; userReaction: string | null }> = {};
    reactionRes.data.reactions.forEach((r: any) => {
      reactionMap[r.blogId] = {
        likes: r.likes,
        dislikes: r.dislikes,
        userReaction: r.userReaction || null
      };
    });

    return fetchedBlogs.map((blog: blog) => ({
      ...blog,
      likes: reactionMap[blog.id]?.likes || 0,
      dislikes: reactionMap[blog.id]?.dislikes || 0,
      userReaction: reactionMap[blog.id]?.userReaction || null
    }));
  };

  useEffect(() => {
    setLoading(true);
    fetchBlogsWithReactions().then(setBlogs).finally(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setSearching(true);
    const updated = await fetchBlogsWithReactions(filterValue);
    setBlogs(updated);
    setLoading(false);
  };

  const handleRemoveFilter = async () => {
    setLoading(true);
    setSearching(false);
    setFilterValue("");
    const updated = await fetchBlogsWithReactions();
    setBlogs(updated);
    setLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background, #0f0f0f)", color: "var(--foreground, #ffffff)" }}>
      <header className="fixed w-full z-10 border-b shadow-sm" style={{ backgroundColor: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center sm:justify-between items-center py-4 gap-4">
            <div className="flex items-center cursor-default">
              <h1 className="text-2xl sm:text-3xl font-semibold italic">inkwell.</h1>
            </div>
            <div className="w-full sm:w-auto flex flex-wrap justify-around sm:justify-between sm:items-center space-x-4">
              <div className="flex items-center justify-between space-x-4">
                <div className="text-base sm:text-lg  py-1 cursor-default">
                  Hi there, {user.split(" ")[0]}.
                </div>
                <Button onClick={() => Navigate("/post")} variant="outline" size="sm" className="cursor-pointer dark:hover:shadow-md dark:transition-shadow dark:hover:shadow-gray-800 duration-200" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)", borderColor: "var(--border)" }}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Post
                </Button>
                <ThemeToggleButton />
                <Dropdown />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-35 pb-20">
        <div className="cursor-default">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">Recent Blogs</h1>
          <p className="italic mb-7" style={{ color: "var(--muted-foreground)" }}>Dive into trending thoughts, stories, and expert insights.</p>
        </div>
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: "var(--muted-foreground)" }} />
            <Input type="text" value={filterValue} placeholder="Search blogs..." className="pl-10 w-full" style={{ backgroundColor: "var(--card)", color: "var(--foreground)", borderColor: "var(--border)" }} onChange={(e) => setFilterValue(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="dark:hover:shadow-md dark:transition-shadow dark:hover:shadow-gray-800 duration-200" disabled={filterValue.trim() === ""} onClick={handleSearch} style={{ backgroundColor: "var(--muted)", color: "var(--foreground)", borderColor: "var(--border)" }}>
              Search
            </Button>
            {filterValue.trim() && searching && (
              <Button onClick={handleRemoveFilter} variant="outline" className="dark:hover:shadow-md dark:transition-shadow dark:hover:shadow-gray-800 duration-200" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)", borderColor: "var(--border)" }}>
                Remove filter
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <div className="space-y-6">
            {blogs.length === 0 ? (
              <p className="text-xl ml-2 pt-3">No blogs found</p>
            ) : (
              blogs.map((blog: blog) => (
                <Card key={blog.id} onClick={() => { Navigate(`/blog/${blog.id}`); localStorage.setItem("blogId", blog.id.toString()); }} className="hover:shadow-md transition-shadow dark:hover:shadow-md dark:transition-shadow dark:hover:shadow-gray-800 duration-200 cursor-pointer" style={{ backgroundColor: "var(--card)", color: "var(--foreground)", borderColor: "var(--border)" }}>
                  <CardContent className="p-3 sm:p-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8 outline-1 outline-gray-400">
                          <ProfileAvatar />
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{blog.author.name}</p>
                          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                            {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })} · {Math.max(Math.ceil(blog.content.split(" ").length / 200), 1)} minute read
                          </p>
                        </div>
                      </div>
                      <h2 className="sm:text-xl text-[18px] font-medium mb-2 hover:opacity-80 transition-colors">{blog.title}</h2>
                      <div className="prose max-w-none prose-invert">
                        {blog.content.split(" ").length < 22 ? parse(blog.content) : parse(blog.content.split(" ").slice(0, 22).join(" ") + "...")}
                      </div>
                      {blog.content.split(" ").length > 22 && (
                        <Button variant="ghost" size="sm" className="p-0 font-normal hover:underline" style={{ color: "var(--muted-foreground)" }}>Read more</Button>
                      )}

                      <div className="flex justify-between mt-3">
                        <div className="flex space-x-3 items-center">
                          <button onClick={(e) => {
                            e.stopPropagation();
                            const token = localStorage.getItem("token");
                            setBlogs(prev => prev.map(b => {
                              if (b.id !== blog.id) return b;
                              if (b.userReaction === "LIKE") return { ...b, likes: Math.max((b.likes?? 0) - 1, 0), userReaction: null };
                              if (b.userReaction === "DISLIKE") return { ...b, likes: (b.likes?? 0) + 1, dislikes: Math.max((b.dislikes?? 0) - 1, 0), userReaction: "LIKE" };
                              return { ...b, likes: (b.likes?? 0) + 1, userReaction: "LIKE" };
                            }));
                            axios.post(`${apiBaseUrl}/reaction/blog/${blog.id}/like`, null, { headers: { Authorization: `Bearer ${token}` } }).catch(() => toast.error("Error reacting"));
                          }} className={blog.userReaction === "LIKE" ? "text-blue-500" : ""}>
                            <ThumbsUpIcon size={16} />
                          </button>
                          <div>{Math.max(blog.likes || 0, 0)}</div>
                          <button onClick={(e) => {
                            e.stopPropagation();
                            const token = localStorage.getItem("token");
                            setBlogs(prev => prev.map(b => {
                              if (b.id !== blog.id) return b;
                              if (b.userReaction === "DISLIKE") return { ...b, dislikes: Math.max((b.dislikes?? 0) - 1, 0), userReaction: null };
                              if (b.userReaction === "LIKE") return { ...b, dislikes: (b.dislikes?? 0) + 1, likes: Math.max((b.likes?? 0) - 1, 0), userReaction: "DISLIKE" };
                              return { ...b, dislikes: (b.dislikes?? 0) + 1, userReaction: "DISLIKE" };
                            }));
                            axios.post(`${apiBaseUrl}/reaction/blog/${blog.id}/dislike`, null, { headers: { Authorization: `Bearer ${token}` } }).catch(() => toast.error("Error reacting"));
                          }} className={blog.userReaction === "DISLIKE" ? "text-red-500" : ""}>
                            <ThumbsDownIcon size={16} />
                          </button>
                          <div>{Math.max(blog.dislikes || 0, 0)}</div>
                        </div>

                        <button className="cursor-pointer" onClick={async (e) => {
                          e.stopPropagation();
                          const shareData = { title: blog.title, text: "Check out this blog!", url: `blog/${blog.id}` };
                          if (navigator.share) {
                            try { await navigator.share(shareData); } catch (err) { console.error(err); }
                          } else {
                            try { await navigator.clipboard.writeText(shareData.url); toast.success("Link copied"); } catch (err) { console.error(err); toast.error("Error"); }
                          }
                        }}>
                          <Share2 size="19px" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {blogs.length > 0 && (
          <div className="mt-12 mb-10">
            <div className="text-center">Hey there! You have reached the end of the feed.</div>
            <div className="flex justify-center mt-4">
              <Button className="cursor-pointer dark:hover:shadow-md dark:transition-shadow dark:hover:shadow-gray-600 duration-200" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} variant="default">
                Scroll back up
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
