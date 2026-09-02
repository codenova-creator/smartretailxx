<?php
/**
 * Smartify Tech - Product Detail Page ("Select Your Gear")
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/gamification.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 1;

// Fetch product details
$stmt = $pdo->prepare("
    SELECT p.*, b.name as brand_name, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
");
$stmt->execute([$id]);
$product = $stmt->fetch();

if (!$product) {
    header('Location: shop.php');
    exit;
}

$specs = json_decode($product['specifications'] ?? '[]', true) ?: [];
$displayPrice = ($product['discount_price'] > 0) ? $product['discount_price'] : $product['price'];
$savings = ($product['discount_price'] > 0) ? ($product['price'] - $product['discount_price']) : 0;
$kokoInstallment = round($displayPrice / 3);

// Fetch Related / Synergy Products
$stmtRelated = $pdo->prepare("
    SELECT p.*, b.name as brand_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE p.category_id = ? AND p.id != ?
    LIMIT 4
");
$stmtRelated->execute([$product['category_id'], $product['id']]);
$relatedProducts = $stmtRelated->fetchAll();

// Handle Review Submission (Awards +25 XP)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_review'])) {
    if (isLoggedIn()) {
        addPlayerXP($pdo, getCurrentUserId(), 25, "Intel Review Submitted: " . $product['title']);
        setFlash('success', '🏆 Combat Intel Review Logged! +25 XP Added to your Smartify ID.');
    } else {
        setFlash('success', '⚡ Review received! Log in to claim +25 XP.');
    }
    header("Location: product.php?id=$id#reviews");
    exit;
}

$pageTitle = htmlspecialchars($product['title']) . ' — Smartify Tech Gear';
require_once __DIR__ . '/includes/header.php';
?>

<main class="container" style="padding: 40px 20px 80px;">
    <!-- Breadcrumb -->
    <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-dim); margin-bottom: 25px; display: flex; gap: 8px; align-items: center;">
        <a href="index.php" style="color: var(--text-muted);">ARENA</a>
        <span>/</span>
        <a href="shop.php?cat=<?= urlencode($product['category_slug'] ?? '') ?>" style="color: var(--text-muted);"><?= strtoupper(htmlspecialchars($product['category_name'] ?? 'GEAR')) ?></a>
        <span>/</span>
        <span style="color: var(--cyan-neon);"><?= htmlspecialchars($product['brand_name'] ?? 'SMARTIFY') ?></span>
    </div>

    <!-- Product Main Grid -->
    <div class="product-detail-grid">
        <!-- Left: Image Gallery & Hologram Frame -->
        <div class="product-gallery-box">
            <div style="position: relative;">
                <span class="product-card-xp-badge" style="top: 15px; right: 15px; font-size: 0.8rem; padding: 4px 10px;">+50 XP WHEN ACQUIRED</span>
                <img src="<?= htmlspecialchars($product['image_main']) ?>" alt="<?= htmlspecialchars($product['title']) ?>" class="gallery-main-img" id="mainGearImage">
            </div>
            <!-- Security & Warranty Badges -->
            <div style="display: flex; gap: 12px; margin-top: 15px; justify-content: center; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
                <span style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 6px 12px; border-radius: 4px;">🛡️ 1 YEAR WARRANTY</span>
                <span style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 6px 12px; border-radius: 4px;">🚚 24-72h DISPATCH</span>
                <span style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 6px 12px; border-radius: 4px;">🔒 100% GENUINE</span>
            </div>
        </div>

        <!-- Right: Gear Intel & Actions -->
        <div>
            <div class="product-info-meta-top">
                <span class="badge-tech badge-stock">⚡ IN STOCK (<?= $product['stock'] ?> READY TO DEPLOY)</span>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--amber-gold);">★ <?= number_format($product['rating'], 1) ?> (<?= $product['reviews_count'] ?> Verified Reviews)</span>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon);">BRAND: <?= htmlspecialchars($product['brand_name'] ?? 'SMARTIFY') ?></span>
            </div>

            <h1 class="product-detail-title"><?= htmlspecialchars($product['title']) ?></h1>

            <!-- Price Breakdown -->
            <div style="display: flex; align-items: baseline; gap: 15px; margin-bottom: 12px;">
                <span class="price-current" style="font-size: 2.2rem;"><?= formatLKR($displayPrice) ?></span>
                <?php if ($savings > 0): ?>
                    <span class="price-old" style="font-size: 1.2rem;"><?= formatLKR($product['price']) ?></span>
                    <span class="badge-tech badge-discount">SAVE <?= formatLKR($savings) ?></span>
                <?php endif; ?>
            </div>

            <!-- Koko 3-Month Installment Banner -->
            <div class="koko-installment-pill">
                <span>⚡ <strong>KOKO 3-PAY:</strong> Pay 3 installments of <strong><?= formatLKR($kokoInstallment) ?></strong> with Debit/Credit card (0% Interest).</span>
            </div>

            <!-- Product Description -->
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.7; margin-bottom: 25px;">
                <?= nl2br(htmlspecialchars($product['description'])) ?>
            </p>

            <!-- Tech Spec Matrix Pills -->
            <?php if (!empty($specs)): ?>
                <div style="margin-bottom: 25px;">
                    <h4 style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon); letter-spacing: 1px; margin-bottom: 12px;">TACTICAL SPECIFICATIONS</h4>
                    <div class="spec-pills-grid">
                        <?php foreach ($specs as $key => $val): ?>
                            <div class="spec-pill-item">
                                <span class="spec-pill-key"><?= htmlspecialchars($key) ?></span>
                                <div class="spec-pill-val"><?= htmlspecialchars($val) ?></div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Action Row: Quantity & Add to Loadout -->
            <div class="detail-actions-row">
                <div class="qty-control-box">
                    <button type="button" class="qty-btn" onclick="let input=document.getElementById('detailQtyInput'); if(parseInt(input.value)>1) input.value=parseInt(input.value)-1;">-</button>
                    <input type="number" id="detailQtyInput" class="qty-input" value="1" min="1" max="<?= max(1, $product['stock']) ?>">
                    <button type="button" class="qty-btn" onclick="let input=document.getElementById('detailQtyInput'); input.value=parseInt(input.value)+1;">+</button>
                </div>

                <button type="button" class="btn-cyber btn-add-detail-loadout" style="flex: 1; font-size: 1rem; padding: 14px 28px;" data-product-id="<?= $product['id'] ?>" data-product-title="<?= htmlspecialchars($product['title']) ?>">
                    🎮 ADD TO LOADOUT (+50 XP)
                </button>

                <a href="cart.php?action=buy_now&id=<?= $product['id'] ?>" class="btn-cyber btn-cyber-cyan" style="font-size: 1rem; padding: 14px 24px;">
                    ⚡ BUY NOW
                </a>
            </div>

            <!-- Perks Summary Box -->
            <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 16px; font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>📦 <strong>Islandwide Delivery:</strong> 1-3 Business Days</div>
                <div>🛡️ <strong>Replacement:</strong> 7 Days Return Protocol</div>
                <div>⚡ <strong>Smartify Care:</strong> Dedicated 24/7 Tech Squad</div>
                <div>🏆 <strong>Quest Points:</strong> Earn +50 XP immediately</div>
            </div>
        </div>
    </div>

    <!-- Related Gear / Synergy Section -->
    <?php if (!empty($relatedProducts)): ?>
        <section style="margin-top: 70px; border-top: 1px solid var(--border-subtle); padding-top: 50px;">
            <div class="section-header">
                <div class="section-title-wrap">
                    <span class="section-tag">COMPATIBLE ARSENAL</span>
                    <h2 class="section-title">🎒 LOADOUT SYNERGY GEAR</h2>
                </div>
            </div>
            <div class="product-grid">
                <?php foreach ($relatedProducts as $item): ?>
                    <?php $dPrice = ($item['discount_price'] > 0) ? $item['discount_price'] : $item['price']; ?>
                    <div class="product-card">
                        <div class="product-card-thumb">
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
                                <span class="price-current"><?= formatLKR($dPrice) ?></span>
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
        </section>
    <?php endif; ?>

    <!-- Customer Reviews & Feedback Section -->
    <section id="reviews" style="margin-top: 70px; border-top: 1px solid var(--border-subtle); padding-top: 50px;">
        <div class="section-header">
            <div class="section-title-wrap">
                <span class="section-tag">FIELD INTEL &amp; BENCHMARKS</span>
                <h2 class="section-title">⭐ PLAYER REVIEWS</h2>
            </div>
            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--emerald-xp);">
                SUBMIT INTEL &amp; EARN +25 XP
            </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; align-items: start;">
            <!-- Review Submission Form -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 24px;">
                <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: #fff; margin-bottom: 15px;">
                    📝 LOG HARDWARE REVIEW
                </h3>
                <form action="product.php?id=<?= $product['id'] ?>" method="POST">
                    <div class="form-group">
                        <label class="form-label">Player Name / Codename</label>
                        <input type="text" name="reviewer_name" class="form-input" placeholder="e.g. CyberViper99" value="<?= htmlspecialchars($_SESSION['user_name'] ?? '') ?>" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Performance Rating</label>
                        <select name="rating" class="form-select">
                            <option value="5">★★★★★ (5.0 - Legendary Performance)</option>
                            <option value="4">★★★★☆ (4.0 - Solid Tactical Gear)</option>
                            <option value="3">★★★☆☆ (3.0 - Standard Performance)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Combat Feedback &amp; Specs Review</label>
                        <textarea name="comment" class="form-textarea" rows="3" placeholder="How is the build quality, frame rates, audio fidelity, or fast charge speed?" required></textarea>
                    </div>
                    <button type="submit" name="submit_review" class="btn-cyber btn-sm" style="width: 100%;">
                        🚀 SUBMIT INTEL (+25 XP REWARD)
                    </button>
                </form>
            </div>

            <!-- Existing Reviews List -->
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 18px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-family: var(--font-heading); font-size: 0.95rem; color: var(--cyan-neon);">Alex "Vortex" Silva</span>
                        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--amber-gold);">★ 5.0 VERIFIED PLAYER</span>
                    </div>
                    <p style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 6px;">
                        "Unmatched performance! Delivered in 24 hours to Colombo with original warranty slip. Build quality is 10/10 and the Smartify Quest XP system is so fun!"
                    </p>
                    <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">Deployed 2 days ago</span>
                </div>

                <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 18px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <span style="font-family: var(--font-heading); font-size: 0.95rem; color: var(--primary-violet);">Kasun D. (Pro Streamer)</span>
                        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--amber-gold);">★ 5.0 VERIFIED PLAYER</span>
                    </div>
                    <p style="font-size: 0.9rem; color: var(--text-main); margin-bottom: 6px;">
                        "The latency and precision are top tier. Paid with Koko 3 installments smoothly with zero interest. Smartify Tech is hands down the best tech store in Sri Lanka."
                    </p>
                    <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">Deployed 5 days ago</span>
                </div>
            </div>
        </div>
    </section>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
