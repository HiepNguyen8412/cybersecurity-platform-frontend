import PageShell from "../../components/layout/PageShell"
import { User } from "lucide-react"

export function Profile() {
  return (
    <PageShell
      title="Learner Profile"
      area="Account"
      subtitle="Public Portfolio & Credentials"
      description="Manage your learning identity, verified skill certificates, and learning preferences."
      activeModule="Public Analyst Profile"
      currentTopic="Profile Verification"
      progressPercent={100}
      nextActionLabel="Edit Preferences"
      nextActionPath="/settings"
      icon={User}
    />
  )
}

export default Profile
