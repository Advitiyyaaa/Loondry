import { useNavigate } from "react-router";

export default function UserComplainCard({ complain }) {
    const navigate = useNavigate();

    const formatDate = (d) =>
      new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    const formatTimeOnly = (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).toUpperCase();


    return (
      <div className="border mt-3 text-sm w-full">
        {/* Header */}
          <div className="px-3 py-2 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex flex-col items-start justify-between">
                  <p className="font-semibold tracking-wider">Complaint</p>

                  {/* Linked Slip */}
                  {complain?.slipId && (
                      <button
                      onClick={() =>
                          navigate("/home", {
                          state: { openSlipId: complain?.slipId },
                          })
                      }
                      className="pt-1 tracking-wider text-xs opacity-70 hover:underline"
                      >
                      View linked Slip
                      </button>
                  )}  
              </div>
              <div className="flex flex-col sm:items-end text-left sm:text-right">   
                  <p
                      className={`text-xs font-semibold tracking-wider ${
                          complain?.resolved ? "text-green-600" : "text-orange-600"
                      }`}
                  >
                      {complain?.resolved ? `Resolved on ${formatDate(complain?.resolvedAt)} at ${formatTimeOnly(complain?.resolvedAt)}` : "Pending"}
                  </p>
                  

                  <p className="text-xs pt-1 opacity-70 tracking-wider">
                      Raised on {formatDate(complain?.createdAt)}
                  </p>          
                  
              </div>    
          </div>

        {/* User Note */}
        <div className="px-3 py-2 border-t border-dashed">
          <p className="font-semibold text-blue-500 text-xs mb-1 tracking-wider">Your Note</p>
          <p className="opacity-80 whitespace-pre-wrap leading-relaxed">{complain?.userNote}</p>
        </div>

        {/* Clinic Reply */}
        {complain?.resolved && complain?.clinicNote && (
          <div className="px-3 py-2 border-t border-dashed bg-black/5 dark:bg-white/5">
            <p className="font-semibold text-yellow-500 text-xs mb-1">
              Clinic Reply
            </p>
            <p className="opacity-80 whitespace-pre-wrap">
              {complain?.clinicNote}
            </p>
          </div>
        )}
      </div>
    );
}
