<?php
/**
 * Smartify Tech - Order Tracking ("Delivery Mission")
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/gamification.php';

$searchOrder = sanitize($_GET['order'] ?? '');
$order = null;
$items = [];

if ($searchOrder) {
    $stmt = $pdo->prepare("
        SELECT o.*, u.name as user_name, u.email as user_email 
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.order_number = ?
    ");
    $stmt->execute([$searchOrder]);
    $order = $stmt->fetch();

    if ($order) {
        $stmtItems = $pdo->prepare("
            SELECT oi.*, p.title, p.image_main, b.name as brand_name
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            LEFT JOIN brands b ON p.brand_id = b.id
            WHERE oi.order_id = ?
        ");
        $stmtItems->execute([$order['id']]);
        $items = $stmtItems->fetchAll();
    }
} else if (isLoggedIn()) {
    // Show most recent order if logged in
    $stmt = $pdo->prepare("
        SELECT o.*, u.name as user_name, u.email as user_email 
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.user_id = ?
        ORDER BY o.id DESC
        LIMIT 1
    ");
    $stmt->execute([getCurrentUserId()]);
    $order = $stmt->fetch();
    if ($order) {
        $searchOrder = $order['order_number'];
        $stmtItems = $pdo->prepare("
            SELECT oi.*, p.title, p.image_main, b.name as brand_name
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            LEFT JOIN brands b ON p.brand_id = b.id
            WHERE oi.order_id = ?
        ");
        $stmtItems->execute([$order['id']]);
        $items = $stmtItems->fetchAll();
    }
}

// Map status to integer step (1 to 5)
$statusLevels = [
    'confirmed' => 1,
    'loadout_verified' => 2,
    'gear_preparing' => 3,
    'dispatched' => 4,
    'out_for_delivery' => 4,
    'mission_complete' => 5
];

$currentStep = $order ? ($statusLevels[$order['order_status']] ?? 1) : 0;

$pageTitle = 'DELIVERY MISSION TRACKING — Smartify Tech Quest Timeline';
require_once __DIR__ . '/includes/header.php';
?>

<main class="container" style="padding: 40px 20px 80px; max-width: 960px;">
    <!-- Page Header & Search Box -->
    <div style="text-align: center; margin-bottom: 35px;">
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon); letter-spacing: 2px;">TACTICAL RADAR &amp; DISPATCH SQUAD</span>
        <h1 style="font-family: var(--font-heading); font-size: 2.2rem; color: #fff; margin: 4px 0 10px;">
            🚚 DELIVERY MISSION TRACKER
        </h1>
        <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 480px; margin: 0 auto 20px;">
            Monitor your gear's real-time trajectory from our Colombo armory directly to your coordinates.
        </p>

        <!-- Order Lookup Form -->
        <form action="order-tracking.php" method="GET" style="max-width: 480px; margin: 0 auto; display: flex; gap: 8px;">
            <input type="text" name="order" value="<?= htmlspecialchars($searchOrder) ?>" placeholder="Enter Order # (e.g. SMT10293)" class="form-input" style="background: var(--bg-surface); text-transform: uppercase;" required>
            <button type="submit" class="btn-cyber btn-sm" style="white-space: nowrap;">
                🔍 SCAN RADAR
            </button>
        </form>
    </div>

    <?php if (!$order && $searchOrder): ?>
        <!-- Not Found Alert -->
        <div style="background: var(--bg-card); border: 1px dashed var(--hot-pink); border-radius: 12px; padding: 40px 20px; text-align: center; margin-top: 20px;">
            <div style="font-size: 2.5rem; margin-bottom: 10px;">⚠️</div>
            <h3 style="font-family: var(--font-heading); font-size: 1.3rem; color: #fff;">ORDER NOT FOUND</h3>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 5px;">
                No tactical mission matching <strong>"<?= htmlspecialchars($searchOrder) ?>"</strong> was detected in our radar database.
            </p>
        </div>
    <?php elseif ($order): ?>
        <!-- Visual Quest Progression Stepper Map -->
        <div class="tracking-stepper-box">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 25px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 15px; flex-wrap: wrap; gap: 10px;">
                <div>
                    <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--emerald-xp);">LIVE MISSION STATUS</span>
                    <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: #fff;">
                        MISSION #<?= htmlspecialchars($order['order_number']) ?>
                    </h2>
                </div>
                <div style="text-align: right;">
                    <span class="badge-tech badge-stock" style="font-size: 0.8rem; padding: 6px 12px;">
                        STATUS: <?= strtoupper(str_replace('_', ' ', $order['order_status'])) ?>
                    </span>
                </div>
            </div>

            <!-- 5-Step Timeline -->
            <div class="quest-timeline">
                <!-- Step 1: Confirmed -->
                <div class="timeline-node <?= ($currentStep > 1) ? 'done' : (($currentStep === 1) ? 'current' : '') ?>">
                    <div class="node-icon-circle">✓</div>
                    <span class="node-title">ORDER CONFIRMED</span>
                    <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); margin-top: 4px;">System Logged</span>
                </div>

                <!-- Step 2: Loadout Verified -->
                <div class="timeline-node <?= ($currentStep > 2) ? 'done' : (($currentStep === 2) ? 'current' : '') ?>">
                    <div class="node-icon-circle">🎒</div>
                    <span class="node-title">LOADOUT VERIFIED</span>
                    <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); margin-top: 4px;">Inventory Locked</span>
                </div>

                <!-- Step 3: Gear Preparing -->
                <div class="timeline-node <?= ($currentStep > 3) ? 'done' : (($currentStep === 3) ? 'current' : '') ?>">
                    <div class="node-icon-circle">🟣</div>
                    <span class="node-title">GEAR PREPARING</span>
                    <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); margin-top: 4px;">QA Battle Tested</span>
                </div>

                <!-- Step 4: Dispatched -->
                <div class="timeline-node <?= ($currentStep > 4) ? 'done' : (($currentStep === 4) ? 'current' : '') ?>">
                    <div class="node-icon-circle">🚚</div>
                    <span class="node-title">IN TRANSIT</span>
                    <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); margin-top: 4px;">Courier Squad</span>
                </div>

                <!-- Step 5: Mission Complete -->
                <div class="timeline-node <?= ($currentStep >= 5) ? 'done' : '' ?>">
                    <div class="node-icon-circle">🏆</div>
                    <span class="node-title">MISSION COMPLETE</span>
                    <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim); margin-top: 4px;">XP Unlocked</span>
                </div>
            </div>

            <!-- Courier Squad & Delivery Info Grid -->
            <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 20px; margin-top: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div>
                    <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">DISPATCH SQUAD</span>
                    <div style="color: #fff; font-weight: bold; margin-top: 2px;">Smartify Rapid Express (Pvt) Ltd</div>
                    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-neon);">WAYBILL: LK-<?= substr(md5($order['order_number']), 0, 10) ?></div>
                </div>

                <div>
                    <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">ESTIMATED ARRIVAL</span>
                    <div style="color: #fff; font-weight: bold; margin-top: 2px;">
                        <?= date('l, M d', strtotime($order['created_at'] . ' + 2 days')) ?>
                    </div>
                    <div style="font-size: 0.75rem; color: var(--emerald-xp);">On Schedule</div>
                </div>

                <div>
                    <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim);">DESTINATION BASE</span>
                    <div style="color: #fff; font-size: 0.85rem; margin-top: 2px;">
                        <?= htmlspecialchars($order['shipping_address']) ?>
                    </div>
                    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">Recipient: <?= htmlspecialchars($order['shipping_name']) ?> (<?= htmlspecialchars($order['shipping_phone']) ?>)</div>
                </div>
            </div>

            <!-- Items in this Mission -->
            <div style="margin-top: 30px;">
                <h3 style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon); margin-bottom: 15px;">
                    HARDWARE DEPLOYED IN THIS MISSION:
                </h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <?php foreach ($items as $it): ?>
                        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface); padding: 12px 16px; border-radius: 6px; border: 1px solid var(--border-subtle);">
                            <div style="display: flex; gap: 12px; align-items: center;">
                                <img src="<?= htmlspecialchars($it['image_main']) ?>" style="width: 40px; height: 40px; object-fit: contain;">
                                <span style="color: #fff; font-weight: 600; font-size: 0.9rem;"><?= htmlspecialchars($it['title']) ?></span>
                            </div>
                            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--cyan-neon);"><?= $it['quantity'] ?> × <?= formatLKR($it['price']) ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

        </div>
    <?php endif; ?>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
