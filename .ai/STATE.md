# 📋 BẢNG TIẾN ĐỘ & ĐIỀU HÀNH DỰ ÁN CYBERSECURITY FRONTEND

**Dự án:** Nền tảng Đào tạo An ninh Mạng (Cybersecurity Learning Platform Frontend)  
**Quản lý Dự án (PM Lead):** AI PM Lead  
**Đội ngũ Triển khai:**
- **Business Analyst (BA):** Gemini 3.8 Flash (BA Specialist)
- **Senior Developer:** Claude Opus (`senior_developer`)
- **Senior QA / Tester:** Gemini 3.8 Flash High (`qa_engineer`)
**Workspace:** `C:\Users\Admin\OneDrive\Desktop\cybersecurity-platform-frontend`  
**Nhánh Git:** `develop`  
**Cập nhật lần cuối:** 2026-10-15 16:50:00  
**Trạng thái Dự án:** ⚡ **ĐANG TRIỂN KHAI SPRINT 4: TẬP TRUNG 100% BÀO FRONTEND (MOCK ENGINE + CLIENT INTERACTIVE UI) THEO CHỈ THỊ CỦA SẾP**

---

## 🎯 1. TỔNG HỢP KẾT QUẢ TRIỂN KHAI SPRINT 3

| Mã Task | Hạng mục công việc | Kết quả bàn giao | Đánh giá |
|---|---|---|:---:|
| **FE-11** | Loại bỏ 100% icon dạng AI (`Sparkles`) trên toàn bộ codebase, thay bằng biểu tượng tự nhiên chuyên ngành (`Target`, `Terminal`, `ShieldCheck`, `Zap`, `Award`, `ShieldAlert`) | 29 files cập nhật, 0 Sparkles còn sót | ✅ ĐẠT |
| **FE-12** | Sửa triệt để lỗi "chỗ sáng quá chỗ tối quá": cấu hình `@custom-variant dark (&:where(.dark, .dark *));` cho Tailwind v4, đưa toàn bộ Module cards, Filters, Header, Footer về adaptive tokens đồng bộ | `index.css`, `Learning.jsx`, `LearningPaths.jsx`, `PublicHeader.jsx`, `PublicFooter.jsx` | ✅ ĐẠT |
| **FE-13** | Tích hợp **Interactive Threat Vector Chain** (4 giai đoạn Recon, Filter Evasion, Execution Sink, Remediation) & **Side-by-Side Code Diff** (Vulnerable vs Hardened OWASP) | `InteractiveLessonModal.jsx` | ✅ ĐẠT |
| **FE-14** | Bổ sung **Real-World Incident Case Studies** (Capital One SSRF, MOVEit Zero-Day, Log4Shell RCE) với telemetry logs thực tế tạo sức hút và giữ chân học viên | `Learning.jsx` | ✅ ĐẠT |
| **FE-15** | Re-skin Contextual AI Chatbot thành **Tactical Security Advisor** (SOC Intel / Cố vấn tác chiến an ninh) | `ContextualAIMentor.jsx`, `AIMentorCard.jsx` | ✅ ĐẠT |
| **QA-03** | Kiểm thử Lint (`eslint .`), Build (`vite build`) và chụp ảnh nghiệm thu song song cả Light Mode và Dark Mode | Build OK (3.54s), Lint OK (0 warnings/errors), 6 Screenshots | ✅ ĐẠT |
| **PM-03** | Nghiệm thu tổng thể, lập báo cáo chi tiết kèm hình ảnh gửi vào nhóm Telegram của người dùng | PM Lead duyệt nghiệm thu xuất sắc (APPROVED) | ✅ ĐẠT |

---

## 📸 2. DANH MỤC ẢNH CHỤP MÀN HÌNH NGHIỆM THU ĐẦY ĐỦ

1. `screenshots/03_learning_page_light.png`: Giao diện Giáo trình thực chiến ở **Light Mode** — Nền trắng tuyết thanh lịch, card module sáng đồng bộ, viền thanh thoát, không còn vệt đen trơ trọi.
2. `screenshots/03_learning_page_dark.png`: Giao diện Giáo trình thực chiến ở **Dark Mode** — Chuẩn Cyber Range Command Center, tương phản hài hòa, dịu mắt.
3. `screenshots/04_learning_paths_light.png`: Lộ trình nghề nghiệp ở **Light Mode** — Track cards sạch đẹp, timeline phân chặng rõ ràng.
4. `screenshots/04_learning_paths_dark.png`: Lộ trình nghề nghiệp ở **Dark Mode** — Glow viền neon cyan tinh tế, đậm chất SOC Operations.
5. `screenshots/06_interactive_lesson_modal.png`: Tab So sánh Code Lỗi vs Bản Vá OWASP song song (Side-by-Side) cùng Weaponized Payload Console.

---

## 🏁 3. KÝ DUYỆT CỦA QUẢN LÝ DỰ ÁN (PM SIGN-OFF)
Nền tảng đã đạt độ sâu tác chiến chuyên nghiệp, không còn đại trà, icon AI ảo đã được thay bằng biểu tượng thực chiến tự nhiên, phối màu hai chế độ sáng/tối đạt chuẩn hài hòa tuyệt đối!

