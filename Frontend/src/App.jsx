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
import ComplainPage from "./pages/ComplainPage";
import { checkAuth } from "./store/authSlice";

export default function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/complain/new" element={<CreateComplain />} />
        <Route path="/complaints" element={<ComplainPage />} />
        {/* add more protected pages here */}
      </Route>
    </Routes>
    </div>
  );
}
