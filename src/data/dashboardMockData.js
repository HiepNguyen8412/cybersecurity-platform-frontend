/**
 * Dữ liệu mẫu học thuật cho Bảng điều khiển Học viên CyberPath v2
 * Dùng làm lớp dự phòng sạch sẽ khi máy chủ ngoại tuyến hoặc tài khoản mới chưa có tiến độ.
 */

// 1. Hành động học tập trọng tâm tiếp theo
export const mockNextStep = {
  id: "lab-sqli-evasion",
  type: "Phòng Lab Thực Hành",
  mitreCode: "MITRE ATT&CK · T1190",
  cweCode: "CWE-89",
  courseTitle: "Nền Tảng An Ninh Ứng Dụng Web",
  moduleTitle: "Chuyên Đề 3: Truy Vấn Cơ Sở Dữ Liệu An Toàn",
  lessonTitle: "SQL Injection: Vượt Bộ Lọc & Tham Số Hóa Truy Vấn",
  description:
    "Phân tích cơ chế kẻ tấn công vượt qua bộ lọc từ khóa đơn giản và thực hành triển khai Prepared Statements nhằm tách biệt hoàn toàn cấu trúc câu lệnh SQL và dữ liệu đầu vào.",
  progress: 65,
  currentTopic: "Bài 4/6: Xây dựng truy vấn tham số hóa (Prepared Statements)",
  nextObjectiveLabel: "Mục tiêu kế tiếp: Kiểm chứng truy vấn tham số hóa trên bộ kiểm thử",
  completedObjectives: 3,
  totalObjectives: 6,
  estimatedTime: "Còn khoảng 15 phút",
  difficulty: "Trung cấp",
  primaryAction: {
    label: "Tiếp tục thực hành Lab",
    path: "/labs",
  },
  secondaryAction: {
    label: "Xem ghi chú học phần",
    path: "/learning",
  },
}

// 2. Bốn chỉ số KPI tổng quan
export const mockLearningOverview = [
  {
    id: "stat-progress",
    label: "Tiến độ tổng thể",
    value: 42,
    suffix: "%",
    subtitle: "Trên toàn bộ học phần đã ghi danh",
    icon: "TrendingUp",
    variant: "primary",
    trend: "+4% tuần này",
    hasProgressBar: true,
  },
  {
    id: "stat-courses",
    label: "Học phần hoàn thành",
    value: 4,
    suffix: "",
    subtitle: "4 trên 12 học phần cốt lõi",
    icon: "BookOpen",
    variant: "indigo",
    trend: "1 học phần đang học",
    hasProgressBar: false,
  },
  {
    id: "stat-labs",
    label: "Phòng Lab đã vượt qua",
    value: 12,
    suffix: "",
    subtitle: "12 trên 28 môi trường thực nghiệm",
    icon: "FlaskConical",
    variant: "success",
    trend: "+3 bài tuần này",
    hasProgressBar: false,
  },
  {
    id: "stat-streak",
    label: "Chuỗi ngày nghiên cứu",
    value: 7,
    suffix: " ngày",
    subtitle: "Thực hành đều đặn không gián đoạn",
    icon: "Flame",
    variant: "warning",
    trend: "Kỷ lục cá nhân",
    hasProgressBar: false,
  },
]

