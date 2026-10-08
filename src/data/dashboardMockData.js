/**
 * Mock Data for Cybersecurity Learning Platform Dashboard
 * 
 * Provides structured, isolated mock datasets for local development.
 * Designed to be easily replaced by backend API endpoints in future iterations.
 */

// 1. Next Recommended Learning Action (Primary focal section)
export const mockNextStep = {
  id: "lab-sqli-evasion",
  type: "Hands-on Lab",
  courseTitle: "Web Security Fundamentals",
  moduleTitle: "Module 3: Defensive Database Queries",
  lessonTitle: "SQL Injection: Filter Evasion & Parameterization",
  description:
    "Learn how attackers bypass naive keyword filters and practice implementing hardened parameterized prepared statements in real-world application code.",
  progress: 65,
  currentTopic: "Lesson 4 of 6: Parameterized Query Construction",
  estimatedTime: "15 mins remaining",
  difficulty: "Intermediate",
  badgeText: "Hands-on Lab",
  primaryAction: {
    label: "Continue Lab",
    path: "/labs",
  },
  secondaryAction: {
    label: "View Lesson Notes",
    path: "/learning",
  },
}

// 2. Learning Overview Statistics (4 concise metrics)
export const mockLearningOverview = [
  {
    id: "stat-progress",
    label: "Overall Progress",
    value: 42,
    suffix: "%",
    subtitle: "Across enrolled curriculum",
    icon: "TrendingUp",
    variant: "primary",
    trend: "+4% this week",
    hasProgressBar: true,
  },
  {
    id: "stat-courses",
    label: "Courses Completed",
    value: 4,
    suffix: "",
    subtitle: "4 of 12 core courses",
    icon: "BookOpen",
    variant: "indigo",
    trend: "1 currently in progress",
    hasProgressBar: false,
  },
  {
    id: "stat-labs",
    label: "Labs Completed",
    value: 12,
    suffix: "",
    subtitle: "12 of 28 sandboxes cleared",
    icon: "FlaskConical",
    variant: "success",
    trend: "+3 solved this week",
    hasProgressBar: false,
  },
  {
    id: "stat-streak",
    label: "Current Streak",
    value: 7,
    suffix: " days",
    subtitle: "Daily practice streak",
    icon: "Flame",
    variant: "warning",
    trend: "Personal record! 🔥",
    hasProgressBar: false,
  },
]

