<?php
/**
 * Smartify Tech - Header Navigation & Player HUD
 */

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/gamification.php';

// Calculate cart count & total
$loadoutItemCount = 0;
$loadoutTotalPrice = 0.0;
if (isset($_SESSION['loadout']) && is_array($_SESSION['loadout'])) {
    foreach ($_SESSION['loadout'] as $item) {
        $qty = (int)($item['qty'] ?? 1);
        $loadoutItemCount += $qty;
        $loadoutTotalPrice += ((float)$item['price']) * $qty;
    }
}

// Fetch active player profile for HUD
$currentUserId = getCurrentUserId();
$playerProfile = getPlayerProfile($pdo, $currentUserId);
$flash = getFlash();

$pageTitle = $pageTitle ?? 'SMARTIFY TECH — Gamified Tech & Gaming Arena';
$activePage = basename($_SERVER['PHP_SELF'] ?? '');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle) ?></title>
    
    <!-- Meta & OpenGraph -->
    <meta name="description" content="Smartify Tech is Sri Lanka's ultimate gamified tech and gaming gear store. Shop consoles, monitors, pro headsets, and fast charging gear while earning XP and unlocking level rewards.">
    <meta name="theme-color" content="#0A0915">

    <!-- CSS Design System -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

    <!-- 1. TOP BAR WITH TRUST BADGES & AUDIO SFX -->
    <div class="top-bar">
        <div class="container">
            <div class="top-badges">
                <div class="top-badge-item">
                    <span class="icon">🚚</span> <strong>FAST ISLANDWIDE DELIVERY</strong> (1-3 Days)
                </div>
                <div class="top-badge-item">
                    <span class="icon">🛡️</span> <strong>100% GENUINE</strong> Certified Hardware
                </div>
                <div class="top-badge-item">
                    <span class="icon">👑</span> <strong>TRUSTED STORE</strong> (Est. 2023)
                </div>
            </div>
            <div class="top-bar-right">
                <button type="button" id="audioToggleBtn" class="audio-toggle-btn" title="Toggle Cyber Sound Effects">
                    🔊 SFX ON
                </button>
                <?php if (isAdmin()): ?>
                    <a href="admin/index.php" style="color: var(--hot-pink); font-weight: bold; font-size: 0.75rem; font-family: var(--font-mono);">
                        👑 ADMIN PANEL
                    </a>
                <?php endif; ?>
                <?php if (isLoggedIn()): ?>
                    <a href="auth.php?action=logout" style="color: var(--text-dim); font-size: 0.75rem; font-family: var(--font-mono);">
                        LOGOUT
                    </a>
                <?php else: ?>
                    <a href="auth.php?action=login" style="color: var(--cyan-neon); font-size: 0.75rem; font-family: var(--font-mono);">
                        ⚡ PLAYER LOGIN
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <!-- 2. MAIN HEADER & HUD -->
    <header class="main-header">
        <div class="container header-container">
            <!-- Brand Logo -->
            <a href="index.php" class="brand-logo" id="headerLogo">
                <div class="brand-logo-icon">⚡</div>
                <div>
                    <div class="brand-title">SMARTIFY<span>TECH</span></div>
                    <span class="brand-subtitle">LEVEL UP YOUR GAME</span>
                </div>
            </a>

            <!-- Search Form -->
            <form action="shop.php" method="GET" class="search-form" id="globalSearchForm">
                <div class="search-input-wrap">
                    <input type="text" name="q" class="search-input" placeholder="Search gear, PS5 Pro, OLED, Razer, Keyboards..." value="<?= htmlspecialchars($_GET['q'] ?? '') ?>" autocomplete="off">
                    <button type="submit" class="search-btn" title="Search Arena">🔍</button>
                </div>
            </form>

            <!-- Player HUD & Loadout Cart -->
            <div class="header-actions">
                <!-- Smartify ID Card Button -->
                <a href="profile.php" class="player-hud-card" id="navPlayerHud">
                    <div class="player-avatar-badge">
                        <?= $playerProfile['tier_info']['icon'] ?? '🎮' ?>
                    </div>
                    <div class="player-info-meta">
                        <span class="player-level-badge">LVL 0<?= $playerProfile['level'] ?> // <?= htmlspecialchars($playerProfile['title']) ?></span>
                        <span class="player-name-text"><?= htmlspecialchars($playerProfile['name']) ?></span>
                        <span class="player-xp-mini">⚡ <?= number_format($playerProfile['xp']) ?> XP</span>
                    </div>
                </a>

                <!-- Loadout Cart -->
                <a href="cart.php" class="loadout-btn" id="navLoadoutBtn">
                    <span>🎒 LOADOUT</span>
                    <span class="loadout-counter-badge"><?= $loadoutItemCount ?></span>
                </a>
            </div>
        </div>

        <!-- 3. CATEGORY NAVIGATION BAR -->
        <nav class="category-nav-bar" aria-label="Game Categories">
            <div class="container">
                <ul class="category-nav-list">
                    <li class="category-nav-item <?= ($activePage === 'shop.php' && !isset($_GET['cat']) && !isset($_GET['flash'])) ? 'active' : '' ?>">
                        <a href="shop.php">⚡ ALL ARENA GEAR</a>
                    </li>
                    <li class="category-nav-item highlight <?= (isset($_GET['flash'])) ? 'active' : '' ?>">
                        <a href="shop.php?flash=1">🔥 FLASH DEALS</a>
                    </li>
                    <li class="category-nav-item <?= (isset($_GET['cat']) && $_GET['cat'] === 'gaming-consoles') ? 'active' : '' ?>">
                        <a href="shop.php?cat=gaming-consoles">🎮 Consoles & Rigs</a>
                    </li>
                    <li class="category-nav-item <?= (isset($_GET['cat']) && $_GET['cat'] === 'gaming-gear') ? 'active' : '' ?>">
                        <a href="shop.php?cat=gaming-gear">⌨️ PC Gear & Mice</a>
                    </li>
                    <li class="category-nav-item <?= (isset($_GET['cat']) && $_GET['cat'] === 'audio-headsets') ? 'active' : '' ?>">
                        <a href="shop.php?cat=audio-headsets">🎧 Pro Audio</a>
                    </li>
                    <li class="category-nav-item <?= (isset($_GET['cat']) && $_GET['cat'] === 'power-charging') ? 'active' : '' ?>">
                        <a href="shop.php?cat=power-charging">⚡ Fast Power</a>
                    </li>
                    <li class="category-nav-item <?= (isset($_GET['cat']) && $_GET['cat'] === 'phones-gadgets') ? 'active' : '' ?>">
                        <a href="shop.php?cat=phones-gadgets">📱 Smart Wearables</a>
                    </li>
                    <li class="category-nav-item <?= (isset($_GET['cat']) && $_GET['cat'] === 'streaming-creator') ? 'active' : '' ?>">
                        <a href="shop.php?cat=streaming-creator">🎙️ Streaming Tech</a>
                    </li>
                    <li class="category-nav-item <?= ($activePage === 'order-tracking.php') ? 'active' : '' ?>">
                        <a href="order-tracking.php">📦 Track Mission</a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>

    <!-- FLASH MESSAGE BANNER -->
    <?php if ($flash): ?>
        <div class="container" style="margin-top: 15px;">
            <div style="background: <?= ($flash['type'] === 'success') ? 'rgba(0, 255, 157, 0.15)' : 'rgba(255, 0, 85, 0.15)' ?>; border: 1px solid <?= ($flash['type'] === 'success') ? 'var(--emerald-xp)' : 'var(--hot-pink)' ?>; color: #fff; padding: 12px 20px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between;">
                <span><?= htmlspecialchars($flash['message']) ?></span>
                <span style="cursor: pointer;" onclick="this.parentElement.parentElement.remove();">✖</span>
            </div>
        </div>
    <?php endif; ?>
