import { useState } from "react"
import {
  Smartphone,
  Bell,
  Terminal,
  Laptop,
  Check,
  Save,
} from "lucide-react"
import { Card, Button } from "../../components/common"

export function Settings() {
  const [mfaEnabled, setMfaEnabled] = useState(true)
  const [sandboxTimeout, setSandboxTimeout] = useState("30")
  const [telemetryVerbosity, setTelemetryVerbosity] = useState("verbose")
  const [cveAlerts, setCveAlerts] = useState(true)
  const [labReminders, setLabReminders] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  return (
    <div className="space-y-8 pb-16 animate-fade-in-up">
      {/* ====================================================================
          1. HEADER BANNER
         ==================================================================== */}
      <section className="relative rounded-2xl bg-gradient-to-br from-white via-blue-50/40 to-slate-50 border border-slate-200/90 shadow-sm p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-[11px] font-bold px-2.5 py-1 rounded bg-blue-600 text-white uppercase tracking-wider shadow-2xs">
                PLATFORM CONFIGURATION
              </span>
              <span className="font-mono-tech text-[11px] font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                HARDENED PROFILE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Security Controls & Sandbox Preferences
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Configure multi-factor authentication, ephemeral terminal sandbox isolation parameters, and telemetry alerts.
            </p>
          </div>

          {saveSuccess && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-fade-in-up">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>Settings Synchronized</span>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          2. SETTINGS SECTIONS
         ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: AUTHENTICATION & SANDBOX CONFIGURATION (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* MULTI-FACTOR AUTHENTICATION */}
          <Card className="p-6 border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Two-Factor Authentication (2FA / WebAuthn)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Hardware security keys (YubiKey) or TOTP authenticator app.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  mfaEnabled ? "bg-blue-600" : "bg-slate-300"
                }`}
                role="switch"
                aria-checked={mfaEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    mfaEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono-tech text-slate-600 flex items-center justify-between">
              <span>PRIMARY METHOD: HARDWARE KEY (FIDO2)</span>
              <span className="text-emerald-700 font-bold">ACTIVE</span>
            </div>
          </Card>

          {/* VIRTUAL LAB SANDBOX ISOLATION PREFERENCES */}
          <Card className="p-6 border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Terminal Range & Sandbox Lifecycle
                </h3>
                <p className="text-xs text-slate-500">
                  Configure ephemeral VM automatic teardown and shell output display.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 font-mono-tech block mb-1">
                  INACTIVE CONTAINER TIMEOUT:
                </label>
                <select
                  value={sandboxTimeout}
                  onChange={(e) => setSandboxTimeout(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                >
                  <option value="15">15 Minutes (Strictest memory reclaim)</option>
                  <option value="30">30 Minutes (Recommended default)</option>
                  <option value="60">60 Minutes (Long duration pentest)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 font-mono-tech block mb-1">
                  TELEMETRY LOG VERBOSITY:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["compact", "verbose", "raw_hex"].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setTelemetryVerbosity(mode)}
                      className={`p-2.5 rounded-xl text-xs font-mono-tech uppercase font-semibold text-center border transition-all cursor-pointer ${
                        telemetryVerbosity === mode
                          ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {mode.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* ACTIVE LOGGED-IN SESSIONS */}
          <Card className="p-6 border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Laptop className="h-4 w-4 text-slate-600" />
              Active Operational Sessions
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span>Windows 11 &bull; Chrome 126</span>
                    <span className="font-mono-tech text-[10px] px-1.5 py-0.2 rounded bg-blue-600 text-white">CURRENT</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono-tech">
                    IP: 192.168.111.69 &bull; Hanoi, Vietnam
                  </div>
                </div>
                <span className="text-emerald-700 font-mono-tech font-bold text-[11px]">ACTIVE NOW</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-800">
                    macOS Ventura &bull; Safari 17
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono-tech">
                    IP: 14.161.42.10 &bull; Da Nang, Vietnam
                  </div>
                </div>
                <button className="text-rose-600 hover:text-rose-700 font-mono-tech font-semibold text-[11px] cursor-pointer">
                  Revoke
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: NOTIFICATIONS & SAVE BUTTON (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* NOTIFICATION PREFERENCES */}
          <Card className="p-6 border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Threat Intelligence & Drill Alerts
              </h3>
            </div>

            <div className="space-y-3 pt-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cveAlerts}
                  onChange={(e) => setCveAlerts(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Critical Zero-Day & CVE Bulletins</span>
                  <span className="text-slate-500">Receive instant alerts when a critical CVSS &ge; 9.0 lab is deployed.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={labReminders}
                  onChange={(e) => setLabReminders(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Lab Expiration & Teardown Warnings</span>
                  <span className="text-slate-500">Ping 5 minutes before an inactive terminal sandbox terminates.</span>
                </div>
              </label>
            </div>
          </Card>

          {/* SAVE CONTROLS */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3">
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              className="w-full justify-center"
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Platform Configuration
            </Button>
            <p className="text-[11px] text-slate-400 text-center font-mono-tech">
              Changes propagate to your isolated sandbox profile immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
