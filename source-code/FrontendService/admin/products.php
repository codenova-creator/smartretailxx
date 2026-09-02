<?php
/**
 * Smartify Tech - Admin Hardware Products Arsenal Management
 */

$pageTitle = 'Products Arsenal Management — Smartify Tech Staff';
require_once __DIR__ . '/includes/header.php';

$action = $_GET['action'] ?? 'list';
$editId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Fetch Categories and Brands for form selectors
$categories = $pdo->query("SELECT * FROM categories ORDER BY name ASC")->fetchAll();
$brands = $pdo->query("SELECT * FROM brands ORDER BY name ASC")->fetchAll();

// Handle Delete
if ($action === 'delete' && $editId > 0) {
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$editId]);
    setFlash('success', 'Hardware unit deleted from arena catalog.');
    header('Location: products.php');
    exit;
}

// Handle Add / Edit Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_product'])) {
    $title = sanitize($_POST['title'] ?? '');
    $slug = sanitize($_POST['slug'] ?? strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title))));
    $categoryId = (int)($_POST['category_id'] ?? 1);
    $brandId = (int)($_POST['brand_id'] ?? 1);
    $price = (float)($_POST['price'] ?? 0);
    $discountPrice = !empty($_POST['discount_price']) ? (float)$_POST['discount_price'] : null;
    $stock = (int)($_POST['stock'] ?? 0);
    $rating = (float)($_POST['rating'] ?? 5.0);
    $isFlashDeal = isset($_POST['is_flash_deal']) ? 1 : 0;
    $description = sanitize($_POST['description'] ?? '');
    $imageMain = sanitize($_POST['image_main'] ?? 'assets/images/products/ps5-pro.png');

    if ($editId > 0) {
        $stmt = $pdo->prepare("
            UPDATE products SET 
                title = ?, slug = ?, category_id = ?, brand_id = ?, price = ?, discount_price = ?, stock = ?, rating = ?, is_flash_deal = ?, description = ?, image_main = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $title, $slug, $categoryId, $brandId, $price, $discountPrice, $stock, $rating, $isFlashDeal, $description, $imageMain, $editId
        ]);
        setFlash('success', "⚡ Hardware unit '$title' updated successfully.");
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO products (
                title, slug, category_id, brand_id, price, discount_price, stock, rating, is_flash_deal, description, image_main
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $title, $slug, $categoryId, $brandId, $price, $discountPrice, $stock, $rating, $isFlashDeal, $description, $imageMain
        ]);
        setFlash('success', "⚡ New hardware unit '$title' deployed to arena catalog.");
    }
    header('Location: products.php');
    exit;
}

// If editing, fetch product
$productToEdit = null;
if (($action === 'edit' || $action === 'create') && $editId > 0) {
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$editId]);
    $productToEdit = $stmt->fetch();
}

