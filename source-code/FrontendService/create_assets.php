<?php
/**
 * Smartify Tech - Asset Generator for Cyberpunk Product Images & Badges
 */

$imgDir = __DIR__ . '/assets/images';
$prodDir = $imgDir . '/products';
$brandDir = $imgDir . '/brands';

if (!file_exists($imgDir)) mkdir($imgDir, 0777, true);
if (!file_exists($prodDir)) mkdir($prodDir, 0777, true);
if (!file_exists($brandDir)) mkdir($brandDir, 0777, true);

function generateCyberSVG($title, $type, $color1, $color2, $iconEmoji) {
    return '<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stop-color="'.$color1.'" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#0A0915" stop-opacity="1" />
    </radialGradient>
    <linearGradient id="cyberLine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="'.$color1.'" />
      <stop offset="100%" stop-color="'.$color2.'" />
    </linearGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="600" height="600" fill="#0E0D1F" rx="20"/>
  <rect width="600" height="600" fill="url(#bgGlow)" rx="20"/>
  
  <!-- Cyber Grid Pattern -->
  <path d="M0 100 H600 M0 200 H600 M0 300 H600 M0 400 H600 M0 500 H600" stroke="#1F1D3D" stroke-width="1" stroke-dasharray="4 8"/>
  <path d="M100 0 V600 M200 0 V600 M300 0 V600 M400 0 V600 M500 0 V600" stroke="#1F1D3D" stroke-width="1" stroke-dasharray="4 8"/>

  <!-- Tech Hexagon / HUD Frame -->
  <polygon points="300,90 470,190 470,390 300,490 130,390 130,190" stroke="url(#cyberLine)" stroke-width="2" fill="#14132B" fill-opacity="0.8" filter="url(#neonGlow)"/>
  <polygon points="300,110 450,200 450,380 300,470 150,380 150,200" stroke="'.$color2.'" stroke-width="1" stroke-dasharray="8 6" fill="none" opacity="0.6"/>

  <!-- Corner Tech Accents -->
  <path d="M 30 50 L 30 30 L 50 30" stroke="'.$color1.'" stroke-width="3" fill="none"/>
  <path d="M 570 50 L 570 30 L 550 30" stroke="'.$color1.'" stroke-width="3" fill="none"/>
  <path d="M 30 550 L 30 570 L 50 570" stroke="'.$color1.'" stroke-width="3" fill="none"/>
  <path d="M 570 550 L 570 570 L 550 570" stroke="'.$color1.'" stroke-width="3" fill="none"/>

  <!-- Central Visual Symbol / Emoji -->
  <text x="300" y="290" font-size="110" text-anchor="middle" dominant-baseline="middle">'.$iconEmoji.'</text>

  <!-- Cyber Badge Tag -->
  <rect x="200" y="340" width="200" height="32" rx="4" fill="#0A0915" stroke="url(#cyberLine)" stroke-width="1.5"/>
  <text x="300" y="361" font-family="Orbitron, Rajdhani, monospace" font-size="14" font-weight="900" fill="#00FF9D" letter-spacing="3" text-anchor="middle">'.$type.'</text>

  <!-- Title Text -->
  <text x="300" y="435" font-family="Orbitron, Rajdhani, sans-serif" font-size="20" font-weight="bold" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">'.htmlspecialchars($title).'</text>
  <text x="300" y="460" font-family="Rajdhani, sans-serif" font-size="14" fill="#94A3B8" text-anchor="middle" letter-spacing="2">SMARTIFY CERTIFIED GEAR // 2026 EDITION</text>

  <!-- Cyber HUD Elements -->
  <circle cx="300" cy="50" r="4" fill="'.$color1.'" filter="url(#neonGlow)"/>
  <text x="300" y="550" font-family="monospace" font-size="11" fill="'.$color2.'" text-anchor="middle" opacity="0.8">LOADOUT SYNC // SYSTEM READY // ID_SMT_'.rand(1000,9999).'</text>
</svg>';
}

