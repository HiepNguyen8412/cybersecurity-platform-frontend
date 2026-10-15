import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Compass,
  Shield,
  Globe,
  Lock,
  Key,
  ChevronRight,
  ArrowRight,
  Target,
  Terminal,
} from "lucide-react"
import { LearningPathTimeline } from "./components/LearningPathTimeline"

const TRACKS_DATA = [
  {
    id: "soc-analyst",
    title: "SOC Security Analyst Track",
    role: "Defensive Security & Blue Team",
    icon: Shield,
    level: "Entry to Intermediate",
    duration: "42 Hours Hands-on",
    labsCount: 24,
    enrolledCount: "1,240 Analysts",
    certifications: ["CompTIA Security+", "CySA+", "BTL1"],
    summary: "Master real-time threat detection, packet analysis, and enterprise incident triage in modern Security Operations Centers.",
    stages: [
      {
        number: "01",
        title: "Network Fundamentals & Traffic Forensics",
        skills: ["TCP/IP", "Wireshark", "Packet Decoding", "ARP Spoofing"],
        status: "completed",
        labs: 6,
      },
      {
        number: "02",
        title: "Endpoint Telemetry & Sysmon Auditing",
        skills: ["Windows Event Logs", "Linux Auth Logs", "Process Trees", "Volatility"],
        status: "in-progress",
        labs: 7,
      },
      {
        number: "03",
        title: "SIEM Operations & Suricata Rule Engineering",
        skills: ["Splunk Query Language", "Suricata IDS", "Snort Signatures", "Alert Tuning"],
        status: "locked",
        labs: 6,
      },
      {
        number: "04",
        title: "Active Adversary Incident Response Capstone",
        skills: ["MITRE ATT&CK Mapping", "Ransomware Triage", "Forensic Reporting"],
        status: "locked",
        labs: 5,
      },
    ],
  },
  {
    id: "web-pentester",
    title: "Web Penetration Tester Track",
    role: "Offensive Security & Red Team",
    icon: Globe,
    level: "Intermediate to Advanced",
    duration: "38 Hours Hands-on",
    labsCount: 22,
    enrolledCount: "980 Pentesters",
    certifications: ["eJPT", "OSCP", "Burp Suite Certified"],
    summary: "Learn to systematically discover, exploit, and remediate high-severity web vulnerabilities across modern distributed architectures.",
    stages: [
      {
        number: "01",
        title: "Web Architecture & Reconnaissance",
        skills: ["HTTP/2 & HTTP/3", "Burp Suite Pro", "Directory Bruteforcing", "Subdomain Takeover"],
        status: "completed",
        labs: 5,
      },
      {
        number: "02",
        title: "OWASP Top 10 Core Exploitation",
        skills: ["SQL Injection", "Stored/DOM XSS", "SSRF", "CSRF", "File Upload Bypass"],
        status: "in-progress",
        labs: 8,
      },
      {
        number: "03",
        title: "Authentication Flaws & Cryptographic Breaks",
        skills: ["JWT Algorithm Confusion", "OAuth 2.0 Hijacking", "SAML Flaws", "IDOR"],
        status: "locked",
        labs: 5,
      },
      {
        number: "04",
        title: "Real Enterprise Application Pentest Exam",
        skills: ["Multi-Stage Exploitation", "Chained Zero-Days", "Executive Remediation Report"],
        status: "locked",
        labs: 4,
      },
    ],
  },
  {
    id: "cloud-security",
    title: "Cloud & DevSecOps Security Engineer",
    role: "Infrastructure & Identity Defense",
    icon: Lock,
    level: "Advanced",
    duration: "35 Hours Hands-on",
    labsCount: 18,
    enrolledCount: "640 Engineers",
    certifications: ["AWS Certified Security", "CCSP", "CKS"],
    summary: "Harden multi-tenant cloud accounts, enforce zero-trust identity architectures, and secure containerized Kubernetes microservices.",
    stages: [
      {
        number: "01",
        title: "Cloud IAM & Least-Privilege Governance",
        skills: ["AWS STS", "IAM Boundary Auditing", "Metadata IMDSv2", "Policy Enforcement"],
        status: "locked",
        labs: 5,
      },
      {
        number: "02",
        title: "Kubernetes & Microservice Hardening",
        skills: ["Pod Security Standards", "NetworkPolicies", "Falco Runtime", "Trivy Scanning"],
        status: "locked",
        labs: 5,
      },
      {
        number: "03",
        title: "Automated DevSecOps Pipeline CI/CD",
        skills: ["SAST/DAST", "Secret Scanning", "OPA Gatekeeper", "Cosign Signature Verification"],
        status: "locked",
        labs: 4,
      },
      {
        number: "04",
        title: "Cloud Breach Simulation & Recovery",
        skills: ["S3 Ransomware Response", "CloudTrail Forensics", "GuardDuty Automation"],
        status: "locked",
        labs: 4,
      },
    ],
  },
  {
    id: "cryptography",
    title: "Applied Cryptography & Protocol Defense",
    role: "Cryptographic Engineering",
    icon: Key,
    level: "Foundation to Advanced",
    duration: "26 Hours Hands-on",
    labsCount: 14,
    enrolledCount: "420 Researchers",
    certifications: ["GIAC Defending Cryptography", "NIST Standards"],
    summary: "Implement and audit modern cryptographic primitives, inspect protocol handshakes, and prevent timing and side-channel leaks.",
    stages: [
      {
        number: "01",
        title: "Symmetric Ciphers & Block Modes",
        skills: ["AES-GCM", "ChaCha20-Poly1305", "Padding Oracles", "IV Replay Flaws"],
        status: "locked",
        labs: 4,
      },
      {
        number: "02",
        title: "Asymmetric Key Exchange & Signatures",
        skills: ["RSA Parameter Hardening", "ECDH & Ed25519", "Certificates & X.509"],
        status: "locked",
        labs: 4,
      },
      {
        number: "03",
        title: "TLS 1.3 Protocol Analysis",
        skills: ["Forward Secrecy", "Zero-RTT Replay Defense", "SNI Encrypted Client Hello"],
        status: "locked",
        labs: 3,
      },
      {
        number: "04",
        title: "Post-Quantum Cryptography Primitives",
        skills: ["Kyber Lattice Key Exchange", "Dilithium Digital Signatures", "Quantum Resistance"],
        status: "locked",
        labs: 3,
      },
    ],
  },
]