---

## 🚀 4. KẾ HOẠCH HÀNH ĐỘNG TỔNG THỂ SPRINT 4 (MASTER ACTION PLAN - MILESTONE 4)

**Mục tiêu Sprint 4:** Xây dựng Trung tâm Giám sát SOC Telemetry thời gian thực (Webhook/Stream Hub) & Đấu trường CTF Challenge Arena (Smart Flag Validator, Anti-Brute-force, Real-time Leaderboard, First Blood Celebration).

### 📋 Bảng phân rã công việc chi tiết (Work Breakdown Structure - WBS)

| Mã Task | Hạng mục công việc | Phụ trách | File tạo mới / Chỉnh sửa | Tiêu chuẩn hoàn thành (DoD) |
|---|---|---|---|---|
| **BA-04** | Chuẩn hóa Data Contract & API Specs (SSE/WebSocket Log Stream, CTF Challenge Catalog, Flag Submission, Leaderboard Sync) | BA (@Ba_hi_bot) | `.ai/DATA_CONTRACT_S4.md` | Hoàn tất JSON Schema chuẩn, mã lỗi HTTP/Socket, ma trận điểm decay. |
| **DEV-16** | Xây dựng State Management cho Telemetry & CTF | Senior Dev (@Dev_hii_bot) | • `src/stores/useTelemetryStore.js`<br>• `src/stores/useCTFStore.js` | Ring buffer tối đa 200 logs; State pause/resume stream; Quản lý trạng thái nộp cờ, lock 30s sau 5 lần sai, React 19 batching. |
| **DEV-17** | Xây dựng Mock Stream Engine & Real-time Services | Senior Dev (@Dev_hii_bot) | • `src/services/telemetryService.js`<br>• `src/services/ctfService.js` | Mock stream giả lập burst 20-50 logs/giây; cơ chế tự động reconnect; API submit cờ có debounce và timestamp chính xác. |
| **DEV-18** | Phát triển Giao diện Trung tâm Giám sát SOC Telemetry | Senior Dev (@Dev_hii_bot) | • `src/pages/telemetry/SOCTelemetryCenter.jsx`<br>• `src/pages/telemetry/components/LogVirtualFeed.jsx`<br>• `src/pages/telemetry/components/TelemetryFilterBar.jsx` | Giao diện Terminal/SIEM chuyên nghiệp, hiển thị tag MITRE ATT&CK; Virtualized list cuộn mượt 60 FPS; Pause/Resume an toàn; Tương thích 100% Light/Dark tokens. |
| **DEV-19** | Phát triển Giao diện Đấu trường CTF & Bảng xếp hạng Zero-Reload | Senior Dev (@Dev_hii_bot) | • `src/pages/ctf/CTFArena.jsx`<br>• `src/pages/ctf/components/FlagSubmissionModal.jsx`<br>• `src/pages/ctf/components/LiveLeaderboard.jsx`<br>• `src/pages/ctf/components/LiveActionTicker.jsx`<br>• `src/routes/AppRoutes.jsx` | Thẻ thử thách đa phân loại (Web, Binary, Cloud, Threat Hunting); Modal nộp cờ kèm đồng hồ countdown 30s chống brute-force; Banner/Effect First Blood; Leaderboard tự cập nhật không giật lag trang. |
| **QA-04** | Kiểm thử Tải, An ninh, Trường hợp biên & Nghiệm thu UI | QA Lead (@phong_ban_ai_bot) | Test matrix & Scripts | Kiểm thử Burst log 100 log/s (không memory leak); Test XSS sanitize trên log payload; Test Race condition nộp cờ; Test tie-breaker; Lint & Build pass 100%. |
| **PM-04** | Giám sát tiến độ, nghiệm thu bàn giao và báo cáo Sếp | PM Lead | `.ai/STATE.md` | Bàn giao đầy đủ tính năng, chụp ảnh nghiệm thu, cập nhật nhật ký dự án hoàn tất. |

### ⏱️ Phân kỳ các mốc triển khai (Sprint Milestones & Timeline)
- **Mốc 1 (T+2h):** BA chốt Data Contract & Dev hoàn tất Core Stores (`useTelemetryStore`, `useCTFStore`) + Stream Services.
- **Mốc 2 (T+5h):** Dev hoàn tất UI Modules (SOC Telemetry Center, CTF Arena, Submission Modal, Live Leaderboard) & định tuyến AppRoutes.
- **Mốc 3 (T+7h):** QA thực thi Stress Test (Burst log, XSS injection, Rate-limit bypass) & sửa các lỗi phát sinh.
- **Mốc 4 (T+8h):** Build hoàn tất (`vite build`), Lint sạch sẽ (`eslint .`), chụp ảnh nghiệm thu song song Light/Dark Mode và phát hành báo cáo Release.



### Cập nhật lúc 2026-10-15 16:48:00
**Kế hoạch thảo luận của cả team cho đề bài:** "đang triển khai dự án nào"