// 3. Lộ trình chuyên môn theo khung năng lực NIST
export const mockLearningPaths = [
  {
    id: "path-sec-analyst",
    title: "Chuyên Viên Phân Tích An Ninh SOC",
    isCurrent: true,
    description:
      "Làm chủ kỹ thuật giám sát an ninh mạng, phân tích nhật ký SIEM, tình báo mối đe dọa và đánh giá thế trận phòng thủ theo khung NIST SP 800-61.",
    progress: 48,
    currentStage: "Chặng 2: Phát hiện mối đe dọa & phân loại cảnh báo SIEM",
    currentStageNumber: 2,
    totalStages: 5,
    completedStages: 1,
    stages: [
      { id: 1, name: "Nền tảng an ninh & mạng máy tính", status: "completed" },
      { id: 2, name: "Phát hiện mối đe dọa & cảnh báo SIEM", status: "in-progress" },
      { id: 3, name: "Ứng cứu sự cố & điều tra số (DFIR)", status: "upcoming" },
      { id: 4, name: "Quản lý & khắc phục lỗ hổng (CWE)", status: "upcoming" },
      { id: 5, name: "Đồ án Capstone & thẩm định chuẩn NIST", status: "upcoming" },
    ],
    modulesCount: 14,
    labsCount: 22,
    estimatedHours: "Còn lại 18 giờ",
    ctaLabel: "Tiếp tục lộ trình",
    ctaPath: "/learning-paths",
  },
  {
    id: "path-web-pen",
    title: "Kiểm Thử Xâm Nhập Ứng Dụng Web",
    isCurrent: false,
    description:
      "Phát hiện, phân tích nguyên nhân gốc rễ theo danh mục CWE và vá triệt để các lỗ hổng trên ứng dụng web phân tán và REST API.",
    progress: 15,
    currentStage: "Chặng 1: Giao thức HTTP & trinh sát bề mặt tấn công",
    currentStageNumber: 1,
    totalStages: 4,
    completedStages: 0,
    stages: [
      { id: 1, name: "Giao thức HTTP & trinh sát bề mặt", status: "in-progress" },
      { id: 2, name: "Lỗ hổng Injection & xác thực phía máy chủ", status: "upcoming" },
      { id: 3, name: "Tấn công phía trình khách (XSS, CSRF)", status: "upcoming" },
      { id: 4, name: "Bảo mật API & đồ án kiểm thử doanh nghiệp", status: "upcoming" },
    ],
    modulesCount: 12,
    labsCount: 26,
    estimatedHours: "Còn lại 24 giờ",
    ctaLabel: "Khám phá lộ trình",
    ctaPath: "/learning-paths",
  },
  {
    id: "path-soc-ops",
    title: "Vận Hành Trung Tâm Điều Hành SOC",
    isCurrent: false,
    description:
      "Xây dựng năng lực phản ứng nhanh, tương quan sự kiện an ninh và cô lập mã độc dựa trên dữ liệu telemetry hệ thống.",
    progress: 0,
    currentStage: "Chặng 1: Nguyên lý phân loại cảnh báo an ninh",
    currentStageNumber: 1,
    totalStages: 4,
    completedStages: 0,
    stages: [
      { id: 1, name: "Nguyên lý phân loại cảnh báo an ninh", status: "upcoming" },
      { id: 2, name: "Phân tích dữ liệu telemetry máy chủ & mạng", status: "upcoming" },
      { id: 3, name: "Thực thi quy trình ứng phó & cô lập", status: "upcoming" },
      { id: 4, name: "Chiến dịch săn lùng mối đe dọa chủ động", status: "upcoming" },
    ],
    modulesCount: 10,
    labsCount: 18,
    estimatedHours: "Còn lại 20 giờ",
    ctaLabel: "Xem đề cương lộ trình",
    ctaPath: "/learning-paths",
  },
  {
    id: "path-crypto",
    title: "Mật Mã Học Ứng Dụng & Hạ Tầng PKI",
    isCurrent: false,
    description:
      "Nắm vững bản chất mã hóa đối xứng, bất đối xứng, hàm băm mật mã, chứng chỉ số X.509 và kiểm toán bắt tay TLS 1.3.",
    progress: 0,
    currentStage: "Chặng 1: Nền tảng toán học & mật mã đối xứng",
    currentStageNumber: 1,
    totalStages: 3,
    completedStages: 0,
    stages: [
      { id: 1, name: "Nền tảng toán học & mật mã đối xứng", status: "upcoming" },
      { id: 2, name: "Mật mã bất đối xứng & chữ ký số", status: "upcoming" },
      { id: 3, name: "Quản lý khóa bí mật & hạ tầng PKI", status: "upcoming" },
    ],
    modulesCount: 8,
    labsCount: 12,
    estimatedHours: "Còn lại 14 giờ",
    ctaLabel: "Xem đề cương lộ trình",
    ctaPath: "/learning-paths",
  },
]

