import Navbar from "../components/Navbar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}
