export default function Footer() {
    return (
        <footer className="border-t mt-10">
        <div className="w-[89%] sm:w-[96.5%] mx-auto py-6 text-xs sm:text-sm flex flex-col sm:flex-row gap-3 sm:gap-0 items-center justify-between opacity-80">
            <div>
                <p className="font-semibold">© {new Date().getFullYear()} Loondry.</p>
                <p className="opacity-70 text-xs">Fresh clothes. Clear queues. Zero chaos.</p>  
            </div>
            
            {/* <div className="flex gap-4">
                <span className="hover:underline cursor-pointer">About</span>
                <span className="opacity-70">MERN Stack</span>
                <span className="opacity-70">Project by Advitiya</span>
            </div> */}
        </div>
        </footer>
    );
}
