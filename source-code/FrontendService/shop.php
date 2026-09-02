<?php
/**
 * Smartify Tech - Shop Catalog (Enter The Arena)
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/gamification.php';

// Filter inputs
$selectedCatSlug = sanitize($_GET['cat'] ?? '');
$selectedBrandId = isset($_GET['brand']) ? (int)$_GET['brand'] : 0;
$searchQuery = sanitize($_GET['q'] ?? '');
$isFlashOnly = isset($_GET['flash']) ? 1 : 0;
$sort = sanitize($_GET['sort'] ?? 'featured');
$minPrice = isset($_GET['min_price']) ? (float)$_GET['min_price'] : 0;
$maxPrice = isset($_GET['max_price']) ? (float)$_GET['max_price'] : 500000;

// Build SQL Query
$sql = "
    SELECT p.*, b.name as brand_name, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
";
$params = [];

if ($selectedCatSlug) {
    $sql .= " AND c.slug = ?";
    $params[] = $selectedCatSlug;
}

if ($selectedBrandId > 0) {
    $sql .= " AND p.brand_id = ?";
    $params[] = $selectedBrandId;
}

if ($isFlashOnly) {
    $sql .= " AND p.is_flash_deal = 1";
}

if ($searchQuery) {
    $sql .= " AND (p.title LIKE ? OR p.description LIKE ? OR b.name LIKE ?)";
    $searchTerm = "%$searchQuery%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $params[] = $searchTerm;
}

if ($minPrice > 0) {
    $sql .= " AND COALESCE(NULLIF(p.discount_price, 0), p.price) >= ?";
    $params[] = $minPrice;
}

if ($maxPrice < 500000) {
    $sql .= " AND COALESCE(NULLIF(p.discount_price, 0), p.price) <= ?";
    $params[] = $maxPrice;
}

// Sorting
switch ($sort) {
    case 'price_asc':
        $sql .= " ORDER BY COALESCE(NULLIF(p.discount_price, 0), p.price) ASC";
        break;
    case 'price_desc':
        $sql .= " ORDER BY COALESCE(NULLIF(p.discount_price, 0), p.price) DESC";
        break;
    case 'rating':
        $sql .= " ORDER BY p.rating DESC, p.reviews_count DESC";
        break;
    default:
        $sql .= " ORDER BY p.is_flash_deal DESC, p.id ASC";
        break;
}

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();

// Fetch filter options: Categories and Brands with counts
$categories = $pdo->query("
    SELECT c.*, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON c.id = p.category_id
    GROUP BY c.id
")->fetchAll();

$brands = $pdo->query("
    SELECT b.*, COUNT(p.id) as product_count
    FROM brands b
    LEFT JOIN products p ON b.id = p.brand_id
    GROUP BY b.id
")->fetchAll();

$pageTitle = 'ENTER THE ARENA — Smartify Tech Hardware Catalog';
require_once __DIR__ . '/includes/header.php';
?>

<main class="container" style="padding: 40px 20px 80px;">
    <!-- Catalog Header Banner -->
    <div style="background: linear-gradient(135deg, #15142b, #0d0c1c); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 30px 35px; margin-bottom: 35px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; clip-path: polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px);">
        <div>
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon); letter-spacing: 2px;">TACTICAL GEAR INVENTORY</span>
            <h1 style="font-family: var(--font-heading); font-size: 2.2rem; color: #fff; margin: 4px 0 6px;">
                ENTER THE ARENA // <span style="color: var(--cyan-neon);"><?= $isFlashOnly ? 'FLASH DEALS' : ($selectedCatSlug ? strtoupper(str_replace('-', ' ', $selectedCatSlug)) : 'ALL GEAR') ?></span>
            </h1>
            <p style="color: var(--text-muted); font-size: 0.9rem;">
                Showing <strong><?= count($products) ?></strong> deployed hardware units ready for islandwide deployment.
            </p>
        </div>
        <div>
            <!-- Sort dropdown -->
            <form method="GET" action="shop.php" style="display: flex; gap: 10px; align-items: center;">
                <?php if ($selectedCatSlug): ?><input type="hidden" name="cat" value="<?= htmlspecialchars($selectedCatSlug) ?>"><?php endif; ?>
                <?php if ($selectedBrandId): ?><input type="hidden" name="brand" value="<?= $selectedBrandId ?>"><?php endif; ?>
                <?php if ($searchQuery): ?><input type="hidden" name="q" value="<?= htmlspecialchars($searchQuery) ?>"><?php endif; ?>
                <?php if ($isFlashOnly): ?><input type="hidden" name="flash" value="1"><?php endif; ?>
                <label style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">SORT BY:</label>
                <select name="sort" class="form-select" onchange="this.form.submit()" style="padding: 8px 14px; font-size: 0.85rem; width: auto; background: var(--bg-surface);">
                    <option value="featured" <?= $sort === 'featured' ? 'selected' : '' ?>>⭐ Featured & Flash Deals</option>
                    <option value="price_asc" <?= $sort === 'price_asc' ? 'selected' : '' ?>>💵 Price: Low to High</option>
                    <option value="price_desc" <?= $sort === 'price_desc' ? 'selected' : '' ?>>💎 Price: High to Low</option>
                    <option value="rating" <?= $sort === 'rating' ? 'selected' : '' ?>>🏆 Highest Rated Pro Gear</option>
                </select>
            </form>
        </div>
    </div>

    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 30px; align-items: start;">
        
        <!-- SIDEBAR FILTERS -->
        <aside style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 24px; position: sticky; top: 100px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
                <h3 style="font-family: var(--font-heading); font-size: 1.05rem; color: #fff;">FILTERS</h3>
                <a href="shop.php" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--hot-pink);">RESET ALL</a>
            </div>

            <!-- Categories Filter -->
            <div style="margin-bottom: 25px;">
                <h4 style="font-family: var(--font-subhead); font-size: 0.95rem; font-weight: 700; color: var(--cyan-neon); margin-bottom: 12px;">CATEGORIES</h4>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
                    <li>
                        <a href="shop.php<?= $selectedBrandId ? '?brand='.$selectedBrandId : '' ?>" style="display: flex; justify-content: space-between; font-size: 0.85rem; color: <?= empty($selectedCatSlug) && !$isFlashOnly ? 'var(--cyan-neon)' : 'var(--text-muted)' ?>; font-weight: <?= empty($selectedCatSlug) ? 'bold' : 'normal' ?>;">
                            <span>⚡ All Categories</span>
                        </a>
                    </li>
                    <?php foreach ($categories as $c): ?>
                        <li>
                            <a href="shop.php?cat=<?= urlencode($c['slug']) ?><?= $selectedBrandId ? '&brand='.$selectedBrandId : '' ?>" style="display: flex; justify-content: space-between; font-size: 0.85rem; color: <?= ($selectedCatSlug === $c['slug']) ? 'var(--cyan-neon)' : 'var(--text-muted)' ?>; font-weight: <?= ($selectedCatSlug === $c['slug']) ? 'bold' : 'normal' ?>;">
                                <span><?= $c['icon_svg'] ?> <?= htmlspecialchars($c['name']) ?></span>
                                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">(<?= $c['product_count'] ?>)</span>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <!-- Brands Filter -->
            <div style="margin-bottom: 25px;">
                <h4 style="font-family: var(--font-subhead); font-size: 0.95rem; font-weight: 700; color: var(--primary-violet); margin-bottom: 12px;">TOP BRANDS</h4>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px;">
                    <?php foreach ($brands as $b): ?>
                        <li>
                            <a href="shop.php?brand=<?= $b['id'] ?><?= $selectedCatSlug ? '&cat='.$selectedCatSlug : '' ?>" style="display: flex; justify-content: space-between; font-size: 0.85rem; color: <?= ($selectedBrandId == $b['id']) ? 'var(--cyan-neon)' : 'var(--text-muted)' ?>; font-weight: <?= ($selectedBrandId == $b['id']) ? 'bold' : 'normal' ?>;">
                                <span>🎮 <?= htmlspecialchars($b['name']) ?></span>
                                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">(<?= $b['product_count'] ?>)</span>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>

            <!-- Flash Deals Quick Toggle -->
            <div style="padding-top: 15px; border-top: 1px solid var(--border-subtle);">
                <a href="shop.php?flash=1" class="btn-cyber btn-cyber-pink btn-sm" style="width: 100%; text-align: center;">
                    🔥 VIEW FLASH DROPS
                </a>
            </div>
        </aside>

        <!-- PRODUCT CATALOG GRID -->
        <section>
            <?php if (empty($products)): ?>
                <div style="background: var(--bg-card); border: 1px dashed var(--border-active); border-radius: 12px; padding: 60px 30px; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: #fff;">NO GEAR MATCHED YOUR SEARCH</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin: 8px auto 20px; max-width: 400px;">
                        No tactical hardware was found matching your filter parameters. Try clearing your filters or searching another keyword.
                    </p>
                    <a href="shop.php" class="btn-cyber btn-cyber-cyan btn-sm">VIEW ALL AVAILABLE GEAR</a>
                </div>
            <?php else: ?>
                <div class="product-grid">
                    <?php foreach ($products as $item): ?>
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
            <?php endif; ?>
        </section>

    </div>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
