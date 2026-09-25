import { Link } from "react-router-dom"
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
  ProgressBar,
  ContextualAIMentor,
} from "../common"
import {
  BookOpen,
  Compass,
  FlaskConical,
  Award,
  ArrowRight,
  Clock,
  Sparkles,
  Flame,
  CheckCircle2,
} from "lucide-react"

/**
 * Learning-First Page Shell
 * 
 * Communicates clearly:
 * 1. WHERE AM I? (Page title, area badge, breadcrumb)
 * 2. WHAT AM I DOING? (Learning state, current track, progress status)
 * 3. WHAT SHOULD I DO NEXT? (Direct actionable next steps)
 * 
 * Seamlessly integrates the Contextual AI Mentor component without enterprise clutter.
 */
export function PageShell({
  title,
  area = "Learn",
  subtitle = "",
  description,
  activeModule = "Defensive Security Essentials",
  currentTopic = "Web Application Security",
  progressPercent = 58,
  nextActionLabel = "Continue Learning",
  nextActionPath = "/learning",
  icon: Icon = BookOpen,
}) {
  return (
    <div className="space-y-6">
      {/* 1. Header: WHERE AM I? */}
      <PageHeader
        title={title}
        description={
          description ||
          subtitle ||
          `Welcome to your ${title.toLowerCase()} workspace. Discover, practice, and track your cybersecurity mastery.`
        }
        badge={
          <Badge variant="primary" size="md">
            {area} Area
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold select-none">
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>3-day streak</span>
            </div>
          </div>
        }
      />

      {/* 2. Main Content Grid: WHAT AM I DOING? & WHAT SHOULD I DO NEXT? */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2/3): Current Learning Focus & Next Actions */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Learning Progress Card */}
          <Card variant="default">
            <CardHeader className="mb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Icon className="h-4 w-4" />
                  In Progress Track
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  ~25 mins remaining
                </span>
              </div>

              <CardTitle className="text-lg font-bold text-slate-900 mt-1">
                {activeModule}
              </CardTitle>
              <CardDescription>
                Hands-on concepts and defense patterns in {currentTopic}.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Module Completion</span>
                  <span className="font-bold text-blue-600">{progressPercent}% Completed</span>
                </div>
                <ProgressBar value={progressPercent} max={100} variant="primary" size="sm" />
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Lesson 4 of 7: Input Validation</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> 3 Quiz checks passed
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3">
              <div className="text-xs text-slate-500">
                Next up: <span className="font-semibold text-slate-700">Filter Evasion & Prevention Lab</span>
              </div>

              <Link to={nextActionPath}>
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  {nextActionLabel}
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Quick Learning Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card variant="interactive" className="p-4">
              <Link to="/learning-paths" className="block focus:outline-none">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Compass className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                      Career Paths
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-normal">
                      Structured curriculum for SOC Analysts & Security Engineers.
                    </p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card variant="interactive" className="p-4">
              <Link to="/labs" className="block focus:outline-none">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FlaskConical className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                      Practice Labs
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-normal">
                      Isolated browser sandboxes with real vulnerabilities to defend.
                    </p>
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </div>

        {/* Right Column (1/3): Contextual AI Mentor & Quick Milestones */}
        <div className="space-y-5">
          {/* Reusable Contextual AI Mentor Component */}
          <ContextualAIMentor
            topic={currentTopic}
            contextDescription="Stuck on a concept or need a simpler explanation? CyberMentor is here to help with hints and examples."
          />

          {/* Quick Milestones Card */}
          <Card variant="subtle">
            <CardHeader className="mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-sm font-semibold text-slate-800">
                  Learning Milestone
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Complete today's lab to unlock your next verified skill badge.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/80">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Award className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    Web Defense Novice
                  </p>
                  <p className="text-[11px] text-slate-500">1 of 2 labs completed</p>
                </div>
                <Badge variant="warning" size="sm">
                  50%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PageShell
