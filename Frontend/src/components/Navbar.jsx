// src/components/Navbar.jsx
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/themeSlice";
import { logoutUser } from "../store/authSlice";

export default function Navbar() {
  const theme = useSelector((state) => state.theme.theme);
  const dispatch = useDispatch();

  return (
    <nav className="w-full px-6 py-4 border-b flex items-center justify-between
                    bg-white text-black dark:bg-black dark:text-white dark:border-white">
      <h1 className="font-extrabold text-lg">Loondry</h1>

      <div className="flex gap-4 items-center">
        <button onClick={() => dispatch(toggleTheme())}>
          {theme === "dark" ? "🌞" : "🌙"}
        </button>

        <button
          onClick={() => dispatch(logoutUser())}
          className="px-3 py-1 border rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