// Fetch list of products
$products = $pdo->query("
    SELECT p.*, b.name as brand_name, c.name as category_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.id DESC
")->fetchAll();
?>

<main class="container" style="padding: 40px 20px 80px;">
    
    <?php if ($action === 'create' || $action === 'edit'): ?>
        <!-- ADD / EDIT PRODUCT FORM -->
        <div style="background: var(--bg-card); border: 1px solid var(--primary-purple); border-radius: 12px; padding: 35px; max-width: 800px; margin: 0 auto; box-shadow: var(--glow-purple-sm); clip-path: polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 15px;">
                <h1 style="font-family: var(--font-heading); font-size: 1.6rem; color: #fff;">
                    <?= ($editId > 0) ? '⚙️ EDIT HARDWARE UNIT' : '⚡ DEPLOY NEW HARDWARE UNIT' ?>
                </h1>
                <a href="products.php" class="btn-cyber-outline btn-sm">← CANCEL &amp; BACK</a>
            </div>

            <form action="products.php<?= $editId ? '?action=edit&id='.$editId : '?action=create' ?>" method="POST">
                <div class="form-group">
                    <label class="form-label">Product Name / Hardware Title *</label>
                    <input type="text" name="title" class="form-input" placeholder="e.g. Razer DeathAdder V3 Pro" value="<?= htmlspecialchars($productToEdit['title'] ?? '') ?>" required>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label class="form-label">Category *</label>
                        <select name="category_id" class="form-select" required>
                            <?php foreach ($categories as $cat): ?>
                                <option value="<?= $cat['id'] ?>" <?= (($productToEdit['category_id'] ?? 1) == $cat['id']) ? 'selected' : '' ?>>
                                    <?= $cat['icon_svg'] ?> <?= htmlspecialchars($cat['name']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Brand *</label>
                        <select name="brand_id" class="form-select" required>
                            <?php foreach ($brands as $b): ?>
                                <option value="<?= $b['id'] ?>" <?= (($productToEdit['brand_id'] ?? 1) == $b['id']) ? 'selected' : '' ?>>
                                    <?= htmlspecialchars($b['name']) ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label class="form-label">Price (LKR) *</label>
                        <input type="number" step="0.01" name="price" class="form-input" placeholder="45000" value="<?= htmlspecialchars($productToEdit['price'] ?? '') ?>" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Discount Price (LKR)</label>
                        <input type="number" step="0.01" name="discount_price" class="form-input" placeholder="38990 (Optional)" value="<?= htmlspecialchars($productToEdit['discount_price'] ?? '') ?>">
                    </div>

                    <div class="form-group">
                        <label class="form-label">Armory Stock *</label>
                        <input type="number" name="stock" class="form-input" placeholder="15" value="<?= htmlspecialchars($productToEdit['stock'] ?? 10) ?>" required>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px;">
                    <div class="form-group">
                        <label class="form-label">Image Asset Path</label>
                        <input type="text" name="image_main" class="form-input" placeholder="assets/images/products/ps5-pro.png" value="<?= htmlspecialchars($productToEdit['image_main'] ?? 'assets/images/products/ps5-pro.png') ?>" required>
                    </div>

                    <div class="form-group" style="display: flex; flex-direction: column; justify-content: center;">
                        <label class="form-label">Flash Deal Option</label>
                        <label style="display: flex; gap: 10px; align-items: center; cursor: pointer; color: #fff;">
                            <input type="checkbox" name="is_flash_deal" value="1" <?= (!empty($productToEdit['is_flash_deal'])) ? 'checked' : '' ?>>
                            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--hot-pink);">🔥 Feature in Flash Drops Section</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Tactical Gear Description</label>
                    <textarea name="description" class="form-textarea" rows="4" placeholder="Detailed combat specifications, performance metrics, and feature overview..." required><?= htmlspecialchars($productToEdit['description'] ?? '') ?></textarea>
                </div>

                <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 25px;">
                    <a href="products.php" class="btn-cyber-outline btn-sm">CANCEL</a>
                    <button type="submit" name="save_product" class="btn-cyber">
                        💾 SAVE HARDWARE UNIT
                    </button>
                </div>
            </form>
        </div>

    <?php else: ?>
        <!-- PRODUCTS LIST TABLE -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
            <div>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--hot-pink); letter-spacing: 2px;">ARSENAL INVENTORY</span>
                <h1 style="font-family: var(--font-heading); font-size: 2rem; color: #fff; margin-top: 4px;">
                    🎮 HARDWARE PRODUCTS CATALOG (<?= count($products) ?> SKUs)
                </h1>
            </div>
            <a href="products.php?action=create" class="btn-cyber" id="btnAddProduct">
                + ADD NEW HARDWARE
            </a>
        </div>

        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 24px; overflow-x: auto;">
            <table class="table-cyber">
                <thead>
                    <tr>
                        <th>GEAR IMAGE</th>
                        <th>TITLE &amp; BRAND</th>
                        <th>CATEGORY</th>
                        <th>PRICE (LKR)</th>
                        <th>STOCK</th>
                        <th>FLASH DEAL</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $p): ?>
                        <tr>
                            <td>
                                <img src="../<?= htmlspecialchars($p['image_main']) ?>" style="width: 50px; height: 50px; object-fit: contain; background: #0d0c1c; border-radius: 6px; padding: 4px;">
                            </td>
                            <td>
                                <div style="font-weight: 700; color: #fff; font-size: 0.95rem;"><?= htmlspecialchars($p['title']) ?></div>
                                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-neon);"><?= htmlspecialchars($p['brand_name'] ?? 'SMARTIFY') ?></div>
                            </td>
                            <td>
                                <span style="font-size: 0.85rem; color: var(--text-muted);"><?= htmlspecialchars($p['category_name'] ?? 'General') ?></span>
                            </td>
                            <td>
                                <strong style="font-family: var(--font-mono); color: var(--cyan-neon); font-size: 0.95rem;"><?= formatLKR($p['price']) ?></strong>
                                <?php if ($p['discount_price'] > 0): ?>
                                    <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--emerald-xp);">Sale: <?= formatLKR($p['discount_price']) ?></div>
                                <?php endif; ?>
                            </td>
                            <td>
                                <span class="badge-tech <?= ($p['stock'] <= 10) ? 'badge-discount' : 'badge-stock' ?>">
                                    <?= $p['stock'] ?> UNITS
                                </span>
                            </td>
                            <td>
                                <?= $p['is_flash_deal'] ? '<span class="badge-tech badge-discount">🔥 ACTIVE</span>' : '<span style="color:var(--text-dim); font-size:0.75rem;">NO</span>' ?>
                            </td>
                            <td>
                                <div style="display: flex; gap: 8px;">
                                    <a href="products.php?action=edit&id=<?= $p['id'] ?>" class="btn-cyber btn-sm" style="font-size: 0.72rem; padding: 6px 10px;">
                                        EDIT
                                    </a>
                                    <a href="products.php?action=delete&id=<?= $p['id'] ?>" onclick="return confirm('Dismantle and delete this product?');" class="btn-cyber-outline btn-sm" style="font-size: 0.72rem; padding: 6px 10px; color: var(--hot-pink); border-color: var(--hot-pink);">
                                        DELETE
                                    </a>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>

</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
