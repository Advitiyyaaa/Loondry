import { useEffect, useState } from "react";
import { toggleTheme } from "../store/themeSlice";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser, registerUser, clearError } from "../store/authSlice";

const loginSchema = z.object({
  emailId: z
    .string()
    .regex(/^[a-zA-Z0-9._%+-]+@bennett\.edu\.in$/, "Use your Bennett University email ID"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  firstName: z.string().min(2, "Name should be at least 2 characters").max(25),
  lastName: z.string().optional(),
  bagNo: z
    .string()
    .min(4, "Bag number should be at least 4 digits")
    .max(6, "Bag number should be at most 6 digits")
    .regex(/^\d+$/, "Bag number must contain only digits"),
  emailId: z
    .string()
    .regex(/^[a-zA-Z0-9._%+-]+@bennett\.edu\.in$/, "Use your Bennett University email ID"),
  password: z
    .string()
    .min(8, "Password should be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain at least one special character"),
});

export default function Auth() {
  const theme = useSelector((state) => state.theme.theme);
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const Navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState("login");

  const form = useForm({
    resolver: zodResolver(mode === "login" ? loginSchema : registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bagNo: "",
      emailId: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const onSubmit = (data) => {
    if (mode === "login") {
      dispatch(loginUser(data));
    } else {
      dispatch(registerUser(data));
    }
  };

  const toggleMode = () => {
    dispatch(clearError());
    setMode((p) => (p === "login" ? "register" : "login"));
    reset();
  };

  return (
    <div className="min-h-screen duration-300">

      {/* Back Button */}
      <ChevronLeft className={`absolute top-6 left-6 ${theme === "dark" ? "hover:bg-white hover:text-black" : "hover:bg-black hover:text-white"}`} size="28" onClick={()=>Navigate(-1)}/>
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg"
        >
          {theme === "light" ? (
            //moon
            <svg className="w-5 h-5 text-black hover:fill-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            //sun
            <svg className="w-5 h-5 text-white hover:fill-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center min-h-screen px-3 sm:px-4">
        <div className="w-full max-w-md relative inline-block">
          {/* shadow layer */}
          <div className={`absolute inset-0 translate-x-3 translate-y-3 border-2 border-black bg-black ${theme === "dark" &&("dark:border-white dark:bg-white")}`}></div>

          {/* card */}
          <div className={`relative bg-white text-black border-black border-2 shadow-xl p-6 sm:p-8  ${theme === "dark" &&("dark:bg-black dark:text-white dark:border-white")}`}>
            <div className="flex flex-col justify-center items-center mb-6">
              <p className="text-2xl sm:text-3xl font-extrabold"> 
                {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
              </p>
              <span className="mt-2 text-sm font-bold tracking-wide text-gray-500 dark:text-gray-400">
                ENTER YOUR CREDENTIALS
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {mode === "register" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold tracking-wider mb-2">
                        FIRST NAME
                      </label>
                      <input
                        {...register("firstName")}
                        className={`w-full px-4 py-2 border-2 border-black bg-white text-black
                               focus:ring-2 focus:ring-black outline-none transition-all pr-10
                                ${theme === "dark" &&("dark:bg-black dark:text-white dark:border-white dark:focus:ring-white")}
                               `}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold tracking-wider mb-2">
                        LAST NAME
                      </label>
                      <input
                        {...register("lastName")}
                        className={`w-full px-4 py-2 border-2 border-black bg-white text-black
                               focus:ring-2 focus:ring-black outline-none transition-all pr-10
                                ${theme === "dark" &&("dark:bg-black dark:text-white dark:border-white dark:focus:ring-white")}
                               `}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold tracking-wider mb-1">
                      LAUNDRY BAG NUMBER
                    </label>
                    <span className="block mb-1 text-xs text-gray-500 font-semibold dark:text-gray-400">
                      It is assigned while purchasing the laundry bag.
                    </span>
                    <input
                      {...register("bagNo")}
                      className={`w-full px-4 py-2 border-2 border-black bg-white text-black
                               focus:ring-2 focus:ring-black outline-none transition-all pr-10
                                ${theme === "dark" &&("dark:bg-black dark:text-white dark:border-white dark:focus:ring-white")}
                               `}
                      placeholder="e.g. 6277"
                    />
                    {errors.bagNo && (
                      <p className="mt-1 text-xs text-red-500">{errors.bagNo.message}</p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold tracking-wider mb-2">
                  EMAIL
                </label>
                <input
                  {...register("emailId")}
                  className={`w-full px-4 py-2 border-2 border-black bg-white text-black
                               focus:ring-2 focus:ring-black outline-none transition-all pr-10
                                ${theme === "dark" &&("dark:bg-black dark:text-white dark:border-white dark:focus:ring-white")}
                               `}
                  placeholder="you@bennett.edu.in"
                />
                {errors.emailId && (
                  <p className="mt-1 text-xs text-red-500">{errors.emailId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold tracking-wider mb-2">
                  PASSWORD
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={`w-full px-4 py-2 border-2 border-black bg-white text-black
                               focus:ring-2 focus:ring-black outline-none transition-all pr-10
                                ${theme === "dark" &&("dark:bg-black dark:text-white dark:border-white dark:focus:ring-white")}
                               `}
                    placeholder="••••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-black text-white hover:bg-gray-800
                          ${theme === "dark" && "dark:bg-white dark:text-black dark:hover:bg-gray-200"}
                           font-semibold tracking-wider py-3 transition-colors duration-200 shadow-md hover:shadow-lg`}
              >
                {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
                {loading && <span className="ml-2 loading animate-spin"></span>}
              </button>
            </form>

            {error && (
              <p className="mt-4 text-center text-sm text-red-600 font-semibold">
                {error}
              </p>
            )}

            <div className="mt-6 text-center text-sm flex justify-center items-center gap-1">
              <p className="text-gray-500">{mode === "login" ? "Don't have an account? " : "Already have an account? "}</p>
              <button
                onClick={toggleMode}
                className="font-semibold tracking-wider hover:underline"
              >
                {mode === "login" ? "SIGN UP" : "SIGN IN"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
