import { useNavigate } from "react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function FinalCTA({ theme }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const check = () => setIsLg(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Zoom-out effect
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    isLg ? [1.3, 1] : [1, 1]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    isLg ? [80, 0] : [0, 0]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3],
    isLg ? [0, 1] : [1, 1]
  );

  return (
    <section
      ref={ref}
      className={`relative ${isLg ? "min-h-[200vh]" : "py-1 scale-[0.9] -ml-5"}`}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen flex items-center">
        <motion.div
          style={{ scale, y, opacity }}
          className="max-w-6xl mx-auto px-6"
        >
          {/* Big Heading */}
          <div className="relative inline-block -ml-2 md:ml-0">
            {/* Top-right tape */}
            <div className="absolute -top-3 -right-6 w-16 h-6 rotate-12 bg-yellow-200/80 border border-black/20 z-1" />

            {/* Bottom-left tape */}
            <div className="absolute -bottom-3 -left-6 w-16 h-6 -rotate-12 bg-yellow-200/80 border border-black/20 z-1" />

            <h2 className="text-3xl md:text-6xl font-extrabold p-2 md:px-4 tracking-tight leading-tight border-2 -rotate-2 w-90 lg:w-175">
              Laundry. Without the
              <br />
              Laundry Problems.
            </h2>
          </div>

          {/* Sub text */}
          <p
            className={`mt-8 text-sm md:text-xl max-w-2xl leading-relaxed lg:ml-4 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No paper slips. No confusion. No queues. Just a smart,
            trackable laundry flow powered by Loondry.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-4 mt-12 text-sm md:text-base font-medium">
            {[
              "Live Queue Count",
              "Slip Status Tracking",
              "OTP Bag Collection",
              "One-day Complaint Window",
            ].map((item, i) => (
              <span
                key={i}
                className={`px-4 py-2 border-2 border-dashed ${
                  theme === "dark"
                    ? "border-white text-white"
                    : "border-black text-black"
                }`}
              >
                {item}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="relative mt-12 md:mt-10 flex justify-center">
            <div className="relative inline-block">
              {/* Shadow layer */}
              <div
                className={`absolute top-0 left-0 w-full h-full translate-x-3 translate-y-3 border-2 scale-[0.8] ${
                  theme === "dark"
                    ? "border-white bg-white"
                    : "border-black bg-black"
                }`}
              />

              {/* Foreground action bar */}
              <div
                className={`relative z-10 flex flex-col items-center gap-4 px-6 py-5 border-2 scale-[0.8] ${
                  theme === "dark"
                    ? "bg-black border-white text-white"
                    : "bg-white border-black text-black"
                }`}
              >
                <div className="text-sm md:text-lg">
                  Ready to skip the paper slips and queues?
                </div>

                <div className="flex gap-4">
                  {/* Primary CTA */}
                  <button
                    onClick={() => navigate("/home")}
                    className={`px-3 py-1.5 md:px-8 md:py-6 font-semibold text-md transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-white text-black hover:bg-gray-300"
                        : "bg-black text-white hover:bg-gray-700"
                    }`}
                  >
                    Get Started
                  </button>

                  {/* Secondary CTA */}
                  <button
                    onClick={() => navigate("/auth")}
                    className="px-3 py-1.5 md:px-8 md:py-6 font-semibold text-md hover:bg-gray-400/30"
                  >
                    Login Instead
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
