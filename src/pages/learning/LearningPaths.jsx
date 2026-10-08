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
} from "lucide-react"
import { Badge } from "../../components/common"

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono-tech font-bold">
            <Compass className="h-3.5 w-3.5 text-blue-600" />
            <span>STRUCTURED CAREER ROADMAPS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Cybersecurity Learning Pathways
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
            Curated progressive tracks engineered to guide you from foundational principles to industry-recognized security roles.
          </p>
        </div>

        {/* Career Stats Pill */}
        <div className="flex items-center gap-4 font-mono-tech text-xs text-slate-600 p-3.5 rounded-2xl cyber-card bg-white/95 self-start md:self-auto">
          <div>
            <span className="text-blue-600 font-extrabold text-base block">4 TRACKS</span>
            <span className="text-[10px] text-slate-400">PRACTITIONER CURRICULUM</span>
          </div>
          <div className="h-7 w-px bg-slate-200" />
          <div>
            <span className="text-emerald-600 font-extrabold text-base block">100%</span>
            <span className="text-[10px] text-slate-400">HANDS-ON LAB COVERAGE</span>
          </div>
        </div>
      </div>

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
                  ? "bg-gradient-to-br from-blue-50/90 via-white to-blue-50/40 border-blue-400 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20"
                  : "cyber-card hover:border-slate-300"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                        : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}
                  >
                    <Icon className="h-5 w-5 stroke-[2.2]" />
                  </div>

                  <span className="text-[10px] font-mono-tech font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {track.level.split(" ")[0]}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {track.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono-tech mt-0.5">
                    {track.role}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-mono-tech text-slate-400">
                <span>{track.duration}</span>
                {isSelected && (
                  <span className="text-blue-600 font-bold flex items-center gap-0.5">
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
          3. ACTIVE TRACK DEEP-DIVE & PROGRESSION STAGES
         ==================================================================== */}
      <div className="cyber-card p-6 sm:p-8 rounded-3xl border border-blue-200 bg-white/95 shadow-xl space-y-8">
        {/* Active Track Top Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="cyber" size="sm">
                SELECTED ROADMAP
              </Badge>
              <span className="text-xs font-mono-tech text-slate-500">
                {activeTrack.duration} &bull; {activeTrack.labsCount} Sandbox Labs
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {activeTrack.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {activeTrack.summary}
            </p>
          </div>

          {/* Industry Certifications Mapped */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2 shrink-0 font-mono-tech">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              ALIGNED CERTIFICATIONS
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeTrack.certifications.map((cert) => (
                <span
                  key={cert}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-blue-700 shadow-2xs"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Progressive Milestones */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-mono-tech uppercase tracking-wider">
              CURRICULUM MILESTONES & STAGES
            </h3>
            <span className="text-xs font-mono-tech text-slate-400">
              Structured progressive advancement
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTrack.stages.map((stage) => (
              <div
                key={stage.number}
                className="p-5 rounded-2xl border border-slate-200/90 bg-white/80 hover:border-blue-300 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black font-mono-tech text-blue-600">
                      STAGE {stage.number}
                    </span>

                    <span
                      className={`text-[10px] font-mono-tech font-bold px-2 py-0.5 rounded ${
                        stage.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : stage.status === "in-progress"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {stage.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {stage.title}
                  </h4>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {stage.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono-tech text-slate-500">
                  <span>{stage.labs} Hands-on Sandbox Labs</span>
                  <Link
                    to="/labs"
                    className="text-blue-600 font-bold hover:text-blue-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Practice Stage</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Track CTA Bar */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
          <div className="space-y-1">
            <h4 className="text-base font-bold">
              Ready to pursue the {activeTrack.title}?
            </h4>
            <p className="text-xs text-blue-100">
              Enroll into the guided roadmap to unlock automated checkpoint validation and milestone badges.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="btn-cyber-interactive px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs shrink-0 cursor-pointer shadow-md hover:bg-blue-50"
          >
            Start Track Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LearningPaths