export function LearningPaths() {
  const [selectedTrackId, setSelectedTrackId] = useState("soc-analyst")
  const activeTrack = TRACKS_DATA.find((t) => t.id === selectedTrackId) || TRACKS_DATA[0]

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-8 sm:pb-10 space-y-10 animate-fade-in-up">
      {/* ====================================================================
          1. HEADER & CAREER ROADMAP BRIEFING
         ==================================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/90 border border-slate-700/60 dark:border-slate-800 shadow-xl p-6 sm:p-8 overflow-hidden text-white">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
        <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none select-none text-cyan-400">
          <Shield className="w-96 h-96" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              <span>LỘ TRÌNH CHUYÊN GIA AN NINH MẠNG</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Cybersecurity Career Roadmaps & Pipelines
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Các lộ trình chuẩn hóa từ nhập môn đến kỹ sư tác chiến chuyên sâu, tích hợp hoàn hảo với hệ thống Cyber Range Sandbox và chứng chỉ quốc tế.
            </p>
          </div>

          {/* Career Stats Pill */}
          <div className="flex items-center gap-4 font-mono text-xs text-slate-300 p-4 rounded-2xl bg-slate-950/80 border border-slate-700/50 dark:border-slate-800 self-start md:self-auto shadow-xl shrink-0 backdrop-blur-sm">
            <div>
              <span className="text-cyan-400 font-extrabold text-base block">4 TRACKS</span>
              <span className="text-[10px] text-slate-400">PRACTITIONER PIPELINE</span>
            </div>
            <div className="h-7 w-px bg-slate-800" />
            <div>
              <span className="text-emerald-400 font-extrabold text-base block">100%</span>
              <span className="text-[10px] text-slate-400">HANDS-ON COVERAGE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. CAREER TRACK SELECTOR CARDS (Top Horizontal Grid)
         ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TRACKS_DATA.map((track) => {
          const Icon = track.icon
          const isSelected = selectedTrackId === track.id

          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setSelectedTrackId(track.id)}
              className={`text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-blue-50/90 dark:bg-slate-900 border-blue-500 dark:border-cyan-500 shadow-md ring-2 ring-blue-500/20 dark:ring-cyan-500/30 text-slate-900 dark:text-white"
                  : "bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800/90 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      isSelected
                        ? "bg-blue-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-md shadow-blue-500/25 dark:shadow-cyan-500/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <Icon className="h-5 w-5 stroke-[2.2]" />
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                    {track.level.split(" ")[0]}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {track.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                    {track.role}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <span>{track.duration}</span>
                {isSelected && (
                  <span className="text-blue-600 dark:text-cyan-400 font-bold flex items-center gap-0.5">
                    <span>Active</span>
                    <ChevronRight className="h-3 w-3" />
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* ====================================================================
          3. ACTIVE TRACK DEEP-DIVE & PROGRESSION STAGES (Adaptive Light/Dark)
         ==================================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-8 text-slate-900 dark:text-white">
        {/* Active Track Top Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded font-mono text-xs font-bold bg-blue-50 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/30">
                ACTIVE ROADMAP PIPELINE
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {activeTrack.duration} &bull; {activeTrack.labsCount} Sandbox Labs
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeTrack.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {activeTrack.summary}
            </p>
          </div>

          {/* Industry Certifications Mapped */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 shrink-0 font-mono shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              CHỨNG CHỈ QUỐC TẾ MỤC TIÊU
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeTrack.certifications.map((cert) => (
                <span
                  key={cert}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-700 dark:text-cyan-400 shadow-xs"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Visual Timeline */}
        <LearningPathTimeline path={activeTrack} />

        {/* 4 Progressive Milestones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>CÁC CHẶNG THỬ THÁCH & CHUYÊN ĐỀ ({activeTrack.stages.length} CHẶNG)</span>
            </h3>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Kiến thức lũy tiến thực chiến
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTrack.stages.map((stage) => (
              <div
                key={stage.number}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70 hover:border-blue-400 dark:hover:border-cyan-500/40 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black font-mono text-blue-600 dark:text-cyan-400">
                      STAGE {stage.number}
                    </span>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        stage.status === "completed"
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                          : stage.status === "in-progress"
                          ? "bg-blue-50 dark:bg-cyan-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-cyan-800/40"
                          : "bg-slate-100 dark:bg-slate-900 text-slate-500"
                      }`}
                    >
                      {stage.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {stage.title}
                  </h4>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {stage.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span>{stage.labs} Phòng Lab Thực Hành</span>
                  <Link
                    to="/learning"
                    className="text-blue-600 dark:text-cyan-400 font-bold hover:underline inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Vào Học Chặng Này</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Track CTA Bar */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <h4 className="text-base font-bold">
              Sẵn sàng gia nhập lộ trình {activeTrack.title}?
            </h4>
            <p className="text-xs text-blue-100">
              Ghi danh vào pipeline để mở khóa toàn bộ bài giảng thực chiến, code audit và phòng lab tương tác.
            </p>
          </div>

          <Link
            to="/learning"
            className="px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-cyan-300 font-bold text-xs shrink-0 cursor-pointer shadow-md border border-cyan-400/30 transition-all flex items-center gap-1.5"
          >
            <Terminal className="w-4 h-4" />
            <span>Mở Giáo Trình Tác Chiến</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LearningPaths
