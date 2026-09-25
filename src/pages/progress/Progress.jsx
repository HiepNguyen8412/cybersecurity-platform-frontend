import PageShell from "../../components/layout/PageShell"
import { TrendingUp } from "lucide-react"

export function Progress() {
  return (
    <PageShell
      title="My Progress"
      area="Progress"
      subtitle="Skill Mastery & Activity"
      description="Review your mastery across security domains, completed modules, and weekly study streaks."
      activeModule="Junior Analyst Progress Matrix"
      currentTopic="Network Protocols & Vulnerabilities"
      progressPercent={72}
      nextActionLabel="View Full Assessment"
      nextActionPath="/progress"
      icon={TrendingUp}
    />
  )
}

export default Progress