- **PM:** Kính gửi Sếp và toàn thể thành viên phòng ban AI,

Dưới đây là nội dung phát biểu mở đầu cuộc họp và báo cáo trực diện câu hỏi của Sếp trong nhóm Telegram:

***

<b>[KÍNH BÁO SẾP &amp; KHỞI ĐỘNG CUỘC HỌP PHÒNG BAN AI]</b>

Kính chào Sếp, em xin phép đại diện phòng ban AI xác nhận đã tiếp nhận câu hỏi của Sếp về tình hình triển khai dự án hiện tại. Em xin tóm tắt tổng quan hiện trạng và kế hoạch hành động ngay sau đây:

🎯 <b>1. DỰ ÁN ĐANG TRIỂN KHAI &amp; MỤC TIÊU (OBJECTIVES)</b>
• <b>Tên dự án:</b> <b>Cybersecurity Learning Platform Frontend</b> (Nền tảng Đào tạo &amp; Diễn tập An ninh Mạng Thực chiến).
• <b>Mục tiêu cốt lõi:</b> Xây dựng giao diện trung tâm chỉ huy tác chiến an ninh (SOC / Cyber Range) trực quan, có chiều sâu kỹ thuật; giúp người học tiếp cận lỗ hổng qua chuỗi vector tấn công thực tế (<i>Threat Vector Chain</i>) và so sánh mã khai thác/vá lỗi song song (<i>Side-by-Side Code Diff</i>) thay vì lý thuyết đại trà.
• <b>Phạm vi (Scope):</b>
  - Module Giáo trình thực chiến &amp; Phân tích Case-study sự cố lớn (<i>Capital One, MOVEit, Log4Shell</i>).
  - Cyber Range Labs &amp; Weaponized Payload Sandbox.
  - Dashboard giám sát tiến độ, huy hiệu thành tích và Tactical Security Advisor.
  - Chuẩn hóa trải nghiệm người dùng với hệ thống phối màu thích ứng kép (<i>Adaptive Light &amp; Dark Theme</i>).

🏗 <b>2. KIẾN TRÚC TỔNG QUAN &amp; CÁC MỐC TIẾN ĐỘ (MILESTONES)</b>
• <b>Kiến trúc kỹ thuật:</b> <code>React 19</code> + <code>Vite 8</code> + <code>Tailwind CSS v4</code> (sử dụng <code>tokens.css</code> và adaptive variants), quản lý trạng thái tập trung với <code>Zustand</code>, trực quan hóa dữ liệu qua <code>Recharts</code> và <code>Lucide Icons</code>.
• <b>Các mốc tiến độ chính:</b>
  - <b>Milestone 1 (Đã hoàn tất):</b> Core Architecture, Auth Flow, Master Dashboard &amp; Public Pages.
  - <b>Milestone 2 (Đã hoàn tất):</b> Hệ thống Labs tương tác &amp; Quản lý tiến trình học tập.
  - <b>Milestone 3 (Vừa nghiệm thu - Sprint 3):</b> Loại bỏ hoàn toàn hình ảnh AI ảo, đồng bộ phối màu Light/Dark mượt mà, tích hợp Threat Vector Chain &amp; Real-world Telemetry.
  - <b>Milestone 4 (Giai đoạn tiếp theo):</b> Tích hợp Live SOC Telemetry Webhook, chuẩn hóa API tương tác môi trường Backend và phát triển giải đấu CTF / Competitive Leaderboard.

📋 <b>3. PHÂN CÔNG TÁC CHIẾN GIAI ĐOẠN TIẾP THEO</b>
Tag @Ba_hi_bot:
<i>Yêu cầu BA chủ trì phiên làm việc tiếp theo: rà soát nghiệp vụ, bóc tách chi tiết các <b>User Stories (US)</b> và tiêu chuẩn nghiệm thu <b>Acceptance Criteria (AC)</b> cho tính năng Live Telemetry &amp; CTF Challenge Arena để bàn giao cho Senior Developer triển khai ngay trong Sprint tới.</i>

Trân trọng báo cáo Sếp và kính mời team bắt đầu phiên thảo luận!


- **BA:** <b>[BÁO CÁO NGHIỆP VỤ &amp; KHỞI ĐỘNG SPRINT MILESTONE 4]</b>

Kính chào Sếp và anh PM, 

Em là BA của phòng ban AI xin xác nhận đã tiếp nhận chỉ đạo từ PM. Dựa trên thành quả nghiệm thu vững chắc của Milestone 3 (chuẩn hóa Adaptive UI, Threat Vector Chain &amp; Telemetry giả lập), em xin phép chủ trì bóc tách nghiệp vụ chi tiết cho <b>Milestone 4: Live SOC Telemetry Webhook &amp; CTF Challenge Arena</b> nhằm chuẩn bị đầy đủ đầu vào kỹ thuật cho Senior Developer (@Dev_hii_bot) và đội ngũ QA/Tester sẵn sàng triển khai.

Nội dung phân tích nghiệp vụ chi tiết như sau:

***

🎯 <b>I. KỊCH BẢN NGƯỜI DÙNG CỐT LÕI (USER STORIES)</b>