// 3. Learning Paths Data (Current path & available alternatives)
export const mockLearningPaths = [
  {
    id: "path-sec-analyst",
    title: "Security Analyst",
    isCurrent: true,
    description:
      "Master security monitoring, log analysis, threat intelligence, and defensive posture validation for modern enterprise SOC environments.",
    progress: 48,
    currentStage: "Stage 2: Threat Detection & SIEM Triage",
    currentStageNumber: 2,
    totalStages: 5,
    completedStages: 1,
    stages: [
      { id: 1, name: "Security Fundamentals & Networking", status: "completed" },
      { id: 2, name: "Threat Detection & SIEM Triage", status: "in-progress" },
      { id: 3, name: "Incident Response & Forensics", status: "upcoming" },
      { id: 4, name: "Vulnerability Management", status: "upcoming" },
      { id: 5, name: "Capstones & SOC Certification", status: "upcoming" },
    ],
    modulesCount: 14,
    labsCount: 22,
    estimatedHours: "18h remaining",
    ctaLabel: "Continue Path",
    ctaPath: "/learning-paths",
  },
  {
    id: "path-web-pen",
    title: "Web Penetration Testing",
    isCurrent: false,
    description:
      "Identify, exploit, and remediate high-impact vulnerabilities in web applications, REST APIs, and microservices.",
    progress: 15,
    currentStage: "Stage 1: HTTP Protocols & Reconnaissance",
    currentStageNumber: 1,
    totalStages: 4,
    completedStages: 0,
    stages: [
      { id: 1, name: "HTTP Protocols & Reconnaissance", status: "in-progress" },
      { id: 2, name: "Server-side Injection & Auth Flaws", status: "upcoming" },
      { id: 3, name: "Client-side Exploitation (XSS, CSRF)", status: "upcoming" },
      { id: 4, name: "API Security & Capstone Audit", status: "upcoming" },
    ],
    modulesCount: 12,
    labsCount: 26,
    estimatedHours: "24h remaining",
    ctaLabel: "Switch to Path",
    ctaPath: "/learning-paths",
  },
  {
    id: "path-soc-ops",
    title: "SOC Operations",
    isCurrent: false,
    description:
      "Develop rapid response capabilities for triage, alert correlation, and mitigation under live operational pressures.",
    progress: 0,
    currentStage: "Stage 1: Alert Triage Fundamentals",
    currentStageNumber: 1,
    totalStages: 4,
    completedStages: 0,
    stages: [
      { id: 1, name: "Alert Triage Fundamentals", status: "upcoming" },
      { id: 2, name: "Host & Network Telemetry Analysis", status: "upcoming" },
      { id: 3, name: "Playbook Execution & Containment", status: "upcoming" },
      { id: 4, name: "Threat Hunting Operations", status: "upcoming" },
    ],
    modulesCount: 10,
    labsCount: 18,
    estimatedHours: "20h remaining",
    ctaLabel: "Enroll in Path",
    ctaPath: "/learning-paths",
  },
  {
    id: "path-crypto",
    title: "Cryptography",
    isCurrent: false,
    description:
      "Gain intuitive mastery of symmetric & asymmetric ciphers, hashing, digital certificates, and modern PKI implementations.",
    progress: 0,
    currentStage: "Stage 1: Classical Ciphers & Math Foundations",
    currentStageNumber: 1,
    totalStages: 3,
    completedStages: 0,
    stages: [
      { id: 1, name: "Classical Ciphers & Math Foundations", status: "upcoming" },
      { id: 2, name: "Modern Symmetric & Asymmetric Crypto", status: "upcoming" },
      { id: 3, name: "Key Management & Public Key Infrastructure", status: "upcoming" },
    ],
    modulesCount: 8,
    labsCount: 12,
    estimatedHours: "14h remaining",
    ctaLabel: "Enroll in Path",
    ctaPath: "/learning-paths",
  },
]

// 4. Recommended Learning Content (Courses, Labs, Lessons)
export const mockRecommendedContent = [
  {
    id: "rec-net-sec",
    title: "Introduction to Network Security",
    description:
      "Master the fundamentals of TCP/IP handshakes, packet headers, subnetting, and network layer defense mechanisms.",
    type: "Course",
    category: "Networking",
    difficulty: "Beginner",
    duration: "45 mins",
    progress: 0,
    status: "Not Started",
    ctaLabel: "Start Course",
    path: "/learning",
    icon: "Network",
  },
  {
    id: "rec-web-sec",
    title: "Web Security Fundamentals",
    description:
      "Deep dive into OWASP Top 10 vulnerabilities, session hijacking, security headers, and defensive architectures.",
    type: "Course",
    category: "Web Defense",
    difficulty: "Intermediate",
    duration: "1h 20m",
    progress: 30,
    status: "In Progress",
    ctaLabel: "Continue",
    path: "/learning",
    icon: "Globe",
  },
  {
    id: "rec-sqli-lab",
    title: "SQL Injection Basics",
    description:
      "Hands-on interactive sandbox testing input sanitization, error-based attacks, and union-based payload defenses.",
    type: "Lab",
    category: "Hands-on Practice",
    difficulty: "Beginner",
    duration: "35 mins",
    progress: 0,
    status: "Not Started",
    ctaLabel: "Start Lab",
    path: "/labs",
    icon: "Database",
  },
  {
    id: "rec-linux-analyst",
    title: "Linux for Security Analysts",
    description:
      "Essential command-line skills for log analysis, inspecting /var/log, user privileges, and detecting unauthorized cron jobs.",
    type: "Lab",
    category: "System Security",
    difficulty: "Intermediate",
    duration: "55 mins",
    progress: 0,
    status: "Not Started",
    ctaLabel: "Start Lab",
    path: "/labs",
    icon: "Terminal",
  },
]