// 4. Học phần và phòng thí nghiệm đề xuất
export const mockRecommendedContent = [
  {
    id: "rec-net-sec",
    title: "Nhập Môn An Ninh Mạng Máy Tính",
    description:
      "Làm chủ nguyên lý bắt tay TCP/IP, cấu trúc tiêu đề gói tin mạng, chia mạng con và các cơ chế phòng thủ tầng mạng.",
    type: "Khóa học",
    typeKey: "course",
    category: "Mạng máy tính",
    difficulty: "Cơ bản",
    difficultyKey: "beginner",
    duration: "45 phút",
    progress: 0,
    status: "Chưa bắt đầu",
    ctaLabel: "Bắt đầu học",
    path: "/learning",
  },
  {
    id: "rec-web-sec",
    title: "Nền Tảng Bảo Mật Ứng Dụng Web",
    description:
      "Đào sâu danh mục OWASP Top 10, phòng chống chiếm đoạt phiên làm việc, cấu hình HTTP Security Headers và kiến trúc phòng thủ.",
    type: "Khóa học",
    typeKey: "course",
    category: "Bảo mật Web",
    difficulty: "Trung cấp",
    difficultyKey: "intermediate",
    duration: "1 giờ 20 phút",
    progress: 30,
    status: "Đang học",
    ctaLabel: "Tiếp tục",
    path: "/learning",
  },
  {
    id: "rec-sqli-lab",
    title: "Thực Hành Phòng Chống SQL Injection (CWE-89)",
    description:
      "Môi trường cô lập thực hành kiểm thử lọc đầu vào, phân tích Error-based, UNION-based và triển khai truy vấn tham số hóa.",
    type: "Phòng Lab",
    typeKey: "lab",
    category: "Thực hành thực địa",
    difficulty: "Cơ bản",
    difficultyKey: "beginner",
    duration: "35 phút",
    progress: 0,
    status: "Chưa bắt đầu",
    ctaLabel: "Mở Lab",
    path: "/labs",
  },
  {
    id: "rec-linux-analyst",
    title: "Quản Trị & Kiểm Toán Linux Cho Chuyên Viên SOC",
    description:
      "Kỹ năng dòng lệnh thiết yếu để phân tích nhật ký /var/log, kiểm toán phân quyền người dùng và phát hiện tác vụ định kỳ bất thường.",
    type: "Phòng Lab",
    typeKey: "lab",
    category: "An ninh hệ thống",
    difficulty: "Trung cấp",
    difficultyKey: "intermediate",
    duration: "55 phút",
    progress: 0,
    status: "Chưa bắt đầu",
    ctaLabel: "Mở Lab",
    path: "/labs",
  },
]

// 5. Hồ sơ năng lực theo chuyên đề
export const mockSkillOverview = [
  {
    id: "skill-net-sec",
    name: "An ninh mạng & Phân tích gói tin",
    progress: 68,
    level: "Thành thạo",
    variant: "primary",
    category: "Hạ tầng mạng",
  },
  {
    id: "skill-web-sec",
    name: "Bảo mật ứng dụng Web (OWASP / CWE)",
    progress: 45,
    level: "Trung cấp",
    variant: "indigo",
    category: "An toàn ứng dụng",
  },
  {
    id: "skill-linux",
    name: "Kiểm toán hệ điều hành Linux",
    progress: 82,
    level: "Nâng cao",
    variant: "success",
    category: "Hệ điều hành",
  },
  {
    id: "skill-crypto",
    name: "Mật mã học ứng dụng & PKI",
    progress: 30,
    level: "Cơ bản",
    variant: "warning",
    category: "Bảo vệ dữ liệu",
  },
]

// 6. Nhật ký hoạt động gần đây
export const mockRecentActivity = [
  {
    id: "act-1",
    type: "course",
    title: 'Hoàn thành học phần "Nền tảng Mạng máy tính"',
    description: "Hoàn tất toàn bộ chuyên đề và đạt 94% trong bài kiểm tra tổng hợp.",
    timestamp: "2 giờ trước",
    iconName: "CheckCircle2",
    badgeVariant: "success",
    badgeText: "Hoàn thành học phần",
  },
  {
    id: "act-2",
    type: "lab",
    title: 'Vượt qua bài Lab "Kiểm toán phân quyền Linux"',
    description: "Thiết lập thành công chính sách phân quyền tối thiểu trên các tệp cấu hình trong môi trường cô lập.",
    timestamp: "Hôm qua",
    iconName: "FlaskConical",
    badgeVariant: "primary",
    badgeText: "Hoàn thành phòng Lab",
  },
  {
    id: "act-3",
    type: "quiz",
    title: 'Đạt 86% bài đánh giá "An ninh ứng dụng Web"',
    description: "Nắm vững cấu hình HTTP Security Headers và cờ bảo mật cho cookie phiên.",
    timestamp: "2 ngày trước",
    iconName: "Award",
    badgeVariant: "warning",
    badgeText: "Đạt chuẩn đánh giá",
  },
  {
    id: "act-4",
    type: "achievement",
    title: 'Đạt chứng nhận năng lực "Phân tích gói tin PCAP"',
    description: "Ghi nhận qua bài thực hành truy vết luồng lưu lượng bất thường trên tệp PCAP.",
    timestamp: "3 ngày trước",
    iconName: "ShieldCheck",
    badgeVariant: "indigo",
    badgeText: "Chứng nhận kỹ năng",
  },
  {
    id: "act-5",
    type: "path",
    title: "Đạt cột mốc Chặng 2 lộ trình Chuyên viên SOC",
    description: "Hoàn thành Chặng 1 và mở khóa Chặng 2: Phát hiện mối đe dọa & phân loại cảnh báo SIEM.",
    timestamp: "4 ngày trước",
    iconName: "Compass",
    badgeVariant: "info",
    badgeText: "Cột mốc lộ trình",
  },
]

