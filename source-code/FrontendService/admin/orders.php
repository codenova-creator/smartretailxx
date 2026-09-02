<?php
/**
 * Smartify Tech - Admin Quest Orders & Status Updater
 */

$pageTitle = 'Quest Orders & Status Updater — Smartify Tech Staff';
require_once __DIR__ . '/includes/header.php';

// Handle Quest Status Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_order_status'])) {
    $orderId = (int)$_POST['order_id'];
    $newStatus = sanitize($_POST['order_status']);
    $paymentStatus = sanitize($_POST['payment_status']);

    // Fetch order details before update
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
    $stmt->execute([$orderId]);
    $existingOrder = $stmt->fetch();

    if ($existingOrder) {
        $stmtUpdate = $pdo->prepare("UPDATE orders SET order_status = ?, payment_status = ? WHERE id = ?");
        $stmtUpdate->execute([$newStatus, $paymentStatus, $orderId]);

        // If status transitioned to 'mission_complete' from a non-complete state, award bonus completion XP
        if ($newStatus === 'mission_complete' && $existingOrder['order_status'] !== 'mission_complete') {
            addPlayerXP($pdo, $existingOrder['user_id'], 150, "Mission #{$existingOrder['order_number']} Final Delivery Bonus");
            setFlash('success', "⚡ Quest #{$existingOrder['order_number']} status updated to MISSION COMPLETE! +150 Completion XP credited to player.");
        } else {
            setFlash('success', "⚡ Quest #{$existingOrder['order_number']} updated successfully to " . strtoupper(str_replace('_', ' ', $newStatus)));
        }
    }
    header('Location: orders.php');
    exit;
}

// Search and Filter Orders
$search = sanitize($_GET['search'] ?? '');
$statusFilter = sanitize($_GET['status'] ?? '');

