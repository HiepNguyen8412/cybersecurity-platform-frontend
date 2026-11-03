import { useState, useRef } from "react"
import { Play, Pause, RotateCcw, Download, Eye, Sliders, Shield, CheckCircle2, Video } from "lucide-react"
import CyberSecurityVideoBanner from "../../components/effects/CyberSecurityVideoBanner"

export default function CyberVideoPreview() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [viewMode, setViewMode] = useState("player") // 'player' | 'in-context'
  const [threatText, setThreatText] = useState("ZERO-TRUST DEFENDED")
  const [statusText, setStatusText] = useState("ALL SYSTEMS NOMINAL // 0 BREACHES")
  const [opacity, setOpacity] = useState(0.5)
  const [blurAmount, setBlurAmount] = useState(0.5)
  const videoRef = useRef(null)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const restartVideo = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    videoRef.current.play()
    setIsPlaying(true)
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 relative z-20">
      {/* Header Info */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>CYBERSECURITY VIDEO RENDER PREVIEW // 100% LOGO-FREE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white cyberpunk:text-cyan-300 tracking-tight">
          Kiểm tra & Tinh chỉnh Video An Ninh Mạng
        </h1>
        <p className="text-slate-600 dark:text-slate-400 cyberpunk:text-cyan-200/70 max-w-3xl mx-auto text-sm sm:text-base">
          Video được render chuẩn mực điện ảnh (1920x600, 60FPS, 13.47 MB, WebM, 100% không logo). 
          <strong>Người trùm mũ hoàn toàn không lộ mặt</strong> (khuôn mặt chìm hoàn toàn trong hốc bóng tối 100%), nhưng <strong>có đầy đủ cử động & hành động sống động</strong>: vai phập phồng thở, rung lắc cơ học khi gõ phím, đầu nghiêng quan sát đa màn hình, đôi tay thao tác gõ phím trực tiếp kèm sóng xung kích phím bấm, USB exploit phát tia dữ liệu, thanh tiến trình exfiltration nhảy thời gian thực (0% → 100%), và chuyển cảnh vào hành lang máy chủ 3D Datacenter.
        </p>
      </div>

      {/* Mode Switcher & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-3 rounded-xl border border-cyan-500/20">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("player")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              viewMode === "player"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                : "text-slate-300 hover:bg-white/10"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Xem Video Gốc (Player)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("in-context")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-2 ${
              viewMode === "in-context"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                : "text-slate-300 hover:bg-white/10"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Xem thử trên nền Header trang web
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-cyan-400/80 bg-cyan-950/40 px-2.5 py-1 rounded border border-cyan-800/40">
            12.0s // 1920x600 // 60FPS // 13.47 MB
          </span>
          <a
            href="/videos/cyber_security_top.webm"
            download="cyber_security_top.webm"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold tracking-wide transition-all flex items-center gap-2 shadow-md shadow-indigo-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            Tải video về máy
          </a>
        </div>
      </div>

      {/* Main Video Display Stage with Silky-Smooth Transition */}
      <div className="transition-all duration-300 ease-out">
        {viewMode === "player" ? (
          <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/10 bg-[#030816] animate-in fade-in duration-300">
            {/* Video Player */}
            <video
              ref={videoRef}
              src="/videos/cyber_security_top.webm"
              autoPlay
              loop
              muted
              playsInline
              className="w-full aspect-[1920/600] object-cover block"
              style={{ filter: `blur(${blurAmount}px)`, opacity }}
            />

            {/* Player Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-transform active:scale-95 shadow-lg shadow-cyan-500/40 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={restartVideo}
                  className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 border border-white/10 cursor-pointer"
                  title="Phát lại từ đầu"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <div className="text-xs font-mono text-cyan-300">
                  <span>00:12 // SEAMLESS LOOP</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>VP8 / WEBM // READY FOR PRODUCTION</span>
              </div>
            </div>
          </div>
        ) : (
          /* In-Context Header Preview Stage */
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#030816] min-h-[460px] flex flex-col justify-center items-center text-center p-8 animate-in fade-in duration-300">
            <CyberSecurityVideoBanner
              videoSrc="/videos/cyber_security_top.webm"
              threatLevel={threatText}
              systemStatus={statusText}
              opacity={opacity}
              lazyLoadVideo={false}
            />
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-400/30">
              {threatText}
            </span>
            <h2 className="text-3xl font-black text-white tracking-wider">
              NỀN TẢNG ĐÀO TẠO & DIỄN TẬP AN NINH MẠNG
            </h2>
            <p className="text-slate-300 text-sm">
              Mô phỏng chân thực các cuộc tấn công không gian mạng, phòng thủ chủ động và phân tích mã độc trên nền tảng đám mây.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button type="button" className="px-5 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/30 hover:bg-cyan-400">
                Bắt đầu thực hành
              </button>
              <button type="button" className="px-5 py-2.5 rounded-lg bg-slate-800 text-white font-medium text-sm border border-slate-700 hover:bg-slate-700">
                Xem lộ trình
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Interactive Fine-Tuning Controls Panel ("tinh chỉnh nội dung theo trang web") */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/20 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-lg text-white">Bảng Tinh Chỉnh Nội Dung Theo Trang Web</h3>
          <span className="text-xs text-slate-400 ml-auto font-mono">Real-time parameters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Customization */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-1.5">
                TIÊU ĐỀ BẢO MẬT (Threat Status Text):
              </label>
              <input
                type="text"
                value={threatText}
                onChange={(e) => setThreatText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-1.5">
                TRẠNG THÁI HỆ THỐNG (System Telemetry Subtitle):
              </label>
              <input
                type="text"
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-sm focus:border-cyan-400 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Visual Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-cyan-300 mb-1.5">
                <span>ĐỘ SÁNG / OPACITY:</span>
                <span className="text-white font-bold">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-mono text-cyan-300 mb-1.5">
                <span>ĐỘ MỜ / BLUR AMOUNT:</span>
                <span className="text-white font-bold">{blurAmount} px</span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="0.5"
                value={blurAmount}
                onChange={(e) => setBlurAmount(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
