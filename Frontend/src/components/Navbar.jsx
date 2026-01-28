import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/themeSlice";
import { logoutUser } from "../store/authSlice";
import { useNavigate } from "react-router";
import { Linkedin, Instagram, Github } from 'lucide-react';

export default function Navbar() {
  const theme = useSelector((state) => state.theme.theme);
  const { isAuthenticated, loading, error, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <nav
      className={`w-full p-5 ${theme === "dark" && "dark:bg-black dark:text-white"}`}
    >
      <div className="relative">
    {/* Shadow Layer */}
    <div
      className={`absolute inset-0 translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3 border-2 border-black bg-black
        ${theme === "dark" && "dark:border-white dark:bg-white"}
      `}
    />

    {/* Foreground Navbar */}
    <div
      className={`relative z-10 grid grid-cols-2 md:grid-cols-3 items-center border-2 p-2 bg-white text-black
      ${theme === "dark" && "dark:bg-black dark:text-white dark:border-white"}`}
      >
      {/* Logo */}
      <div className="justify-self-start font-extrabold text-lg flex items-center hover:cursor-pointer" onClick={() => navigate("/home")}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 819 819">
          <g transform="translate(0, 20.5)">
            <path fill="currentColor" d="M497 97.6c-43.6 2.8-79.4 5-120.5 7.4-9.3.6-28 1.7-41.5 2.5-13.5.9-35.3 2.2-48.5 3-54.6 3.3-92.4 5.6-116.5 7.1-42 2.5-45.4 2.9-49.1 5-1.8 1.1-4.1 3.3-5.1 5-1.8 3.1-15 78.8-14.1 80.9.2.5 2.4 2.5 4.9 4.3l4.4 3.3v206.3c0 226.1-.4 209.9 5.7 222.1 3.4 6.6 13.5 16.5 20.3 19.8 7 3.4 14.4 4.3 50 6.2 32.9 1.7 129 7 155.5 8.5 27.1 1.6 105.9 5.8 132.4 7 12.8.7 24.5.9 26 .5 2.6-.6 10.9-4 76.6-31 20.4-8.4 47.9-19.7 61.2-25.1l24.3-9.9-.3-224.4-.2-224.5-14-7.3c-7.7-4.1-21-11-29.5-15.5-8.5-4.4-24.7-12.9-36-18.8s-30.5-16-42.7-22.4c-12.3-6.4-22.6-11.5-23-11.5-.5.1-9.6.8-20.3 1.5m27.8 83.9-.3 22.6-6.7-5.6-6.8-5.5v-5.8c0-15.4 6.9-55.1 11.8-68.2 1.7-4.5 1.7-4.4 2 17.7.1 12.2.1 32.3 0 44.8m-22.4-56.8c-1.4 16.2-6.2 62.4-6.5 62.7-.4.4-23.6 1.3-99.4 4.1-22.5.8-51.8 1.9-65 2.5-45.4 1.8-94.5 3.3-95 2.9-.4-.4 7.7-56.6 9-62.5.4-2 1.4-2.2 13.2-2.8 14.5-.8 54.1-3.1 80.3-4.6 32.3-2 67.2-4 103.5-6 48.2-2.7 47.1-2.6 54.2-2.8l6.2-.2zm-258.9 9.6c-.2.7-2.2 14.2-4.5 30.2-2.3 15.9-4.5 29.9-5 31.1-.8 2-1.8 2.1-22.7 2.8-12 .3-38.7 1.3-59.3 2-20.6.8-37.7 1.3-38.1 1.1-.3-.2.7-8 2.3-17.2 1.5-9.2 3.7-22.7 4.8-29.8 1.3-8.2 2.6-13.4 3.5-14.1.8-.6 7.7-1.4 15.2-1.8 7.6-.3 20.3-1.1 28.3-1.6s27.3-1.6 43-2.5 29.2-1.7 30-1.9c2.1-.4 3 .2 2.5 1.7m325.3 14.6c25 10.7 50.3 22.5 63.2 29.3 11.2 6 23 12.9 23 13.4 0 .6-8.4-3.4-38.3-18-24.2-11.9-51.2-24.8-65.7-31.4-2.5-1.1-4.2-2.1-3.7-2.1.4-.1 10.1 3.9 21.5 8.8m9.6 29.1c1.4 1.7 3 4.7 3.6 6.8 1.4 5.1 1.4 368.2 0 373.3-2.3 8.3-9.7 11.6-13.9 6.3l-2.1-2.7 3.2-1.6c1.7-.9 4.1-2.9 5.2-4.4l2.1-2.8V371.7c0-180.9 0-181.2-2.1-184.7-1.1-1.9-3.3-4.2-5-5-1.6-.8-3.1-1.6-3.3-1.8-.3-.1.6-1.3 1.9-2.7 3.3-3.5 7.2-3.3 10.4.5m34.1 14.4c1.3 1.3 2.8 4.1 3.4 6.2.8 2.7 1.1 56.4 1.1 176.9 0 167.6-.1 173.1-1.9 177.2-3.1 6.7-8.4 8.3-12 3.7l-2.1-2.7 3.3-1.6c1.7-.9 4-3.2 4.9-5.1 1.7-3.3 1.8-13.6 1.8-172.2 0-117-.3-169.5-1.1-171.5-1.4-3.8-4.8-7.3-7.1-7.3-2.4 0-2.3-1.5.2-4 2.7-2.7 6.6-2.5 9.5.4M643 205c1.5 1.6 3 4.4 3.4 6.1.3 1.7.6 77.4.6 168.1 0 151.6-.1 165.3-1.7 168.5-2.8 6-9.7 7.1-12.1 1.9-1-2.2-.8-2.4 1.8-3 1.9-.3 3.5-1.7 4.7-3.8 1.7-3.1 1.8-11.6 2.1-162.3.2-113.5 0-160.3-.8-163.5-1.3-5-4.4-9-7.2-9-2.4 0-2.3-.9.4-3.7 2.9-3.1 5.4-2.9 8.8.7M524.9 373.7c-.1 91.8-.4 191.5-.8 221.8l-.6 55-2.7 4.5c-2.9 5.1-10.9 13-15.4 15.3-1.6.8-4.9 2-7.2 2.7-4.4 1.1-4.8 1.1-62.7-2-9.9-.5-31.5-1.6-48-2.5-16.5-.8-38.5-2-49-2.5-10.4-.6-32-1.7-48-2.5-15.9-.9-37.1-2-47-2.5s-27.7-1.4-39.5-2c-50-2.4-56.2-3-61.5-5.4-6.6-3-13.2-9.7-16.4-16.6l-2.6-5.5-.3-205.2-.2-205.1 10.2-.6c5.7-.3 25.2-1 43.3-1.6 18.2-.6 45.8-1.5 61.5-2 15.7-.6 48.5-1.7 73-2.5s57.1-1.9 72.5-2.5c15.4-.5 50.3-1.6 77.5-2.5 27.2-.8 50.9-1.7 52.5-1.9 1.7-.1 4.9-.4 7.3-.4l4.2-.2z"/><path fill="currentColor" d="M449 133c-5.8.4-22.9 1.5-38 2.5-17.4 1-27.9 2.1-28.6 2.8-1.7 1.7-4.9 27.6-3.6 28.9.7.7 8.3.7 24.4-.1 12.8-.6 33.4-1.6 45.8-2.2 14.2-.7 22.9-1.5 23.6-2.3 1.3-1.2 4.5-27.1 3.7-29.3-.6-1.4-8.9-1.5-27.3-.3m-140.8 1.1c-5.6 1.1-13.7 5.6-16.9 9.4-4.8 5.6-7.6 13.2-7.6 20.4.1 15.9 11.7 27.7 27.3 27.6 24.6-.2 39.1-30 23.5-48.2-6.1-7.2-17-11-26.3-9.2m8 7.5c5.6 2.9 9.4 10.9 8.2 17.5-1 5.1-2.8 8.2-7.3 12.2-6.4 5.8-15.9 6.2-22.2 1-4.1-3.5-5.9-7.4-5.9-12.9 0-14.5 14.8-24.1 27.2-17.8m145.6 33.1c-5.5.5-7.7 2.8-5.8 6.3 1.6 2.9 13.1 2.9 16 0 1.6-1.6 1.8-2.5 1.1-3.9-1.1-2-3.4-3.2-5.4-2.9-.7.1-3.3.3-5.9.5m-31.9 3.7c-1.9 4.2.2 5.6 8.1 5.6 7.4 0 9.4-1.2 8.8-5.2-.3-2.1-.8-2.3-8.1-2.6-7.4-.3-7.8-.2-8.8 2.2m-25.1-.3c-2 1.1-2.3 3.6-.8 5.9 1.1 1.7 13.6 1.6 15.7-.2 1.8-1.5 1.6-5.5-.3-6.2-2.5-1-12.7-.6-14.6.5m-26 1c-2.2 1.2-2.3 5.2-.3 6.9 1.8 1.5 13 .7 15.1-1.1 1.7-1.4 1.8-4.1.2-5.7-1.5-1.5-12.6-1.5-15-.1m-168.3-11.5c-1.1.1-15.4.8-31.8 1.5l-29.9 1.2-.9 2.4c-1.4 3.9-2.2 13-1.2 13.6.6.4 16.4.1 35.3-.5 25.2-.9 34.6-1.6 35.6-2.5 1.4-1.4 3-13.6 1.9-15.2-.6-1-4.2-1.2-9-.5m86.5 58c-40.2 5-76.6 24.5-101.3 54.2-25.1 30.2-37.7 64.8-37.7 104 0 28.5 6.2 53.9 18.7 77.2 17.4 32.2 44.9 58.8 75.1 72.6 22.1 10.1 43.3 14.7 67.7 14.6 45.6-.2 84.7-16.7 115.7-49 33.4-34.9 49.6-83.7 43.3-131.1-4.9-36.9-18.9-66.6-43.7-92.6-23.3-24.4-51.9-40.4-85.3-47.5-7.8-1.7-14.3-2.2-29.5-2.5-10.7-.2-21.1-.1-23 .1m45.1 10.3c27.7 6 50.8 17.8 71.5 36.5 32.7 29.6 51.2 78.2 46.5 122.1-4.5 41.5-22.8 76.7-52.9 101.6-19.7 16.3-39.1 25.8-64.7 31.6-11.3 2.6-44.3 2.6-56.5 0-55.6-11.7-97.1-48.5-113.9-100.9-8-25.2-8.9-51.9-2.6-78.5 14.2-59.5 61.6-104.1 121-113.9 11.9-1.9 39.4-1.1 51.6 1.5"/><path fill="currentColor" d="M299 248c-23.4 2.4-46 11.4-65.6 26.1-34 25.5-53.4 64.8-53.4 108.4 0 15.6 1.9 28.1 6.6 42.4 8.4 25.5 23.5 47.4 43.8 63.3 27.7 21.5 57.3 30.1 95 27.6 51.7-3.6 98.8-41.5 115-92.6 4.6-14.7 6-24.4 6-42.2-.1-13.3-.5-18.5-2.4-27-13.3-61.5-63.5-103.7-126.5-106.4-6-.2-14.4-.1-18.5.4m14 31.9c-17.6 3.8-33.6 12.6-47.1 26-13 13.1-21.3 28-26.7 47.9-2.3 8.7-2.6 11.6-2.6 28.2-.1 16.1.2 19.6 2.2 27.5 6.2 24.3 18.6 44 37 58.6 13 10.4 28.3 17.6 43 20.3 7.6 1.4 7.7 1.4 2.6 1.5-6.6.1-20.8-2.4-28.7-5-16.5-5.5-30.3-14.5-42.9-27.7-17.5-18.6-26.3-40.2-27.5-67.3-1.4-34.1 10.5-64.1 33.9-85.5 16.5-15 42.1-26 61.3-26.2 2.9 0 1.6.4-4.5 1.7m41 8.6c3.6.9 11 3.8 16.5 6.5 33.9 16.3 53.6 53 51.1 95-2.2 37-21.6 66.4-50.4 76.5-10.8 3.8-19 4.8-34.1 4.2-11.1-.4-15-.9-21.4-3.1-31.2-10.5-52-34.5-61-70.5-3.3-13.3-3-34.2.6-47.5 1.6-5.7 5-14.2 8-20 8.9-17.2 26.2-32.7 43.3-38.7 14.1-5 33-6 47.4-2.4m68.7 279.2c-1.1 1.1-.8 81.1.3 81.8 2 1.3 75.4 4.4 76.7 3.3 1.9-1.5 1.9-81.1.1-82.6-.8-.6-15.8-1.5-36.3-2.1-41-1.3-40-1.3-40.8-.4m43.8 3.8c15.4.4 28.8.9 29.8 1.1 1.6.5 1.7 3.2 1.7 39V650h-5.2c-2.9 0-18.1-.7-33.8-1.5s-29.7-1.5-31.2-1.5H425v-77.2l6.8.6c3.7.3 19.3.8 34.7 1.1"/></g>
        </svg>
        <p>Loondry</p>
      </div>
      {/* Nav */}
      <div className="hidden md:flex justify-self-center gap-6 items-center">
        <button onClick={() => navigate("/home")} className="hover:text-gray-400 hover:cursor-pointer">Home</button>
        {user?.role === "admin" ? 
          <button 
            className="hover:text-gray-400 hover:cursor-pointer whitespace-nowrap"
            onClick={() => navigate("/admin")}
          >
            Admin Dashboard
          </button>
          :
          <button className="hover:text-gray-400 hover:cursor-pointer whitespace-nowrap">Create-Slip</button>}
        <button className="hover:text-gray-400 hover:cursor-pointer">Complaints</button>
        <button className="hover:text-gray-400 hover:cursor-pointer">About</button>
      </div>
      
      {/* Theme+User+Social*/}
      
      <div className="justify-self-end flex gap-2 items-center">
        {/* Social */}
        <div className="hidden sm:flex gap-1">
          <a href="https://www.linkedin.com/in/advitiyaarya/" target="_blank">
            <Linkedin className={`h-4 hover:cursor-pointer ${theme === "dark" ? "text-white hover:fill-white" : "text-black hover:fill-black"}`} />
          </a>
          <a href="https://www.instagram.com/advitiyyaaa/" target="_blank">
            <Instagram className={`h-4 hover:cursor-pointer ${theme === "dark" ? "text-white hover:fill-white hover:text-black" : "text-black hover:fill-black hover:text-white"}`} />
          </a>
          <a href="https://github.com/Advitiyyaaa" target="_blank">
            <Github className={`h-4 hover:cursor-pointer ${theme === "dark" ? "text-white hover:fill-white" : "text-black hover:fill-black"}`} />
          </a>
        </div>

          {/* Theme Toggle */}
        <button 
          className="p-1 text-center"
          onClick={() => dispatch(toggleTheme())}>
          {theme === "light" ? (
            // Moon
            <svg
              className="w-5 h-5 text-black hover:fill-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            // Sun
            <svg
              className="w-5 h-5 text-white hover:fill-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </button>
        
          {/*User Button*/}
        {isAuthenticated ?(
          <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className={`border-2 py-1 px-2.5 m-1 text-center ${theme === "dark" ? "hover:bg-white hover:text-black border-white":"hover:bg-black hover:text-white border-black"}`}>{user?.firstName?.[0]?.toUpperCase()}</div>
          <ul tabIndex="-1" className={`dropdown-content menu border-2 z-1 w-42 p-2 shadow-sm bg-white text-black ${theme === "dark" && "dark:bg-black dark:text-white"}`}>
            <li><button>Profile</button></li>
            <li><button>Settings</button></li>
            <li><button className="md:hidden">Complaints</button></li>
            <li><button className="md:hidden">About</button></li>
            {isAuthenticated &&(
              <li>
                <button onClick={()=>{dispatch(logoutUser());
                }}>Logout</button>
              </li>
            )}
          </ul>
        </div>
        
        ):(
          <button className="border-2 py-1 px-1.5 text-center" onClick={()=>{navigate("/auth")}}>Login</button>
        )}
      </div> 
      </div>
    </div>
    </nav>
  );
}
