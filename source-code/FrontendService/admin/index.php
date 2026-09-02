<?php
/**
 * Smartify Tech - Admin Dashboard Overview
 */

$pageTitle = 'Dashboard Overview — Smartify Tech Commander';
require_once __DIR__ . '/includes/header.php';

// KPI Queries
$totalRevenue = (float)$pdo->query("SELECT SUM(total_amount) FROM orders WHERE payment_status = 'paid'")->fetchColumn();
$totalOrders = (int)$pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
$activeMissions = (int)$pdo->query("SELECT COUNT(*) FROM orders WHERE order_status != 'mission_complete'")->fetchColumn();
$totalUsers = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'customer'")->fetchColumn();
$totalProducts = (int)$pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();

// Low Stock Alert Query
$lowStockProducts = $pdo->query("SELECT * FROM products WHERE stock <= 10 ORDER BY stock ASC LIMIT 4")->fetchAll();

// Recent 6 Orders
$recentOrders = $pdo->query("
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.id DESC
    LIMIT 6
")->fetchAll();
?>

<main class="container" style="padding: 40px 20px 80px;">
    <!-- Dashboard Top Bar -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
        <div>
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--hot-pink); letter-spacing: 2px;">LIVE METRICS HUB</span>
            <h1 style="font-family: var(--font-heading); font-size: 2rem; color: #fff; margin-top: 4px;">
                COMMAND CENTER DASHBOARD
            </h1>
        </div>
        <div style="display: flex; gap: 10px;">
            <a href="products.php?action=create" class="btn-cyber btn-sm">
                + ADD NEW HARDWARE
            </a>
            <a href="orders.php" class="btn-cyber btn-cyber-cyan btn-sm">
                🚚 MANAGE QUESTS
            </a>
        </div>
    </div>

    <!-- 4-Stat Metric Cards Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 40px;">
        <!-- Card 1: Revenue -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 22px;">
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px;">TOTAL REVENUE (LKR)</div>
            <div style="font-family: var(--font-heading); font-size: 1.8rem; color: var(--cyan-neon); font-weight: 900;">
                <?= formatLKR($totalRevenue) ?>
            </div>
            <div style="font-size: 0.75rem; color: var(--emerald-xp); margin-top: 4px;">● Islandwide Transactions</div>
        </div>

        <!-- Card 2: Active Missions -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 22px;">
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px;">ACTIVE DELIVERY MISSIONS</div>
            <div style="font-family: var(--font-heading); font-size: 1.8rem; color: var(--amber-gold); font-weight: 900;">
                <?= $activeMissions ?> <span style="font-size: 0.9rem; color: var(--text-dim);">/ <?= $totalOrders ?> Total</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--cyan-neon); margin-top: 4px;">● In Dispatch Progress</div>
        </div>

        <!-- Card 3: Registered Players -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 22px;">
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px;">REGISTERED PLAYERS</div>
            <div style="font-family: var(--font-heading); font-size: 1.8rem; color: var(--primary-violet); font-weight: 900;">
                <?= $totalUsers ?>
            </div>
            <div style="font-size: 0.75rem; color: var(--emerald-xp); margin-top: 4px;">● Smartify ID Accounts</div>
        </div>

        <!-- Card 4: Catalog Hardware -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 22px;">
            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px;">ARSENAL PRODUCTS</div>
            <div style="font-family: var(--font-heading); font-size: 1.8rem; color: #fff; font-weight: 900;">
                <?= $totalProducts ?>
            </div>
            <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 4px;">● Verified SKUs</div>
        </div>
    </div>

    <!-- Main Grid: Recent Orders (Left) & Low Stock Alerts (Right) -->
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 30px; align-items: start;">
        
        <!-- Recent Orders Table -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: #fff;">
                    📦 RECENT QUEST ORDERS
                </h3>
                <a href="orders.php" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-neon);">VIEW ALL MISSIONS →</a>
            </div>

            <div style="overflow-x: auto;">
                <table class="table-cyber">
                    <thead>
                        <tr>
                            <th>ORDER #</th>
                            <th>PLAYER</th>
                            <th>AMOUNT</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recentOrders as $o): ?>
                            <tr>
                                <td>
                                    <strong style="font-family: var(--font-mono); color: var(--cyan-neon);">#<?= htmlspecialchars($o['order_number']) ?></strong>
                                    <div style="font-size: 0.72rem; color: var(--text-dim);"><?= date('M d, H:i', strtotime($o['created_at'])) ?></div>
                                </td>
                                <td>
                                    <div style="font-weight: 600; color: #fff;"><?= htmlspecialchars($o['shipping_name']) ?></div>
                                    <div style="font-size: 0.75rem; color: var(--text-muted);"><?= htmlspecialchars($o['shipping_phone']) ?></div>
                                </td>
                                <td>
                                    <strong style="font-family: var(--font-mono); color: #fff;"><?= formatLKR($o['total_amount']) ?></strong>
                                    <div style="font-size: 0.72rem; color: var(--emerald-xp);">+<?= $o['xp_earned'] ?> XP</div>
                                </td>
                                <td>
                                    <span class="badge-tech badge-stock" style="font-size: 0.7rem;">
                                        <?= strtoupper(str_replace('_', ' ', $o['order_status'])) ?>
                                    </span>
                                </td>
                                <td>
                                    <a href="orders.php?order=<?= urlencode($o['order_number']) ?>" class="btn-cyber btn-sm" style="font-size: 0.72rem; padding: 6px 12px;">
                                        UPDATE QUEST
                                    </a>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Low Stock Alerts & Inventory Health -->
        <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 24px;">
            <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: #fff; margin-bottom: 15px;">
                ⚠️ LOW STOCK ARSENAL
            </h3>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px;">
                Hardware units running low on stock in the armory.
            </p>

            <div style="display: flex; flex-direction: column; gap: 12px;">
                <?php foreach ($lowStockProducts as $lp): ?>
                    <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <img src="../<?= htmlspecialchars($lp['image_main']) ?>" style="width: 35px; height: 35px; object-fit: contain;">
                            <div>
                                <h4 style="font-family: var(--font-subhead); font-size: 0.88rem; color: #fff; margin-bottom: 2px;">
                                    <?= htmlspecialchars($lp['title']) ?>
                                </h4>
                                <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-neon);"><?= formatLKR($lp['price']) ?></span>
                            </div>
                        </div>
                        <span class="badge-tech badge-discount" style="font-size: 0.72rem;">
                            <?= $lp['stock'] ?> LEFT
                        </span>
                    </div>
                <?php endforeach; ?>
            </div>

            <div style="margin-top: 20px;">
                <a href="products.php" class="btn-cyber btn-cyber-outline btn-sm" style="width: 100%; text-align: center;">
                    INSPECT FULL INVENTORY →
                </a>
            </div>
        </div>

    </div>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
