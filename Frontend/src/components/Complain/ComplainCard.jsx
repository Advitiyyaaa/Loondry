import { useNavigate } from "react-router";

export default function ComplainCard({ complain }) {
  const navigate = useNavigate();

  const format = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="border mt-3 text-sm">
      {/* Header */}
        <div className="px-3 pt-1">
            <div className="flex items-center justify-between">
                <p className="font-semibold tracking-wider">Complaint</p>

                <p
                    className={`text-xs font-semibold tracking-wider ${
                        complain.resolved ? "text-green-600" : "text-orange-600"
                    }`}
                >
                    {complain.resolved ? "Resolved" : "Pending"}
                </p>

                
            </div>
            <div className="flex items-center justify-between">   
                
                {/* Linked Slip */}
                {complain.slipId && (
                    <button
                    onClick={() =>
                        navigate("/home", {
                        state: { openSlipId: complain.slipId },
                        })
                    }
                    className="py-2 tracking-wider text-xs opacity-70 hover:underline"
                    >
                    View linked slip
                    </button>
                )}  

                <p className="text-xs opacity-70 tracking-wider">
                    Raised on {format(complain.createdAt)}
                </p>          
                
            </div>    
        </div>

      {/* User Note */}
      <div className="px-3 py-2 border-t">
        <p className="font-semibold text-blue-500 text-xs mb-1 tracking-wider">Your Note</p>
        <p className="opacity-80 whitespace-pre-wrap">{complain.userNote}</p>
      </div>

      {/* Clinic Reply */}
      {complain.resolved && complain.clinicNote && (
        <div className="px-3 py-2 border-t bg-black/5 dark:bg-white/5">
          <p className="font-semibold text-yellow-500 text-xs mb-1">
            Clinic Reply
          </p>
          <p className="opacity-80 whitespace-pre-wrap">
            {complain.clinicNote}
          </p>
        </div>
      )}

      {/* Resolved Date */}
      {complain.resolved && complain.resolvedAt && (
        <div className="px-3 py-2 border-t text-xs opacity-70">
          Resolved on {format(complain.resolvedAt)}
        </div>
      )}
    </div>
  );
}
