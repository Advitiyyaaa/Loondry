import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { useRef } from "react";

export default function ProblemSolution({ theme }) {
	const ref = useRef(null);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 768);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);


	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end start"],
	});
	
	const y = useTransform(
		scrollYProgress,
		[0, 0.35],
		isMobile ? [0, -40] : [0, -50]
	);

	const scale = useTransform(
		scrollYProgress,
		[0, 1],
		isMobile ? [1, 1.18] : [1, 1.5]
	);

	return (
		<section ref={ref} className="relative min-h-[140vh] md:h-screen overflow-x-hidden overflow-y-clip">
			{/* Sticky viewport */}
			<div className="sticky top-0 h-screen flex items-start justify-center pt-20 sm:pt-24 md:pt-32">
				<motion.div
					style={{ y, scale }}
					className="text-center px-4 sm:px-6 w-full max-w-5xl mx-auto lg:scale-[1.1] xl:scale-[1.2] origin-top"
				>
					<h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-left pb-5">
						But how?
					</h2>
						<div className="pt-5 relative">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 relative">
							<div className={`absolute left-1/2 top-0 h-full w-px ${theme==="dark"?"bg-white/10":"bg-black/10"} hidden md:block`} />
							<div
								className={`
									w-full
									text-left
									space-y-4 
								`}
							>
								<h3
									className={`
										inline-block
										text-lg sm:text-xl md:text-2xl
										px-4 py-1
										font-semibold
										-rotate-2
										${theme === "dark"
											? "bg-white text-black"
											: "bg-black text-white"}
									`}
								>
									Current Process
								</h3>

								<div className="pl-2 flex flex-col gap-2">
									<p>Write your clothes.</p>
									<p>Wait in a queue.</p>
									<p>Repeat the list.</p>

									<div className="h-4" />

									<p>Register entry.</p>
									<p>Paper slip.</p>

									<div className="h-4" />

									<p className="font-medium">
										No tracking. No system. Just paper and memory.
									</p>
									<p className="font-medium">
										Lose the slip, lose the process.
									</p>

									<div className="h-4" />

									<p
										className={`
											${theme === "dark" ? "text-gray-400" : "text-gray-500"}
										`}
									>
										It doesn’t seem like much but it wastes time, creates queues,
										and depends entirely on paper.
									</p>
								</div>
							</div>

							<div
								className={`
									w-full
									lg:ml-10
									text-left
									space-y-4
								`}
							>
								<div className="relative inline-block mb-6">
									{/* Shadow layer */}
									<div
										className={`
											absolute inset-0 translate-x-2 translate-y-2 border-2
											${theme === "dark"
												? "border-white bg-white"
												: "border-black bg-black"}
										`}
									/>

									{/* Foreground label */}
									<h3
										className={`
											relative z-10 px-4 py-1 text-lg sm:text-xl md:text-2xl font-semibold border-2
											${theme === "dark"
												? "bg-black text-white border-white"
												: "bg-white text-black border-black"}
										`}
									>
										Loondry Process
									</h3>
								</div>

								<div className="pl-2 flex flex-col gap-2">
									<p>Create your digital slip from the web.</p>
									<p>Get estimated queue size before visiting the clinic.</p>

									<div className="h-4" />

									<p>Admin verifies clothes and approves the slip.</p>
									<p>Everything is recorded digitally.</p>

									<div className="h-4" />

									<p className="font-medium">
										Track real-time status - At Clinic, Ready for Pickup, Completed.
									</p>
									<p className="font-medium">
										Collect your bag using OTP verification.
									</p>

									<div className="h-4" />

									<p
										className={`
											${theme === "dark" ? "text-gray-400" : "text-gray-500"}
										`}
									>
										No paper. No confusion. No disputes. Just a smooth, trackable laundry process.
									</p>
								</div>
						</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
