import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  Globe,
  Map,
  Shield,
  Zap,
  Activity,
  CheckCircle2,
  Server,
  Radio,
  ChevronRight,
} from "lucide-react"
import { REALISTIC_CONTINENTS } from "./worldMapGeoData"

/**
 * 24 TIER-4 GLOBAL SECURITY POPS & SCRUBBING HUBS
 * High-precision latitude & longitude with real-world enterprise infrastructure metadata
 */
const NETWORK_POPS = [
  // Châu Á - Thái Bình Dương (APAC)
  {
    id: "vnm_han",
    name: "Hà Nội",
    country: "Việt Nam",
    flag: "🇻🇳",
    zone: "apac",
    lat: 21.03,
    lon: 105.85,
    capacity: "1.8 Tbps",
    latency: "3ms",
    type: "Tier-4 Edge PoP",
    services: ["Anti-DDoS Anycast", "WAF L7", "VNIX Peering", "DNS Anycast"],
    status: "Hoạt động 100%",
  },
  {
    id: "vnm_sgn",
    name: "Hồ Chí Minh",
    country: "Việt Nam",
    flag: "🇻🇳",
    zone: "apac",
    lat: 10.82,
    lon: 106.63,
    capacity: "2.4 Tbps",
    latency: "4ms",
    type: "Tier-4 Core PoP",
    services: ["Anti-DDoS Anycast", "WAF L7", "Edge CDN", "Zero Trust Gateway"],
    status: "Hoạt động 100%",
  },
  {
    id: "sgp_sin",
    name: "Singapore",
    country: "Singapore",
    flag: "🇸🇬",
    zone: "apac",
    lat: 1.35,
    lon: 103.82,
    capacity: "18.5 Tbps",
    latency: "16ms",
    type: "Regional Super Hub",
    services: ["Massive Scrubbing", "BGP Anycast", "Bot Shield", "WAF L7"],
    status: "Hoạt động 100%",
  },
  {
    id: "jpn_tyo",
    name: "Tokyo",
    country: "Nhật Bản",
    flag: "🇯🇵",
    zone: "apac",
    lat: 35.68,
    lon: 139.69,
    capacity: "24.0 Tbps",
    latency: "28ms",
    type: "Trans-Pacific Gateway",
    services: ["DDoS Scrubbing", "WAF L7", "Edge Compute", "AI Threat Engine"],
    status: "Hoạt động 100%",
  },
  {
    id: "kor_sel",
    name: "Seoul",
    country: "Hàn Quốc",
    flag: "🇰🇷",
    zone: "apac",
    lat: 37.57,
    lon: 126.98,
    capacity: "14.0 Tbps",
    latency: "32ms",
    type: "Core PoP",
    services: ["Anti-DDoS", "WAF L7", "API Protection", "DNS Anycast"],
    status: "Hoạt động 100%",
  },
  {
    id: "chn_shg",
    name: "Thượng Hải",
    country: "Trung Quốc",
    flag: "🇨🇳",
    zone: "apac",
    lat: 31.23,
    lon: 121.47,
    capacity: "16.5 Tbps",
    latency: "35ms",
    type: "Regional Exchange",
    services: ["WAF L7", "Anti-DDoS", "Edge CDN", "Zero Trust"],
    status: "Hoạt động 100%",
  },
  {
    id: "ind_mum",
    name: "Mumbai",
    country: "Ấn Độ",
    flag: "🇮🇳",
    zone: "apac",
    lat: 19.08,
    lon: 72.88,
    capacity: "10.5 Tbps",
    latency: "42ms",
    type: "South Asia Core",
    services: ["Scrubbing Center", "WAF L7", "DNSSEC", "Anti-DDoS"],
    status: "Hoạt động 100%",
  },
  {
    id: "aus_syd",
    name: "Sydney",
    country: "Úc",
    flag: "🇦🇺",
    zone: "apac",
    lat: -33.87,
    lon: 151.21,
    capacity: "12.0 Tbps",
    latency: "52ms",
    type: "Oceania Super Hub",
    services: ["Anti-DDoS", "WAF L7", "Zero Trust Gateway", "Edge Compute"],
    status: "Hoạt động 100%",
  },

  // Bắc Mỹ (NAM)
  {
    id: "usa_sjc",
    name: "Silicon Valley",
    country: "Hoa Kỳ",
    flag: "🇺🇸",
    zone: "nam",
    lat: 37.37,
    lon: -121.96,
    capacity: "32.0 Tbps",
    latency: "12ms",
    type: "Global Tech Super Hub",
    services: ["Full Suite", "AI Threat Engine", "Anycast Backbone", "Massive Scrubbing"],
    status: "Hoạt động 100%",
  },
  {
    id: "usa_was",
    name: "Washington D.C.",
    country: "Hoa Kỳ",
    flag: "🇺🇸",
    zone: "nam",
    lat: 38.9,
    lon: -77.03,
    capacity: "28.5 Tbps",
    latency: "14ms",
    type: "Federal Security Center",
    services: ["GovCloud Scrubbing", "Zero Trust", "Threat Intelligence", "WAF"],
    status: "Hoạt động 100%",
  },
  {
    id: "usa_nyc",
    name: "New York",
    country: "Hoa Kỳ",
    flag: "🇺🇸",
    zone: "nam",
    lat: 40.71,
    lon: -74.01,
    capacity: "25.0 Tbps",
    latency: "10ms",
    type: "Trans-Atlantic Gateway",
    services: ["FinTech Shield", "WAF L7", "Anti-DDoS Anycast", "Edge CDN"],
    status: "Hoạt động 100%",
  },
  {
    id: "can_tor",
    name: "Toronto",
    country: "Canada",
    flag: "🇨🇦",
    zone: "nam",
    lat: 43.65,
    lon: -79.38,
    capacity: "9.5 Tbps",
    latency: "18ms",
    type: "Core PoP",
    services: ["Anti-DDoS", "WAF L7", "DNS Anycast"],
    status: "Hoạt động 100%",
  },

  // Châu Âu (EUR)
  {
    id: "deu_fra",
    name: "Frankfurt",
    country: "Đức",
    flag: "🇩🇪",
    zone: "eur",
    lat: 50.11,
    lon: 8.68,
    capacity: "26.0 Tbps",
    latency: "15ms",
    type: "DE-CIX Europe Super Hub",
    services: ["Scrubbing Center", "WAF L7", "BGP Anycast", "API Shield"],
    status: "Hoạt động 100%",
  },
  {
    id: "gbr_lon",
    name: "London",
    country: "Vương quốc Anh",
    flag: "🇬🇧",
    zone: "eur",
    lat: 51.51,
    lon: -0.13,
    capacity: "22.5 Tbps",
    latency: "13ms",
    type: "LINX Gateway Super Hub",
    services: ["Anti-DDoS", "WAF L7", "Zero Trust Gateway", "Bot Management"],
    status: "Hoạt động 100%",
  },
  {
    id: "fra_par",
    name: "Paris",
    country: "Pháp",
    flag: "🇫🇷",
    zone: "eur",
    lat: 48.86,
    lon: 2.35,
    capacity: "16.0 Tbps",
    latency: "17ms",
    type: "Core PoP",
    services: ["Anti-DDoS", "WAF L7", "Edge CDN"],
    status: "Hoạt động 100%",
  },
  {
    id: "nld_ams",
    name: "Amsterdam",
    country: "Hà Lan",
    flag: "🇳🇱",
    zone: "eur",
    lat: 52.37,
    lon: 4.89,
    capacity: "20.0 Tbps",
    latency: "11ms",
    type: "AMS-IX Backbone",
    services: ["Massive Scrubbing", "WAF L7", "API Protection"],
    status: "Hoạt động 100%",
  },
  {
    id: "che_zrh",
    name: "Zurich",
    country: "Thụy Sĩ",
    flag: "🇨🇭",
    zone: "eur",
    lat: 47.37,
    lon: 8.54,
    capacity: "8.5 Tbps",
    latency: "16ms",
    type: "Banking Vault PoP",
    services: ["Encrypted Ingress", "Zero Trust", "WAF L7"],
    status: "Hoạt động 100%",
  },
  {
    id: "rus_mow",
    name: "Moscow",
    country: "Nga",
    flag: "🇷🇺",
    zone: "eur",
    lat: 55.75,
    lon: 37.62,
    capacity: "28.0 Tbps",
    latency: "19ms",
    type: "MSK-IX Eurasia Core Super Hub",
    services: ["Massive Anti-DDoS Anycast", "Threat Intelligence Engine", "Deep Packet Inspection"],
    status: "Hoạt động 100%",
  },
  {
    id: "rus_led",
    name: "Saint Petersburg",
    country: "Nga",
    flag: "🇷🇺",
    zone: "eur",
    lat: 59.93,
    lon: 30.33,
    capacity: "14.5 Tbps",
    latency: "21ms",
    type: "Baltic Regional PoP",
    services: ["Scrubbing Center", "WAF L7", "Edge CDN", "Anycast DNS"],
    status: "Hoạt động 100%",
  },

  // Trung Đông & Châu Phi (MEA)
  {
    id: "uae_dxb",
    name: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    zone: "mea",
    lat: 25.2,
    lon: 55.27,
    capacity: "10.0 Tbps",
    latency: "24ms",
    type: "Middle East Hub",
    services: ["Scrubbing Center", "WAF L7", "DNSSEC", "Anti-DDoS"],
    status: "Hoạt động 100%",
  },
  {
    id: "isr_tlv",
    name: "Tel Aviv",
    country: "Israel",
    flag: "🇮🇱",
    zone: "mea",
    lat: 32.08,
    lon: 34.78,
    capacity: "9.0 Tbps",
    latency: "22ms",
    type: "Defense Center",
    services: ["Threat Intelligence", "Anti-DDoS", "WAF L7"],
    status: "Hoạt động 100%",
  },
  {
    id: "sau_ruh",
    name: "Riyadh",
    country: "Saudi Arabia",
    flag: "🇸🇦",
    zone: "mea",
    lat: 24.71,
    lon: 46.67,
    capacity: "7.5 Tbps",
    latency: "28ms",
    type: "Core PoP",
    services: ["Anti-DDoS", "WAF L7", "Edge CDN"],
    status: "Hoạt động 100%",
  },
  {
    id: "zaf_jnb",
    name: "Johannesburg",
    country: "Nam Phi",
    flag: "🇿🇦",
    zone: "mea",
    lat: -26.2,
    lon: 28.04,
    capacity: "6.5 Tbps",
    latency: "58ms",
    type: "Africa Core Hub",
    services: ["Anti-DDoS", "WAF L7", "DNS Anycast"],
    status: "Hoạt động 100%",
  },

  // Mỹ Latinh (LATAM)
  {
    id: "bra_sao",
    name: "São Paulo",
    country: "Brazil",
    flag: "🇧🇷",
    zone: "latam",
    lat: -23.55,
    lon: -46.63,
    capacity: "12.0 Tbps",
    latency: "36ms",
    type: "LATAM Super Hub",
    services: ["Scrubbing Center", "WAF L7", "BGP Anycast"],
    status: "Hoạt động 100%",
  },
  {
    id: "arg_bue",
    name: "Buenos Aires",
    country: "Argentina",
    flag: "🇦🇷",
    zone: "latam",
    lat: -34.6,
    lon: -58.38,
    capacity: "7.0 Tbps",
    latency: "42ms",
    type: "Core PoP",
    services: ["Anti-DDoS", "WAF L7"],
    status: "Hoạt động 100%",
  },
  {
    id: "mex_mex",
    name: "Mexico City",
    country: "Mexico",
    flag: "🇲🇽",
    zone: "latam",
    lat: 19.43,
    lon: -99.13,
    capacity: "8.5 Tbps",
    latency: "20ms",
    type: "Core PoP",
    services: ["Anti-DDoS", "WAF L7", "Edge CDN"],
    status: "Hoạt động 100%",
  },
]

