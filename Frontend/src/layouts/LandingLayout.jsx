import Footer from "../components/Footer";
import { Outlet } from "react-router";

export default function LandingLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}