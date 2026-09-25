import PageShell from "../../components/layout/PageShell"
import { FlaskConical } from "lucide-react"

export function Labs() {
  return (
    <PageShell
      title="Hands-on Labs"
      area="Learn"
      subtitle="Isolated Browser Sandboxes"
      description="Real-world simulated vulnerability environments. Practice defensive hardening and attack forensics with zero setup."
      activeModule="Server-Side Defense Sandbox"
      currentTopic="Firewall Rules & Packet Filtering"
      progressPercent={80}
      nextActionLabel="Launch Lab Sandbox"
      nextActionPath="/labs"
      icon={FlaskConical}
    />
  )
}

export default Labs
