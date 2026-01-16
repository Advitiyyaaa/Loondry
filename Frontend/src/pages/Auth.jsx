import { useEffect, useState } from "react";
import { toggleTheme } from "../store/themeSlice";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


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
    console.log(data);
    };

  const toggleMode = () => {
    setMode((p) => (p === "login" ? "register" : "login"));
    reset();
  };


  return (
    <div className="min-h-screen bg-white duration-300">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg bg-white"
        >
            {theme === "light" ? (
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 text-black">
        <div className="w-full max-w-md relative inline-block">
          {/* Form Card */}
          <div className="absolute inset-0 translate-x-3 translate-y-3 border-2 border-black bg-black"></div>
          <div className="relative bg-white border-black border-2 shadow-xl p-8">
            <div className="flex flex-col justify-center items-center mb-6">
                <p className="text-3xl font-extrabold text-black">{mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}</p>
                <span className="mt-2 text-sm font-bold tracking-wide text-gray-500">ENTER YOUR CREDENTIALS</span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                
              {mode === "register" && (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold tracking-wider mb-2">
                        FIRST NAME
                        </label>
                        <input 
                        {...register("firstName")}
                        className="w-full px-4 py-2 border-black border-2 bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="John"
                        />
                        {errors.firstName && (
                        <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold tracking-wider mb-2">
                        LAST NAME
                        </label>
                        <input
                        {...register("lastName")}
                        className="w-full px-4 py-2 border-2 border-black bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="Doe"
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-sm font-bold tracking-wider mb-1">
                        LAUNDRY BAG NUMBER
                    </label>
                    <span className="block mb-1 text-xs text-gray-500 font-semibold">
                        It is assigned while purchasing the laundry bag.
                    </span>
                    <input
                        {...register("bagNo")}
                        className="w-full px-4 py-2 border-2 border-black bg-white focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        placeholder="e.g. 6277"
                    />
                    {errors.bagNo && (
                        <p className="mt-1 text-xs text-red-500">{errors.bagNo}</p>
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
                  className="w-full px-4 py-2 border-2 border-black  bg-white  text-black focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  placeholder="you@bennett.edu.in"
                />
                {errors.emailId && (
                  <p className="mt-1 text-xs text-red-500">{errors.emailId}</p>
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
                    className="w-full px-4 py-2 border-2 border-black bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all pr-10"
                    placeholder="••••••••"
                    />

                    <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-black opacity-70 hover:opacity-100"
                    >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

  {errors.password && (
    <p className="mt-1 text-xs text-red-500">{errors.password}</p>
  )}
</div>

              <button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold tracking-wider py-3 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="text-black font-semibold tracking-wider hover:underline"
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