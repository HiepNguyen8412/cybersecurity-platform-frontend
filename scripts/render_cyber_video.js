/* global Buffer, process */
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, "../public/videos");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "cyber_security_top.webm");

const SILHOUETTE_IMG_FILE = path.resolve(__dirname, "../public/images/hooded_faceless_hacker_silhouette.jpg");
const HANDS_IMG_FILE = path.resolve(__dirname, "../public/images/hacker_hands_typing_action.jpg");
const EXTRACTION_IMG_FILE = path.resolve(__dirname, "../public/images/hooded_hacker_data_extraction.jpg");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read images as base64
const silhouetteBase64 = fs.readFileSync(SILHOUETTE_IMG_FILE).toString("base64");
const handsBase64 = fs.readFileSync(HANDS_IMG_FILE).toString("base64");
const extractionBase64 = fs.existsSync(EXTRACTION_IMG_FILE) ? fs.readFileSync(EXTRACTION_IMG_FILE).toString("base64") : silhouetteBase64;

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 100%; height: 100%; overflow: hidden; background: #020612; }
    canvas { display: block; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <img id="silhouetteImg" src="data:image/jpeg;base64,${silhouetteBase64}" style="display:none;" />
  <img id="handsImg" src="data:image/jpeg;base64,${handsBase64}" style="display:none;" />
  <img id="extractionImg" src="data:image/jpeg;base64,${extractionBase64}" style="display:none;" />
  <canvas id="c" width="1920" height="600"></canvas>
  <script>
    const canvas = document.getElementById("c");
    const ctx = canvas.getContext("2d");
    const silhouetteImg = document.getElementById("silhouetteImg");
    const handsImg = document.getElementById("handsImg");
    const extractionImg = document.getElementById("extractionImg");
    const w = 1920;
    const h = 600;

    // MediaRecorder setup (60 FPS high-bitrate WebM)
    const stream = canvas.captureStream(60);
    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm; codecs=vp8",
      videoBitsPerSecond: 16000000, // 16 Mbps ultra crisp quality
    });
    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const reader = new FileReader();
      reader.onloadend = () => {
        window.videoBase64 = reader.result.split(",")[1];
        window.renderFinished = true;
      };
      reader.readAsDataURL(blob);
    };
    recorder.start(250);

    // 3D Datacenter Setup for Scene 3
    const vpX = w * 0.5;
    const vpY = h * 0.46;
    const fov = 750;
    const NUM_RACKS = 10;
    const RACK_SPACING = 380;
    const TRACK_LEN = NUM_RACKS * RACK_SPACING;

    function pseudoRandom(seed) {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }

    const racksData = [];
    for (let r = 0; r < NUM_RACKS * 2; r++) {
      const units = [];
      let currentU = 0;
      let seed = r * 100;
      while (currentU < 42) {
        const uHeight = pseudoRandom(seed++) < 0.6 ? 2 : pseudoRandom(seed++) < 0.5 ? 1 : 4;
        const numLeds = Math.floor(6 + pseudoRandom(seed++) * 18);
        const leds = [];
        for (let l = 0; l < numLeds; l++) {
          const type = pseudoRandom(seed++);
          leds.push({
            color: type < 0.55 ? "cyan" : type < 0.85 ? "blue" : type < 0.96 ? "emerald" : "amber",
            blinkSpeed: 4 + pseudoRandom(seed++) * 24,
            phase: pseudoRandom(seed++) * Math.PI * 2,
            dutyCycle: 0.3 + pseudoRandom(seed++) * 0.5,
          });
        }
        units.push({ uHeight, leds });
        currentU += uHeight;
      }
      racksData.push(units);
    }

    const extractionCode = [
      "BYPASSING KERNEL MEMORY PROTECTION... [OK]",
      "EXPLOIT: CVE-2026-8941 PRIVILEGE ELEVATION",
      "TCP STREAM: 10.0.4.12:8080 -> 192.168.1.99",
      "CERTIFICATE CHAIN OVERRIDE: SHA-384 HANDSHAKE",
      "ZERO-TRUST AUDIT LOG TRACE: INTERCEPTED",
      "DECRYPTING DATABASE BLOB (4,096 ENTRIES)...",
      "EXFILTRATION TUNNEL: TLS 1.3 OVER PORT 443",
      "STATUS: DATA TRANSFER ACCELERATED (142.8 MB/s)",
      ">> DUMPING SECURE_KEYSTORE.JKS [AES-256]",
      ">> EXFILTRATING ENCRYPTED CORP_VAULT.TAR.GZ"
    ];

    // Keystroke shockwave ripples & particle sparks
    const keyRipples = [];
    const sparkParticles = [];
    const packetBeams = [];

    // Pre-calculated keyboard key hit points on the macro shot
    const keyPositions = [
      { x: 0.38, y: 0.55, finger: 'L_index' },
      { x: 0.42, y: 0.52, finger: 'L_middle' },
      { x: 0.35, y: 0.58, finger: 'L_ring' },
      { x: 0.47, y: 0.62, finger: 'L_thumb' },
      { x: 0.54, y: 0.54, finger: 'R_index' },
      { x: 0.58, y: 0.51, finger: 'R_middle' },
      { x: 0.63, y: 0.56, finger: 'R_ring' },
      { x: 0.68, y: 0.58, finger: 'R_pinky' },
      { x: 0.51, y: 0.65, finger: 'Space' },
      { x: 0.72, y: 0.52, finger: 'Enter' }
    ];

    const DURATION_MS = 12000; // 12 seconds total
    let startTime = null;

    function draw(now) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      // =========================================================================
      // SCENE 1 (0.0s to 4.0s): Macro Action - Active Typing & Hardware Data Heist
      // =========================================================================
      if (elapsed < 4200) {
        ctx.save();
        if (elapsed > 3600) {
          ctx.globalAlpha = 1 - (elapsed - 3600) / 600;
        }

        // Dynamic handheld camera micro-motion (cinematic thriller feel)
        const camShakeX = Math.sin(elapsed * 0.004) * 5 + Math.sin(elapsed * 0.012) * 1.5;
        const camShakeY = Math.cos(elapsed * 0.003) * 4;
        const zoom = 1.02 + (elapsed / 4200) * 0.06;

        const drawW = w * zoom;
        const drawH = (w * (1080 / 1920)) * zoom;
        const drawX = (w - drawW) * 0.5 + camShakeX;
        const drawY = (h - drawH) * 0.5 + camShakeY;

        // 1. Draw base photorealistic mechanical keyboard & tactical hands
        ctx.drawImage(handsImg, drawX, drawY, drawW, drawH);

        // 2. Active Typing Action: Simulate active finger key strikes (Cử động gõ phím)
        // Keystroke cadence: rapid bursts every 90ms - 180ms
        const typeBeat = Math.floor(elapsed / 110);
        const isStrikeFrame = (elapsed % 110) < 55;

        if (isStrikeFrame && Math.random() < 0.65) {
          const keyIdx = Math.floor(pseudoRandom(typeBeat * 7) * keyPositions.length);
          const key = keyPositions[keyIdx];
          const strikeX = drawX + drawW * key.x;
          const strikeY = drawY + drawH * key.y;

          keyRipples.push({
            x: strikeX,
            y: strikeY,
            radius: 3,
            maxRadius: 28 + Math.random() * 16,
            alpha: 0.95,
            color: key.finger === 'Enter' ? '#00e5ff' : '#38bdf8'
          });

          // Emit sparks
          for (let sp = 0; sp < 4; sp++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 2 + Math.random() * 4;
            sparkParticles.push({
              x: strikeX,
              y: strikeY,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd - 1.5,
              alpha: 1,
              life: 1
            });
          }
        }

        // Draw and update keystroke shockwave ripples
        for (let i = keyRipples.length - 1; i >= 0; i--) {
          const kr = keyRipples[i];
          kr.radius += 2.2;
          kr.alpha *= 0.89;
          if (kr.alpha <= 0.04) {
            keyRipples.splice(i, 1);
            continue;
          }

          ctx.strokeStyle = "rgba(0, 229, 255, " + kr.alpha + ")";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(kr.x, kr.y, kr.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Bright switch contact flash
          ctx.fillStyle = "rgba(255, 255, 255, " + (kr.alpha * 1.3) + ")";
          ctx.beginPath();
          ctx.arc(kr.x, kr.y, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw and update tactile spark particles
        for (let i = sparkParticles.length - 1; i >= 0; i--) {
          const sp = sparkParticles[i];
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vy += 0.15; // subtle gravity
          sp.alpha *= 0.92;
          if (sp.alpha <= 0.05) {
            sparkParticles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = "rgba(0, 229, 255, " + sp.alpha + ")";
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3. Fast Blinking USB Hardware Exploit LED (Action Motion)
        const usbX = drawX + drawW * 0.185;
        const usbY = drawY + drawH * 0.76;
        const isUsbActive = Math.sin(elapsed * 0.045) > -0.3;

        if (isUsbActive) {
          const usbGlow = ctx.createRadialGradient(usbX, usbY, 0, usbX, usbY, 45);
          usbGlow.addColorStop(0, "rgba(0, 229, 255, 0.95)");
          usbGlow.addColorStop(0.35, "rgba(0, 132, 255, 0.55)");
          usbGlow.addColorStop(1, "transparent");
          ctx.fillStyle = usbGlow;
          ctx.beginPath();
          ctx.arc(usbX, usbY, 45, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(usbX, usbY, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // 4. Data packet laser streams pulsing from USB to keyboard deck
        if (Math.random() < 0.3) {
          packetBeams.push({
            progress: 0,
            speed: 0.04 + Math.random() * 0.03,
            startY: usbY + (Math.random() - 0.5) * 10
          });
        }

        ctx.strokeStyle = "rgba(0, 229, 255, 0.6)";
        ctx.lineWidth = 1.5;
        for (let pb = packetBeams.length - 1; pb >= 0; pb--) {
          const beam = packetBeams[pb];
          beam.progress += beam.speed;
          if (beam.progress >= 1) {
            packetBeams.splice(pb, 1);
            continue;
          }

          const curX = usbX + beam.progress * (drawW * 0.3);
          const curY = beam.startY - Math.sin(beam.progress * Math.PI) * 40;

          ctx.beginPath();
          ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#00e5ff";
          ctx.fill();
        }

        // 5. Dynamic Typing Terminal HUD (Top Left)
        const typedCmd = "./exploit_tunnel --inject-payload --bypass-ids".slice(
          0,
          Math.min(48, Math.floor(elapsed * 0.015))
        );
        ctx.font = "bold 13px 'Courier New', monospace";
        ctx.fillStyle = "rgba(0, 229, 255, 0.95)";
        ctx.fillText("OPERATOR: ROOT // CONSOLE: /dev/pts/2", 40, 50);
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.fillText("$ " + typedCmd + (Math.floor(elapsed / 250) % 2 === 0 ? "_" : ""), 40, 72);
        ctx.font = "11px 'Courier New', monospace";
        ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
        ctx.fillText("TRANSFER: 142.8 MB/s | PACKETS: 4,096/4,096 | AES-256", 40, 92);

        ctx.restore();
      }

      // =========================================================================
      // SCENE 2 (3.6s to 7.8s): Faceless Hooded Hacker - Dynamic Body Motion & Extraction
      // =========================================================================
      if (elapsed >= 3600 && elapsed < 8000) {
        ctx.save();
        if (elapsed < 4200) {
          ctx.globalAlpha = (elapsed - 3600) / 600;
        } else if (elapsed > 7300) {
          ctx.globalAlpha = 1 - (elapsed - 7300) / 700;
        }

        const sceneElapsed = elapsed - 3600;

        // --- DYNAMIC HUMAN BODY MOTION (Cử động cơ thể không lộ mặt) ---
        // 1. Natural breathing movement (Shoulders rise and fall)
        const breath = Math.sin(sceneElapsed * 0.0028);
        const shoulderY = breath * 4.5;
        const chestScaleX = 1 + breath * 0.006;
        const chestScaleY = 1 + breath * 0.008;

        // 2. Typing micro-recoil / arm tremor during fast code execution
        const isTypingBurst = Math.sin(sceneElapsed * 0.006) > -0.2;
        const typingJitterY = isTypingBurst ? (Math.random() - 0.5) * 1.6 : 0;
        const typingJitterX = isTypingBurst ? (Math.random() - 0.5) * 1.2 : 0;

        // 3. Head subtly tilting / scanning left and right monitors
        const headPanX = Math.sin(sceneElapsed * 0.0016) * 6;
        const headTiltY = Math.cos(sceneElapsed * 0.002) * 3;

        // 4. Smooth slow cinematic zoom
        const zoom = 1.0 + (sceneElapsed / 4400) * 0.06;
        const drawW = w * zoom * chestScaleX;
        const drawH = (w * (1080 / 1920)) * zoom * chestScaleY;
        const drawX = (w - drawW) * 0.5 - (sceneElapsed / 4400) * 30 + typingJitterX;
        const drawY = (h - drawH) * 0.45 + shoulderY + typingJitterY;

        // Draw photorealistic hooded hacker
        ctx.drawImage(silhouetteImg, drawX, drawY, drawW, drawH);

        // --- 100% FACELESS CONCEALMENT (Tuyệt đối không lộ mặt) ---
        // Under the hood cavity: Enforce pitch-black shadow void so NO facial features can ever be seen
        const faceCenterX = drawX + drawW * 0.485 + headPanX;
        const faceCenterY = drawY + drawH * 0.34 + headTiltY;
        const faceShadowW = 75 * zoom;
        const faceShadowH = 95 * zoom;

        const faceShadow = ctx.createRadialGradient(
          faceCenterX, faceCenterY, 5,
          faceCenterX, faceCenterY, faceShadowW
        );
        faceShadow.addColorStop(0, "#01040a");
        faceShadow.addColorStop(0.65, "#01050e");
        faceShadow.addColorStop(1, "rgba(2, 6, 18, 0)");

        ctx.fillStyle = faceShadow;
        ctx.beginPath();
        ctx.ellipse(faceCenterX, faceCenterY, faceShadowW, faceShadowH, 0, 0, Math.PI * 2);
        ctx.fill();

        // Subtle dark cyber anonymity visor / shadow line (100% anonymous)
        const visorGrad = ctx.createLinearGradient(faceCenterX - 35, 0, faceCenterX + 35, 0);
        visorGrad.addColorStop(0, "rgba(0, 229, 255, 0)");
        visorGrad.addColorStop(0.5, "rgba(0, 229, 255, 0.25)");
        visorGrad.addColorStop(1, "rgba(0, 229, 255, 0)");
        ctx.fillStyle = visorGrad;
        ctx.fillRect(faceCenterX - 35, faceCenterY - 4, 70, 3);

        // --- DYNAMIC SCREEN LIGHT REFLECTION ON HOODIE FABRIC ---
        // Screen lighting sweeps across the hacker's shoulders, creating realistic living depth
        const lightPulse = Math.sin(sceneElapsed * 0.005) * 0.5 + 0.5;
        const screenLightGrad = ctx.createRadialGradient(
          drawX + drawW * 0.48, drawY + drawH * 0.42, 40,
          drawX + drawW * 0.48, drawY + drawH * 0.42, 280
        );
        screenLightGrad.addColorStop(0, "rgba(0, 229, 255, " + (0.18 + 0.12 * lightPulse) + ")");
        screenLightGrad.addColorStop(0.6, "rgba(0, 132, 255, " + (0.08 + 0.06 * lightPulse) + ")");
        screenLightGrad.addColorStop(1, "transparent");

        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = screenLightGrad;
        ctx.beginPath();
        ctx.ellipse(drawX + drawW * 0.48, drawY + drawH * 0.44, 260, 160, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // --- ANIMATED TYPING HANDS AT DESK (Cử động đôi tay gõ phím) ---
        // Draw illuminated tactical hands and keyboard reflections at bottom-center
        const deskX = drawX + drawW * 0.44;
        const deskY = drawY + drawH * 0.68;
        const handTypingCycle = Math.sin(sceneElapsed * 0.035);

        // Left Hand Strike Motion
        const leftHandY = deskY + (handTypingCycle > 0 ? 3 : -2);
        const rightHandY = deskY + (handTypingCycle < 0 ? 3 : -2);

        // Tactical gloved hand silhouettes tapping keyboard
        ctx.fillStyle = "rgba(4, 10, 22, 0.95)";
        // Left hand
        ctx.beginPath();
        ctx.ellipse(deskX - 35, leftHandY, 26, 16, -0.2, 0, Math.PI * 2);
        ctx.fill();
        // Right hand
        ctx.beginPath();
        ctx.ellipse(deskX + 35, rightHandY, 26, 16, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Keycap glow under active typing hand
        if (Math.abs(handTypingCycle) > 0.4) {
          const activeHandX = handTypingCycle > 0 ? deskX - 35 : deskX + 35;
          const activeHandY = handTypingCycle > 0 ? leftHandY : rightHandY;
          ctx.fillStyle = "rgba(0, 229, 255, 0.5)";
          ctx.beginPath();
          ctx.arc(activeHandX, activeHandY + 12, 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // --- DYNAMIC DATA EXTRACTION HUD ON TERMINAL ---
        const monX = drawX + drawW * 0.41;
        const monY = drawY + drawH * 0.48;
        const progress = Math.min(100, Math.floor((sceneElapsed / 3800) * 100));

        const barW = 300 * zoom;
        const barH = 14 * zoom;
        ctx.fillStyle = "rgba(4, 20, 36, 0.92)";
        ctx.fillRect(monX, monY, barW, barH);
        ctx.strokeStyle = "rgba(0, 229, 255, 0.9)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(monX, monY, barW, barH);

        const fillW = (barW - 4) * (progress / 100);
        const barGrad = ctx.createLinearGradient(monX, 0, monX + barW, 0);
        barGrad.addColorStop(0, "#0084ff");
        barGrad.addColorStop(0.7, "#00e5ff");
        barGrad.addColorStop(1, "#38bdf8");
        ctx.fillStyle = barGrad;
        ctx.fillRect(monX + 2, monY + 2, fillW, barH - 4);

        // Progress text with blinking cursor
        ctx.font = "bold " + Math.floor(13 * zoom) + "px 'Courier New', monospace";
        ctx.fillStyle = "#00e5ff";
        const statusTxt = progress >= 100
          ? "[SUCCESS] DATA EXFILTRATION COMPLETE!"
          : "DATA EXTRACTION: " + progress + "% (" + (84.2 + (progress * 0.6)).toFixed(1) + " MB/s)";
        ctx.fillText(statusTxt, monX, monY - 8 * zoom);

        // Live Scrolling Terminal Code on Left Monitor
        const termX = drawX + drawW * 0.32;
        const termY = drawY + drawH * 0.28;
        ctx.font = Math.floor(10.5 * zoom) + "px 'Courier New', monospace";
        ctx.fillStyle = "rgba(56, 189, 248, 0.85)";
        for (let i = 0; i < 6; i++) {
          const logIdx = (i + Math.floor(sceneElapsed / 450)) % extractionCode.length;
          ctx.fillText(extractionCode[logIdx], termX, termY + i * 19 * zoom);
        }

        // Live Global Vector Nodes on Right Monitor
        const mapX = drawX + drawW * 0.82;
        const mapY = drawY + drawH * 0.35;
        const mapPulse = Math.sin(sceneElapsed * 0.01) * 0.5 + 0.5;
        ctx.fillStyle = "rgba(0, 229, 255, " + (0.5 + 0.5 * mapPulse) + ")";
        ctx.beginPath();
        ctx.arc(mapX, mapY, 5, 0, Math.PI * 2);
        ctx.fill();

        // CRT horizontal scanline
        const scanY = (sceneElapsed * 0.4) % h;
        ctx.fillStyle = "rgba(0, 229, 255, 0.12)";
        ctx.fillRect(0, scanY, w, 3);

        ctx.restore();

        // Flash transition to Scene 3
        if (elapsed > 7300) {
          const flashFade = (elapsed - 7300) / 700;
          const flashX = flashFade * w * 1.5;
          const flashGrad = ctx.createLinearGradient(flashX - 250, 0, flashX + 250, 0);
          flashGrad.addColorStop(0, "transparent");
          flashGrad.addColorStop(0.5, "rgba(0, 229, 255, " + (0.65 * (1 - flashFade)) + ")");
          flashGrad.addColorStop(1, "transparent");
          ctx.fillStyle = flashGrad;
          ctx.fillRect(0, 0, w, h);
        }
      }

      // =========================================================================
      // SCENE 3 (7.3s to 12.0s): Enterprise 3D Datacenter / High-Security Vault
      // =========================================================================
      if (elapsed >= 7300) {
        ctx.save();
        if (elapsed < 8000) {
          ctx.globalAlpha = (elapsed - 7300) / 700;
        }

        const scene3Elapsed = elapsed - 7300;
        const cameraSpeed = 160;
        const camZ = (scene3Elapsed * 0.001 * cameraSpeed) % TRACK_LEN;

        // 1. Dark Atmosphere & Horizon Glow
        const bgGrad = ctx.createRadialGradient(vpX, vpY, 0, vpX, vpY, w * 0.7);
        bgGrad.addColorStop(0, "#081b38");
        bgGrad.addColorStop(0.35, "#040e22");
        bgGrad.addColorStop(1, "#020612");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // 2. 3D Raised Anti-Static Floor
        ctx.fillStyle = "#01050f";
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(w, h);
        ctx.lineTo(vpX + 90, vpY + 50);
        ctx.lineTo(vpX - 90, vpY + 50);
        ctx.closePath();
        ctx.fill();

        // Floor Grid Lines
        ctx.strokeStyle = "rgba(0, 162, 255, 0.12)";
        ctx.lineWidth = 1;
        const floorTileSize = 180;
        const zOffset = camZ % floorTileSize;

        for (let z = 120 - zOffset; z < 2800; z += floorTileSize) {
          if (z <= 50) continue;
          const scale = fov / z;
          const sy = vpY + 160 * scale;
          if (sy > h || sy < vpY + 50) continue;
          const halfW = 280 * scale;
          ctx.beginPath();
          ctx.moveTo(vpX - halfW, sy);
          ctx.lineTo(vpX + halfW, sy);
          ctx.stroke();
        }

        for (let x = -280; x <= 280; x += 140) {
          const scaleNear = fov / 120;
          const scaleFar = fov / 2800;
          ctx.beginPath();
          ctx.moveTo(vpX + x * scaleNear, vpY + 160 * scaleNear);
          ctx.lineTo(vpX + x * scaleFar, vpY + 160 * scaleFar);
          ctx.stroke();
        }

        // Overhead Cable Trays
        for (const side of [-1, 1]) {
          ctx.strokeStyle = "rgba(0, 229, 255, 0.25)";
          ctx.lineWidth = 1.5;
          const scaleNear = fov / 120;
          const scaleFar = fov / 2600;
          ctx.beginPath();
          ctx.moveTo(vpX + side * 220 * scaleNear, vpY - 220 * scaleNear);
          ctx.lineTo(vpX + side * 220 * scaleFar, vpY - 220 * scaleFar);
          ctx.stroke();
        }

        // 3D Server Racks
        const racksToDraw = [];
        const aisleWidth = 260;
        const rackHeight = 440;

        for (let i = 0; i < NUM_RACKS * 2; i++) {
          const side = i < NUM_RACKS ? -1 : 1;
          const index = i % NUM_RACKS;
          let worldZ = index * RACK_SPACING - (camZ % RACK_SPACING);
          while (worldZ < 80) worldZ += TRACK_LEN;
          while (worldZ > TRACK_LEN + 80) worldZ -= TRACK_LEN;

          if (worldZ > 80 && worldZ < 2600) {
            racksToDraw.push({ side, worldZ, rackIndex: i });
          }
        }

        racksToDraw.sort((a, b) => b.worldZ - a.worldZ);

        for (const r of racksToDraw) {
          const { side, worldZ, rackIndex } = r;
          const scale = fov / worldZ;
          const nextScale = fov / (worldZ + RACK_SPACING * 0.95);

          const innerX = vpX + side * aisleWidth * scale;
          const topY = vpY - (rackHeight * 0.6) * scale;
          const bottomY = vpY + (rackHeight * 0.4) * scale;

          const nextInnerX = vpX + side * aisleWidth * nextScale;
          const nextTopY = vpY - (rackHeight * 0.6) * nextScale;
          const nextBottomY = vpY + (rackHeight * 0.4) * nextScale;

          const depthFade = Math.min(1, Math.max(0, 1 - (worldZ - 200) / 2200));

          ctx.fillStyle = "rgba(7, 14, 28, " + (0.95 * depthFade) + ")";
          ctx.strokeStyle = "rgba(0, 162, 255, " + (0.35 * depthFade) + ")";
          ctx.lineWidth = Math.max(1, 2 * scale);

          ctx.beginPath();
          ctx.moveTo(innerX, topY);
          ctx.lineTo(nextInnerX, nextTopY);
          ctx.lineTo(nextInnerX, nextBottomY);
          ctx.lineTo(innerX, bottomY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Server Blades & Blinking LEDs
          const units = racksData[rackIndex % racksData.length];
          const rackPixelHeight = bottomY - topY;
          let currentPixelY = topY;

          for (let u = 0; u < units.length; u++) {
            const unit = units[u];
            const unitHeight = (unit.uHeight / 42) * rackPixelHeight;
            const unitBottom = currentPixelY + unitHeight;

            ctx.strokeStyle = "rgba(0, 229, 255, " + (0.18 * depthFade) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(innerX, currentPixelY);
            ctx.lineTo(nextInnerX, nextTopY + (currentPixelY - topY) * (nextScale / scale));
            ctx.stroke();

            const numLeds = unit.leds.length;
            const ledSpacingY = unitHeight / (numLeds + 1);

            for (let l = 0; l < numLeds; l++) {
              const led = unit.leds[l];
              const ledY = currentPixelY + (l + 1) * ledSpacingY;
              const ledX = innerX + (nextInnerX - innerX) * 0.25;

              const blinkVal = Math.sin(scene3Elapsed * 0.001 * led.blinkSpeed + led.phase);
              const isOn = blinkVal > (1 - led.dutyCycle * 2);

              if (isOn && depthFade > 0.15) {
                let lr = 0, lg = 229, lb = 255;
                if (led.color === "blue") { lr = 0; lg = 132; lb = 255; }
                else if (led.color === "emerald") { lr = 16; lg = 185; lb = 129; }
                else if (led.color === "amber") { lr = 245; lg = 158; lb = 11; }

                const ledAlpha = depthFade * (0.6 + 0.4 * blinkVal);
                const ledRadius = Math.max(1, 2.2 * scale);
                const glowRadius = Math.max(3, 10 * scale);

                const ledGlow = ctx.createRadialGradient(ledX, ledY, 0, ledX, ledY, glowRadius);
                ledGlow.addColorStop(0, "rgba(" + lr + ", " + lg + ", " + lb + ", " + (ledAlpha * 0.8) + ")");
                ledGlow.addColorStop(0.4, "rgba(" + lr + ", " + lg + ", " + lb + ", " + (ledAlpha * 0.2) + ")");
                ledGlow.addColorStop(1, "transparent");
                ctx.fillStyle = ledGlow;
                ctx.beginPath();
                ctx.arc(ledX, ledY, glowRadius, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "rgba(255, 255, 255, " + ledAlpha + ")";
                ctx.beginPath();
                ctx.arc(ledX, ledY, ledRadius, 0, Math.PI * 2);
                ctx.fill();
              }
            }

            currentPixelY = unitBottom;
          }
        }

        ctx.restore();
      }

      // Bottom Dissolve Vignette (Ensures clean seamless blend with page background)
      const bottomVignette = ctx.createLinearGradient(0, h * 0.6, 0, h);
      bottomVignette.addColorStop(0, "rgba(2, 6, 18, 0)");
      bottomVignette.addColorStop(0.7, "rgba(2, 6, 18, 0.65)");
      bottomVignette.addColorStop(1, "rgba(2, 6, 18, 0.98)");
      ctx.fillStyle = bottomVignette;
      ctx.fillRect(0, h * 0.6, w, h * 0.4);

      if (elapsed < DURATION_MS) {
        requestAnimationFrame(draw);
      } else {
        recorder.stop();
      }
    }

    // Wait until images are loaded
    let loadedCount = 0;
    function checkLoaded() {
      loadedCount++;
      if (loadedCount >= 2) {
        requestAnimationFrame(draw);
      }
    }

    if (silhouetteImg.complete) checkLoaded();
    else silhouetteImg.onload = checkLoaded;

    if (handsImg.complete) checkLoaded();
    else handsImg.onload = checkLoaded;
  </script>
</body>
</html>
`;

async function main() {
  console.log("Launching Edge to render 3-shot Cinematic Hacker Action Video with genuine body & hand motion...");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 600, deviceScaleFactor: 1 });
  await page.setContent(htmlContent);

  console.log("Recording 12 seconds of 60FPS Faceless Hacker Action + Dynamic Body Motion + Typing + Datacenter video...");
  await page.waitForFunction(() => window.renderFinished === true, { timeout: 45000 });

  const base64Data = await page.evaluate(() => window.videoBase64);
  const buffer = Buffer.from(base64Data, "base64");

  fs.writeFileSync(OUTPUT_FILE, buffer);
  console.log("Video successfully rendered and saved to: " + OUTPUT_FILE + " (" + (buffer.length / 1024 / 1024).toFixed(2) + " MB)");

  await browser.close();
}

main().catch((err) => {
  console.error("Error rendering video:", err);
  process.exit(1);
});