$productSVGs = [
    'ps5-pro.png' => ['PS5 PRO CONSOLE', 'ULTRA 4K 120FPS', '#7C3AED', '#00F0FF', '🎮'],
    'rog-monitor.png' => ['ROG SWIFT OLED 240Hz', '0.03ms HDR10', '#EC4899', '#7C3AED', '🖥️'],
    'razer-deathadder.png' => ['DEATHADDER V3 PRO', '30K DPI 63g', '#00FF9D', '#00F0FF', '🖱️'],
    'arctis-nova-pro.png' => ['ARCTIS NOVA PRO', 'HI-RES DUAL WIRELESS', '#00F0FF', '#7C3AED', '🎧'],
    'anker-prime.png' => ['ANKER PRIME 250W', '27,650mAh SMART', '#F59E0B', '#00FF9D', '⚡'],
    'sony-wh1000xm5.png' => ['SONY WH-1000XM5', 'AUTO ANC HI-RES', '#8B5CF6', '#38BDF8', '🎧'],
    'logitech-g915.png' => ['LOGITECH G915 TKL', 'LIGHTSPEED RGB', '#00F0FF', '#A855F7', '⌨️'],
    'apple-watch-ultra.png' => ['APPLE WATCH ULTRA 2', 'TITANIUM 3000 NITS', '#F97316', '#F43F5E', '⌚'],
    'jbl-quantum-910.png' => ['JBL QUANTUM 910', 'SPHERE 360 HEAD TRACK', '#06B6D4', '#EC4899', '🎧'],
    'rog-carnyx-mic.png' => ['ROG CARNYX STUDIO', '192kHz/24-bit RGB', '#FF0055', '#7C3AED', '🎙️'],
    'baseus-blade.png' => ['BASEUS BLADE 100W', '18mm SLIM 20000mAh', '#3B82F6', '#00FF9D', '⚡'],
    'samsung-buds3-pro.png' => ['GALAXY BUDS3 PRO', 'GALAXY AI HI-FI', '#6366F1', '#00F0FF', '🎵']
];

foreach ($productSVGs as $file => $info) {
    // Generate both .svg and .png named SVG files (browsers render svg directly even if named png or we save as svg)
    $svg = generateCyberSVG($info[0], $info[1], $info[2], $info[3], $info[4]);
    file_put_contents($prodDir . '/' . $file, $svg);
    // Also save with .svg extension
    $svgName = preg_replace('/\.png$/', '.svg', $file);
    file_put_contents($prodDir . '/' . $svgName, $svg);
}

// Category Banners
$categorySVGs = [
    'cat-gaming.jpg' => ['GAMING RIGS & CONSOLES', 'NEXT-GEN ARENA', '#7C3AED', '#00F0FF', '🎮'],
    'cat-audio.jpg' => ['AUDIO & PRO HEADSETS', 'ALMIGHTY SOUND', '#EC4899', '#7C3AED', '🎧'],
    'cat-gear.jpg' => ['PC GEAR & KEYBOARDS', 'TACTICAL CONTROL', '#00FF9D', '#00F0FF', '⌨️'],
    'cat-phones.jpg' => ['PHONES & WEARABLES', 'CYBER COMPANIONS', '#F97316', '#7C3AED', '📱'],
    'cat-power.jpg' => ['POWER & CHARGING', '250W FAST JUICE', '#F59E0B', '#00FF9D', '⚡'],
    'cat-streaming.jpg' => ['STREAMING & CREATOR', 'BROADCAST READY', '#FF0055', '#06B6D4', '🎙️']
];

foreach ($categorySVGs as $file => $info) {
    $svg = generateCyberSVG($info[0], $info[1], $info[2], $info[3], $info[4]);
    file_put_contents($imgDir . '/' . $file, $svg);
    $svgName = preg_replace('/\.jpg$/', '.svg', $file);
    file_put_contents($imgDir . '/' . $svgName, $svg);
}

echo "Created all cyber graphics successfully!\n";