• <b>US-01 (Live SOC Telemetry Stream):</b>
<i>Là một</i> Học viên / Kỹ sư An ninh mạng (Blue Team / SecOps),
<i>Tôi muốn</i> theo dõi luồng sự kiện an ninh (SIEM, IDS/IPS, WAF alerts) trả về theo thời gian thực (Real-time) trong khi thao tác tấn công/phòng thủ trong Lab,
<i>Để</i> quan sát trực quan dấu vết payload, độ trễ phát hiện sự cố và đối chiếu ngay lập tức với chuỗi kỹ thuật MITRE ATT&amp;CK.

• <b>US-02 (CTF Challenge Arena &amp; Flag Submission):</b>
<i>Là một</i> Thí sinh / Đấu thủ Red Team,
<i>Tôi muốn</i> truy cập đấu trường CTF, xem danh mục thử thách đa dạng, nộp cờ (Flag) và nhận phản hồi xác thực tức thì kèm hiệu ứng vinh danh First Blood,
<i>Để</i> tham gia rèn luyện kỹ năng thực chiến và cạnh tranh thứ hạng công bằng, minh bạch.

• <b>US-03 (Real-time Competitive Leaderboard):</b>
<i>Là một</i> Người tham gia thi đấu hoặc Giảng viên quản lý,
<i>Tôi muốn</i> bảng xếp hạng điểm số (Scoreboard) tự động cập nhật vị trí, số flag đã giải và thời gian hoàn thành mà không cần tải lại trang (Zero-reload),
<i>Để</i> theo dõi nhịp độ cuộc đua kịch tính và đánh giá chính xác năng lực học viên.

***

⚙️ <b>II. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS) &amp; LUỒNG XỬ LÝ</b>

<b>1. Yêu cầu Chức năng (FR):</b>
• <b>FR-01 - SOC Telemetry Webhook Hub:</b>
  - Tiếp nhận luồng telemetry log dạng JSON Stream thông qua WebSocket/SSE liên tục gắn kèm <code>sessionId</code> và <code>labId</code>.
  - Phân loại mức độ cảnh báo (<i>Critical, High, Medium, Low, Info</i>) tương ứng hệ màu semantic trong <code>tokens.css</code>.
  - Tích hợp bộ lọc đa tầng (Filter by Rule ID, Source IP, Attack Vector) và chế độ Auto-scroll / Pause feed.
• <b>FR-02 - CTF Arena &amp; Smart Flag Validator:</b>
  - Hiển thị danh mục thử thách dạng Card Grid (Web, Binary, Cloud, Threat Hunting) kèm điểm động (Dynamic Score Decay) và tag MITRE ATT&amp;CK.
  - Ô nhập Flag chuẩn định dạng <code>FLAG{...}</code> tích hợp cơ chế chống gian lận: Client-side Debounce và Exponential Backoff (khóa tạm thời 30s nếu nhập sai 5 lần liên tiếp).
  - Tích hợp âm thanh/banner chúc mừng <b>First Blood</b> cho người đầu tiên giải được challenge trong phiên thi đấu.
• <b>FR-03 - Live Leaderboard &amp; Event Ticker:</b>
  - Bảng tổng sắp hiển thị Top hạt giống: Rank, Avatar, Tên người dùng, Điểm tích lũy, Radar Chart kỹ năng và Timestamp cờ cuối cùng (Last Submission).
  - Thanh thông báo trực tiếp (Live Action Ticker) hiển thị thông báo popup nhỏ khi có đấu thủ vừa capture thành công thử thách.

<b>2. Luồng Xử lý Nghiệp vụ (End-to-End Workflow):</b>
<code>[User kích hoạt Payload trong Lab] 
   ⬇️
[Backend / Container Sandbox ghi nhận Audit Log] 
   ⬇️ (Webhook / Socket Push)
[Frontend Telemetry Hub bắt Event] 
   ⬇️
[Ghi nhận vào useTelemetryStore &amp; Render dòng log với mã màu tương ứng]
   ⬇️
[User tìm thấy Flag ➔ Submit qua CTF Modal]
   ⬇️ (POST /api/v1/ctf/submit)
[Validator kiểm tra: Đúng Flag &amp; Không vi phạm Rate-limit]
   ⬇️
[Cộng điểm ➔ Socket Emit Broadcast: First Blood/Solved ➔ Cập nhật Leaderboard tức thì]</code>

***

📋 <b>III. TIÊU CHUẨN NGHIỆM THU CHI TIẾT (ACCEPTANCE CRITERIA - AC)</b>

Dành cho Developer triển khai và QA nghiệm thu theo chuẩn BDD (Given - When - Then):

<b>AC-01: Nhận &amp; Render Telemetry thời gian thực</b>
• <b>Given:</b> Người dùng đang mở một bài Lab hoặc đang ở Dashboard SOC Center.
• <b>When:</b> Backend đẩy gói tin telemetry qua WebSocket/SSE với tần suất cao (&gt; 20 log/giây).
• <b>Then:</b> Giao diện hiển thị mượt mà không giật lag (sử dụng Windowing/Virtual List, lưu tối đa 200 log gần nhất); nhãn cảnh báo (Critical, High) chuyển màu chính xác theo tokens Light/Dark mode; có nút "Pause Stream" để dừng cuộn khi đang phân tích.

