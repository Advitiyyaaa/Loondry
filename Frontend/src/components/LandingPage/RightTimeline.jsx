import { motion, useTransform } from "framer-motion";
import { Check } from "lucide-react";

export default function RightTimeline({ theme, p1, p2, p3, p4, p5, p6 }) {
	const isDark = theme === "dark";

	const gray = isDark
		? "rgba(255,255,255,0.25)"
		: "rgba(0,0,0,0.25)";

	const active = isDark ? "#ffffff" : "#000000";

	const line = (p) =>
		useTransform(p, [0, 1], [gray, active]);

	const textBox = isDark
		? "bg-white text-black"
		: "bg-black text-white";

	return (
		<div>
			<ul className="timeline timeline-vertical">
				{/*Slip Created*/}
				<li>
					<div
						className={`timeline-end px-2 font-semibold ${textBox} -rotate-6 py-2 mb-6`}
					>
						Slip-Created
					</div>

					<div className="timeline-middle">
						<Check
							className={`${
								theme === "dark"
									? "bg-white text-black"
									: "bg-black text-white"
							} mb-1 h-8 w-8`}
						/>
					</div>

					<motion.hr
						style={{ backgroundColor: line(p1) }}
						className="h-20 w-8 rounded-none"
					/>
				</li>

				{/*At Clinic*/}
				<li>
					<motion.hr
						style={{ backgroundColor: line(p2) }}
						className="h-20 w-8 rounded-none"
					/>

					<div className="timeline-middle">
						<Check
							className={`${
								theme === "dark"
									? "bg-white text-black"
									: "bg-black text-white"
							} my-1 h-8 w-8`}
						/>
					</div>

					<div
						className={`timeline-end px-2 font-semibold ${textBox} -rotate-4 py-2 mb-3`}
					>
						At Clinic
					</div>

					<motion.hr
						style={{ backgroundColor: line(p3) }}
						className="h-20 w-8 rounded-none"
					/>
				</li>

				{/*Ready*/}
				<li>
					<motion.hr
						style={{ backgroundColor: line(p4) }}
						className="h-20 w-8 rounded-none"
					/>

					<div className={`timeline-end px-2 font-semibold ${textBox} py-2`}>
						Ready for Pickup
					</div>

					<div className="timeline-middle">
						<Check
							className={`${
								theme === "dark"
									? "bg-white text-black"
									: "bg-black text-white"
							} my-1 h-8 w-8`}
						/>
					</div>

					<motion.hr
						style={{ backgroundColor: line(p5) }}
						className="h-20 w-8 rounded-none"
					/>
				</li>

				{/*Completed*/}
				<li>
					<motion.hr
						style={{ backgroundColor: line(p6) }}
						className="h-20 w-8 rounded-none"
					/>

					<div className="timeline-middle">
						<Check
							className={`${
								theme === "dark"
									? "bg-white text-black"
									: "bg-black text-white"
							} mt-1 h-8 w-8`}
						/>
					</div>

					<div
						className={`timeline-end px-2 font-semibold ${textBox} rotate-10 py-2 mt-7`}
					>
						Completed
					</div>
				</li>
			</ul>
		</div>
	);
}
