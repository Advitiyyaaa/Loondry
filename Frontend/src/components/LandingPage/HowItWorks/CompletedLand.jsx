import completedDark from "../../../assets/completedDark.png";
import completedLight from "../../../assets/completedLight.png";

export default function CompletedLand({ theme }) {

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
        {/* Text Content */}
        <div className="flex min-w-0">
            <h3 className="font-bold tracking-tight leading-tight">
                <span className="block text-2xl sm:text-lg md:text-7xl">
                Not right?
                </span>
                <span className="block text-xl sm:text-lg md:text-7xl">
                Complain.
                </span>
                <span className="block text-xl sm:text-lg md:text-5xl">
                Within a day.
                </span>
            </h3>
        </div>
        {/* Image */}
        <div className="w-65 md:w-95 shrink-0">
            {theme === "dark"
                ?<img
                src={completedDark}
                alt="Create Slip"
                className="w-full object-contain drop-shadow-xl"
                />
                :
                <img
                src={completedLight}
                alt="Create Slip"
                className="w-full object-contain drop-shadow-xl"
                />
            }
            
        </div>

        
        </div>
    );
}