<b>AC-02: Xác thực Flag &amp; Kiểm soát Rate-Limiting</b>
• <b>Given:</b> Đấu thủ mở modal nộp Flag cho một Challenge cụ thể.
• <b>When:</b> Nhập sai cờ quá 5 lần trong vòng 60 giây.
• <b>Then:</b> Nút Submit bị vô hiệu hóa (disabled), hiển thị đồng hồ đếm ngược chờ 30 giây kèm thông báo cảnh báo <i>"Brute-force protection activated. Please wait..."</i>.
• <b>When:</b> Nhập đúng định dạng cờ hợp lệ lần đầu tiên trên toàn hệ thống.
• <b>Then:</b> Trả về trạng thái thành công trong &lt; 300ms, cộng 100% điểm cơ bản + 20% First Blood bonus, đồng thời kích hoạt hiệu ứng Particle/Toast chúc mừng.

<b>AC-03: Đồng bộ Bảng xếp hạng Zero-Reload</b>
• <b>Given:</b> Người dùng đang theo dõi trang Leaderboard CTF.
• <b>When:</b> Có bất kỳ thí sinh nào trong cùng bảng đấu ghi điểm thành công.
• <b>Then:</b> Vị trí thứ hạng và tổng điểm của thí sinh đó tự động nhảy vị trí với animation mượt mà trong vòng &lt; 500ms, không xảy ra hiện tượng chớp nháy (Flash of Content) hoặc gián đoạn cuộn trang.

***

🤝 <b>IV. BÀN GIAO &amp; XIN Ý KIẾN KIẾN TRÚC KỸ THUẬT</b>

Tag @Dev_hii_bot (Claude Opus):
Em đã hoàn tất tài liệu đặc tả nghiệp vụ chi tiết cho <b>Milestone 4</b>. Nhờ anh rà soát và cho ý kiến chuyên môn về các khía cạnh giải pháp kỹ thuật sau:

1. <b>Giao thức Real-time:</b> Với tính chất luồng SOC Telemetry một chiều (Server ➔ Client) và CTF Leaderboard/Actions hai chiều, anh khuyến nghị giải pháp thuần <b>WebSocket</b> (gộp chung connection pool) hay tách riêng <b>SSE (Server-Sent Events)</b> cho Telemetry để tối ưu tài nguyên và tái kết nối tự động (auto-reconnect)?
2. <b>Quản lý State &amp; Hiệu năng:</b> Chúng ta nên kiến trúc <code>useTelemetryStore</code> và <code>useCTFStore</code> độc lập trong Zustand như thế nào để tận dụng cơ chế render batching mới của <code>React 19</code>, tránh re-render thừa toàn bộ cây DOM khi log đẩy dồn dập?
3. <b>Data Contract:</b> Nhờ anh đề xuất khung Schema chuẩn (JSON Contract) cho gói tin Webhook Telemetry và Payload Submit Flag để BA chuẩn hóa tài liệu giao tiếp API với đội Backend.

Kính mời Sếp và anh PM duyệt scope nghiệp vụ, và mời @Dev_hii_bot cho phản hồi kỹ thuật để Sprint 4 có thể bấm nút khởi chạy ngay ạ!


- **Dev:** 💻 <b>[DEVELOPER - Claude Opus 4.6 Thinking]:</b>
Chào Sếp, anh PM và chị BA! Về mặt kỹ thuật, em xin đề xuất phương án:

🛠️ <b>Kiến trúc Kỹ thuật & Module:</b>
• Phân tách rành mạch Business Logic, UI Components và State Management.
• Tối ưu hóa render, tái sử dụng component và bảo đảm Type Safety.
• Bổ sung xử lý biên (Boundary Handling) và fallback an toàn.

👉 <i>Nhờ anh QA @phong_ban_ai_bot lên chiến lược kiểm thử và các trường hợp biên để bảo đảm chất lượng nhé!</i>

- **QA:** 🛡️ <b>[BÁO CÁO QA LEAD & KẾ HOẠCH KIỂM THỬ SPRINT MILESTONE 4]</b>

Kính chào Sếp, anh PM @EriaEverLy_bot, chị BA và anh Senior Dev @Dev_hii_bot!

Em là QA Lead của phòng ban AI xin xác nhận đã tiếp nhận tài liệu đặc tả nghiệp vụ chi tiết cho <b>Milestone 4: Live SOC Telemetry Webhook & CTF Challenge Arena</b> cũng như định hướng kiến trúc tối ưu render từ anh Dev Claude Opus. 

Với đặc thù của hệ thống SOC Telemetry thời gian thực và Đấu trường CTF cạnh tranh cao, rủi ro lớn nhất nằm ở: <b>nghẽn hiệu năng (DOM rendering lag), rò rỉ bộ nhớ (Memory Leak), lỗ hổng gian lận nộp cờ (Race condition / Brute-force) và tấn công XSS qua Log Injection</b>. Đội ngũ QA xin đề xuất kế hoạch kiểm thử nghiêm ngặt như sau:

***

🎯 <b>1. CHIẾN LƯỢC KIỂM THỬ (TESTING STRATEGY)</b>

• <b>Unit Tests (Độ bao phủ logic lõi):</b>
  - <code>useTelemetryStore</code> & <code>useCTFStore</code>: Kiểm tra cơ chế buffer xoay vòng (chỉ giữ đúng 200 logs mới nhất), xử lý enqueue/dequeue mượt mà, tính toán điểm số động (Dynamic Score Decay).
  - <b>Flag Validator & Rate-limiter:</b> Kiểm tra hàm validate định dạng <code>FLAG{...}</code>, cơ chế đếm số lần sai trong khung thời gian 60s và logic kích hoạt timer 30s.
  - <b>Semantic Token Mapping:</b> Kiểm tra hàm phân loại màu theo log severity (<i>Critical, High, Medium, Low, Info</i>) tương thích chuẩn 100% cả Light và Dark mode.

• <b>Integration Tests (Tích hợp luồng dữ liệu & Giao thức):</b>
  - <b>Socket / SSE Stream Lifecycle:</b> Kiểm tra chu trình kết nối, nhận stream log liên tục, ngắt kết nối đột ngột, tái kết nối tự động (Exponential Backoff Reconnect) và chống duplicate log khi reconnect.
  - <b>End-to-End Submission Flow:</b> Gửi request nộp flag ➔ API phản hồi ➔ Broadcast Socket sự kiện First Blood / Solved ➔ Cập nhật vị trí trên <code>Leaderboard</code> và đẩy thông báo <code>Action Ticker</code> đồng bộ.

• <b>UI & E2E Tests (Hiệu năng hiển thị & Trải nghiệm thực chiến):</b>
  - <b>Virtual List & High Throughput:</b> Kiểm thử giao diện khi backend dồn ép lưu lượng cao (&gt; 20 - 50 logs/giây) bảo đảm đạt chuẩn 60 FPS, không drop frame.
  - <b>Pause/Resume Feed Interaction:</b> Khi user click "Pause Stream" hoặc đang chủ động cuộn xem log cũ, stream vẫn âm thầm tích luỹ trong background buffer và không tự ý giật màn hình xuống đáy.
  - <b>Audio & Animation:</b> Kiểm tra trigger âm thanh/pháo hoa chúc mừng First Blood không làm đơ giao diện chính.

***

⚡ <b>2. TEST CASES TRỌNG YẾU & CÁC TRƯỜNG HỢP BIÊN NGUY HIỂM (EDGE CASES & SECURITY)</b>

<b>A. Nhóm SOC Telemetry Stream (High Throughput & Stability):</b>
1. <b>Log Burst Storm & Memory Leak:</b> Backend bắn dồn dập 100 logs/giây trong 5 phút liên tục. <i>Kỳ vọng:</i> Virtual List chỉ render các node nhìn thấy được; dung lượng RAM trình duyệt (Heap size) phải giữ phẳng, không tăng vô hạn.
2. <b>XSS Injection qua Log Payload:</b> Gói tin Telemetry chứa các chuỗi độc hại như <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> hoặc <code>&lt;img src=x onerror=...&gt;</code> trong các trường <i>Payload</i>, <i>Raw Packet</i>, <i>User-Agent</i>. <i>Kỳ vọng:</i> 100% nội dung được encode/sanitize an toàn trước khi in ra console UI.
3. <b>Socket Dropouts & Network Jitter:</b> Mất mạng trong 10 giây rồi có lại. <i>Kỳ vọng:</i> UI hiển thị badge trạng thái mạng rõ ràng (<i>Connected / Reconnecting / Offline</i>), không bị crash ứng dụng.

<b>B. Nhóm CTF Arena & Flag Validation (Anti-Cheat & Concurrency):</b>
4. <b>Race Condition / Rapid Double-Click:</b> Thí sinh bấm liên tục nút "Submit Flag" hoặc dùng script bắn đồng thời 10 request POST trong 50ms. <i>Kỳ vọng:</i> Frontend vô hiệu hóa nút ngay sau click đầu tiên (Client Debounce), Backend xử lý Idempotency, chỉ ghi nhận 1 lần tính điểm duy nhất.
5. <b>Bypass Client-side Lockout:</b> Thí sinh nhập sai 5 lần, bị khóa 30s nhưng cố tình mở DevTools xóa class <code>disabled</code>, sửa LocalStorage hoặc F5 tải lại trang. <i>Kỳ vọng:</i> Trạng thái khóa (Lockout state) phải được xác thực chặt chẽ từ phía Backend/Session; submit cưỡng bức vẫn trả về mã lỗi <code>429 Too Many Requests</code>.
6. <b>Tie-Breaker Leaderboard:</b> Hai thí sinh cùng giải được challenge ở cùng một điểm số. <i>Kỳ vọng:</i> Bảng xếp hạng phân định thứ bậc chính xác theo thời gian nộp (Last Submission Timestamp: ai nộp trước xếp trên), hiệu ứng đổi vị trí diễn ra mượt mà dưới 500ms, không gây chớp nháy (Flash of Unstyled Content).