// 5. Skill Progress Data (Compact, readable skill breakdown)
export const mockSkillOverview = [
  {
    id: "skill-net-sec",
    name: "Network Security",
    progress: 68,
    level: "Proficient",
    variant: "primary",
    category: "Infrastructure",
  },
  {
    id: "skill-web-sec",
    name: "Web Security",
    progress: 45,
    level: "Intermediate",
    variant: "indigo",
    category: "Application Security",
  },
  {
    id: "skill-linux",
    name: "Linux Basics",
    progress: 82,
    level: "Advanced",
    variant: "success",
    category: "Operating Systems",
  },
  {
    id: "skill-crypto",
    name: "Cryptography",
    progress: 30,
    level: "Novice",
    variant: "warning",
    category: "Data Protection",
  },
]

// 6. Recent Learning Activity (Concise chronological timeline)
export const mockRecentActivity = [
  {
    id: "act-1",
    type: "course",
    title: 'Completed "Network Fundamentals"',
    description: "Successfully finished all modules and scored 94% on the final assessment.",
    timestamp: "2 hours ago",
    iconName: "CheckCircle2",
    badgeVariant: "success",
    badgeText: "Course Completed",
  },
  {
    id: "act-2",
    type: "lab",
    title: 'Finished "Linux Basics" lab',
    description: "Configured restrictive permissions on sensitive configuration files in sandbox.",
    timestamp: "Yesterday",
    iconName: "FlaskConical",
    badgeVariant: "primary",
    badgeText: "Lab Passed",
  },
  {
    id: "act-3",
    type: "quiz",
    title: 'Scored 86% on "Web Security" quiz',
    description: "Demonstrated solid understanding of HTTP headers and cookie security flags.",
    timestamp: "2 days ago",
    iconName: "Award",
    badgeVariant: "warning",
    badgeText: "Quiz Passed",
  },
  {
    id: "act-4",
    type: "achievement",
    title: 'Earned "Packet Inspector" badge',
    description: "Awarded for analyzing live PCAP packet traces and identifying anomalous traffic.",
    timestamp: "3 days ago",
    iconName: "Sparkles",
    badgeVariant: "indigo",
    badgeText: "Achievement",
  },
  {
    id: "act-5",
    type: "path",
    title: "Progressed in Security Analyst path",
    description: "Completed Stage 1 and unlocked Stage 2: Threat Detection & SIEM Triage.",
    timestamp: "4 days ago",
    iconName: "Compass",
    badgeVariant: "info",
    badgeText: "Path Milestone",
  },
]

// 7. Contextual AI Mentor State for Dashboard
export const mockAIMentorGuidance = {
  contextTopic: "Web Security & Database Defense",
  recommendationMessage: "You're making good progress in Web Security. Try the next SQL Injection lab.",
  contextDetail:
    "Based on your 86% score in the Web Security Fundamentals quiz, applying parameterized queries in the live sandbox will reinforce your hands-on defense skills.",
  suggestedAction: {
    label: "Continue to Lab",
    path: "/labs",
  },
  promptHints: [
    {
      id: "hint-1",
      label: "Get a hint",
      content:
        "When constructing prepared statements in Node.js with MySQL/PostgreSQL, always use placeholder tokens (? or $1) instead of concatenating input variables into the SQL string.",
    },
    {
      id: "hint-2",
      label: "Ask AI",
      content:
        "You can ask CyberMentor to clarify any confusing concepts like boolean-based vs time-based blind SQL injection.",
    },
  ],
}
