/**
 * Mock Data for Cybersecurity Learning Platform Dashboard
 * 
 * Provides structured, isolated mock datasets for local development.
 * Fully localized with authentic Vietnamese technical cybersecurity terminology.
 */

// 1. Next Recommended Learning Action (Primary focal section)
export const mockNextStep = {
  id: "lab-sqli-evasion",
  type: "Phòng Lab Thực Chiến",
  courseTitle: "Nền Tảng An Ninh Ứng Dụng Web",
  moduleTitle: "Chuyên Đề 3: Truy Vấn Cơ Sở Dữ Liệu An Toàn",
  lessonTitle: "SQL Injection: Evasion Filter & Tham Số Hóa Truy Vấn",
  description:
    "Tìm hiểu cách kẻ tấn công bypass các bộ lọc từ khóa ngây thơ và thực hành triển khai Prepared Statements để vá triệt để lỗ hổng trên ứng dụng thực tế.",
  progress: 65,
  currentTopic: "Bài 4/6: Xây Dựng Truy Vấn Tham Số Hóa (Prepared Statements)",
  estimatedTime: "Còn khoảng 15 phút",
  difficulty: "Trung Cấp",
  badgeText: "Phòng Lab Thực Chiến",
  primaryAction: {
    label: "Tiếp Tục Thực Hành Lab",
    path: "/labs",
  },
  secondaryAction: {
    label: "Xem Ghi Chú Bài Học",
    path: "/learning",
  },
}

// 2. Learning Overview Statistics (4 concise metrics)
export const mockLearningOverview = [
  {
    id: "stat-progress",
    label: "Tiến Độ Tổng Thể",
    value: 42,
    suffix: "%",
    subtitle: "Trên toàn bộ chương trình đã ghi danh",
    icon: "TrendingUp",
    variant: "primary",
    trend: "+4% tuần này",
    hasProgressBar: true,
  },
  {
    id: "stat-courses",
    label: "Khóa Học Hoàn Thành",
    value: 4,
    suffix: "",
    subtitle: "4 trên 12 khóa học cốt lõi",
    icon: "BookOpen",
    variant: "indigo",
    trend: "1 khóa đang tiếp diễn",
    hasProgressBar: false,
  },
  {
    id: "stat-labs",
    label: "Phòng Lab Đã Vượt Qua",
    value: 12,
    suffix: "",
    subtitle: "12 trên 28 sandbox thực chiến",
    icon: "FlaskConical",
    variant: "success",
    trend: "+3 lab tuần này",
    hasProgressBar: false,
  },
  {
    id: "stat-streak",
    label: "Chuỗi Ngày Liên Tục",
    value: 7,
    suffix: " ngày",
    subtitle: "Luyện tập không gián đoạn",
    icon: "Flame",
    variant: "warning",
    trend: "Kỷ lục cá nhân! 🔥",
    hasProgressBar: false,
  },
]

