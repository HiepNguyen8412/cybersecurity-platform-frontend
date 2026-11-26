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
 * Fully adaptive across Editorial Light and Deep Obsidian Dark.
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
      {/* 1. Đầu trang: Vị trí & Mạch học tập */}
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
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/12 border border-amber-200/80 dark:border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-semibold select-none">
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span>
                Chuỗi <CountUp end={3} duration={1400} /> ngày liên tiếp
              </span>
            </div>
          </div>
        }
      />

      {/* 2. Lưới nội dung chính */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cột trái (2/3): Trọng tâm học tập & Hành động tiếp theo */}
        <div className="lg:col-span-2 space-y-5">
          <Card variant="default">
            <CardHeader className="mb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono-tech font-semibold uppercase tracking-wider text-[#1D4ED8] dark:text-[#38BDF8] flex items-center gap-1.5">
                  <Icon className="h-4 w-4" />
                  Học phần đang triển khai
                </span>
                <span className="text-xs text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  ~25 phút còn lại
                </span>
              </div>

              <CardTitle className="font-serif-editorial text-xl font-semibold text-[#0F172A] dark:text-[#F1F5F9] mt-1">
                {activeModule}
              </CardTitle>
              <CardDescription>
                Khái niệm thực chiến và mô hình phòng thủ nâng cao trong {currentTopic}.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Thanh tiến độ */}
              <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                    Tiến độ học phần
                  </span>
                  <span className="font-mono-tech font-bold text-[#1D4ED8] dark:text-[#38BDF8] inline-flex items-center gap-1">
                    <CountUp end={progressPercent} suffix="%" duration={1800} /> Hoàn tất
                  </span>
                </div>
                <ProgressBar value={progressPercent} max={100} variant="primary" size="sm" />
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748B] dark:text-[#94A3B8] pt-0.5">
                  <span>Bài 4/7: Kiểm tra &amp; Làm sạch Dữ liệu Đầu vào</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Đã vượt qua 3 bài kiểm tra
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3">
              <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Tiếp theo:{" "}
                <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                  Lab Thực chiến: Vượt Bộ lọc &amp; Biện pháp Phòng ngừa
                </span>
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

          {/* Thẻ điều hướng học tập nhanh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card variant="interactive" className="p-4">
              <Link to="/learning-paths" className="block focus:outline-none">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] dark:bg-[#3B82F6]/12 border border-[#BFDBFE]/70 dark:border-[#3B82F6]/25 text-[#1D4ED8] dark:text-[#38BDF8]">
                    <Compass className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                      Lộ trình Chuyên môn
                    </h4>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 leading-normal">
                      Khung chương trình chuẩn hóa cho Chuyên viên SOC &amp; Kỹ sư Bảo mật.
                    </p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card variant="interactive" className="p-4">
              <Link to="/labs" className="block focus:outline-none">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/12 border border-emerald-200/70 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-400">
                    <FlaskConical className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] leading-tight">
                      Phòng Lab &amp; CTF
                    </h4>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 leading-normal">
                      Môi trường cô lập với các lỗ hổng thực tế cần phân tích và phòng thủ.
                    </p>
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </div>

        {/* Cột phải (1/3): Phân tích theo ngữ cảnh & Cột mốc */}
        <div className="space-y-5">
          <ContextualAIMentor
            topic={currentTopic}
            contextDescription="Phân tích chuyên sâu & hướng dẫn phòng thủ theo chuẩn OWASP Top 10 và MITRE ATT&CK."
          />

          <Card variant="subtle">
            <CardHeader className="mb-2">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-[#1D4ED8] dark:text-[#38BDF8]" />
                <CardTitle className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                  Cột mốc Kỹ năng
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Hoàn thành phòng lab hôm nay để mở khóa huy hiệu năng lực phòng thủ tiếp theo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08]">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/12 text-amber-600 dark:text-amber-400 border border-amber-200/70 dark:border-amber-500/25">
                  <Award className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] truncate">
                    Phòng thủ Web Cơ bản
                  </p>
                  <p className="text-[11px] font-mono-tech text-[#64748B] dark:text-[#94A3B8]">
                    1 / 2 bài lab hoàn tất
                  </p>
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
