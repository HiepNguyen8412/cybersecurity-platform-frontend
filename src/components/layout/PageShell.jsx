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
  CountUp,
} from "../common"
import {
  BookOpen,
  Compass,
  FlaskConical,
  Award,
  ArrowRight,
  Clock,
  Target,
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
 * Fully adaptive across Light, Dark (Stealth), and Cyber Range themes.
 */
export function PageShell({
  title,
  area = "Học tập",
  subtitle = "",
  description,
  activeModule = "Nền tảng An toàn Phòng thủ Web",
  currentTopic = "Bảo mật Ứng dụng Web & OWASP Top 10",
  progressPercent = 58,
  nextActionLabel = "Tiếp tục bài học",
  nextActionPath = "/learning",
  icon: Icon = BookOpen,
}) {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-in-up">
      {/* 1. Header: WHERE AM I? */}
      <PageHeader
        title={title}
        description={
          description ||
          subtitle ||
          `Chào mừng bạn đến với không gian làm việc ${title.toLowerCase()}. Khám phá, rèn luyện thực chiến và theo dõi quá trình làm chủ an ninh mạng.`
        }
        badge={
          <Badge variant="primary" size="md">
            Khu vực {area}
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 cyberpunk:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 cyberpunk:border-amber-500/50 text-amber-800 dark:text-amber-300 cyberpunk:text-amber-300 text-xs font-semibold select-none">
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>Chuỗi <CountUp end={3} duration={1400} /> ngày liên tiếp</span>
            </div>
          </div>
        }
      />

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2/3): Current Learning Focus & Next Actions */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Learning Progress Card */}
          <Card variant="default">
            <CardHeader className="mb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 cyberpunk:text-cyan-400 flex items-center gap-1.5">
                  <Icon className="h-4 w-4" />
                  Học phần đang triển khai
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-300/80 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  ~25 phút còn lại
                </span>
              </div>

              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white cyberpunk:text-cyan-50 mt-1">
                {activeModule}
              </CardTitle>
              <CardDescription>
                Khái niệm thực chiến và mô hình phòng thủ nâng cao trong {currentTopic}.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 cyberpunk:bg-[#071329] border border-slate-200/70 dark:border-slate-700 cyberpunk:border-cyan-500/40 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 cyberpunk:text-cyan-100">Tiến độ module</span>
                  <span className="font-bold text-blue-600 dark:text-cyan-400 cyberpunk:text-cyan-300 inline-flex items-center gap-0.5">
                    <CountUp end={progressPercent} suffix="%" duration={1800} /> Hoàn tất
                  </span>
                </div>
                <ProgressBar value={progressPercent} max={100} variant="primary" size="sm" />
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-400/80 pt-0.5">
                  <span>Bài 4/7: Input Validation & Sanitization</span>
                  <span className="text-emerald-600 dark:text-emerald-400 cyberpunk:text-emerald-300 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Đã vượt qua 3 bài kiểm tra
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3">
              <div className="text-xs text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-200/90">
                Tiếp theo: <span className="font-semibold text-slate-700 dark:text-white cyberpunk:text-cyan-100">Lab Thực chiến: Filter Evasion & Prevention</span>
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
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 cyberpunk:bg-cyan-950/70 text-blue-600 dark:text-cyan-400">
                    <Compass className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white cyberpunk:text-cyan-50 leading-tight">
                      Lộ trình Chuyên môn
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-200/90 mt-1 leading-normal">
                      Khung chương trình chuẩn hóa cho SOC Analyst & Security Engineer.
                    </p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card variant="interactive" className="p-4">
              <Link to="/labs" className="block focus:outline-none">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 cyberpunk:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
                    <FlaskConical className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white cyberpunk:text-cyan-50 leading-tight">
                      Phòng Lab & CTF
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-300 cyberpunk:text-cyan-200/90 mt-1 leading-normal">
                      Môi trường sandbox cô lập với các lỗ hổng thực tế cần phòng thủ.
                    </p>
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </div>

        {/* Right Column (1/3): Tactical SOC Intel & Quick Milestones */}
        <div className="space-y-5">
          {/* Reusable Contextual Tactical Intel Component */}
          <ContextualAIMentor
            topic={currentTopic}
            contextDescription="Tình báo thực địa & hướng dẫn phòng thủ cho các lỗ hổng theo chuẩn OWASP Top 10 và MITRE ATT&CK."
          />

          {/* Quick Milestones Card */}
          <Card variant="subtle">
            <CardHeader className="mb-2">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-blue-600 dark:text-cyan-400" />
                <CardTitle className="text-sm font-semibold text-slate-800 dark:text-white cyberpunk:text-cyan-50">
                  Cột mốc Kỹ năng
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Hoàn thành phòng lab hôm nay để mở khóa huy hiệu năng lực phòng thủ tiếp theo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800/90 cyberpunk:bg-[#060e1d] border border-slate-200/80 dark:border-slate-700 cyberpunk:border-cyan-500/40">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                  <Award className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white cyberpunk:text-cyan-50 truncate">
                    Chuyên viên Phòng thủ Web (Web Defense Novice)
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 cyberpunk:text-cyan-300/80">1 / 2 bài lab hoàn tất</p>
                </div>
                <Badge variant="warning" size="sm">
                  <CountUp end={50} suffix="%" duration={1800} />
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