// 3. Learning Paths Data (Current path & available alternatives)
export const mockLearningPaths = [
  {
    id: "path-sec-analyst",
    title: "Chuyên Viên Phân Tích SOC (Blue Team)",
    isCurrent: true,
    description:
      "Làm chủ kỹ thuật giám sát an ninh mạng, phân tích log SIEM, tình báo mối đe dọa và đánh giá thế trận phòng thủ trong môi trường SOC doanh nghiệp.",
    progress: 48,
    currentStage: "Chặng 2: Phát Hiện Mối Đe Dọa & Phân Loại Cảnh Báo SIEM",
    currentStageNumber: 2,
    totalStages: 5,
    completedStages: 1,
    stages: [
      { id: 1, name: "Nền Tảng An Ninh & Mạng Máy Tính", status: "completed" },
      { id: 2, name: "Phát Hiện Mối Đe Dọa & Phân Loại Cảnh Báo SIEM", status: "in-progress" },
      { id: 3, name: "Ứng Cứu Sự Cố & Điều Tra Kỹ Thuật Số (DFIR)", status: "upcoming" },
      { id: 4, name: "Quản Lý & Khắc Phục Lỗ Hổng Bảo Mật", status: "upcoming" },
      { id: 5, name: "Đồ Án Tốt Nghiệp & Chứng Chỉ SOC Chuyên Nghiệp", status: "upcoming" },
    ],
    modulesCount: 14,
    labsCount: 22,
    estimatedHours: "Còn lại 18 giờ",
    ctaLabel: "Tiếp Tục Lộ Trình",
    ctaPath: "/learning-paths",
  },
  {
    id: "path-web-pen",
    title: "Kiểm Thử Xâm Nhập Ứng Dụng Web (Red Team)",
    isCurrent: false,
    description:
      "Phát hiện, khai thác và vá triệt để các lỗ hổng nghiêm trọng trên ứng dụng web phân tán, REST API và kiến trúc microservices.",
    progress: 15,
    currentStage: "Chặng 1: Giao Thức HTTP & Do Thám Thu Thập Mục Tiêu",
    currentStageNumber: 1,
    totalStages: 4,
    completedStages: 0,
    stages: [
      { id: 1, name: "Giao Thức HTTP & Do Thám Thu Thập Mục Tiêu", status: "in-progress" },
      { id: 2, name: "Khai Thác Injection Phía Máy Chủ & Lỗ Hổng Xác Thực", status: "upcoming" },
      { id: 3, name: "Tấn Công Phía Client (XSS, CSRF, DOM Exploitation)", status: "upcoming" },
      { id: 4, name: "Bảo Mật API & Đồ Án Kiểm Thử Xâm Nhập Doanh Nghiệp", status: "upcoming" },
    ],
    modulesCount: 12,
    labsCount: 26,
    estimatedHours: "Còn lại 24 giờ",
    ctaLabel: "Chuyển Sang Lộ Trình",
    ctaPath: "/learning-paths",
  },
  {
    id: "path-soc-ops",
    title: "Vận Hành Trung Tâm SOC",
    isCurrent: false,
    description:
      "Xây dựng năng lực phản ứng nhanh, tương quan cảnh báo an ninh và ngăn chặn mã độc dưới áp lực vận hành thực tế.",
    progress: 0,
    currentStage: "Chặng 1: Nguyên Lý Phân Loại Cảnh Báo An Ninh",
    currentStageNumber: 1,
    totalStages: 4,
    completedStages: 0,
    stages: [
      { id: 1, name: "Nguyên Lý Phân Loại Cảnh Báo An Ninh", status: "upcoming" },
      { id: 2, name: "Phân Tích Dữ Liệu Telemetry Máy Chủ & Mạng", status: "upcoming" },
      { id: 3, name: "Thực Thi Quy Trình Playbook & Cô Lập Mối Đe Dọa", status: "upcoming" },
      { id: 4, name: "Chiến Dịch Săn Lùng Mối Đe Dọa (Threat Hunting)", status: "upcoming" },
    ],
    modulesCount: 10,
    labsCount: 18,
    estimatedHours: "Còn lại 20 giờ",
    ctaLabel: "Ghi Danh Lộ Trình",
    ctaPath: "/learning-paths",
  },
  {
    id: "path-crypto",
    title: "Mật Mã Học Ứng Dụng",
    isCurrent: false,
    description:
      "Nắm vững bản chất mã hóa đối xứng & bất đối xứng, hàm băm mật mã, chứng chỉ số và kiến trúc PKI hiện đại.",
    progress: 0,
    currentStage: "Chặng 1: Mật Mã Cổ Điển & Nền Tảng Toán Học",
    currentStageNumber: 1,
    totalStages: 3,
    completedStages: 0,
    stages: [
      { id: 1, name: "Mật Mã Cổ Điển & Nền Tảng Toán Học", status: "upcoming" },
      { id: 2, name: "Mật Mã Hiện Đại Đối Xứng & Bất Đối Xứng", status: "upcoming" },
      { id: 3, name: "Quản Lý Khóa Bí Mật & Hạ Tầng Khóa Công Khai (PKI)", status: "upcoming" },
    ],
    modulesCount: 8,
    labsCount: 12,
    estimatedHours: "Còn lại 14 giờ",
    ctaLabel: "Ghi Danh Lộ Trình",
    ctaPath: "/learning-paths",
  },
]

