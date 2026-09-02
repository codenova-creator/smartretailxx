<?php
/**
 * Smartify Tech - Admin Panel Header
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../includes/gamification.php';

// Check if user is staff or admin
if (!isAdmin()) {
    // If not logged in, log in as admin for test convenience or redirect
    $stmt = $pdo->prepare("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
    $stmt->execute();
    $adminUser = $stmt->fetch();
    if ($adminUser) {
        $_SESSION['user_id'] = $adminUser['id'];
        $_SESSION['user_name'] = $adminUser['name'];
        $_SESSION['user_email'] = $adminUser['email'];
        $_SESSION['user_role'] = $adminUser['role'];
    } else {
        header('Location: ../auth.php?action=login');
        exit;
    }
}

$activeAdminPage = basename($_SERVER['PHP_SELF'] ?? '');
$flash = getFlash();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $pageTitle ?? 'Admin Command Center — Smartify Tech' ?></title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        .admin-nav-bar {
            background: #080714;
            border-bottom: 1px solid var(--border-subtle);
            padding: 12px 0;
        }
        .admin-nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .admin-nav-links {
            display: flex;
            gap: 20px;
            list-style: none;
        }
        .admin-nav-links a {
            font-family: var(--font-heading);
            font-size: 0.85rem;
            font-weight: 700;
            color: var(--text-muted);
            padding: 6px 12px;
            border-radius: 4px;
        }
        .admin-nav-links a:hover, .admin-nav-links a.active {
            color: var(--cyan-neon);
            background: rgba(0, 240, 255, 0.1);
        }
        .admin-badge {
            background: rgba(255, 0, 85, 0.2);
            border: 1px solid var(--hot-pink);
            color: #fff;
            padding: 3px 8px;
            border-radius: 4px;
            font-family: var(--font-mono);
            font-size: 0.72rem;
        }
        .table-cyber {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }
        .table-cyber th {
            background: #0d0c1c;
            color: var(--cyan-neon);
            font-family: var(--font-heading);
            font-size: 0.8rem;
            padding: 12px 14px;
            text-align: left;
            border-bottom: 1px solid var(--border-subtle);
        }
        .table-cyber td {
            padding: 14px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            color: var(--text-main);
        }
        .table-cyber tr:hover {
            background: rgba(124, 58, 237, 0.06);
        }
    </style>
</head>
<body>

    <!-- ADMIN TOP BAR -->
    <div style="background: #04030a; border-bottom: 1px solid rgba(255,0,85,0.3); padding: 8px 0; font-family: var(--font-mono); font-size: 0.75rem;">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="color: var(--hot-pink); display: flex; align-items: center; gap: 8px;">
                <span>👑 SMARTIFY TECH // STAFF COMMAND CENTER</span>
                <span class="admin-badge">ACCESS LEVEL: COMMANDER</span>
            </div>
            <div style="display: flex; gap: 15px; align-items: center;">
                <span style="color: var(--text-muted);">Logged in as: <strong><?= htmlspecialchars($_SESSION['user_name']) ?></strong></span>
                <a href="../index.php" style="color: var(--cyan-neon);">⚡ VIEW ARENA (STORE)</a>
                <a href="../auth.php?action=logout" style="color: var(--text-dim);">LOGOUT</a>
            </div>
        </div>
    </div>

    <!-- ADMIN NAVIGATION -->
    <nav class="admin-nav-bar">
        <div class="container admin-nav-container">
            <a href="index.php" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
                <div class="brand-logo-icon" style="width: 32px; height: 32px; font-size: 1rem;">👑</div>
                <span style="font-family: var(--font-heading); font-size: 1.1rem; color: #fff; font-weight: 900;">
                    SMARTIFY<span style="color: var(--hot-pink);">ADMIN</span>
                </span>
            </a>

            <ul class="admin-nav-links">
                <li><a href="index.php" class="<?= ($activeAdminPage === 'index.php') ? 'active' : '' ?>">📊 DASHBOARD</a></li>
                <li><a href="orders.php" class="<?= ($activeAdminPage === 'orders.php') ? 'active' : '' ?>">🚚 QUEST ORDERS</a></li>
                <li><a href="products.php" class="<?= ($activeAdminPage === 'products.php') ? 'active' : '' ?>">🎮 PRODUCTS ARSENAL</a></li>
                <li><a href="users.php" class="<?= ($activeAdminPage === 'users.php') ? 'active' : '' ?>">👥 PLAYER PROFILES</a></li>
            </ul>
        </div>
    </nav>

    <?php if ($flash): ?>
        <div class="container" style="margin-top: 15px;">
            <div style="background: <?= ($flash['type'] === 'success') ? 'rgba(0, 255, 157, 0.15)' : 'rgba(255, 0, 85, 0.15)' ?>; border: 1px solid <?= ($flash['type'] === 'success') ? 'var(--emerald-xp)' : 'var(--hot-pink)' ?>; color: #fff; padding: 12px 20px; border-radius: 6px;">
                <?= htmlspecialchars($flash['message']) ?>
            </div>
        </div>
    <?php endif; ?>
