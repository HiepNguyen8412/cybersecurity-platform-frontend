import PageShell from "../../components/layout/PageShell"
import { LayoutDashboard } from "lucide-react"

export function Dashboard() {
  return (
    <PageShell
      title="Welcome back, Alex"
      area="Learn"
      subtitle="Daily Learning Overview"
      description="Track your daily learning streak, continue your current module, or practice in hands-on defense labs."
      activeModule="Defensive Security Essentials"
      currentTopic="SQL Injection & Sanitization"
      progressPercent={65}
      nextActionLabel="Continue Lesson"
      nextActionPath="/learning"
      icon={LayoutDashboard}
    />
  )
}

export default Dashboard
