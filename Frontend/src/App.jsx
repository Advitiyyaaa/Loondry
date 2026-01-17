import { Routes, Route, Navigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Home from "./pages/Home";
import Auth from "./pages/Auth"
import MainLayout from "./layouts/MainLayout";
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
          ? "bg-black text-white"
          : "bg-white text-black"
        }`}
    >
      <Routes>
      {/* Auth without Navbar */}
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/home" /> : <Auth />}
      />

      {/* All pages WITH Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        {/* add more protected pages here */}
      </Route>
    </Routes>
    </div>
  );
}