$sql = "
    SELECT o.*, u.name as user_name, u.email as user_email,
           (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE 1=1
";
$params = [];

if ($search) {
    $sql .= " AND (o.order_number LIKE ? OR o.shipping_name LIKE ? OR o.shipping_phone LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

if ($statusFilter) {
    $sql .= " AND o.order_status = ?";
    $params[] = $statusFilter;
}

$sql .= " ORDER BY o.id DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$orders = $stmt->fetchAll();

// Available Quest Statuses
$statusOptions = [
    'confirmed' => '1. Confirmed (Order Logged)',
    'loadout_verified' => '2. Loadout Verified (Inventory Locked)',
    'gear_preparing' => '3. Gear Preparing (QA & Packaging)',
    'dispatched' => '4. Dispatched (Handed to Courier)',
    'out_for_delivery' => '5. Out for Delivery (In Transit)',
    'mission_complete' => '6. Mission Complete (Delivered & XP Unlocked)'
];
?>

<main class="container" style="padding: 40px 20px 80px;">
    <!-- Page Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
        <div>
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--hot-pink); letter-spacing: 2px;">LOGISTICS &amp; QUEST DISPATCH</span>
            <h1 style="font-family: var(--font-heading); font-size: 2rem; color: #fff; margin-top: 4px;">
                🚚 QUEST ORDERS MANAGEMENT
            </h1>
        </div>

        <!-- Search & Filter Form -->
        <form method="GET" action="orders.php" style="display: flex; gap: 10px; flex-wrap: wrap;">
            <input type="text" name="search" value="<?= htmlspecialchars($search) ?>" placeholder="Search Order # or Player..." class="form-input" style="padding: 8px 14px; font-size: 0.85rem; width: 220px; background: var(--bg-surface);">
            <select name="status" class="form-select" onchange="this.form.submit()" style="padding: 8px 14px; font-size: 0.85rem; width: auto; background: var(--bg-surface);">
                <option value="">-- All Quest Statuses --</option>
                <?php foreach ($statusOptions as $key => $lbl): ?>
                    <option value="<?= $key ?>" <?= ($statusFilter === $key) ? 'selected' : '' ?>><?= $lbl ?></option>
                <?php endforeach; ?>
            </select>
            <button type="submit" class="btn-cyber btn-sm">FILTER</button>
            <?php if ($search || $statusFilter): ?>
                <a href="orders.php" class="btn-cyber-outline btn-sm">RESET</a>
            <?php endif; ?>
        </form>
    </div>

    <!-- Orders Table -->
    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 24px; overflow-x: auto;">
        <table class="table-cyber">
            <thead>
                <tr>
                    <th>MISSION #</th>
                    <th>PLAYER &amp; DESTINATION</th>
                    <th>AMOUNT &amp; ITEMS</th>
                    <th>PAYMENT</th>
                    <th>QUEST STATUS UPDATER</th>
                    <th>ACTION</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($orders)): ?>
                    <tr>
                        <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">
                            No missions found matching your search criteria.
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($orders as $ord): ?>
                        <tr>
                            <!-- Order Number & Date -->
                            <td>
                                <strong style="font-family: var(--font-mono); color: var(--cyan-neon); font-size: 1rem;">
                                    #<?= htmlspecialchars($ord['order_number']) ?>
                                </strong>
                                <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim); margin-top: 2px;">
                                    <?= date('M d, Y H:i', strtotime($ord['created_at'])) ?>
                                </div>
                            </td>

                            <!-- Player & Address -->
                            <td>
                                <div style="font-weight: bold; color: #fff;"><?= htmlspecialchars($ord['shipping_name']) ?></div>
                                <div style="font-size: 0.78rem; color: var(--text-muted);"><?= htmlspecialchars($ord['shipping_phone']) ?></div>
                                <div style="font-size: 0.75rem; color: var(--text-dim); max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    📍 <?= htmlspecialchars($ord['shipping_address']) ?>
                                </div>
                            </td>

                            <!-- Total & Items -->
                            <td>
                                <strong style="font-family: var(--font-heading); color: var(--cyan-neon);">
                                    <?= formatLKR($ord['total_amount']) ?>
                                </strong>
                                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--emerald-xp);">
                                    +<?= $ord['xp_earned'] ?> XP (<?= $ord['item_count'] ?> Gear Items)
                                </div>
                            </td>

                            <!-- Payment Method & Status -->
                            <td>
                                <span style="font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: #fff;">
                                    <?= htmlspecialchars($ord['payment_method']) ?>
                                </span>
                                <div>
                                    <span class="badge-tech <?= ($ord['payment_status'] === 'paid') ? 'badge-stock' : 'badge-discount' ?>" style="font-size: 0.68rem; margin-top: 3px;">
                                        <?= strtoupper($ord['payment_status']) ?>
                                    </span>
                                </div>
                            </td>

                            <!-- Quest Status Updater Form -->
                            <td>
                                <form method="POST" action="orders.php" style="display: flex; gap: 8px; align-items: center;">
                                    <input type="hidden" name="order_id" value="<?= $ord['id'] ?>">
                                    <input type="hidden" name="payment_status" value="<?= $ord['payment_status'] ?>">
                                    
                                    <select name="order_status" class="form-select" style="padding: 6px 10px; font-size: 0.8rem; width: 190px; background: var(--bg-surface);">
                                        <?php foreach ($statusOptions as $k => $label): ?>
                                            <option value="<?= $k ?>" <?= ($ord['order_status'] === $k) ? 'selected' : '' ?>>
                                                <?= $label ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                    
                                    <button type="submit" name="update_order_status" class="btn-cyber btn-sm" style="font-size: 0.72rem; padding: 6px 12px;" title="Update Status & Sync XP">
                                        ⚡ SYNC
                                    </button>
                                </form>
                            </td>

                            <!-- Link to Live Tracking Radar -->
                            <td>
                                <a href="../order-tracking.php?order=<?= urlencode($ord['order_number']) ?>" target="_blank" class="btn-cyber-outline btn-sm" style="font-size: 0.72rem; padding: 6px 10px;">
                                    RADAR ↗
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
