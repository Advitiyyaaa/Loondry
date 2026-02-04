import { motion, useScroll, useTransform } from "framer-motion";
import FloatingClothes from "./FloatingClothes";
import { useRef } from "react";

export default function HeroZoomSlip({ theme }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  return (
    <section ref={ref} className="relative overflow-x-hidden min-h-[90vh] md:h-[120vh]">
      {/* Sticky viewport */}
      <div className="sticky top-0 min-h-[70vh] md:h-screen flex items-start justify-center pt-40 md:pt-60">  
        <div className="w-full flex justify-center overflow-hidden">
          <motion.div
            style={{ opacity, y, scale }}
            className="text-center px-6 pt-10 md:pt-0"
          >
            <div className="flex justify-center flex-col items-center">
              <h1 className="text-6xl sm:text-4xl md:text-6xl lg:text-7xl max-w-4xl font-bold tracking-tight leading-[1.1]">
                Laundry, Engineered.
              </h1>

              <p className="mt-4 sm:mt-8 text-md md:text-xl lg:text-2xl max-w-3xl lg:max-w-4xl text-gray-500 dark:text-gray-400 leading-relaxed">
                Queue logic. Status flow. OTP verification. Complaint window.
                <br />
                All powered by a single smart slip.
              </p>
            </div>
            <div className="mt-4 sm:mt-16 md:mt-20">
              <FloatingClothes theme={theme} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
