import { Toaster } from "sonner";
import CreateBlog from "./pages/CreateBlog";
import Dashboard from "./pages/Dashboard";
import ShowBlog from "./pages/ShowBlog";
import Signin from "./pages/Signinpage";
import Signup from "./pages/Signuppage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Profile from "./pages/ProfilePage";
import EditProfile from "./pages/EditProfile";
import { EditBlog } from "./pages/EditBlog";
import { useEffect } from "react";
import Landing from "./pages/LandingPage";

export default function App(){
  
  function PrivateRoute({ children }: { children: any }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/signin" replace />;
  }

  function OpenRoute({ children }: { children: any }) {
    const token = localStorage.getItem('token');
    return !token ? children : <Navigate to="/dashboard" replace />;
  }

   useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors duration={2500}></Toaster>
      <Routes>
        
        <Route path="/" element={
          <OpenRoute>
            <Landing/>
          </OpenRoute>
        }></Route>

        <Route path="/signup" element={
          <OpenRoute>
            <Signup/>
          </OpenRoute>
        }></Route>

        <Route path="/signin" element={
          <OpenRoute>
            <Signin/>
          </OpenRoute>
        }></Route>

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
          }></Route>

        <Route path="/post" element={
          <PrivateRoute>
            <CreateBlog/>
          </PrivateRoute>
          }></Route>

        <Route path="/blog/:id" element={
          <PrivateRoute>
            <ShowBlog/>
          </PrivateRoute>
        }></Route>

        <Route path="/profile/:authorId" element={
          <PrivateRoute>
            <Profile/>
          </PrivateRoute>
        }></Route>

        <Route path="/profile/edit-profile" element={
          <PrivateRoute>
            <EditProfile/>
          </PrivateRoute>
        }></Route> 

        <Route path="/blog/:id/edit-blog" element={
          <PrivateRoute>
            <EditBlog/>
          </PrivateRoute>
        }></Route>

      </Routes>
    </BrowserRouter>
  )
}