/**
 * 12 REAL-WORLD INTERCONTINENTAL SUBSEA FIBER CABLE LINES
 */
const SUBSEA_CABLES = [
  { fromId: "jpn_tyo", toId: "usa_sjc", name: "Tuyến cáp Unity (Trans-Pacific)", speed: "60 Tbps" },
  { fromId: "gbr_lon", toId: "usa_nyc", name: "Tuyến cáp AC-1 (Trans-Atlantic)", speed: "72 Tbps" },
  { fromId: "deu_fra", toId: "gbr_lon", name: "Trục liên kết Euro-Ring", speed: "48 Tbps" },
  { fromId: "deu_fra", toId: "nld_ams", name: "Trục C-IX Amsterdam", speed: "54 Tbps" },
  { fromId: "sgp_sin", toId: "vnm_han", name: "Tuyến cáp quang biển APG", speed: "32 Tbps" },
  { fromId: "vnm_han", toId: "vnm_sgn", name: "Trục cáp quang Bắc - Nam", speed: "16 Tbps" },
  { fromId: "sgp_sin", toId: "jpn_tyo", name: "Tuyến cáp quang biển ASE", speed: "40 Tbps" },
  { fromId: "sgp_sin", toId: "ind_mum", name: "Tuyến cáp ngầm SMW-5", speed: "38 Tbps" },
  { fromId: "ind_mum", toId: "uae_dxb", name: "Tuyến cáp Vùng Vịnh Falcon", speed: "24 Tbps" },
  { fromId: "uae_dxb", toId: "deu_fra", name: "Trục cáp Á - Âu AAE-1", speed: "36 Tbps" },
  { fromId: "deu_fra", toId: "rus_mow", name: "Trục cáp Transit Europe-Asia (TEA)", speed: "40 Tbps" },
  { fromId: "rus_mow", toId: "jpn_tyo", name: "Tuyến cáp quang xuyên Siberia (TSR)", speed: "32 Tbps" },
  { fromId: "aus_syd", toId: "usa_sjc", name: "Tuyến cáp Southern Cross", speed: "28 Tbps" },
  { fromId: "bra_sao", toId: "usa_nyc", name: "Tuyến cáp ngầm Monet Fiber", speed: "64 Tbps" },
]

/**
 * 36 REAL-WORLD CYBER THREAT & BOTNET HOTSPOT ORIGINS
 * (Realistic attack origin nodes mapped from global threat intelligence telemetry)
 */