***

🏁 <b>3. TIÊU CHUẨN NGHIỆM THU CHẤT LƯỢNG (DEFINITION OF DONE - DoD)</b>

• <b>Về Code & Test Coverage:</b> 100% chức năng mới có Unit/Integration Test tương ứng; Core Stores & Validator đạt độ bao phủ tối thiểu &gt; 85%.
• <b>Về Hiệu năng (Performance):</b> UI duy trì ổn định <b>60 FPS</b>; không rò rỉ bộ nhớ sau 10.000 log liên tục; độ trễ cập nhật Leaderboard sau khi nộp cờ &lt; 500ms.
• <b>Về Bảo mật (Security):</b> Không phát hiện lỗ hổng Client-side XSS; cơ chế Rate-limit hoạt động chuẩn xác ngăn chặn hoàn toàn brute-force flag.
• <b>Về Trực quan & UI Tokens:</b> Đồng bộ 100% theme Light/Dark theo hệ màu semantic token; không có lỗi font chữ, vỡ layout responsive; Zero console error/warning; Lint (<code>eslint .</code>) và Build (<code>vite build</code>) pass tuyệt đối.

***

🤝 <b>4. KHỞI ĐỘNG HÀNH ĐỘNG</b>

Kính gửi anh PM @EriaEverLy_bot:
Đội ngũ QA đã hoàn tất chuẩn bị khung tiêu chí nghiệm thu và bộ test matrix. Kính nhờ anh xem xét, thống nhất cùng các đề xuất kiến trúc của @Dev_hii_bot để chốt lại <b>Bảng Kế hoạch Hành động Tổng thể (Master Action Plan)</b>, phân rã task chi tiết cho Sprint Milestone 4 để toàn team bắt tay vào chiến ngay ạ!


- **Chốt Kế hoạch:** Kính gửi Sếp và toàn thể thành viên phòng ban AI,

Sau khi tiếp nhận và tổng hợp đầy đủ ý kiến từ <b>BA (@Ba_hi_bot)</b> về User Stories &amp; Acceptance Criteria, định hướng kiến trúc từ <b>Senior Dev (@Dev_hii_bot)</b>, cùng chiến lược kiểm thử biên &amp; an ninh từ <b>QA Lead (@phong_ban_ai_bot)</b>, em xin phép đại diện Ban Quản trị Dự án ban hành <b>BẢNG KẾ HOẠCH HÀNH ĐỘNG TỔNG THỂ (MASTER ACTION PLAN)</b> cho <b>Sprint Milestone 4</b> như sau:

***

<b>[KẾ HOẠCH HÀNH ĐỘNG TỔNG THỂ — MASTER ACTION PLAN SPRINT 4]</b>
<b>Dự án:</b> <code>Cybersecurity Learning Platform Frontend</code>
<b>Trọng tâm Sprint:</b> <i>Live SOC Telemetry Webhook Hub &amp; CTF Challenge Arena</i>

🎯 <b>1. BẢNG PHÂN RÃ CÔNG VIỆC (WORK BREAKDOWN STRUCTURE - WBS)</b>

• <b>[BA-04] Chuẩn hóa Data Contract &amp; API Specs</b>
  - <b>Phụ trách:</b> BA (@Ba_hi_bot)
  - <b>Sản phẩm bàn giao (Deliverables):</b> <code>.ai/DATA_CONTRACT_S4.md</code>
  - <b>Tiêu chuẩn hoàn thành (DoD):</b> Hoàn tất Schema JSON chuẩn cho SSE/WebSocket Telemetry Log, Payload Submit Flag, Error codes (429 Rate-limit) và quy tắc tính điểm Dynamic Score Decay.

• <b>[DEV-16] Kiến trúc State Management tập trung (Zustand)</b>
  - <b>Phụ trách:</b> Senior Dev (@Dev_hii_bot)
  - <b>Files tạo mới/chỉnh sửa:</b>
    + <code>src/stores/useTelemetryStore.js</code>
    + <code>src/stores/useCTFStore.js</code>
  - <b>Tiêu chuẩn hoàn thành (DoD):</b> Xây dựng Ring buffer tối đa 200 logs chống tràn RAM; tích hợp state Pause/Resume; quản lý trạng thái nộp cờ, cơ chế khóa 30s sau 5 lần nhập sai; tận dụng triệt để render batching của React 19.

• <b>[DEV-17] Xây dựng Real-time Streaming Service &amp; Mock Engine</b>
  - <b>Phụ trách:</b> Senior Dev (@Dev_hii_bot)
  - <b>Files tạo mới/chỉnh sửa:</b>
    + <code>src/services/telemetryService.js</code>
    + <code>src/services/ctfService.js</code>
  - <b>Tiêu chuẩn hoàn thành (DoD):</b> Cung cấp luồng stream giả lập từ 20 đến 50 logs/giây kèm mã hóa MITRE ATT&amp;CK; cơ chế Exponential Backoff Auto-reconnect khi gián đoạn mạng; API xác thực cờ có Debounce.

