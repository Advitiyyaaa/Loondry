import readyForPickupDark from "../../../assets/readyForPickupDark.png";
import readyForPickupLight from "../../../assets/readyForPickupLight.png";

export default function ReadyLand({ theme }) {

    return (
        <div
        className={`
            w-full flex items-center
            gap-4 md:gap-14
            px-4 md:px-10
            py-6 md:py-12
            md:ml-30
        `}
        >
            {/* Image */}
            <div className="w-65 md:w-95 shrink-0">
                {theme === "dark"
                    ?<img
                    src={readyForPickupDark}
                    alt="Create Slip"
                    className="w-full object-contain drop-shadow-xl"
                    />
                    :
                    <img
                    src={readyForPickupLight}
                    alt="Create Slip"
                    className="w-full object-contain drop-shadow-xl"
                    />
                }
            </div>
            {/* Text Content */}
            <div className="flex min-w-0">
                <h3 className="font-bold tracking-tight leading-tight">
                    <span className="block text-2xl sm:text-lg md:text-7xl">No slip.</span>
                    <span className="block text-xl sm:text-lg md:text-5xl">No confusion.</span>
                    <span className="block text-2xl sm:text-lg md:text-7xl">Just OTP.</span>
                </h3>
            </div>
        </div>
    );
}
