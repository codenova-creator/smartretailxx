<?php
/**
 * Smartify Tech - Order Confirmation ("🏆 MISSION COMPLETE")
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/gamification.php';

$orderNumber = sanitize($_GET['order'] ?? '');
if (!$orderNumber) {
    header('Location: index.php');
    exit;
}

// Fetch order details
$stmt = $pdo->prepare("
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.order_number = ?
");
$stmt->execute([$orderNumber]);
$order = $stmt->fetch();

if (!$order) {
    header('Location: index.php');
    exit;
}

// Fetch order items
$stmtItems = $pdo->prepare("
    SELECT oi.*, p.title, p.image_main, b.name as brand_name
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE oi.order_id = ?
");
$stmtItems->execute([$order['id']]);
$items = $stmtItems->fetchAll();

$pageTitle = '🏆 MISSION COMPLETE — Order #' . htmlspecialchars($orderNumber);
require_once __DIR__ . '/includes/header.php';
?>

<main class="container" style="padding: 50px 20px 80px; max-width: 820px;">
    <!-- Mission Complete Card -->
    <div style="background: var(--bg-card); border: 1px solid var(--emerald-xp); border-radius: 12px; padding: 40px; box-shadow: 0 0 35px rgba(0, 255, 157, 0.25); text-align: center; clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);">
        
        <div style="font-size: 4rem; margin-bottom: 10px;">🏆</div>
        
        <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--emerald-xp); letter-spacing: 2px;">
            MISSION SUCCESS // BRIEFING LOGGED
        </span>
        <h1 style="font-family: var(--font-heading); font-size: 2.4rem; color: #fff; margin: 6px 0 15px;">
            MISSION COMPLETE
        </h1>
        <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 500px; margin: 0 auto 25px;">
            Your tactical loadout order has been received and locked. Our dispatch team is preparing your hardware for islandwide deployment.
        </p>

        <!-- XP Reward Callout Box -->
        <div style="background: rgba(0, 255, 157, 0.1); border: 1px solid var(--emerald-xp); border-radius: 8px; padding: 18px 25px; display: inline-flex; align-items: center; gap: 15px; margin-bottom: 35px; box-shadow: var(--glow-green-sm);">
            <div style="font-size: 2rem;">⚡</div>
            <div style="text-align: left;">
                <div style="font-family: var(--font-heading); font-size: 1.1rem; color: #fff;">
                    +<?= $order['xp_earned'] ?> XP CREDITED TO SMARTIFY ID!
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--emerald-xp);">
                    LEVEL PROGRESSION ADVANCED // CHECK YOUR PROFILE STATS
                </div>
            </div>
        </div>

        <!-- Order Meta Grid -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 20px; text-align: left; margin-bottom: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 15px;">
            <div>
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">ORDER CODE</span>
                <div style="font-family: var(--font-mono); font-weight: bold; color: var(--cyan-neon);">#<?= htmlspecialchars($order['order_number']) ?></div>
            </div>
            <div>
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">DATE &amp; TIME</span>
                <div style="font-family: var(--font-mono); color: #fff; font-size: 0.85rem;"><?= date('M d, Y H:i', strtotime($order['created_at'])) ?></div>
            </div>
            <div>
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">PAYMENT METHOD</span>
                <div style="font-family: var(--font-mono); color: #fff; text-transform: uppercase; font-size: 0.85rem;"><?= htmlspecialchars($order['payment_method']) ?> (<?= $order['payment_status'] ?>)</div>
            </div>
            <div>
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">TOTAL PAID</span>
                <div style="font-family: var(--font-heading); color: var(--cyan-neon); font-weight: bold; font-size: 1.1rem;"><?= formatLKR($order['total_amount']) ?></div>
            </div>
        </div>

        <!-- Equipped Items Table -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 20px; text-align: left; margin-bottom: 35px;">
            <h3 style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon); margin-bottom: 15px; letter-spacing: 1px;">
                DEPLOYED GEAR ITEMS:
            </h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <?php foreach ($items as $it): ?>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
                        <div style="display: flex; gap: 12px; align-items: center;">
                            <img src="<?= htmlspecialchars($it['image_main']) ?>" style="width: 45px; height: 45px; object-fit: contain; background: #0c0b1a; border-radius: 4px; padding: 4px;">
                            <div>
                                <h4 style="font-family: var(--font-subhead); font-size: 0.95rem; color: #fff; margin-bottom: 2px;">
                                    <?= htmlspecialchars($it['title']) ?>
                                </h4>
                                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
                                    Qty: <?= $it['quantity'] ?> × <?= formatLKR($it['price']) ?>
                                </span>
                            </div>
                        </div>
                        <div style="font-family: var(--font-mono); font-weight: bold; color: var(--cyan-neon);">
                            <?= formatLKR($it['price'] * $it['quantity']) ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Action CTA Buttons -->
        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
            <a href="order-tracking.php?order=<?= urlencode($order['order_number']) ?>" class="btn-cyber" id="btnTrackMission">
                📦 TRACK MY MISSION
            </a>
            <a href="profile.php" class="btn-cyber btn-cyber-cyan">
                🎮 VIEW SMARTIFY ID
            </a>
            <a href="shop.php" class="btn-cyber-outline btn-sm" style="align-self: center;">
                ← CONTINUE EXPLORING ARENA
            </a>
        </div>

    </div>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