const THREAT_ORIGINS = [
  // Châu Á - Thái Bình Dương (APAC)
  { id: "thr_szx", name: "Shenzhen", country: "Trung Quốc", lat: 22.54, lon: 114.05, type: "Botnet Cluster" },
  { id: "thr_can", name: "Guangzhou", country: "Trung Quốc", lat: 23.13, lon: 113.26, type: "IoT Zombie Fleet" },
  { id: "thr_pek", name: "Beijing", country: "Trung Quốc", lat: 39.9, lon: 116.4, type: "APT Recon Node" },
  { id: "thr_ctu", name: "Chengdu", country: "Trung Quốc", lat: 30.65, lon: 104.06, type: "Exploit Farm" },
  { id: "thr_hgh", name: "Hangzhou", country: "Trung Quốc", lat: 30.27, lon: 120.15, type: "Cloud Scanner" },
  { id: "thr_wuh", name: "Wuhan", country: "Trung Quốc", lat: 30.59, lon: 114.3, type: "Credential Stuffing" },
  { id: "thr_jkt", name: "Jakarta", country: "Đông Nam Á", lat: -6.2, lon: 106.85, type: "Infected IoT" },
  { id: "thr_bkk", name: "Bangkok", country: "Đông Nam Á", lat: 13.75, lon: 100.52, type: "Zombie Farm" },
  { id: "thr_mnl", name: "Manila", country: "Đông Nam Á", lat: 14.6, lon: 120.98, type: "Spam Relay" },
  { id: "thr_del", name: "New Delhi", country: "Ấn Độ", lat: 28.61, lon: 77.2, type: "Reflected UDP" },
  { id: "thr_tpe", name: "Taipei", country: "Đài Loan", lat: 25.03, lon: 121.56, type: "Proxy Reflector" },

  // Nga & Đông Âu (Eurasia)
  { id: "thr_ovb", name: "Novosibirsk", country: "Nga", lat: 55.03, lon: 82.92, type: "Darknet Relay" },
  { id: "thr_vvo", name: "Vladivostok", country: "Nga", lat: 43.12, lon: 131.89, type: "Bulletproof Host" },
  { id: "thr_kuf", name: "Samara", country: "Nga", lat: 53.2, lon: 50.15, type: "Ransomware C2" },
  { id: "thr_kaz", name: "Kazan", country: "Nga", lat: 55.79, lon: 49.12, type: "Exploit Server" },
  { id: "thr_yek", name: "Yekaterinburg", country: "Nga", lat: 56.84, lon: 60.61, type: "Bot Ingress" },
  { id: "thr_iev", name: "Kyiv", country: "Đông Âu", lat: 50.45, lon: 30.52, type: "Botnet Node" },
  { id: "thr_otp", name: "Bucharest", country: "Đông Âu", lat: 44.43, lon: 26.1, type: "Credential Siphon" },
  { id: "thr_waw", name: "Warsaw", country: "Đông Âu", lat: 52.23, lon: 21.01, type: "Proxy Mesh" },

  // Tây & Nam Âu (Europe)
  { id: "thr_ber", name: "Berlin", country: "Đức", lat: 52.52, lon: 13.4, type: "Compromised Node" },
  { id: "thr_mil", name: "Milan", country: "Ý", lat: 45.46, lon: 9.19, type: "IoT Botnet" },
  { id: "thr_mad", name: "Madrid", country: "Tây Ban Nha", lat: 40.41, lon: -3.7, type: "Proxy Gateway" },

  // Bắc Mỹ (NAM)
  { id: "thr_dfw", name: "Dallas", country: "Hoa Kỳ", lat: 32.77, lon: -96.79, type: "Compromised VPS" },
  { id: "thr_chi", name: "Chicago", country: "Hoa Kỳ", lat: 41.88, lon: -87.63, type: "Reflected Cloud" },
  { id: "thr_lax", name: "Los Angeles", country: "Hoa Kỳ", lat: 34.05, lon: -118.24, type: "Malware CDN" },
  { id: "thr_mia", name: "Miami", country: "Hoa Kỳ", lat: 25.76, lon: -80.19, type: "Botnet Ingress" },
  { id: "thr_sea", name: "Seattle", country: "Hoa Kỳ", lat: 47.6, lon: -122.33, type: "Zombie Fleet" },
  { id: "thr_atl", name: "Atlanta", country: "Hoa Kỳ", lat: 33.75, lon: -84.39, type: "DDoS Ingress" },

  // Mỹ Latinh (LATAM)
  { id: "thr_rio", name: "Rio de Janeiro", country: "Brazil", lat: -22.9, lon: -43.17, type: "Trojan C2" },
  { id: "thr_bog", name: "Bogota", country: "Colombia", lat: 4.71, lon: -74.07, type: "Ransomware Drone" },
  { id: "thr_scl", name: "Santiago", country: "Chile", lat: -33.45, lon: -70.66, type: "Reflector Node" },
  { id: "thr_lim", name: "Lima", country: "Peru", lat: -12.04, lon: -77.04, type: "IoT Zombie" },

  // Trung Đông & Châu Phi (MEA)
  { id: "thr_thr", name: "Tehran", country: "Trung Đông", lat: 35.69, lon: 51.39, type: "APT Ingress" },
  { id: "thr_cai", name: "Cairo", country: "Bắc Phi", lat: 30.04, lon: 31.24, type: "Zombie Swarm" },
  { id: "thr_los", name: "Lagos", country: "Châu Phi", lat: 6.52, lon: 3.38, type: "Phishing C2" },
  { id: "thr_ist", name: "Istanbul", country: "Thổ Nhĩ Kỳ", lat: 41.01, lon: 28.97, type: "Proxy Node" },
  { id: "thr_cas", name: "Casablanca", country: "Ma-rốc", lat: 33.57, lon: -7.58, type: "Reflector" },
]

/**
 * 42 REAL-WORLD CYBER ATTACK & ANYCAST INTERCEPTION ENGAGEMENTS
 * Dynamic plasma attack tracers countered by Anycast Scrubbing Dome Shields, Counter-Beams & Spark Dissipations
 */
const ACTIVE_ENGAGEMENTS = [
  // APAC Engagements (Fast, high-density traffic)
  { id: "eng-1", fromId: "thr_szx", toId: "vnm_han", attackColor: "#ff1744", interceptColor: "#00f5ff", speed: 1.15, peakAlt: 0.16, offset: 0.0 },
  { id: "eng-2", fromId: "thr_can", toId: "vnm_sgn", attackColor: "#ff9100", interceptColor: "#00e676", speed: 1.25, peakAlt: 0.15, offset: 0.19 },
  { id: "eng-3", fromId: "thr_bkk", toId: "vnm_han", attackColor: "#ffea00", interceptColor: "#00f5ff", speed: 1.35, peakAlt: 0.12, offset: 0.42 },
  { id: "eng-4", fromId: "thr_pek", toId: "jpn_tyo", attackColor: "#ff1744", interceptColor: "#00f5ff", speed: 1.1, peakAlt: 0.18, offset: 0.65 },
  { id: "eng-5", fromId: "thr_ctu", toId: "sgp_sin", attackColor: "#d500f9", interceptColor: "#00e676", speed: 1.05, peakAlt: 0.17, offset: 0.88 },
  { id: "eng-6", fromId: "thr_jkt", toId: "sgp_sin", attackColor: "#ff9100", interceptColor: "#00f5ff", speed: 1.4, peakAlt: 0.11, offset: 0.08 },
  { id: "eng-7", fromId: "thr_mnl", toId: "kor_sel", attackColor: "#ff1744", interceptColor: "#00e676", speed: 1.2, peakAlt: 0.19, offset: 0.31 },
  { id: "eng-8", fromId: "thr_vvo", toId: "jpn_tyo", attackColor: "#ff9100", interceptColor: "#00f5ff", speed: 1.3, peakAlt: 0.14, offset: 0.54 },
  { id: "eng-9", fromId: "thr_hgh", toId: "chn_shg", attackColor: "#d500f9", interceptColor: "#00e676", speed: 1.45, peakAlt: 0.1, offset: 0.77 },
  { id: "eng-10", fromId: "thr_wuh", toId: "sgp_sin", attackColor: "#ff1744", interceptColor: "#00f5ff", speed: 1.12, peakAlt: 0.18, offset: 0.23 },
  { id: "eng-11", fromId: "thr_del", toId: "ind_mum", attackColor: "#ffea00", interceptColor: "#00e676", speed: 1.3, peakAlt: 0.13, offset: 0.46 },
  { id: "eng-12", fromId: "thr_tpe", toId: "jpn_tyo", attackColor: "#ff9100", interceptColor: "#00f5ff", speed: 1.25, peakAlt: 0.15, offset: 0.69 },
  { id: "eng-13", fromId: "thr_jkt", toId: "aus_syd", attackColor: "#ff1744", interceptColor: "#00f5ff", speed: 1.05, peakAlt: 0.22, offset: 0.92 },

  // NAM & Trans-Pacific Engagements
  { id: "eng-14", fromId: "thr_szx", toId: "usa_sjc", attackColor: "#ff1744", interceptColor: "#00f5ff", speed: 0.9, peakAlt: 0.26, offset: 0.14 },
  { id: "eng-15", fromId: "thr_pek", toId: "usa_sjc", attackColor: "#ff9100", interceptColor: "#00e676", speed: 0.92, peakAlt: 0.27, offset: 0.37 },
  { id: "eng-16", fromId: "thr_dfw", toId: "usa_nyc", attackColor: "#ff1744", interceptColor: "#00f5ff", speed: 1.35, peakAlt: 0.15, offset: 0.6 },
  { id: "eng-17", fromId: "thr_chi", toId: "usa_was", attackColor: "#d500f9", interceptColor: "#00e676", speed: 1.4, peakAlt: 0.13, offset: 0.83 },
  { id: "eng-18", fromId: "thr_lax", toId: "usa_sjc", attackColor: "#ffea00", interceptColor: "#00f5ff", speed: 1.5, peakAlt: 0.11, offset: 0.05 },
  { id: "eng-19", fromId: "thr_mia", toId: "can_tor", attackColor: "#ff1744", interceptColor: "#00e676", speed: 1.2, peakAlt: 0.17, offset: 0.28 },
  { id: "eng-20", fromId: "thr_sea", toId: "usa_sjc", attackColor: "#ff9100", interceptColor: "#00f5ff", speed: 1.45, peakAlt: 0.12, offset: 0.51 },
  { id: "eng-21", fromId: "thr_atl", toId: "usa_was", attackColor: "#d500f9", interceptColor: "#00e676", speed: 1.35, peakAlt: 0.14, offset: 0.74 },
  { id: "eng-22", fromId: "thr_dfw", toId: "mex_mex", attackColor: "#ff9100", interceptColor: "#00f5ff", speed: 1.3, peakAlt: 0.15, offset: 0.97 },

  // EUR & Russian Eurasia Engagements
  { id: "eng-23", fromId: "thr_ovb", toId: "deu_fra", attackColor: "#ff1744", interceptColor: "#00f5ff", speed: 0.95, peakAlt: 0.24, offset: 0.11 },
  { id: "eng-24", fromId: "thr_ovb", toId: "rus_mow", attackColor: "#ff9100", interceptColor: "#00e676", speed: 1.2, peakAlt: 0.18, offset: 0.34 },
  { id: "eng-25", fromId: "thr_kuf", toId: "gbr_lon", attackColor: "#d500f9", interceptColor: "#00f5ff", speed: 1.1, peakAlt: 0.2, offset: 0.57 },
  { id: "eng-26", fromId: "thr_kaz", toId: "rus_led", attackColor: "#ff1744", interceptColor: "#00e676", speed: 1.35, peakAlt: 0.15, offset: 0.8 },
  { id: "eng-27", fromId: "thr_yek", toId: "rus_mow", attackColor: "#ff9100", interceptColor: "#00f5ff", speed: 1.3, peakAlt: 0.16, offset: 0.02 },
  { id: "eng-28", fromId: "thr_iev", toId: "nld_ams", attackColor: "#ff1744", interceptColor: "#00e676", speed: 1.25, peakAlt: 0.16, offset: 0.25 },
  { id: "eng-29", fromId: "thr_otp", toId: "fra_par", attackColor: "#ffea00", interceptColor: "#00f5ff", speed: 1.2, peakAlt: 0.15, offset: 0.48 },
  { id: "eng-30", fromId: "thr_waw", toId: "che_zrh", attackColor: "#d500f9", interceptColor: "#00e676", speed: 1.3, peakAlt: 0.14, offset: 0.71 },
  { id: "eng-31", fromId: "thr_ber", toId: "deu_fra", attackColor: "#ff9100", interceptColor: "#00f5ff", speed: 1.5, peakAlt: 0.1, offset: 0.94 },
  { id: "eng-32", fromId: "thr_mil", toId: "che_zrh", attackColor: "#ff1744", interceptColor: "#00e676", speed: 1.6, peakAlt: 0.09, offset: 0.17 },
  { id: "eng-33", fromId: "thr_mad", toId: "fra_par", attackColor: "#d500f9", interceptColor: "#00f5ff", speed: 1.35, peakAlt: 0.14, offset: 0.39 },

  // MEA, LATAM & Global South Engagements
  { id: "eng-34", fromId: "thr_thr", toId: "uae_dxb", attackColor: "#d500f9", interceptColor: "#00f5ff", speed: 1.4, peakAlt: 0.13, offset: 0.62 },
  { id: "eng-35", fromId: "thr_cai", toId: "isr_tlv", attackColor: "#ff1744", interceptColor: "#00e676", speed: 1.5, peakAlt: 0.11, offset: 0.85 },
  { id: "eng-36", fromId: "thr_ist", toId: "sau_ruh", attackColor: "#ff9100", interceptColor: "#00f5ff", speed: 1.25, peakAlt: 0.16, offset: 0.07 },
  { id: "eng-37", fromId: "thr_los", toId: "zaf_jnb", attackColor: "#ff1744", interceptColor: "#00e676", speed: 1.05, peakAlt: 0.23, offset: 0.3 },
  { id: "eng-38", fromId: "thr_cas", toId: "fra_par", attackColor: "#ffea00", interceptColor: "#00f5ff", speed: 1.15, peakAlt: 0.19, offset: 0.53 },
  { id: "eng-39", fromId: "thr_rio", toId: "bra_sao", attackColor: "#ff1744", interceptColor: "#00f5ff", speed: 1.6, peakAlt: 0.1, offset: 0.76 },
  { id: "eng-40", fromId: "thr_bog", toId: "arg_bue", attackColor: "#ff9100", interceptColor: "#00e676", speed: 1.08, peakAlt: 0.21, offset: 0.98 },
  { id: "eng-41", fromId: "thr_scl", toId: "arg_bue", attackColor: "#d500f9", interceptColor: "#00f5ff", speed: 1.5, peakAlt: 0.12, offset: 0.21 },
  { id: "eng-42", fromId: "thr_rio", toId: "usa_nyc", attackColor: "#ff1744", interceptColor: "#00f5ff", speed: 0.95, peakAlt: 0.25, offset: 0.44 },
]

