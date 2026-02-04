import { useSelector } from "react-redux";
import LandingNavbar from "../components/LandingPage/LandingNavbar";
import HeroZoomSlip from "../components/LandingPage/HeroZoomSlip";
import HowItWorks from "../components/LandingPage/HowItWorks";
import ProblemSolution from "../components/LandingPage/ProblemSolution";

export default function Landing() {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <div className="overflow-x-hidden md:overflow-visible">
      <LandingNavbar theme={theme} />
      <HeroZoomSlip theme={theme} />
      <ProblemSolution theme={theme} /> 
      <HowItWorks theme={theme} />
    </div>
  );
}
