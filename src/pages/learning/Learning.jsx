import PageShell from "../../components/layout/PageShell"
import { BookOpen } from "lucide-react"

export function Learning() {
  return (
    <PageShell
      title="Learning Modules"
      area="Learn"
      subtitle="Interactive Courses"
      description="Step-by-step interactive courses covering defensive security, penetration testing, and incident response."
      activeModule="Web Application Security"
      currentTopic="Cross-Site Scripting (XSS) Mitigation"
      progressPercent={40}
      nextActionLabel="Start Next Lesson"
      nextActionPath="/learning"
      icon={BookOpen}
    />
  )
}

export default Learning
