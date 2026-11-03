---
name: bespoke-ui-ux
description: Chuyên môn hóa thiết kế UX/UI thoát khỏi các khuôn mẫu đại trà của AI (AI-slop/clichés), xây dựng giao diện chuẩn mực, tự nhiên, công thái học và sang trọng theo tiêu chuẩn của các sản phẩm công nghệ hàng đầu thế giới (Linear, Vercel, Stripe, Cloudflare).
---

# 🎨 BESPOKE UI/UX DESIGN SYSTEM — THOÁT KHỎI KHUÔN MẪU AI

Bộ kỹ năng này thiết lập chuẩn mực thiết kế độc bản, có gu thẩm mỹ cao cấp (Human-Crafted & Engineering-Grade), loại bỏ triệt để các vết tích "giao diện do AI tự sinh" (AI Clichés & Over-engineering).

---

## 🚫 1. BẢNG DANH MỤC "VẾT TÍCH AI" (TUYỆT ĐỐI KHÔNG DÙNG)

Các công cụ AI thường mắc kẹt trong một tập hợp khuôn mẫu dễ đoán. Khi thiết kế hoặc refactor giao diện, **phải loại bỏ 100%** các yếu tố sau:

| Vết tích AI (Cần loại bỏ) | Lý do | Thay thế bằng chuẩn Human-Grade |
| :--- | :--- | :--- |
| **Phối màu cầu vồng phát sáng** (Tím + Neon Cyan + Neon Lục) | Trông như game sci-fi rẻ tiền, gây mỏi mắt, thiếu tính chuyên nghiệp | **Kỷ luật đơn sắc (Single Accent)**: Nền Dark Slate sâu thẳm (`#0a0d14`), chỉ dùng 1 màu nhấn công nghệ duy nhất (Cobalt Blue `#2563eb` hoặc Soft Slate-Cyan `#0284c7`). |
| **Hiệu ứng kịch tính giả tạo** (Vòng xoay radar kép, laser quét nóc, đếm % giả) | Làm người dùng sốt ruột, cảm giác "kịch cỡm", giả lập hacker phim 90s | **Tĩnh lặng & Tốc độ**: Biểu tượng tối giản (1.2px stroke), thanh tiến trình 2px thanh lịch, trang sẵn sàng là tan biến ngay tức khắc (<150ms). |
| **Nhồi nhét thuật ngữ sáo rỗng** (`[01/04] ZERO-TRUST`, `APT MATRIX SYNC`) | Tạo cảm giác giả dối, AI cố tỏ ra nguy hiểm | **Ngôn ngữ tự nhiên & súc tích**: "Đang tải dữ liệu...", "Hệ thống đã sẵn sàng", hoặc tên thương hiệu tinh tế. |
| **Lạm dụng Glassmorphism & Neon Glow** (Card nào cũng blur nhòe nhoẹt, viền phát sáng) | Làm mờ nhạt nội dung chính, giảm hiệu năng render GPU | **Phân tầng chiều sâu vật lý (Elevation & Layering)**: Nền phẳng phân cấp (`bg-slate-900/60`), viền hairline siêu mỏng `border-white/[0.06]`, đổ bóng mềm (diffuse shadow). |
| **Icon lấp lánh ma thuật** (`Sparkles`, `Wand`) | Biểu tượng AI đại trà bị người dùng ngày nay dị ứng | **Biểu tượng kỹ thuật chuẩn xác**: `Shield`, `Terminal`, `Activity`, `Cpu`, `Layers`, `ArrowRight` với nét vẽ đồng nhất. |

---

## ✨ 2. CÁC NGUYÊN TẮC THIẾT KẾ ĐỈNH CAO (THE CRAFTSMANSHIP RULES)

### 2.1. Phối màu & Độ tương phản có chiều sâu quang học
1. **Nền Dark Mode quang học (Optical Dark)**: 
   - Không dùng màu đen tuyền tuyệt đối `#000000` (dễ gây gắt và rỗ màn OLED khi scroll), không dùng xám nhựa bạc màu.
   - Dùng mã màu nền cao cấp: `#090c12` (Base Canvas), `#0f131d` (Elevated Card), `#161b28` (Hover/Active surface).
2. **Kỷ luật điểm nhấn (Single Accent Focus)**:
   - Dùng 1 dải màu chính có kiểm soát: `text-blue-400`, `bg-blue-600`, viền `border-blue-500/20`.
   - Màu trạng thái chỉ xuất hiện khi có ý nghĩa: Đỏ (Alert/Critical), Vàng hổ phách (Warning), Xanh ngọc dịu (Operational Success).

### 2.2. Nhịp điệu không gian & Bố cục công thái học (Ergonomics & White Space)
1. **Quy tắc bội số 4px/8px**:
   - Mọi khoảng đệm (padding), khoảng cách (gap) phải nằm trong hệ số: `gap-2 (8px)`, `gap-3 (12px)`, `gap-4 (16px)`, `gap-6 (24px)`, `p-4 sm:p-6 (16px - 24px)`.
2. **Container thẳng hàng & Tránh Layout Shift**:
   - Giữ khung chuẩn: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
   - Mọi card hoặc skeleton khi hiển thị phải có chiều cao và lề khớp chính xác 1:1 với component thật khi đã load xong dữ liệu.

### 2.3. Trạng thái tải tự nhiên (Calm & Zero-Friction Loading)
1. **Skeleton tự nhiên (Organic Skeleton)**:
   - Sử dụng màu xám bạc mờ tự nhiên: `bg-white/[0.04]` (nền skeleton) kết hợp dải pulse êm dịu `bg-white/[0.07]`.
   - Tuyệt đối không dùng gradient cầu vồng chạy qua skeleton.
2. **Top Loading Bar**:
   - Chiều cao: Đúng `2px` (hoặc `1.5px`), nằm cố định sát mép trên cùng màn hình.
   - Màu sắc: Đơn sắc hoặc gradient êm (VD: `from-blue-600 via-sky-400 to-blue-500`), không tỏa bóng glow quá 8px.

### 2.4. Typography & Phân cấp thông tin (Human Typography)
1. **Font chữ & Tracking**:
   - Tiêu đề: Font Sans hiện đại, `font-bold tracking-tight text-white`.
   - Code/Telemetry/Data: Font Mono, `text-xs font-mono text-slate-400 tracking-normal`.
2. **Độ tương phản chữ**:
   - Primary: `text-white` (100% opacity) cho tiêu đề và nội dung trọng tâm.
   - Secondary: `text-slate-400` cho mô tả, nhãn phụ.
   - Tertiary / Muted: `text-slate-500` cho timestamp, metadata.

---

## 🛠️ 3. QUY TRÌNH THỰC THI (WORKFLOW CHECKLIST)

Khi nhận yêu cầu thiết kế / chỉnh sửa bất kỳ giao diện nào:
1. **Soi chiếu bảng cấm**: Kiểm tra xem component có dính laser 3 màu, radar xoay, text sến, glow lòe loẹt hay không -> Lập tức dọn sạch.
2. **Cân chỉnh màu sắc**: Đưa về bảng màu Slate/Zinc sâu thẳm + 1 điểm nhấn Electric Blue/Sky Blue.
3. **Đo đạc Padding & Bố cục**: Đảm bảo lề và khoảng cách chuẩn theo 8pt grid, tạo khoảng thở thoáng đãng.
4. **Kiểm tra trạng thái Skeleton & Loading**: Đảm bảo chuyển động mượt, tĩnh lặng, tự nhiên như Linear và Stripe.