// 4. Recommended Learning Content (Courses, Labs, Lessons)
export const mockRecommendedContent = [
  {
    id: "rec-net-sec",
    title: "Nhập Môn An Ninh Mạng Máy Tính",
    description:
      "Làm chủ nguyên lý bắt tay TCP/IP, cấu trúc header gói tin mạng, chia mạng con subnetting và các cơ chế phòng thủ tầng mạng.",
    type: "Khóa Học",
    category: "Mạng Máy Tính",
    difficulty: "Cơ Bản",
    duration: "45 phút",
    progress: 0,
    status: "Chưa Bắt Đầu",
    ctaLabel: "Bắt Đầu Học",
    path: "/learning",
    icon: "Network",
  },
  {
    id: "rec-web-sec",
    title: "Nền Tảng Bảo Mật Ứng Dụng Web",
    description:
      "Đào sâu danh mục OWASP Top 10, chiếm đoạt phiên làm việc Session Hijacking, cấu hình Security Headers và kiến trúc phòng thủ vững chắc.",
    type: "Khóa Học",
    category: "Phòng Thủ Web",
    difficulty: "Trung Cấp",
    duration: "1h 20m",
    progress: 30,
    status: "Đang Học",
    ctaLabel: "Tiếp Tục",
    path: "/learning",
    icon: "Globe",
  },
  {
    id: "rec-sqli-lab",
    title: "Thực Hành Khai Thác SQL Injection Cơ Bản",
    description:
      "Sandbox tương tác thực hành kiểm thử lọc đầu vào, khai thác Error-based, UNION-based và triển khai cơ chế phòng vệ.",
    type: "Phòng Lab",
    category: "Thực Hành Thực Địa",
    difficulty: "Cơ Bản",
    duration: "35 phút",
    progress: 0,
    status: "Chưa Bắt Đầu",
    ctaLabel: "Vào Lab",
    path: "/labs",
    icon: "Database",
  },
  {
    id: "rec-linux-analyst",
    title: "Quản Trị Linux Cho Chuyên Viên An Ninh",
    description:
      "Kỹ năng dòng lệnh thiết yếu để phân tích log hệ thống /var/log, kiểm toán phân quyền người dùng và phát hiện crontab độc hại.",
    type: "Phòng Lab",
    category: "An Ninh Hệ Thống",
    difficulty: "Trung Cấp",
    duration: "55 phút",
    progress: 0,
    status: "Chưa Bắt Đầu",
    ctaLabel: "Vào Lab",
    path: "/labs",
    icon: "Terminal",
  },
]

// 5. Skill Progress Data (Compact, readable skill breakdown)
export const mockSkillOverview = [
  {
    id: "skill-net-sec",
    name: "An Ninh Mạng",
    progress: 68,
    level: "Thành Thạo",
    variant: "primary",
    category: "Hạ Tầng",
  },
  {
    id: "skill-web-sec",
    name: "Bảo Mật Web",
    progress: 45,
    level: "Trung Cấp",
    variant: "indigo",
    category: "An Toàn Ứng Dụng",
  },
  {
    id: "skill-linux",
    name: "Hệ Điều Hành Linux",
    progress: 82,
    level: "Nâng Cao",
    variant: "success",
    category: "Hệ Điều Hành",
  },
  {
    id: "skill-crypto",
    name: "Mật Mã Học",
    progress: 30,
    level: "Cơ Bản",
    variant: "warning",
    category: "Bảo Vệ Dữ Liệu",
  },
]