// 7. Dữ liệu Trợ lý Nghiên cứu AI Học thuật
export const mockAIMentorGuidance = {
  contextTopic: "CWE-89 · Bảo mật Web & Cơ sở dữ liệu",
  recommendationMessage:
    "Bạn đang duy trì tiến độ vững chắc ở học phần An ninh Ứng dụng Web. Bước tiếp theo phù hợp là thực hành tham số hóa truy vấn để vá triệt để lỗ hổng SQL Injection.",
  contextDetail:
    "Dựa trên kết quả 86% ở bài đánh giá nền tảng, việc tự kiểm chứng cách Database Driver biên dịch Prepared Statements sẽ củng cố tư duy phòng thủ ở tầng mã nguồn.",
  suggestedAction: {
    label: "Mở AI Security Workbench",
    path: "/workbench",
  },
  secondaryAction: {
    label: "Vào phòng Lab",
    path: "/labs",
  },
  quickPrompts: [
    {
      id: "qp-cwe89",
      label: "Giải phẫu CWE-89",
      tag: "CWE-89",
      promptText: "Tại sao Prepared Statements ngăn chặn hoàn toàn SQL Injection?",
      response:
        "Prepared Statements tách biệt hoàn toàn quá trình biên dịch cây cú pháp SQL (AST) khỏi bước gán giá trị tham số. Dữ liệu đầu vào luôn được trình điều khiển cơ sở dữ liệu xử lý dưới dạng hằng số thuần túy, không bao giờ làm thay đổi cấu trúc truy vấn.",
    },
    {
      id: "qp-blind-sqli",
      label: "Nhận diện Blind SQLi",
      tag: "MITRE ATT&CK · T1190",
      promptText: "Dấu hiệu phát hiện Time-based Blind SQL Injection trong nhật ký SIEM?",
      response:
        "Theo khung giám sát MITRE ATT&CK T1190, các truy vấn Time-based Blind SQLi gây ra độ trễ phản hồi đồng đều theo bội số cố định (ví dụ 5.000ms) kèm chuỗi hàm ngủ (SLEEP, WAITFOR DELAY, pg_sleep) tại tham số HTTP GET/POST.",
    },
    {
      id: "qp-nist-priv",
      label: "Đặc quyền tối thiểu",
      tag: "NIST SP 800-53",
      promptText: "Áp dụng nguyên tắc Least Privilege (AC-6) cho tài khoản kết nối DB như thế nào?",
      response:
        "Theo chuẩn NIST SP 800-53 (kiểm soát AC-6), tài khoản dịch vụ ứng dụng web chỉ được cấp quyền SELECT/INSERT/UPDATE trên các bảng nghiệp vụ cần thiết, tuyệt đối thu hồi quyền quản trị hệ thống, đọc tệp vật lý hoặc thực thi lệnh hệ điều hành.",
    },
  ],
}

// 8. Dữ liệu Radar theo Ma trận MITRE ATT&CK
export const mockMitreRadarData = [
  { domain: "Trinh sát", tacticId: "TA0043", fullLabel: "Trinh sát mục tiêu (TA0043)", score: 85, fullMark: 100 },
  { domain: "Xâm nhập", tacticId: "TA0001", fullLabel: "Xâm nhập ban đầu (TA0001)", score: 72, fullMark: 100 },
  { domain: "Thực thi", tacticId: "TA0002", fullLabel: "Thực thi mã lệnh (TA0002)", score: 90, fullMark: 100 },
  { domain: "Duy trì quyền", tacticId: "TA0003", fullLabel: "Duy trì hiện diện (TA0003)", score: 65, fullMark: 100 },
  { domain: "Né phòng thủ", tacticId: "TA0005", fullLabel: "Né tránh phòng thủ (TA0005)", score: 78, fullMark: 100 },
  { domain: "Trích xuất", tacticId: "TA0010", fullLabel: "Trích xuất dữ liệu (TA0010)", score: 60, fullMark: 100 },
]

// 9. Dữ liệu Nhịp độ thực hành tuần
export const mockWeeklyActivity = [
  { day: "Thứ 2", hours: 2.5, labs: 1 },
  { day: "Thứ 3", hours: 3.8, labs: 2 },
  { day: "Thứ 4", hours: 1.2, labs: 0 },
  { day: "Thứ 5", hours: 4.5, labs: 3 },
  { day: "Thứ 6", hours: 3.0, labs: 1 },
  { day: "Thứ 7", hours: 5.5, labs: 4 },
  { day: "CN", hours: 4.2, labs: 2 },
]
