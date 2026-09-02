<?php
/**
 * Smartify Tech - Cart ("Your Loadout")
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/gamification.php';

// Handle Direct Add / Buy Now / Remove / Update actions via GET
$action = $_GET['action'] ?? '';
$productId = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$qty = isset($_GET['qty']) ? (int)$_GET['qty'] : 1;

if ($action === 'add' && $productId > 0) {
    $stmt = $pdo->prepare("SELECT id, title, price, discount_price, image_main FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $p = $stmt->fetch();
    if ($p) {
        $price = ($p['discount_price'] > 0) ? $p['discount_price'] : $p['price'];
        if (isset($_SESSION['loadout'][$productId])) {
            $_SESSION['loadout'][$productId]['qty'] += max(1, $qty);
        } else {
            $_SESSION['loadout'][$productId] = [
                'id' => $p['id'],
                'title' => $p['title'],
                'price' => (float)$price,
                'image' => $p['image_main'],
                'qty' => max(1, $qty)
            ];
        }
        setFlash('success', '⚡ Added ' . $p['title'] . ' to Loadout!');
    }
    header('Location: cart.php');
    exit;
}

if ($action === 'buy_now' && $productId > 0) {
    $stmt = $pdo->prepare("SELECT id, title, price, discount_price, image_main FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $p = $stmt->fetch();
    if ($p) {
        $price = ($p['discount_price'] > 0) ? $p['discount_price'] : $p['price'];
        if (!isset($_SESSION['loadout'][$productId])) {
            $_SESSION['loadout'][$productId] = [
                'id' => $p['id'],
                'title' => $p['title'],
                'price' => (float)$price,
                'image' => $p['image_main'],
                'qty' => 1
            ];
        }
    }
    header('Location: checkout.php');
    exit;
}

if ($action === 'remove' && $productId > 0) {
    unset($_SESSION['loadout'][$productId]);
    setFlash('success', 'Gear removed from Loadout.');
    header('Location: cart.php');
    exit;
}

if ($action === 'update' && $productId > 0 && isset($_GET['qty'])) {
    $newQty = max(1, (int)$_GET['qty']);
    if (isset($_SESSION['loadout'][$productId])) {
        $_SESSION['loadout'][$productId]['qty'] = $newQty;
    }
    header('Location: cart.php');
    exit;
}

if ($action === 'clear') {
    $_SESSION['loadout'] = [];
    header('Location: cart.php');
    exit;
}

// Handle Promo Code / Voucher
$promoDiscount = 0;
$promoCode = sanitize($_POST['promo_code'] ?? ($_SESSION['promo_code'] ?? ''));

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['apply_promo'])) {
    if (strtoupper($promoCode) === 'CYBER10') {
        $_SESSION['promo_code'] = 'CYBER10';
        setFlash('success', '⚡ Quest Voucher Applied: 10% Discount Unlocked!');
    } elseif (strtoupper($promoCode) === 'LEVELUP') {
        $_SESSION['promo_code'] = 'LEVELUP';
        setFlash('success', '⚡ Level Up Voucher Applied: 15% VIP Discount Unlocked!');
    } else {
        unset($_SESSION['promo_code']);
        setFlash('error', '⚠️ Invalid Quest Voucher Code. Try "CYBER10"');
    }
    header('Location: cart.php');
    exit;
}

// Calculate Loadout Stats
$subtotal = 0.0;
$totalItems = 0;
$loadout = $_SESSION['loadout'] ?? [];

foreach ($loadout as $item) {
    $itemQty = (int)($item['qty'] ?? 1);
    $totalItems += $itemQty;
    $subtotal += ((float)$item['price']) * $itemQty;
}

if (!empty($_SESSION['promo_code'])) {
    if ($_SESSION['promo_code'] === 'CYBER10') $promoDiscount = $subtotal * 0.10;
    if ($_SESSION['promo_code'] === 'LEVELUP') $promoDiscount = $subtotal * 0.15;
}

// Islandwide shipping estimate (Free if Loadout Power >= 100% or subtotal > Rs. 50,000)
$loadoutPower = calculateLoadoutPower($loadout, $subtotal);
$shippingFee = ($subtotal >= 50000 || $loadoutPower >= 100 || $totalItems === 0) ? 0.00 : 750.00;
$finalTotal = max(0, $subtotal - $promoDiscount + $shippingFee);
$xpToEarn = min(500, max(50, round($subtotal / 1000) * 10));

$pageTitle = '🎒 YOUR LOADOUT — Smartify Tech Gamified Cart';
require_once __DIR__ . '/includes/header.php';
?>

<main class="container" style="padding: 40px 20px 80px;">
    <!-- Page Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
        <div>
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon); letter-spacing: 2px;">TACTICAL INVENTORY SYNC</span>
            <h1 style="font-family: var(--font-heading); font-size: 2.2rem; color: #fff; margin-top: 4px;">
                🎒 YOUR LOADOUT <span style="color: var(--primary-violet); font-size: 1.5rem;">(<?= $totalItems ?> ITEMS)</span>
            </h1>
        </div>
        <?php if (!empty($loadout)): ?>
            <a href="cart.php?action=clear" style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--hot-pink);">
                ✖ DISMANTLE LOADOUT (CLEAR ALL)
            </a>
        <?php endif; ?>
    </div>

    <!-- DYNAMIC LOADOUT POWER METER -->
    <div class="loadout-power-container">
        <div class="power-header">
            <div class="power-title">
                <span>⚡ LOADOUT COMBAT POWER:</span>
                <span style="color: var(--cyan-neon); font-size: 0.9rem; font-family: var(--font-mono);">
                    <?= ($loadoutPower >= 100) ? 'MAXIMUM SYNERGY ACHIEVED' : (($loadoutPower >= 60) ? 'BATTLE READY' : 'RECRUIT TIER') ?>
                </span>
            </div>
            <div class="power-percent"><?= $loadoutPower ?>%</div>
        </div>
        <div class="power-track">
            <div class="power-bar-fill" style="width: <?= $loadoutPower ?>%;"></div>
        </div>
        <div class="power-perk-text">
            <?php if ($loadoutPower >= 100 || $subtotal >= 50000): ?>
                ✨ <strong>PERK UNLOCKED:</strong> 100% Loadout Power = <strong>FREE ISLANDWIDE EXPRESS DELIVERY</strong> + <strong>+<?= $xpToEarn ?> XP</strong> on deployment!
            <?php else: ?>
                ⚡ <em>Tactical Intel:</em> Add more synergy gear to hit 100% Loadout Power and unlock FREE Express Shipping!
            <?php endif; ?>
        </div>
    </div>

    <?php if (empty($loadout)): ?>
        <!-- Empty Loadout State -->
        <div style="background: var(--bg-card); border: 1px dashed var(--border-active); border-radius: 12px; padding: 70px 30px; text-align: center;">
            <div style="font-size: 3.5rem; margin-bottom: 15px;">🎒</div>
            <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: #fff; margin-bottom: 10px;">
                YOUR LOADOUT IS CURRENTLY EMPTY
            </h2>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 25px; max-width: 460px; margin-left: auto; margin-right: auto;">
                You haven't equipped any tactical hardware yet. Explore the Arena catalog and pick up your weapons and battle accessories.
            </p>
            <a href="shop.php" class="btn-cyber" style="font-size: 1rem;">
                🎮 ENTER THE ARENA TO RECRUIT GEAR
            </a>
        </div>
    <?php else: ?>
        <!-- Main Loadout Grid -->
        <div class="loadout-layout">
            <!-- Left: List of Loadout Gear -->
            <div class="loadout-items-list">
                <?php foreach ($loadout as $pId => $item): ?>
                    <?php $itemSubtotal = ((float)$item['price']) * ((int)$item['qty']); ?>
                    <div class="loadout-item-card">
                        <img src="<?= htmlspecialchars($item['image']) ?>" alt="<?= htmlspecialchars($item['title']) ?>" class="loadout-thumb">
                        
                        <div class="loadout-item-info">
                            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--emerald-xp);">GEAR ITEM #<?= $pId ?></span>
                            <h4><a href="product.php?id=<?= $pId ?>"><?= htmlspecialchars($item['title']) ?></a></h4>
                            <div class="loadout-item-price"><?= formatLKR($item['price']) ?></div>
                        </div>

                        <!-- Quantity Stepper -->
                        <div class="qty-control-box">
                            <a href="cart.php?action=update&id=<?= $pId ?>&qty=<?= max(1, $item['qty'] - 1) ?>" class="qty-btn">-</a>
                            <span class="qty-input" style="display: flex; align-items: center; justify-content: center;"><?= $item['qty'] ?></span>
                            <a href="cart.php?action=update&id=<?= $pId ?>&qty=<?= $item['qty'] + 1 ?>" class="qty-btn">+</a>
                        </div>

                        <!-- Remove Action & Item Subtotal -->
                        <div style="text-align: right;">
                            <div style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--cyan-neon); font-weight: 800; margin-bottom: 6px;">
                                <?= formatLKR($itemSubtotal) ?>
                            </div>
                            <a href="cart.php?action=remove&id=<?= $pId ?>" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--hot-pink);">
                                ✖ REMOVE
                            </a>
                        </div>
                    </div>
                <?php endforeach; ?>

                <!-- Continue Shopping Button -->
                <div style="margin-top: 10px;">
                    <a href="shop.php" class="btn-cyber-outline btn-sm">
                        ← CONTINUE EXPLORING ARENA
                    </a>
                </div>
            </div>

            <!-- Right: Loadout Summary & Quest Trigger -->
            <div class="loadout-summary-box">
                <h3 class="summary-title">MISSION BRIEFING</h3>

                <div class="summary-row">
                    <span>Loadout Items:</span>
                    <span style="color: #fff; font-family: var(--font-mono);"><?= $totalItems ?> Units</span>
                </div>

                <div class="summary-row">
                    <span>Base Subtotal:</span>
                    <span style="color: #fff; font-family: var(--font-mono);"><?= formatLKR($subtotal) ?></span>
                </div>

                <?php if ($promoDiscount > 0): ?>
                    <div class="summary-row" style="color: var(--emerald-xp);">
                        <span>Quest Voucher (<?= htmlspecialchars($_SESSION['promo_code']) ?>):</span>
                        <span>-<?= formatLKR($promoDiscount) ?></span>
                    </div>
                <?php endif; ?>

                <div class="summary-row">
                    <span>Delivery Mission Fee:</span>
                    <span style="font-family: var(--font-mono); color: <?= ($shippingFee == 0) ? 'var(--emerald-xp)' : '#fff' ?>;">
                        <?= ($shippingFee == 0) ? 'FREE (PERK UNLOCKED)' : formatLKR($shippingFee) ?>
                    </span>
                </div>

                <div class="summary-row" style="color: var(--primary-violet);">
                    <span>XP Bounty to Claim:</span>
                    <span style="font-family: var(--font-mono); font-weight: bold;">+<?= $xpToEarn ?> XP</span>
                </div>

                <div class="summary-row total">
                    <span>TOTAL DUE:</span>
                    <span class="val"><?= formatLKR($finalTotal) ?></span>
                </div>

                <!-- Promo Code Form -->
                <form action="cart.php" method="POST" style="margin: 20px 0 25px; padding-top: 15px; border-top: 1px solid var(--border-subtle);">
                    <label style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 6px;">
                        QUEST VOUCHER / PROMO CODE:
                    </label>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" name="promo_code" value="<?= htmlspecialchars($_SESSION['promo_code'] ?? '') ?>" placeholder="e.g. CYBER10" class="form-input" style="padding: 8px 12px; font-size: 0.85rem; text-transform: uppercase;">
                        <button type="submit" name="apply_promo" class="btn-cyber btn-sm" style="white-space: nowrap;">
                            APPLY
                        </button>
                    </div>
                </form>

                <!-- Proceed to Checkout Quest Button -->
                <a href="checkout.php" class="btn-cyber" style="width: 100%; font-size: 1rem; padding: 14px 20px;" id="btnProceedCheckout">
                    ⚔️ CHECKOUT QUEST →
                </a>

                <div style="text-align: center; margin-top: 15px; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">
                    🔒 SECURE 256-BIT ENCRYPTED CHECKOUT
                </div>
            </div>
        </div>
    <?php endif; ?>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