// 6. Recent Learning Activity (Concise chronological timeline)
export const mockRecentActivity = [
  {
    id: "act-1",
    type: "course",
    title: 'Hoàn thành khóa học "Nền Tảng Mạng Máy Tính"',
    description: "Hoàn tất toàn bộ modules và đạt điểm số 94% trong bài đánh giá tốt nghiệp.",
    timestamp: "2 giờ trước",
    iconName: "CheckCircle2",
    badgeVariant: "success",
    badgeText: "Khóa Học Hoàn Thành",
  },
  {
    id: "act-2",
    type: "lab",
    title: 'Vượt qua bài lab "Quản Trị Linux"',
    description: "Cấu hình thành công phân quyền nghiêm ngặt trên các tệp tin cấu hình nhạy cảm trong Sandbox.",
    timestamp: "Hôm qua",
    iconName: "FlaskConical",
    badgeVariant: "primary",
    badgeText: "Đạt Điểm Lab",
  },
  {
    id: "act-3",
    type: "quiz",
    title: 'Đạt 86% điểm bài kiểm tra "An Ninh Web"',
    description: "Nắm vững kiến thức về cấu hình HTTP headers và các cờ bảo mật cookie phiên làm việc.",
    timestamp: "2 ngày trước",
    iconName: "Award",
    badgeVariant: "warning",
    badgeText: "Vượt Qua Bài Test",
  },
  {
    id: "act-4",
    type: "achievement",
    title: 'Nhận huy hiệu "Chuyên Gia Soi Gói Tin"',
    description: "Trao tặng nhờ thành tích phân tích thành công luồng PCAP thực tế và phát hiện lưu lượng C2 bất thường.",
    timestamp: "3 ngày trước",
    iconName: "Flame",
    badgeVariant: "indigo",
    badgeText: "Huy Hiệu Mới",
  },
  {
    id: "act-5",
    type: "path",
    title: "Đạt cột mốc mới trên lộ trình Chuyên Viên SOC",
    description: "Hoàn thành Chặng 1 và mở khóa thành công Chặng 2: Phát Hiện Mối Đe Dọa & Phân Loại Cảnh Báo SIEM.",
    timestamp: "4 ngày trước",
    iconName: "Compass",
    badgeVariant: "info",
    badgeText: "Cột Mốc Lộ Trình",
  },
]

// 7. Tactical Security Advisory Intelligence for Dashboard
export const mockAIMentorGuidance = {
  contextTopic: "Bảo Mật Web & Phòng Thủ Cơ Sở Dữ Liệu",
  recommendationMessage: "Bạn đang đạt tiến độ vượt bậc ở mảng An toàn Ứng dụng Web. Hãy chuyển sang phòng Lab SQL Injection tiếp theo.",
  contextDetail:
    "Dựa trên kết quả đánh giá 86% ở bài kiểm tra nền tảng, việc thực hành truy vấn tham số hóa (Parameterized Queries) trong Sandbox sẽ gia cố kỹ năng phòng thủ thực tế.",
  suggestedAction: {
    label: "Vào phòng thực hành Lab",
    path: "/labs",
  },
  promptHints: [
    {
      id: "hint-1",
      label: "Gợi ý Kỹ thuật Phòng thủ",
      content:
        "Khi triển khai Prepared Statements trong Node.js (MySQL/PostgreSQL), luôn sử dụng token thay thế (? hoặc $1) thay vì nối trực tiếp dữ liệu người dùng vào câu lệnh SQL.",
    },
    {
      id: "hint-2",
      label: "Quy Tắc Tác Chiến SOC",
      content:
        "Quy tắc Tác chiến SOC: Phân loại Blind SQL Injection (Boolean-based vs Time-based) dựa trên baseline response time và HTTP status telemetry để kích hoạt cảnh báo SIEM.",
    },
  ],
}
