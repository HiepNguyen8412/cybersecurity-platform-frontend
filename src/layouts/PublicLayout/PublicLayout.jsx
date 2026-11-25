import { useState, lazy, Suspense } from "react"
import { Outlet } from "react-router-dom"
import { HelpCircle } from "lucide-react"
import PublicHeader from "./PublicHeader"
import PublicFooter from "./PublicFooter"
import QuickHelpModal from "../../components/common/QuickHelpModal"
import PageLoadingFallback from "../../components/common/PageLoadingFallback"
import CyberBackground from "../../components/common/CyberBackground"

// Lazy-loaded modal to avoid loading sandbox terminal dependencies on landing pages
const LabTerminalModal = lazy(() =>
  import("../../pages/labs/components/LabTerminalModal").then((module) => ({
    default: module.LabTerminalModal,
  }))
)

/**
 * PublicLayout cho các trang giới thiệu, học thuật và tra cứu công khai.
 * Duy trì PublicHeader và PublicFooter cố định cùng ranh giới Suspense cục bộ.
 */
export function PublicLayout({ children }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#0B0E14] text-[#0F172A] dark:text-[#F1F5F9] flex flex-col antialiased selection:bg-[#1D4ED8]/15 selection:text-[#1D4ED8] dark:selection:bg-[#3B82F6]/25 dark:selection:text-[#38BDF8] relative overflow-x-hidden transition-colors duration-200">
      {/* Nền học thuật tối giản (Editorial Light / Deep Obsidian Dark) */}
      <CyberBackground />

      {/* 1. Thanh điều hướng cố định */}
      <PublicHeader />

      {/* 2. Nội dung trang công khai */}
      <main className="flex-1 w-full relative z-10 route-fade-enter">
        <Suspense fallback={<PageLoadingFallback />}>
          {children || <Outlet />}
        </Suspense>
      </main>

      {/* 3. Chân trang lưu trữ học thuật */}
      <PublicFooter />

      {/* Nút mở hộp thoại trợ giúp nhanh */}
      <button
        type="button"
        onClick={() => setIsHelpOpen(true)}
        title="Trợ giúp nhanh & Câu hỏi thường gặp"
        aria-label="Trợ giúp nhanh & Câu hỏi thường gặp"
        className="fixed bottom-5 right-5 z-40 h-11 w-11 rounded-full bg-[#0F172A] dark:bg-[#121722] text-[#FAF9F6] dark:text-[#F1F5F9] flex items-center justify-center shadow-md hover:bg-[#1D4ED8] dark:hover:bg-[#1D4ED8] transition-colors duration-150 active:scale-[0.98] cursor-pointer border border-[#0F172A]/10 dark:border-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] dark:focus-visible:ring-[#3B82F6]"
      >
        <HelpCircle className="h-5 w-5" strokeWidth={1.75} />
      </button>

      {/* Hộp thoại trợ giúp & câu hỏi thường gặp */}
      <QuickHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Cửa sổ Terminal Sandbox tương tác toàn cục */}
      <Suspense fallback={null}>
        <LabTerminalModal />
      </Suspense>
    </div>
  )
}

export default PublicLayout
