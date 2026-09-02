<?php
/**
 * Smartify Tech - Homepage (Game Start)
 */

$pageTitle = 'SMARTIFY TECH — Level Up Your Game | Gamified Tech Arena';
require_once __DIR__ . '/includes/header.php';

// Fetch Flash Deals (products where is_flash_deal = 1)
$stmtFlash = $pdo->query("
    SELECT p.*, b.name as brand_name, c.name as category_name 
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_flash_deal = 1
    ORDER BY p.id ASC
    LIMIT 4
");
$flashDeals = $stmtFlash->fetchAll();

// Fetch Categories
$stmtCats = $pdo->query("
    SELECT c.*, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id
    ORDER BY c.id ASC
");
$categories = $stmtCats->fetchAll();

// Fetch Trending / Hot Gear
$stmtTrending = $pdo->query("
    SELECT p.*, b.name as brand_name, c.name as category_name 
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.rating DESC, p.reviews_count DESC
    LIMIT 8
");
$trendingProducts = $stmtTrending->fetchAll();
?>

<!-- SYSTEM ONLINE INTRO MODAL (First Visit / On-Demand) -->
<div id="systemIntroModal" class="intro-modal-overlay">
    <div class="intro-modal-box">
        <div style="font-size: 3rem; margin-bottom: 15px;">⚡</div>
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; color: #fff; margin-bottom: 15px; letter-spacing: 1.5px;">
            SMARTIFY TECH <span style="color: var(--cyan-neon);">SYSTEM ONLINE</span>
        </h2>
        <div id="introTerminalOutput" style="background: #080712; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 16px; font-family: var(--font-mono); font-size: 0.85rem; color: var(--emerald-xp); text-align: left; min-height: 120px; margin-bottom: 25px; line-height: 1.6;">
            <div>> SMARTIFY CORE v2.6 ACTIVE</div>
            <div>> CHECKING ARENA STATUS... 100% OK</div>
        </div>
        <div style="display: flex; gap: 12px; justify-content: center;">
            <button type="button" id="btnStartMission" class="btn-cyber btn-cyber-cyan" style="font-size: 0.95rem;">
                🎮 START SHOPPING (GAME START)
            </button>
            <button type="button" id="btnSkipIntro" class="btn-cyber-outline btn-sm" style="font-size: 0.8rem; border-radius: 4px; padding: 10px 18px;">
                SKIP INTRO
            </button>
        </div>
    </div>
</div>

<main>
    <!-- 1. HERO SECTION: "LEVEL UP YOUR GAME" -->
    <section class="hero-section">
        <div class="container">
            <div class="hero-grid">
                <!-- Left Hero Content -->
                <div class="hero-content">
                    <div class="hero-tag">
                        <span class="pulse-dot"></span>
                        <span>SMARTIFY QUEST ECOSYSTEM ACTIVE</span>
                    </div>
                    <h1 class="hero-title">
                        LEVEL UP <br>
                        YOUR <span class="glow-purple">GAME</span> &amp; <br>
                        YOUR <span class="glow-cyan">TECH</span>
                    </h1>
                    <p class="hero-desc">
                        Explore Sri Lanka's most advanced gaming hardware arsenal. Build your dream loadout, earn XP with every piece of gear, and unlock elite tier discounts.
                    </p>
                    <div class="hero-actions">
                        <a href="shop.php" class="btn-cyber" id="btnHeroEnterArena">
                            🎮 ENTER THE ARENA
                        </a>
                        <a href="#flash-deals-section" class="btn-cyber btn-cyber-outline">
                            ⚡ EXPLORE DEALS
                        </a>
                    </div>
                    
                    <!-- Stats Counter Row -->
                    <div class="hero-stats-row">
                        <div class="hero-stat-item">
                            <h4>100%</h4>
                            <p>GENUINE AGENT WARRANTY</p>
                        </div>
                        <div class="hero-stat-item">
                            <h4>+50 XP</h4>
                            <p>PER LOADOUT ITEM</p>
                        </div>
                        <div class="hero-stat-item">
                            <h4>24-72h</h4>
                            <p>ISLANDWIDE DELIVERY</p>
                        </div>
                    </div>
                </div>

                <!-- Right Hero Visual Card -->
                <div class="hero-visual">
                    <div class="hero-main-card">
                        <div class="hero-card-header">
                            <span class="badge-tech badge-discount">🔥 FEATURED DROP</span>
                            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--emerald-xp);">+350 XP REWARD</span>
                        </div>
                        <img src="assets/images/products/ps5-pro.png" alt="PS5 Pro Console" class="hero-card-img">
                        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">SONY PLAYSTATION</span>
                            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--amber-gold);">★ 5.0 (38 Reviews)</span>
                        </div>
                        <h3 style="font-family: var(--font-subhead); font-size: 1.3rem; font-weight: 800; color: #fff; margin-bottom: 12px;">
                            PlayStation 5 Pro 2TB (PSSR 4K 120Hz)
                        </h3>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span class="price-current"><?= formatLKR(239990) ?></span>
                                <span class="price-old" style="margin-left: 8px;"><?= formatLKR(259990) ?></span>
                            </div>
                            <button type="button" class="btn-cyber btn-sm btn-add-loadout" data-product-id="1" data-product-title="PlayStation 5 Pro 2TB">
                                🛒 ADD TO LOADOUT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 2. FLASH DEALS WITH REAL-TIME COUNTDOWN TIMER -->
    <section id="flash-deals-section" class="section-wrap" style="background: #0c0b1c; border-bottom: 1px solid var(--border-subtle);">
        <div class="container">
            <div class="section-header">
                <div class="section-title-wrap">
                    <span class="section-tag">LIMITED TIME MISSION DROPS</span>
                    <h2 class="section-title">⚡ FLASH DEALS ARSENAL</h2>
                </div>
                
                <!-- Live Real-Time Countdown Timer -->
                <div class="flash-timer-box">
                    <span class="flash-timer-label">MISSION ENDS IN:</span>
                    <div class="countdown-digits">
                        <span class="digit-segment" id="flashHours">02</span> :
                        <span class="digit-segment" id="flashMins">14</span> :
                        <span class="digit-segment" id="flashSecs">36</span>
                    </div>
                </div>
            </div>

            <!-- Flash Product Grid -->
            <div class="product-grid">
                <?php foreach ($flashDeals as $item): ?>
                    <?php 
                        $discountPct = ($item['discount_price'] && $item['price'] > $item['discount_price']) 
                            ? round((($item['price'] - $item['discount_price']) / $item['price']) * 100) 
                            : 0;
                        $displayPrice = ($item['discount_price'] > 0) ? $item['discount_price'] : $item['price'];
                    ?>
                    <div class="product-card">
                        <div class="product-card-thumb">
                            <div class="product-card-badges">
                                <?php if ($discountPct > 0): ?>
                                    <span class="badge-tech badge-discount">-<?= $discountPct ?>% OFF</span>
                                <?php endif; ?>
                                <span class="badge-tech badge-stock">IN STOCK</span>
                            </div>
                            <span class="product-card-xp-badge">+50 XP</span>
                            <a href="product.php?id=<?= $item['id'] ?>">
                                <img src="<?= htmlspecialchars($item['image_main']) ?>" alt="<?= htmlspecialchars($item['title']) ?>">
                            </a>
                        </div>
                        <div class="product-card-body">
                            <div class="product-card-meta">
                                <span><?= htmlspecialchars($item['brand_name'] ?? 'SMARTIFY') ?></span>
                                <span class="product-rating">★ <?= number_format($item['rating'], 1) ?></span>
                            </div>
                            <h3 class="product-card-title">
                                <a href="product.php?id=<?= $item['id'] ?>"><?= htmlspecialchars($item['title']) ?></a>
                            </h3>
                            <div class="product-price-row">
                                <span class="price-current"><?= formatLKR($displayPrice) ?></span>
                                <?php if ($item['discount_price'] > 0): ?>
                                    <span class="price-old"><?= formatLKR($item['price']) ?></span>
                                <?php endif; ?>
                            </div>
                            <div class="product-card-action">
                                <button type="button" class="btn-add-loadout" data-product-id="<?= $item['id'] ?>" data-product-title="<?= htmlspecialchars($item['title']) ?>">
                                    🎮 ADD TO LOADOUT
                                </button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- 3. CATEGORIES MATRIX GRID -->
    <section class="section-wrap">
        <div class="container">
            <div class="section-header">
                <div class="section-title-wrap">
                    <span class="section-tag">TACTICAL GEAR SECTORS</span>
                    <h2 class="section-title">🗺️ EXPLORE ARENA CATEGORIES</h2>
                </div>
                <a href="shop.php" class="btn-cyber-outline btn-sm">VIEW ALL (12+ ITEMS) →</a>
            </div>

            <div class="category-matrix">
                <?php foreach ($categories as $cat): ?>
                    <a href="shop.php?cat=<?= urlencode($cat['slug']) ?>" class="category-card">
                        <div class="category-card-icon"><?= $cat['icon_svg'] ?></div>
                        <div class="category-card-name"><?= htmlspecialchars($cat['name']) ?></div>
                        <span class="category-card-badge"><?= $cat['product_count'] ?> Products Available</span>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- 4. TOP GEAR / TRENDING LOADOUTS -->
    <section class="section-wrap" style="background: #090815; border-top: 1px solid var(--border-subtle);">
        <div class="container">
            <div class="section-header">
                <div class="section-title-wrap">
                    <span class="section-tag">COMMUNITY FAVORITES</span>
                    <h2 class="section-title">🏆 TOP RATED HARDWARE</h2>
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon);">
                    DEPLOYED BY 1,200+ PLAYERS IN SRI LANKA
                </div>
            </div>

            <div class="product-grid">
                <?php foreach ($trendingProducts as $item): ?>
                    <?php 
                        $discountPct = ($item['discount_price'] && $item['price'] > $item['discount_price']) 
                            ? round((($item['price'] - $item['discount_price']) / $item['price']) * 100) 
                            : 0;
                        $displayPrice = ($item['discount_price'] > 0) ? $item['discount_price'] : $item['price'];
                    ?>
                    <div class="product-card">
                        <div class="product-card-thumb">
                            <div class="product-card-badges">
                                <?php if ($discountPct > 0): ?>
                                    <span class="badge-tech badge-discount">-<?= $discountPct ?>%</span>
                                <?php endif; ?>
                                <span class="badge-tech badge-stock">IN STOCK</span>
                            </div>
                            <span class="product-card-xp-badge">+50 XP</span>
                            <a href="product.php?id=<?= $item['id'] ?>">
                                <img src="<?= htmlspecialchars($item['image_main']) ?>" alt="<?= htmlspecialchars($item['title']) ?>">
                            </a>
                        </div>
                        <div class="product-card-body">
                            <div class="product-card-meta">
                                <span><?= htmlspecialchars($item['brand_name'] ?? 'SMARTIFY') ?></span>
                                <span class="product-rating">★ <?= number_format($item['rating'], 1) ?> (<?= $item['reviews_count'] ?>)</span>
                            </div>
                            <h3 class="product-card-title">
                                <a href="product.php?id=<?= $item['id'] ?>"><?= htmlspecialchars($item['title']) ?></a>
                            </h3>
                            <div class="product-price-row">
                                <span class="price-current"><?= formatLKR($displayPrice) ?></span>
                                <?php if ($item['discount_price'] > 0): ?>
                                    <span class="price-old"><?= formatLKR($item['price']) ?></span>
                                <?php endif; ?>
                            </div>
                            <div class="product-card-action">
                                <button type="button" class="btn-add-loadout" data-product-id="<?= $item['id'] ?>" data-product-title="<?= htmlspecialchars($item['title']) ?>">
                                    🎮 ADD TO LOADOUT
                                </button>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>

    <!-- 5. SMARTIFY QUEST RPG SHOPPING JOURNEY -->
    <section class="section-wrap quest-flow-section">
        <div class="container">
            <div style="text-align: center; max-width: 650px; margin: 0 auto 45px;">
                <span class="section-tag">GAMIFIED SHOPPING PROTOCOL</span>
                <h2 class="section-title" style="margin-top: 5px;">HOW THE SMARTIFY QUEST WORKS</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 10px;">
                    Every action in our store builds your gamer profile. Level up from Tech Rookie to Smartify Legend and unlock lifetime hardware perks.
                </p>
            </div>

            <div class="quest-steps-grid">
                <div class="quest-step-card">
                    <div class="quest-step-num">STEP 01 // DEPLOY</div>
                    <h3 class="quest-step-title">🎒 BUILD LOADOUT</h3>
                    <p class="quest-step-desc">
                        Select your favorite gaming gear, headsets, monitors, or charging bricks. Earn +50 XP per item added.
                    </p>
                </div>

                <div class="quest-step-card">
                    <div class="quest-step-num">STEP 02 // ENGAGE</div>
                    <h3 class="quest-step-title">⚔️ CHECKOUT QUEST</h3>
                    <p class="quest-step-desc">
                        Fast, secure 4-step checkout. Choose Koko 3-month installments, Visa/Mastercard, or Cash on Delivery.
                    </p>
                </div>

                <div class="quest-step-card">
                    <div class="quest-step-num">STEP 03 // TRACK</div>
                    <h3 class="quest-step-title">🚚 DELIVERY MISSION</h3>
                    <p class="quest-step-desc">
                        Watch your gear progress in real-time on our interactive delivery timeline from our tech armory to your doorstep.
                    </p>
                </div>

                <div class="quest-step-card">
                    <div class="quest-step-num">STEP 04 // REWARD</div>
                    <h3 class="quest-step-title">🏆 LEVEL UP &amp; XP</h3>
                    <p class="quest-step-desc">
                        Mission completion awards up to +350 XP. Level up your Smartify ID and earn permanent VIP discounts up to 12%.
                    </p>
                </div>
            </div>
        </div>
    </section>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
