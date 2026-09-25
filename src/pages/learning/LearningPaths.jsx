import PageShell from "../../components/layout/PageShell"
import { Compass } from "lucide-react"

export function LearningPaths() {
  return (
    <PageShell
      title="Learning Paths"
      area="Learn"
      subtitle="Career Trajectories"
      description="Curated multi-course career tracks designed to take you from fundamentals to certified security practitioner."
      activeModule="SOC Analyst Career Track"
      currentTopic="Security Incident & Event Management"
      progressPercent={28}
      nextActionLabel="Resume Career Path"
      nextActionPath="/learning-paths"
      icon={Compass}
    />
  )
}

export default LearningPaths
