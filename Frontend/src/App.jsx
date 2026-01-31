import { Routes, Route, Navigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import MainLayout from "./layouts/MainLayout";
import LandingLayout from "./layouts/LandingLayout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import AdminDashboard from "./pages/AdminDashboard";
import CreateComplain from "./pages/CreateComplain";
import UserComplainPage from "./pages/UserComplainPage";
import AdminComplainPage from "./pages/AdminComplainPage";
import Settings from "./pages/Settings";
import { checkAuth } from "./store/authSlice";

export default function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300
        ${theme === "dark"
          ? "bg-black text-white border-white"
          : "bg-white text-black border-black"
        }`}
    >
      <Routes>
      {/* Auth without Navbar */}
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/home" /> : <Auth />}
      />
      
      {/*pages WITH Footer */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<Landing />} />
        {/* add more protected pages here */}
      </Route>

      {/* All pages WITH Navbar and Footer */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={
          user?.role==="admin"?<AdminDashboard />:<Home/>
          } />
        <Route path="/complain/new" element={
          isAuthenticated?<CreateComplain />:<Home/>
          } />
        <Route path="/complaints" element={<UserComplainPage />} />
        <Route path="/admin/complaints" element={
          user?.role==="admin"?<AdminComplainPage />:<Home/>
          } />  
        <Route path="/settings" element={isAuthenticated?<Settings />:<Home />} />  
      </Route>
        
    </Routes>
    </div>
  );
}
