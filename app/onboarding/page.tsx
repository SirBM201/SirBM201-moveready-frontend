import LaunchJourneyGuide from "@/components/LaunchJourneyGuide";
import SiteHeader from "@/components/SiteHeader";

export default function OnboardingPage() {
  return <main className="page-shell"><SiteHeader sectionLabel="Guided MoveReady journey" /><LaunchJourneyGuide /></main>;
}
