import PageShell from "../../components/layout/PageShell"
import { Settings as SettingsIcon } from "lucide-react"

export function Settings() {
  return (
    <PageShell
      title="Platform Settings"
      area="Account"
      subtitle="Preferences & Security"
      description="Configure notifications, display preferences, and account security options."
      activeModule="Account Security"
      currentTopic="Multi-Factor Authentication & Sessions"
      progressPercent={100}
      nextActionLabel="Save Changes"
      nextActionPath="/settings"
      icon={SettingsIcon}
    />
  )
}

export default Settings
