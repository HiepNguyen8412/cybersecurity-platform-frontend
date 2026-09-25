import PageShell from "../../components/layout/PageShell"
import { Award } from "lucide-react"

export function Achievements() {
  return (
    <PageShell
      title="Achievements & Credentials"
      area="Progress"
      subtitle="Earned Badges"
      description="Verified certificates, challenge trophies, and skill badges earned throughout your learning journey."
      activeModule="Credential Milestone 2"
      currentTopic="Certified Web Defender Apprentice"
      progressPercent={90}
      nextActionLabel="Claim Next Badge"
      nextActionPath="/achievements"
      icon={Award}
    />
  )
}

export default Achievements