// 6 Continental Filter Zones
const REGIONS = [
  { id: "all", name: "Toàn Cầu", code: "GLOBAL", count: "320+ PoPs", color: "#38bdf8" },
  { id: "apac", name: "Châu Á - TBD", code: "APAC", count: "112 PoPs", color: "#06b6d4" },
  { id: "nam", name: "Bắc Mỹ", code: "NAM", count: "86 PoPs", color: "#38bdf8" },
  { id: "eur", name: "Châu Âu & Nga", code: "EUR", count: "78 PoPs", color: "#fbbf24" },
  { id: "mea", name: "Trung Đông", code: "MEA", count: "28 PoPs", color: "#a855f7" },
  { id: "latam", name: "Mỹ Latinh", code: "LATAM", count: "24 PoPs", color: "#f43f5e" },
]

// 80 Deep Space Twinkling Stars for 3D Globe
const STARS = Array.from({ length: 80 }, (_, i) => ({
  x: ((i * 37 + 13) % 100) / 100,
  y: ((i * 59 + 29) % 100) / 100,
  size: i % 4 === 0 ? 1.8 : 1.2,
  alpha: 0.25 + (i % 5) * 0.12,
  offset: i * 0.7,
}))

export default function CyberCommandTheater() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  // View Mode: "2d-map" (Satellite) | "3d-globe" (Interactive 3D Sphere)
  const [viewMode, setViewMode] = useState("2d-map")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedPop, setSelectedPop] = useState(NETWORK_POPS[0])
  const [pingStatus, setPingStatus] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)

  // 3D Globe Rotation & Drag State
  const globeRotRef = useRef(0)
  const isDraggingRef = useRef(false)
  const lastMouseXRef = useRef(0)
  const viewModeRef = useRef("2d-map")
  const selectedRegionRef = useRef("all")
  const selectedPopRef = useRef(NETWORK_POPS[0])
  const screenNodesRef = useRef([])

  useEffect(() => {
    viewModeRef.current = viewMode
  }, [viewMode])

  useEffect(() => {
    selectedRegionRef.current = selectedRegion
  }, [selectedRegion])

  useEffect(() => {
    selectedPopRef.current = selectedPop
  }, [selectedPop])

  // Filtered PoPs based on region
  const visiblePops = useMemo(() => {
    if (selectedRegion === "all") return NETWORK_POPS
    return NETWORK_POPS.filter((p) => p.zone === selectedRegion)
  }, [selectedRegion])

  // Interactive Ping Test between Selected PoP and Neighboring Hub
  const handleRunPingTest = useCallback(() => {
    if (!selectedPop) return
    setPingStatus({ state: "testing", text: "Đang gửi tín hiệu đo kiểm..." })

    setTimeout(() => {
      const neighbor =
        NETWORK_POPS.find((p) => p.id !== selectedPop.id && p.zone === selectedPop.zone) ||
        NETWORK_POPS.find((p) => p.id === "sgp_sin") ||
        NETWORK_POPS[0]

      setPingStatus({
        state: "done",
        text: `Ping ${selectedPop.name} ➔ ${neighbor.name}: ${selectedPop.latency} • 0% Packet Loss • TLS 1.3 OK`,
      })

      setTimeout(() => setPingStatus(null), 4500)
    }, 700)
  }, [selectedPop])

  // 60 FPS Canvas Rendering Engine (Supports both 2D Equirectangular & 3D Interactive Rotating Sphere)
  useEffect(() => {
    let animId
    let lastTime = performance.now()
    const cablePulsePhases = SUBSEA_CABLES.map((_, i) => i * 0.15)

    const syncSize = (cv, ctx) => {
      const rect = cv.getBoundingClientRect()
      let w = Math.floor(rect.width)
      let h = Math.floor(rect.height)
      if (w <= 0 || h <= 0) {
        w = cv.parentElement?.clientWidth || 1200
        h = cv.parentElement?.clientHeight || 675
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      if (cv.width !== w * dpr || cv.height !== h * dpr) {
        cv.width = w * dpr
        cv.height = h * dpr
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      return { w, h, cx: w / 2, cy: h / 2 }
    }

    const render = (now) => {
      animId = requestAnimationFrame(render)
      const dt = (now - lastTime) / 1000
      lastTime = now

      // Smooth auto-rotation in 3D when not dragging
      if (!isDraggingRef.current && viewModeRef.current === "3d-globe") {
        globeRotRef.current += dt * 0.16
      }

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      try {
        const { w, h, cx, cy } = syncSize(canvas, ctx)
        if (w <= 0 || h <= 0) return

        ctx.clearRect(0, 0, w, h)
        screenNodesRef.current = []

        const curMode = viewModeRef.current
        const curRegion = selectedRegionRef.current
        const curPop = selectedPopRef.current
        const rot = globeRotRef.current

        // 3D Parameters
        const globeRadius = Math.max(110, Math.min(w, h) * 0.38)
        const tilt = 14 * (Math.PI / 180)
        const cosT = Math.cos(tilt)
        const sinT = Math.sin(tilt)

        // Mathematical Projections
        const project2D = (lat, lon) => {
          const px = cx + (lon / 180) * (w * 0.495)
          const py = cy - (lat / 90) * (h * 0.45)
          return { px, py, visible: true, scale: 1, z: 1 }
        }

        const project3D = (lat, lon, altitude = 0) => {
          const phi = (lat * Math.PI) / 180
          const lam = (lon * Math.PI) / 180 + rot
          const rEff = globeRadius + altitude

          const x0 = rEff * Math.cos(phi) * Math.sin(lam)
          const y0 = -rEff * Math.sin(phi)
          const z0 = rEff * Math.cos(phi) * Math.cos(lam)

          const x = x0
          const y = y0 * cosT - z0 * sinT
          const z = y0 * sinT + z0 * cosT

          if (z < 1) return { px: 0, py: 0, visible: false, scale: 0, z }

          const depthScale = Math.max(0.7, Math.min(1.2, 0.75 + 0.38 * (z / rEff)))
          return { px: cx + x, py: cy + y, visible: true, scale: depthScale, z }
        }

        const project = (lat, lon, alt = 0) => {
          return curMode === "2d-map" ? project2D(lat, lon) : project3D(lat, lon, alt)
        }

        // ====================================================================
        // 1. BACKGROUND ENVIRONMENT (SPACE IN 3D OR RECON GRID IN 2D)
        // ====================================================================
        if (curMode === "3d-globe") {
          // Deep space stars outside sphere
          STARS.forEach((s) => {
            const sx = s.x * w
            const sy = s.y * h
            const dx = sx - cx
            const dy = sy - cy
            if (dx * dx + dy * dy < (globeRadius * 1.05) ** 2) return
            const twinkle = 0.5 + 0.5 * Math.sin(now * 0.003 + s.offset)
            ctx.fillStyle = `rgba(226, 232, 240, ${s.alpha * twinkle})`
            ctx.fillRect(sx, sy, s.size, s.size)
          })

          // Outer Atmospheric Halo (Drawn BEFORE sphere)
          const outerHalo = ctx.createRadialGradient(
            cx, cy, globeRadius * 0.98,
            cx, cy, globeRadius * 1.25
          )
          outerHalo.addColorStop(0, "rgba(56, 189, 248, 0.35)")
          outerHalo.addColorStop(0.35, "rgba(6, 182, 212, 0.14)")
          outerHalo.addColorStop(0.7, "rgba(14, 165, 233, 0.03)")
          outerHalo.addColorStop(1, "transparent")
          ctx.fillStyle = outerHalo
          ctx.beginPath()
          ctx.arc(cx, cy, globeRadius * 1.25, 0, Math.PI * 2)
          ctx.fill()

          // Shaded Day/Night Oceanic Sphere
          const sphereGrad = ctx.createRadialGradient(
            cx - globeRadius * 0.35,
            cy - globeRadius * 0.35,
            Math.max(1, globeRadius * 0.05),
            cx, cy, globeRadius
          )
          sphereGrad.addColorStop(0, "#0e1a32")
          sphereGrad.addColorStop(0.65, "#060d1a")
          sphereGrad.addColorStop(1, "#020408")
          ctx.fillStyle = sphereGrad
          ctx.beginPath()
          ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2)
          ctx.fill()

          // Inner Atmospheric Limb Glow (NASA Blue Marble edge)
          const innerLimb = ctx.createRadialGradient(
            cx, cy, globeRadius * 0.86,
            cx, cy, globeRadius
          )
          innerLimb.addColorStop(0, "transparent")
          innerLimb.addColorStop(0.8, "rgba(56, 189, 248, 0.12)")
          innerLimb.addColorStop(1, "rgba(56, 189, 248, 0.32)")
          ctx.fillStyle = innerLimb
          ctx.beginPath()
          ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2)
          ctx.fill()

          // Outer Precision Rim Line
          ctx.strokeStyle = "rgba(56, 189, 248, 0.4)"
          ctx.lineWidth = 1.3
          ctx.beginPath()
          ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2)
          ctx.stroke()

          // Graticule Parallels matching orbital tilt
          ctx.strokeStyle = "rgba(56, 189, 248, 0.1)"
          ctx.lineWidth = 1
          const rotDeg = (rot * 180) / Math.PI
          for (let rLat = -60; rLat <= 60; rLat += 30) {
            ctx.beginPath()
            let drawing = false
            for (let deg = 0; deg <= 360; deg += 6) {
              const p = project3D(rLat, deg - rotDeg, 0)
              if (p.visible) {
                if (!drawing) {
                  ctx.moveTo(p.px, p.py)
                  drawing = true
                } else {
                  ctx.lineTo(p.px, p.py)
                }
              } else {
                drawing = false
              }
            }
            ctx.stroke()
          }

          // Continents in 3D (Vector-Locked to coordinates)
          REALISTIC_CONTINENTS.forEach((c) => {
            if (!c?.coords) return
            ctx.strokeStyle = "rgba(56, 189, 248, 0.65)"
            ctx.lineWidth = 1.2
            ctx.beginPath()
            let drawing = false
            for (let i = 0; i < c.coords.length; i++) {
              const [cLon, cLat] = c.coords[i]
              const p = project3D(cLat, cLon, 0)
              if (p.visible) {
                if (!drawing) {
                  ctx.moveTo(p.px, p.py)
                  drawing = true
                } else {
                  ctx.lineTo(p.px, p.py)
                }
              } else {
                drawing = false
              }
            }
            ctx.stroke()
          })
        }

        // ====================================================================
        // 2. SUBSEA FIBER OPTIC INTERCONNECT LINES & PACKET PULSES
        // ====================================================================
        SUBSEA_CABLES.forEach((cable, idx) => {
          const from = NETWORK_POPS.find((p) => p.id === cable.fromId)
          const to = NETWORK_POPS.find((p) => p.id === cable.toId)
          if (!from || !to) return

          cablePulsePhases[idx] = (cablePulsePhases[idx] + 0.008) % 1
          const phase = cablePulsePhases[idx]

          if (curMode === "2d-map") {
            const p1 = project2D(from.lat, from.lon)
            const p2 = project2D(to.lat, to.lon)
            // Cable line
            ctx.strokeStyle = "rgba(56, 189, 248, 0.28)"
            ctx.lineWidth = 1.2
            ctx.beginPath()
            ctx.moveTo(p1.px, p1.py)
            ctx.lineTo(p2.px, p2.py)
            ctx.stroke()

            // Optic Light Pulse along cable
            const pulseX = p1.px + (p2.px - p1.px) * phase
            const pulseY = p1.py + (p2.py - p1.py) * phase
            ctx.fillStyle = "#38bdf8"
            ctx.beginPath()
            ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2)
            ctx.fill()
          } else {
            // 3D Spherical Cable Path
            let dLon = to.lon - from.lon
            if (dLon > 180) dLon -= 360
            else if (dLon < -180) dLon += 360

            ctx.strokeStyle = "rgba(56, 189, 248, 0.35)"
            ctx.lineWidth = 1.3
            ctx.beginPath()
            let started = false
            for (let st = 0; st <= 1; st += 0.04) {
              const cLat = from.lat + (to.lat - from.lat) * st
              const cLon = from.lon + dLon * st
              const pt = project3D(cLat, cLon, 0)
              if (pt.visible) {
                if (!started) {
                  ctx.moveTo(pt.px, pt.py)
                  started = true
                } else {
                  ctx.lineTo(pt.px, pt.py)
                }
              } else {
                started = false
              }
            }
            ctx.stroke()

            // 3D Fiber Pulse
            const curLat = from.lat + (to.lat - from.lat) * phase
            const curLon = from.lon + dLon * phase
            const pulsePt = project3D(curLat, curLon, 0)
            if (pulsePt.visible) {
              ctx.fillStyle = "#38bdf8"
              ctx.beginPath()
              ctx.arc(pulsePt.px, pulsePt.py, 2.5 * pulsePt.scale, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        })

        // ====================================================================
        // 3. THREAT TELEMETRY NODES (36 REAL-WORLD BOTNET & THREAT ORIGINS)
        // ====================================================================
        THREAT_ORIGINS.forEach((thr) => {
          const p = project(thr.lat, thr.lon, 0)
          if (!p.visible) return
          const scale = p.scale || 1
          screenNodesRef.current.push({ ...thr, px: p.px, py: p.py, isThreat: true })

          // Menacing Radar Pulse Ping
          const tPing = (now * 0.0016 + (Math.abs(thr.lon) % 10) * 0.1) % 1
          const rPing = (4 + tPing * 11) * scale
          ctx.strokeStyle = `rgba(239, 68, 68, ${Math.max(0, (1 - tPing) * 0.55)})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(p.px, p.py, rPing, 0, Math.PI * 2)
          ctx.stroke()

          // Crimson Threat Core Pin
          ctx.fillStyle = "#ef4444"
          ctx.beginPath()
          ctx.arc(p.px, p.py, 3.2 * scale, 0, Math.PI * 2)
          ctx.fill()

          // Needle Core Point
          ctx.fillStyle = "#ffffff"
          ctx.beginPath()
          ctx.arc(p.px, p.py, 1.2 * scale, 0, Math.PI * 2)
          ctx.fill()
        })

        // ====================================================================
        // 4. ACTIVE CYBER ENGAGEMENTS (ATTACK TRACERS & ANYCAST INTERCEPTIONS)
        // ====================================================================
        ACTIVE_ENGAGEMENTS.forEach((eng) => {
          const from =
            THREAT_ORIGINS.find((t) => t.id === eng.fromId) ||
            NETWORK_POPS.find((p) => p.id === eng.fromId)
          const to = NETWORK_POPS.find((p) => p.id === eng.toId)
          if (!from || !to) return

          // Cycle progress from 0.00 to 1.00
          const tRaw = ((now * 0.00032 * (eng.speed || 1)) + eng.offset) % 1

          // 2D vs 3D Trajectory Evaluator
          let getPoint
          if (curMode === "2d-map") {
            const p1 = project2D(from.lat, from.lon)
            const p2 = project2D(to.lat, to.lon)
            const dx = p2.px - p1.px
            const dy = p2.py - p1.py
            const dist = Math.hypot(dx, dy)
            if (dist < 4) return

            const nx = -dy / dist
            const ny = dx / dist
            const arcHeight = Math.min(85, dist * (eng.peakAlt || 0.16))
            const cpx = (p1.px + p2.px) / 2 + nx * arcHeight
            const cpy = (p1.py + p2.py) / 2 + ny * arcHeight

            getPoint = (prog) => {
              const inv = 1 - prog
              return {
                px: inv * inv * p1.px + 2 * inv * prog * cpx + prog * prog * p2.px,
                py: inv * inv * p1.py + 2 * inv * prog * cpy + prog * prog * p2.py,
                visible: true,
                scale: 1,
              }
            }
          } else {
            let dLon = to.lon - from.lon
            if (dLon > 180) dLon -= 360
            else if (dLon < -180) dLon += 360

            getPoint = (prog) => {
              const curLat = from.lat + (to.lat - from.lat) * prog
              const curLon = from.lon + dLon * prog
              const suborbitalAlt = Math.sin(prog * Math.PI) * (globeRadius * (eng.peakAlt || 0.18))
              return project3D(curLat, curLon, suborbitalAlt)
            }
          }

          // A. Attack Plasma Tracer Dart (Active from t = 0 to 0.82)
          if (tRaw < 0.82) {
            const pHead = getPoint(tRaw)
            const pTail = getPoint(Math.max(0, tRaw - 0.14))

            if (pHead.visible && pTail.visible) {
              const hScale = pHead.scale || 1
              // Curved Tracer Trail connecting intermediate steps
              ctx.strokeStyle = eng.attackColor
              ctx.lineWidth = 2.2 * hScale
              ctx.beginPath()
              ctx.moveTo(pTail.px, pTail.py)
              for (let st = 1; st <= 4; st++) {
                const subProg = Math.max(0, tRaw - 0.14) + 0.14 * (st / 4)
                const subPt = getPoint(subProg)
                if (subPt.visible) ctx.lineTo(subPt.px, subPt.py)
              }
              ctx.stroke()

              // White-Hot Laser Tip
              ctx.fillStyle = "#ffffff"
              ctx.beginPath()
              ctx.arc(pHead.px, pHead.py, 2.4 * hScale, 0, Math.PI * 2)
              ctx.fill()

              // Outer Colored Plasma Corona
              ctx.fillStyle = `${eng.attackColor}55`
              ctx.beginPath()
              ctx.arc(pHead.px, pHead.py, 5.5 * hScale, 0, Math.PI * 2)
              ctx.fill()
            }
          }

          // Target Defense Node coordinates
          const pTarget = project(to.lat, to.lon, 0)
          const pImpact = getPoint(0.82)

          if (pTarget.visible && pImpact.visible) {
            const tScale = pTarget.scale || 1
            const iScale = pImpact.scale || 1

            // B. Anycast Scrubbing Dome Barrier Shield (Activated when threat approaches: t >= 0.65)
            if (tRaw >= 0.65) {
              const inAngle = Math.atan2(pImpact.py - pTarget.py, pImpact.px - pTarget.px)
              const domeRadius = 15 * tScale

              // Glowing Shield Barrier Arc
              ctx.strokeStyle = eng.interceptColor || "#00f5ff"
              ctx.lineWidth = 2.4
              ctx.beginPath()
              ctx.arc(pTarget.px, pTarget.py, domeRadius, inAngle - 0.75, inAngle + 0.75)
              ctx.stroke()

              // Inner Forcefield Resonance Arc
              ctx.strokeStyle = "rgba(255, 255, 255, 0.75)"
              ctx.lineWidth = 1.2
              ctx.beginPath()
              ctx.arc(pTarget.px, pTarget.py, domeRadius * 0.75, inAngle - 0.5, inAngle + 0.5)
              ctx.stroke()
            }

            // C. Counter-Interception Beam (Fired from target toward incoming missile: 0.65 <= t < 0.82)
            if (tRaw >= 0.65 && tRaw < 0.82) {
              const defProg = Math.min(1, (tRaw - 0.65) / 0.17)
              const beamHeadX = pTarget.px + (pImpact.px - pTarget.px) * defProg
              const beamHeadY = pTarget.py + (pImpact.py - pTarget.py) * defProg

              ctx.strokeStyle = eng.interceptColor || "#00f5ff"
              ctx.lineWidth = 2.0
              ctx.beginPath()
              ctx.moveTo(pTarget.px, pTarget.py)
              ctx.lineTo(beamHeadX, beamHeadY)
              ctx.stroke()

              // White Defensive Beam Tip Pulse
              ctx.fillStyle = "#ffffff"
              ctx.beginPath()
              ctx.arc(beamHeadX, beamHeadY, 2.2, 0, Math.PI * 2)
              ctx.fill()
            }

            // D. Mid-Air Neutralization, Spark Dissipation & Anycast Absorption Shockwave (t >= 0.82)
            if (tRaw >= 0.82) {
              const postImpact = (tRaw - 0.82) / 0.18 // 0.00 to 1.00

              // 1. Initial Collision Flash
              if (postImpact < 0.28) {
                const flashAlpha = 1 - postImpact / 0.28
                ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.95})`
                ctx.beginPath()
                ctx.arc(pImpact.px, pImpact.py, 7 * iScale, 0, Math.PI * 2)
                ctx.fill()
              }

              // 2. Expanding Clean Anycast Scrubbing Shockwave Ring
              const shockR = (4 + postImpact * 28) * iScale
              const shockAlpha = Math.max(0, 1 - postImpact)
              ctx.strokeStyle = eng.interceptColor || "#00f5ff"
              ctx.lineWidth = Math.max(1, 2.2 * (1 - postImpact))
              ctx.beginPath()
              ctx.arc(pImpact.px, pImpact.py, shockR, 0, Math.PI * 2)
              ctx.stroke()

              // 3. Spark Dissipation Particles Scattering Harmlessly
              const sparkAngles = [0.6, 1.8, 3.2, 4.5, 5.6]
              sparkAngles.forEach((ang, sIdx) => {
                const dist = postImpact * (18 + sIdx * 5) * iScale
                const spX = pImpact.px + Math.cos(ang + eng.offset * 10) * dist
                const spY = pImpact.py + Math.sin(ang + eng.offset * 10) * dist
                ctx.fillStyle =
                  sIdx % 2 === 0
                    ? `rgba(255, 255, 255, ${shockAlpha * 0.9})`
                    : `${eng.attackColor}${Math.floor(shockAlpha * 255).toString(16).padStart(2, "0")}`
                ctx.beginPath()
                ctx.arc(spX, spY, 1.4 * iScale, 0, Math.PI * 2)
                ctx.fill()
              })
            }
          }
        })

        // ====================================================================
        // 5. TIER-4 DEFENSE POPS PINS (ZERO TEXT ON CANVAS FOR CLEANEST HUD)
        // ====================================================================
        NETWORK_POPS.forEach((pop) => {
          const isSelected = curPop?.id === pop.id
          const inRegion = curRegion === "all" || pop.zone === curRegion
          const p = project(pop.lat, pop.lon, 0)
          if (!p.visible) return

          const scale = p.scale || 1
          screenNodesRef.current.push({ ...pop, px: p.px, py: p.py, isThreat: false })

          // Selected Node Pulsing Radar Reticle & Crosshair
          if (isSelected) {
            const t = (now * 0.003) % 1
            const rLock = (14 + t * 8) * scale
            ctx.strokeStyle = `rgba(56, 189, 248, ${Math.max(0, 1 - t)})`
            ctx.lineWidth = 1.4
            ctx.beginPath()
            ctx.arc(p.px, p.py, rLock, 0, Math.PI * 2)
            ctx.stroke()

            // Reticle Crosshairs
            ctx.strokeStyle = "#38bdf8"
            ctx.lineWidth = 1.2
            ctx.beginPath()
            ctx.moveTo(p.px - 14 * scale, p.py)
            ctx.lineTo(p.px + 14 * scale, p.py)
            ctx.moveTo(p.px, p.py - 14 * scale)
            ctx.lineTo(p.px, p.py + 14 * scale)
            ctx.stroke()
          } else if (inRegion) {
            // Subtle Anycast Active Pulse
            const tNode = (now * 0.002 + (Math.abs(pop.lon) % 10) * 0.1) % 1
            ctx.strokeStyle = `rgba(16, 185, 129, ${Math.max(0, (1 - tNode) * 0.4)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.arc(p.px, p.py, (5 + tNode * 8) * scale, 0, Math.PI * 2)
            ctx.stroke()
          }

          // Node Center Dot
          const dotRadius = (isSelected ? 5.5 : inRegion ? 4 : 2.5) * scale
          ctx.fillStyle = isSelected ? "#38bdf8" : inRegion ? "#10b981" : "#475569"
          ctx.beginPath()
          ctx.arc(p.px, p.py, dotRadius, 0, Math.PI * 2)
          ctx.fill()

          // White Core for Active Node
          if (inRegion || isSelected) {
            ctx.fillStyle = "#ffffff"
            ctx.beginPath()
            ctx.arc(p.px, p.py, dotRadius * 0.45, 0, Math.PI * 2)
            ctx.fill()
          }

          // NO ctx.fillText: City labels completely removed from map canvas surface as requested!
        })
      } catch {
        // Recover gracefully
      }
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [])

  // Mouse & Touch Interaction for 3D Globe Drag & Node Hover
  const handlePointerDown = (e) => {
    if (viewMode !== "3d-globe") return
    isDraggingRef.current = true
    lastMouseXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0
  }

  const handlePointerMove = (e) => {
    if (isDraggingRef.current && viewMode === "3d-globe") {
      const curX = e.clientX || (e.touches && e.touches[0].clientX) || 0
      const deltaX = curX - lastMouseXRef.current
      lastMouseXRef.current = curX
      globeRotRef.current += deltaX * 0.006
    }

    // Hover Node Hit-Test
    const canvas = canvasRef.current
    if (canvas && e.clientX) {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const found = screenNodesRef.current.find(
        (n) => Math.hypot(n.px - mx, n.py - my) < 18
      )
      setHoveredNode(found || null)
    }
  }

  const handlePointerUp = () => {
    isDraggingRef.current = false
  }

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const found = screenNodesRef.current.find(
      (n) => Math.hypot(n.px - mx, n.py - my) < 20
    )
    if (found && !found.isThreat) {
      setSelectedPop(found)
    }
  }

  return (
    <section className="relative w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 lg:py-16 select-none">
      {/* ====================================================================
          1. SECTION HEADER (CLEAN, SOPHISTICATED ENTERPRISE SAAS)
         ==================================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold tracking-wider uppercase">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MẠNG LƯỚI BẢO VỆ TOÀN CẦU // GLOBAL SECURITY BACKBONE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Hạ Tầng An Ninh Phân Tán Trên Toàn Cầu
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Hệ thống lá chắn phòng thủ Anycast phân tán trên 26 quốc gia và 320+ trung tâm dữ liệu Tier-4. Tự động hấp thụ tấn công DDoS 150+ Tbps, bảo vệ ứng dụng đám mây với độ trễ siêu thấp dưới 30ms.
          </p>
        </div>

        {/* Global Operational Status Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-right font-mono text-xs shadow-lg backdrop-blur-md">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center justify-end gap-1.5">
              <span>TRẠNG THÁI MẠNG LƯỚI</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-sm font-extrabold text-emerald-400 mt-0.5 tracking-wider">
              100% OPERATIONAL &bull; 0 OUTAGE
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          2. 4 TOP ENTERPRISE KEY METRICS (LARGE, CLEAN, IMPACTFUL)
         ==================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        <div className="p-4 rounded-2xl bg-[#0a0c10]/90 border border-slate-800 backdrop-blur-md hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-mono">
            <span>TRUNG TÂM DỮ LIỆU</span>
            <Server className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            320+
          </div>
          <div className="text-[11px] text-cyan-400/90 mt-1 flex items-center gap-1 font-mono">
            <span>PoPs Anycast tại 26 quốc gia</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0a0c10]/90 border border-slate-800 backdrop-blur-md hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-mono">
            <span>CÔNG SUẤT CHỐNG DDOS</span>
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
            154 Tbps
          </div>
          <div className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1 font-mono">
            <span>Tự động hấp thụ tại biên mạng</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0a0c10]/90 border border-slate-800 backdrop-blur-md hover:border-sky-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-mono">
            <span>ĐỘ TRỄ TRUNG BÌNH</span>
            <Activity className="h-4 w-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-300 font-mono tracking-tight">
            &lt; 28ms
          </div>
          <div className="text-[11px] text-sky-400/90 mt-1 flex items-center gap-1 font-mono">
            <span>Đến 95% người dùng toàn cầu</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0a0c10]/90 border border-slate-800 backdrop-blur-md hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-mono">
            <span>CAM KẾT THỜI GIAN UPTIME</span>
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
            99.999%
          </div>
          <div className="text-[11px] text-amber-400/90 mt-1 flex items-center gap-1 font-mono">
            <span>Chuẩn SLA cấp Enterprise quốc tế</span>
          </div>
        </div>
      </div>

      {/* ====================================================================
          3. MAIN NETWORK MAP CHASSIS
         ==================================================================== */}
      <div
        ref={containerRef}
        className="relative rounded-3xl bg-[#030712] border border-slate-800 shadow-2xl overflow-hidden flex flex-col group"
      >
        {/* Top Control Bar: View Switcher (2D vs 3D) & Regional Filters */}
        <div className="p-3.5 sm:px-6 bg-[#0a0c10]/95 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs font-mono z-30 backdrop-blur-md">
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            <span className="text-slate-500 font-bold px-1 hidden md:inline text-[11px]">KHU VỰC:</span>
            {REGIONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRegion(r.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 text-xs ${
                  selectedRegion === r.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 border border-transparent"
                }`}
              >
                <span>{r.name}</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">({r.count})</span>
              </button>
            ))}
          </div>

          {/* View Toggle: 2D Panoramic Map vs 3D Interactive Rotating Globe */}
          <div className="flex items-center p-1 rounded-2xl bg-black/80 border border-slate-800 text-xs shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode("2d-map")}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "2d-map"
                  ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Map className="h-3.5 w-3.5" />
              <span>BẢN ĐỒ 2D</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("3d-globe")}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "3d-globe"
                  ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/40 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>ĐỊA CẦU 3D</span>
            </button>
          </div>
        </div>

        {/* ==================================================================
            CANVAS MAP STAGE (Supports Mouse Drag to Rotate in 3D Mode!)
           ================================================================== */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            handlePointerUp()
            setHoveredNode(null)
          }}
          onClick={handleCanvasClick}
          className={`relative aspect-video min-h-[460px] lg:min-h-[560px] w-full bg-[#02040a] overflow-hidden flex items-center justify-center ${
            viewMode === "3d-globe" ? "cursor-grab active:cursor-grabbing" : "cursor-crosshair"
          }`}
        >
          {/* Authentic NASA Earth at Night Satellite Texture (Visible in 2D mode) */}
          <img
            src="/images/world-map-realistic-dark.jpg"
            alt="Real World Satellite Global Network"
            className={`absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-700 ${
              viewMode === "2d-map" ? "opacity-95 contrast-105 brightness-95" : "opacity-0"
            }`}
          />

          {/* Interactive HTML5 Canvas Layer */}
          <canvas
            ref={canvasRef}
            className="w-full h-full absolute inset-0 block pointer-events-none z-10"
          />

          {/* Soft Theater Edge Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(2,4,10,0.8)_100%)] pointer-events-none z-10" />

          {/* Top Left Compass & Live Threat Telemetry Badge */}
          <div className="absolute top-4 left-4 z-20 font-mono text-[10px] text-cyan-400/90 pointer-events-none space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
              <span>ANYCAST GLOBAL MESH // REAL-TIME THREAT TELEMETRY</span>
            </div>
            <div className="text-slate-400 text-[10px] flex items-center gap-2">
              <span className="text-emerald-400 font-bold">26 PoPs Bảo Vệ</span>
              <span>&bull;</span>
              <span className="text-red-400 font-bold">36 Nguồn Botnet</span>
              <span>&bull;</span>
              <span className="text-cyan-400 font-bold">100% Đánh Chặn Anycast Edge</span>
            </div>
          </div>

          {/* Top Right Floating Node Telemetry Chip (Appears on Hover) */}
          {hoveredNode && (
            <div className="absolute top-4 right-4 z-30 max-w-sm px-3.5 py-2 rounded-xl bg-slate-950/95 border border-cyan-500/50 backdrop-blur-md font-mono text-xs shadow-2xl flex items-center gap-2.5 animate-in fade-in duration-150 pointer-events-none">
              {hoveredNode.isThreat ? (
                <>
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
                  <div>
                    <div className="text-red-400 font-extrabold flex items-center gap-1.5">
                      <span>NGUỒN TẤN CÔNG: {hoveredNode.name}</span>
                      <span className="text-[10px] text-slate-400">({hoveredNode.country})</span>
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Mối đe dọa: <span className="text-amber-400 font-bold">{hoveredNode.type}</span> &bull; Telemetry Radar
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xl shrink-0">{hoveredNode.flag}</span>
                  <div>
                    <div className="text-cyan-300 font-extrabold flex items-center gap-1.5">
                      <span>{hoveredNode.name}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">• {hoveredNode.type}</span>
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Công suất lọc: <span className="text-cyan-400 font-bold">{hoveredNode.capacity}</span> &bull; Độ trễ: <span className="text-emerald-400 font-bold">{hoveredNode.latency}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Floating Selected Node Inspector Card (Bottom Left) */}
          {selectedPop && (
            <div className="absolute left-4 bottom-4 z-20 max-w-xs sm:max-w-sm w-full p-4 rounded-2xl bg-black/90 border border-cyan-500/40 backdrop-blur-md shadow-2xl font-mono text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedPop.flag}</span>
                  <div>
                    <div className="text-white font-extrabold text-sm">{selectedPop.name}</div>
                    <div className="text-[10px] text-slate-400">{selectedPop.country} &bull; {selectedPop.type}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold">
                  {selectedPop.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] py-1">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 text-[9px] block">CÔNG SUẤT LỌC:</span>
                  <span className="text-cyan-300 font-extrabold">{selectedPop.capacity}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 text-[9px] block">ĐỘ TRỄ NỘI ĐỊA:</span>
                  <span className="text-emerald-400 font-extrabold">{selectedPop.latency}</span>
                </div>
              </div>

              {/* Protected Services Pills */}
              <div className="space-y-1">
                <span className="text-slate-400 text-[9px] font-bold uppercase">DỊCH VỤ HOẠT ĐỘNG:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedPop.services.map((svc, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-300 border border-slate-700"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ping Test Button */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleRunPingTest}
                  className="w-full py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all text-xs"
                >
                  <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                  <span>ĐO KIỂM ĐỘ TRỄ (PING TEST)</span>
                </button>
                {pingStatus && (
                  <div className="mt-1.5 text-[10px] text-emerald-300 font-bold text-center animate-in fade-in">
                    {pingStatus.text}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Right Fast Jump to Labs */}
          <div className="absolute right-4 bottom-4 z-20 hidden sm:block">
            <Link
              to="/learning-paths"
              className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-xl shadow-cyan-400/20 bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all hover:scale-105 active:scale-95"
            >
              <span>Khám Phá Lộ Trình An Ninh Mạng</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* ==================================================================
            BOTTOM POP SELECTOR STRIP (CLICK ANY CITY TO INSPECT & PIN)
           ================================================================== */}
        <div className="p-3 bg-[#0a0c10] border-t border-slate-800 flex items-center justify-between gap-3 overflow-x-auto font-mono text-xs z-30">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-[11px] font-bold px-2 whitespace-nowrap">
              CHỌN TRẠM KIỂM TRA ({visiblePops.length} POPS):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {visiblePops.map((pop) => (
                <button
                  key={pop.id}
                  type="button"
                  onClick={() => setSelectedPop(pop)}
                  className={`px-2.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer hover:scale-102 active:scale-98 text-xs ${
                    selectedPop.id === pop.id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-md shadow-cyan-500/20"
                      : "bg-[#0f1420] text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  <span>{pop.flag}</span>
                  <span>{pop.name}</span>
                  <span className="text-[10px] text-slate-500">({pop.latency})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
          4. 3 PRACTICAL ENTERPRISE INFRASTRUCTURE PILLARS
         ==================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <div className="p-6 rounded-2xl bg-[#0a0c10]/90 border border-slate-800 flex flex-col justify-between group hover:border-cyan-500/50 transition-all">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
              Định Tuyến Anycast Hấp Thụ DDoS
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Mọi lưu lượng tấn công thể tích lớn (SYN, UDP, HTTP Flood) được tự động phân tán và làm sạch tại 320+ PoP gần kẻ tấn công nhất, bảo vệ máy chủ gốc an toàn tuyệt đối.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>BGP Anycast Routing</span>
            <span className="text-cyan-400 font-bold">154 Tbps Sức Chứa</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0a0c10]/90 border border-slate-800 flex flex-col justify-between group hover:border-emerald-500/50 transition-all">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
              Lá Chắn WAF Tầng 7 &amp; AI Bot Shield
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Phát hiện và ngăn chặn tức thì các nỗ lực xâm nhập SQL Injection, XSS, Zero-Day RCE và bầy botnet cào dữ liệu trái phép trong vòng dưới 1 mili-giây.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Machine Learning WAF</span>
            <span className="text-emerald-400 font-bold">&lt; 1ms Độ Trễ</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#0a0c10]/90 border border-slate-800 flex flex-col justify-between group hover:border-purple-500/50 transition-all">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/60">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors">
              Mạng Lưới Tình Báo Đe Dọa Phân Tán
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Hàng tỷ yêu cầu mỗi ngày được xử lý đồng bộ để cập nhật cơ sở dữ liệu IOCs mới nhất từ các tổ chức bảo mật uy tín toàn cầu (CISA, VNCERT, MITRE ATT&amp;CK).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Global Threat Intel</span>
            <span className="text-purple-300 font-bold">Thời Gian Thực</span>
          </div>
        </div>
      </div>
    </section>
  )
}