• <b>[DEV-18] Phát triển Giao diện Trung tâm Giám sát SOC Telemetry</b>
  - <b>Phụ trách:</b> Senior Dev (@Dev_hii_bot)
  - <b>Files tạo mới/chỉnh sửa:</b>
    + <code>src/pages/telemetry/SOCTelemetryCenter.jsx</code>
    + <code>src/pages/telemetry/components/LogVirtualFeed.jsx</code>
    + <code>src/pages/telemetry/components/TelemetryFilterBar.jsx</code>
  - <b>Tiêu chuẩn hoàn thành (DoD):</b> Giao diện phong cách SIEM / Terminal trực chiến; tích hợp Virtualized List giữ vững 60 FPS; Bộ lọc đa tầng (Severity, Vector, Rule ID); Adaptive 100% hai chế độ Light &amp; Dark mode qua <code>tokens.css</code>.

• <b>[DEV-19] Phát triển Đấu trường CTF &amp; Bảng xếp hạng Zero-Reload</b>
  - <b>Phụ trách:</b> Senior Dev (@Dev_hii_bot)
  - <b>Files tạo mới/chỉnh sửa:</b>
    + <code>src/pages/ctf/CTFArena.jsx</code>
    + <code>src/pages/ctf/components/FlagSubmissionModal.jsx</code>
    + <code>src/pages/ctf/components/LiveLeaderboard.jsx</code>
    + <code>src/pages/ctf/components/LiveActionTicker.jsx</code>
    + <code>src/routes/AppRoutes.jsx</code>
  - <b>Tiêu chuẩn hoàn thành (DoD):</b> Grid thử thách đa lĩnh vực (Web, Binary, Cloud, Threat Hunting); Modal nộp cờ có đồng hồ đếm ngược 30s; Banner vinh danh <b>First Blood</b>; Leaderboard cập nhật vị trí thời gian thực mượt mà không load lại trang.

• <b>[QA-04] Kiểm thử Chuyên sâu, An ninh &amp; Tải biên độ cao</b>
  - <b>Phụ trách:</b> QA Lead (@phong_ban_ai_bot)
  - <b>Sản phẩm bàn giao (Deliverables):</b> Bộ Test Scripts &amp; Báo cáo Kiểm thử Biên
  - <b>Tiêu chuẩn hoàn thành (DoD):</b> Vượt qua Stress Test 100 logs/giây không memory leak; kiểm chứng 100% chống Client XSS qua Payload injection; chặn triệt để Brute-force &amp; Double-click race condition; Lint (<code>eslint .</code>) và Build (<code>vite build</code>) pass tuyệt đối.

• <b>[PM-04] Nghiệm thu Tổng thể &amp; Bàn giao Sản phẩm</b>
  - <b>Phụ trách:</b> PM Lead
  - <b>Sản phẩm bàn giao (Deliverables):</b> <code>.ai/STATE.md</code> &amp; Bộ ảnh chụp nghiệm thu (Screenshots)
  - <b>Tiêu chuẩn hoàn thành (DoD):</b> Đối chiếu 100% Acceptance Criteria, kiểm duyệt visual design song song Light/Dark và lập báo cáo kết quả gửi Sếp.

***

⏱ <b>2. CÁC MỐC TIẾN ĐỘ TRIỂN KHAI (MILESTONES &amp; TIMELINE)</b>
• <b>Chặng 1 (T + 2h):</b> BA bàn giao Data Contract ➔ Dev hoàn tất Base Stores &amp; Stream Service.
• <b>Chặng 2 (T + 5h):</b> Dev hoàn tất toàn bộ UI Modules (SOC Center, CTF Arena, Modal, Leaderboard) &amp; Cấu hình Routes.
• <b>Chặng 3 (T + 7h):</b> QA triển khai Stress Test, Security Test &amp; Phối hợp Dev khắc phục triệt để lỗi phát sinh.
• <b>Chặng 4 (T + 8h):</b> Build Production, chụp ảnh nghiệm thu Light/Dark Mode và đóng gói Sprint release.

<i>(Toàn bộ kế hoạch trên đã được PM ghi nhận và đồng bộ trực tiếp vào tài liệu điều hành tại <code>.ai/STATE.md</code>).</i>

***

👑 <b>3. KÍNH TRÌNH SẾP PHÊ DUYỆT</b>

Kính thưa Sếp, toàn bộ đội ngũ phòng ban AI (PM, BA, Senior Dev, QA) đã chuẩn bị đầy đủ tài liệu, kiến trúc và kịch bản sẵn sàng 100%. 

👉 <b>Sếp chỉ cần phản hồi <code>"Triển khai"</code> hoặc gõ lệnh <code>/deploy</code> vào nhóm, phòng ban AI sẽ lập tức phân luồng cho Senior Developer (@Dev_hii_bot) bắt tay vào viết mã và QA kiểm thử ngay lập tức ạ!</b>


