<?php
/**
 * Smartify Tech - Gamer Profile ("SMARTIFY ID")
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/gamification.php';

// If not logged in, auto-login as demo Player 01 for smooth demonstration or redirect to login
if (!isLoggedIn()) {
    // Check if player01 exists
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = 'player01@smartify.lk'");
    $stmt->execute();
    $demoUser = $stmt->fetch();
    if ($demoUser) {
        $_SESSION['user_id'] = $demoUser['id'];
        $_SESSION['user_name'] = $demoUser['name'];
        $_SESSION['user_email'] = $demoUser['email'];
        $_SESSION['user_role'] = $demoUser['role'];
    } else {
        header('Location: auth.php');
        exit;
    }
}

$userId = getCurrentUserId();
$profile = getPlayerProfile($pdo, $userId);
$tiers = getLevelTiers();
$badges = getPlayerBadges($profile);
$xpLogs = getRecentXPTransactions($pdo, $userId, 8);

// Fetch Player's Past Orders
$stmtOrders = $pdo->prepare("
    SELECT o.*, COUNT(oi.id) as item_count 
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.id DESC
");
$stmtOrders->execute([$userId]);
$myOrders = $stmtOrders->fetchAll();

$pageTitle = 'SMARTIFY ID // ' . htmlspecialchars($profile['name']) . ' — Player Profile';
require_once __DIR__ . '/includes/header.php';
?>

<main class="container" style="padding: 40px 20px 80px; max-width: 1100px;">
    
    <!-- 1. HOLOGRAPHIC SMARTIFY ID CARD -->
    <div class="gamer-id-card" style="margin-bottom: 40px;">
        <div class="player-main-header">
            <div class="player-big-avatar">
                <?= $profile['tier_info']['icon'] ?? '🎮' ?>
            </div>
            <div style="flex: 1;">
                <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 4px;">
                    <span class="badge-tech badge-stock" style="background: rgba(0, 240, 255, 0.15); border-color: var(--cyan-neon); color: var(--cyan-neon);">
                        LEVEL 0<?= $profile['level'] ?> TIER
                    </span>
                    <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">
                        UID: #SMT-USR-<?= str_pad($profile['user_id'], 4, '0', STR_PAD_LEFT) ?>
                    </span>
                </div>
                <h1 class="player-tier-title">
                    <?= htmlspecialchars($profile['name']) ?> // <span><?= htmlspecialchars($profile['title']) ?></span>
                </h1>
                <p style="color: var(--text-muted); font-size: 0.88rem; font-family: var(--font-mono);">
                    <?= htmlspecialchars($profile['email']) ?> | Active Member Since <?= date('Y', strtotime($profile['created_at'] ?? 'now')) ?>
                </p>
            </div>
        </div>

        <!-- XP PROGRESSION BAR -->
        <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div>
                    <span style="font-family: var(--font-heading); font-size: 0.95rem; color: #fff;">
                        ⚡ XP PROGRESSION BAR
                    </span>
                    <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); margin-left: 8px;">
                        (<?= number_format($profile['xp']) ?> Total XP Earned)
                    </span>
                </div>
                <div style="font-family: var(--font-mono); font-weight: bold; font-size: 0.9rem; color: var(--emerald-xp);">
                    <?= is_numeric($profile['next_level_xp']) ? ($profile['xp'] . ' / ' . $profile['next_level_xp'] . ' XP (' . $profile['progress_percent'] . '%)') : 'MAX LEVEL ACHIEVED' ?>
                </div>
            </div>

            <div class="profile-xp-track">
                <div class="profile-xp-fill" style="width: <?= $profile['progress_percent'] ?>%;"></div>
            </div>

            <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim); margin-top: 6px;">
                <span>TIER MIN: <?= number_format($profile['tier_info']['min_xp']) ?> XP</span>
                <span style="color: var(--cyan-neon);">TIER DISCOUNT PERK: <?= $profile['tier_info']['discount'] ?> OFF</span>
                <span>NEXT TIER: <?= is_numeric($profile['next_level_xp']) ? number_format($profile['next_level_xp']) . ' XP' : 'LEGEND' ?></span>
            </div>
        </div>

        <!-- GAMER STATS COUNTERS -->
        <div class="gamer-stats-grid">
            <div class="stat-box">
                <h3><?= (int)$profile['missions_completed'] ?></h3>
                <p>Missions Completed</p>
            </div>
            <div class="stat-box">
                <h3><?= (int)$profile['gear_acquired'] ?></h3>
                <p>Gear Acquired</p>
            </div>
            <div class="stat-box">
                <h3><?= (int)$profile['reviews_count'] ?></h3>
                <p>Field Reviews</p>
            </div>
            <div class="stat-box">
                <h3 style="color: var(--emerald-xp);"><?= number_format($profile['xp']) ?></h3>
                <p>Combat XP</p>
            </div>
        </div>
    </div>

    <!-- 2. TWO-COLUMN LAYOUT (LEFT: ACHIEVEMENTS & LEVEL TIERS, RIGHT: MISSION LOG & XP HISTORY) -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: start;">
        
        <!-- LEFT COLUMN: BADGES & LEVEL MATRIX -->
        <div>
            <!-- Badges & Achievements -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <div class="section-header" style="margin-bottom: 18px;">
                    <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: #fff;">
                        🏅 UNLOCKED ACHIEVEMENTS
                    </h3>
                </div>

                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <?php foreach ($badges as $b): ?>
                        <div style="background: var(--bg-surface); border: 1px solid <?= $b['unlocked'] ? 'var(--cyan-neon)' : 'var(--border-subtle)' ?>; border-radius: 6px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; opacity: <?= $b['unlocked'] ? '1' : '0.5' ?>;">
                            <div style="display: flex; gap: 12px; align-items: center;">
                                <div style="font-size: 1.8rem;"><?= $b['icon'] ?></div>
                                <div>
                                    <h4 style="font-family: var(--font-heading); font-size: 0.9rem; color: #fff; margin-bottom: 2px;">
                                        <?= $b['name'] ?>
                                    </h4>
                                    <p style="font-size: 0.78rem; color: var(--text-muted);"><?= $b['desc'] ?></p>
                                </div>
                            </div>
                            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: <?= $b['unlocked'] ? 'var(--emerald-xp)' : 'var(--text-dim)' ?>; font-weight: bold;">
                                <?= $b['date'] ?>
                            </span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Level Progression Matrix -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 24px;">
                <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: #fff; margin-bottom: 15px;">
                    🗺️ LEVEL TIER SYSTEM
                </h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <?php foreach ($tiers as $lvl => $t): ?>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-radius: 6px; background: <?= ($profile['level'] == $lvl) ? 'rgba(124, 58, 237, 0.2)' : 'var(--bg-surface)' ?>; border: 1px solid <?= ($profile['level'] == $lvl) ? 'var(--primary-purple)' : 'var(--border-subtle)' ?>;">
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <span><?= $t['icon'] ?></span>
                                <strong style="color: <?= $t['color'] ?>; font-family: var(--font-heading); font-size: 0.85rem;">
                                    LVL 0<?= $lvl ?>: <?= $t['title'] ?>
                                </strong>
                            </div>
                            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
                                <?= ($lvl < 5) ? ($t['min_xp'] . ' - ' . $t['max_xp'] . ' XP') : '2501+ XP' ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <!-- RIGHT COLUMN: QUEST HISTORY & XP LOGS -->
        <div>
            <!-- Order History (Missions Completed) -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <div class="section-header" style="margin-bottom: 18px;">
                    <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: #fff;">
                        📦 RECENT MISSIONS
                    </h3>
                    <a href="shop.php" class="btn-cyber-outline btn-sm">+ NEW ORDER</a>
                </div>

                <?php if (empty($myOrders)): ?>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">No completed missions yet. Deploy your first order to earn XP!</p>
                <?php else: ?>
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        <?php foreach ($myOrders as $ord): ?>
                            <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px;">
                                        <strong style="font-family: var(--font-mono); color: var(--cyan-neon);">#<?= htmlspecialchars($ord['order_number']) ?></strong>
                                        <span class="badge-tech badge-stock" style="font-size: 0.68rem;"><?= strtoupper(str_replace('_', ' ', $ord['order_status'])) ?></span>
                                    </div>
                                    <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">
                                        <?= date('M d, Y', strtotime($ord['created_at'])) ?> // <?= formatLKR($ord['total_amount']) ?>
                                    </span>
                                </div>
                                <a href="order-tracking.php?order=<?= urlencode($ord['order_number']) ?>" class="btn-cyber btn-sm" style="font-size: 0.75rem; padding: 6px 12px;">
                                    TRACK
                                </a>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Recent XP History Activity Log -->
            <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 24px;">
                <h3 style="font-family: var(--font-heading); font-size: 1.15rem; color: #fff; margin-bottom: 15px;">
                    ⚡ RECENT XP LOGS
                </h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <?php if (empty($xpLogs)): ?>
                        <p style="color: var(--text-muted); font-size: 0.85rem;">No XP logged yet.</p>
                    <?php else: ?>
                        <?php foreach ($xpLogs as $log): ?>
                            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; font-size: 0.85rem;">
                                <div>
                                    <span style="color: #fff; font-weight: 500;"><?= htmlspecialchars($log['reason']) ?></span>
                                    <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim);">
                                        <?= date('M d, H:i', strtotime($log['created_at'])) ?>
                                    </div>
                                </div>
                                <span style="font-family: var(--font-mono); font-weight: bold; color: var(--emerald-xp);">
                                    +<?= $log['xp_amount'] ?> XP
                                </span>
                            </div>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>

    </div>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
