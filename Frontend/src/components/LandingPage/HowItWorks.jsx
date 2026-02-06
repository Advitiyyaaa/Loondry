import RightTimeline from "./RightTimeline";
import CreateSlipLand from "./HowItWorks/CreateSlipLand";
import AtClinicLand from "./HowItWorks/AtClinicLand";
import ReadyLand from "./HowItWorks/ReadyLand";
import CompletedLand from "./HowItWorks/CompletedLand";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

export default function HowItWorks({ theme }) {
  const sectionRef = useRef(null);
  const slipsRef = useRef(null);

  const slipsInView = useInView(slipsRef, {
    margin: "-35% 0px -35% 0px",
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const p1 = useTransform(scrollYProgress, [0.15, 0.22], [0, 1]);
  const p2 = useTransform(scrollYProgress, [0.22, 0.30], [0, 1]);

  const p3 = useTransform(scrollYProgress, [0.30, 0.40], [0, 1]);
  const p4 = useTransform(scrollYProgress, [0.40, 0.52], [0, 1]);

  const p5 = useTransform(scrollYProgress, [0.52, 0.68], [0, 1]);
  const p6 = useTransform(scrollYProgress, [0.68, 0.85], [0, 1]);

  const y = useTransform(scrollYProgress, [0, 0.22], [0, -140]);
  const scale = useTransform(scrollYProgress, [0, 0.22], [1.4, 2]);
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.18], [1, 1, 0]);

  return (
    <section ref={sectionRef} className="relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 ">

        {/*LEFT COLUMN*/}
        <div className="col-span-1 md:col-span-8 relative lg:-translate-x-25 xl:-translate-x-38">
          {/* Sticky heading */}
          <div className="md:sticky md:top-0 md:h-screen flex items-start justify-start pt-20 md:pt-44">
            <motion.div
              style={{ y, scale, opacity }}
              className="px-6 max-w-4xl ml-4 md:ml-12"
            >
              <div className="relative inline-block -ml-3 md:ml-40 md:mt-10 scale-[0.75] md:scale-[1]">

                {/* Tape – left */}
                <div
                  className={`
                    absolute -top-3 left-6 w-14 h-6 rotate-[-18deg] z-10
                    ${theme === "dark" ? "bg-white/70" : "bg-black/20"}
                    backdrop-blur-sm
                  `}
                  style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)" }}
                />

                {/* Tape – right */}
                <div
                  className={`
                    absolute -top-3 right-6 w-14 h-6 rotate-18 z-10
                    ${theme === "dark" ? "bg-white/70" : "bg-black/20"}
                    backdrop-blur-sm
                  `}
                  style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)" }}
                />

                {/* Paper */}
                <div
                  className={`
                    relative px-8 py-4 border-2
                    ${theme === "dark"
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"}
                    shadow-xl
                    -rotate-2
                  `}
                >
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                    Slip Lifecycle!
                  </h2>
                </div>

              </div>

            </motion.div>
          </div>

          <div ref={slipsRef} className="flex flex-col md:gap-20 mt-10 md:mt-0">
            <CreateSlipLand theme={theme}/>
            <AtClinicLand theme={theme}/>
            <ReadyLand theme={theme}/>
            <CompletedLand theme={theme}/>
          </div>

        </div>

        {/*RIGHT COLUMN*/}
        <div className="hidden lg:block col-span-4 relative">
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{
              opacity: slipsInView ? 1 : 0,
              x: slipsInView ? 0 : 60,
            }}
            transition={{ duration: 0.5 }}
            className="sticky top-3"
          >
            <RightTimeline
              theme={theme}
              p1={p1}
              p2={p2}
              p3={p3}
              p4={p4}
              p5={p5}
              p6={p6}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
