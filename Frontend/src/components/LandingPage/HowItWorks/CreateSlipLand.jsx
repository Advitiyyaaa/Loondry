import createSlipDark from "../../../assets/createSlipDark.png";
import createSlipLight from "../../../assets/createSlipLight.png";

export default function CreateSlipLand({ theme }) {

  return (
    <div
      className={`
        w-full flex items-center
        gap-3 md:gap-14
        md:px-10
        py-6 md:py-12
        md:ml-30
        scale-[0.8]
        md:scale-[1]
      `}
    >
      {/* Image */}
      <div className="w-65 md:w-95 shrink-0">
        {theme === "dark"
            ?<img
            src={createSlipDark}
            alt="Create Slip"
            className="w-full object-contain drop-shadow-xl"
            />
            :
            <img
            src={createSlipLight}
            alt="Create Slip"
            className="w-full object-contain drop-shadow-xl"
            />
        }
        
      </div>

      {/* Text Content */}
        <div className="flex min-w-0">
            <h3 className="font-bold tracking-tight leading-tight">
              <span className="block text-2xl sm:text-lg md:text-7xl">Create,</span>
              <span className="block text-xl sm:text-lg md:text-5xl">Slips in</span>
              <span className="block text-2xl sm:text-lg md:text-7xl">Seconds.</span>
            </h3>
        </div>
      </div>
    
  );
}
