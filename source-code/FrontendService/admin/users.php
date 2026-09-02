<?php
/**
 * Smartify Tech - Admin Player Profiles & Gamification XP Manager
 */

$pageTitle = 'Player Profiles & XP Manager — Smartify Tech Staff';
require_once __DIR__ . '/includes/header.php';

// Handle Manual XP Reward Grant
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['grant_xp'])) {
    $targetUserId = (int)$_POST['user_id'];
    $xpAmount = (int)$_POST['xp_amount'];
    $reason = sanitize($_POST['reason'] ?? 'Staff Bounty Grant');

    if ($targetUserId > 0 && $xpAmount > 0) {
        addPlayerXP($pdo, $targetUserId, $xpAmount, "Staff Command Grant: $reason");
        setFlash('success', "⚡ Successfully credited +$xpAmount XP to Player #$targetUserId.");
    }
    header('Location: users.php');
    exit;
}

// Fetch all registered players with profiles
$players = $pdo->query("
    SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
           COALESCE(p.xp, 0) as xp, COALESCE(p.level, 1) as level, COALESCE(p.title, 'TECH ROOKIE') as title,
           COALESCE(p.missions_completed, 0) as missions_completed, COALESCE(p.gear_acquired, 0) as gear_acquired
    FROM users u
    LEFT JOIN player_profiles p ON u.id = p.user_id
    ORDER BY p.xp DESC
")->fetchAll();
?>

<main class="container" style="padding: 40px 20px 80px;">
    <!-- Page Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
        <div>
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--hot-pink); letter-spacing: 2px;">RECRUIT &amp; VETERAN PLAYER RADAR</span>
            <h1 style="font-family: var(--font-heading); font-size: 2rem; color: #fff; margin-top: 4px;">
                👥 SMARTIFY PLAYER PROFILES (<?= count($players) ?> RECRUITS)
            </h1>
        </div>
    </div>

    <!-- Players Table -->
    <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 24px; overflow-x: auto;">
        <table class="table-cyber">
            <thead>
                <tr>
                    <th>SMARTIFY ID &amp; NAME</th>
                    <th>PLAYER LEVEL &amp; TITLE</th>
                    <th>COMBAT XP</th>
                    <th>MISSIONS / GEAR</th>
                    <th>ROLE</th>
                    <th>STAFF XP BOUNTY REWARD</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($players as $pl): ?>
                    <tr>
                        <!-- ID & Name -->
                        <td>
                            <strong style="color: #fff; font-size: 0.95rem;"><?= htmlspecialchars($pl['name']) ?></strong>
                            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-neon);">
                                #SMT-USR-<?= str_pad($pl['id'], 4, '0', STR_PAD_LEFT) ?>
                            </div>
                            <div style="font-size: 0.72rem; color: var(--text-dim);"><?= htmlspecialchars($pl['email']) ?> (<?= htmlspecialchars($pl['phone']) ?>)</div>
                        </td>

                        <!-- Level & Title -->
                        <td>
                            <span class="badge-tech badge-stock" style="font-size: 0.75rem;">
                                LVL 0<?= $pl['level'] ?>
                            </span>
                            <div style="font-family: var(--font-heading); font-size: 0.85rem; color: #fff; margin-top: 4px;">
                                <?= htmlspecialchars($pl['title']) ?>
                            </div>
                        </td>

                        <!-- Combat XP -->
                        <td>
                            <strong style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--emerald-xp);">
                                <?= number_format($pl['xp']) ?> XP
                            </strong>
                        </td>

                        <!-- Missions & Gear -->
                        <td>
                            <div style="font-family: var(--font-mono); font-size: 0.8rem; color: #fff;">
                                🚚 <?= $pl['missions_completed'] ?> Missions
                            </div>
                            <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
                                🎒 <?= $pl['gear_acquired'] ?> Gear Items
                            </div>
                        </td>

                        <!-- Role -->
                        <td>
                            <span class="badge-tech <?= ($pl['role'] === 'admin') ? 'badge-discount' : 'badge-xp' ?>">
                                <?= strtoupper($pl['role']) ?>
                            </span>
                        </td>

                        <!-- Grant XP Form -->
                        <td>
                            <form method="POST" action="users.php" style="display: flex; gap: 6px; align-items: center;">
                                <input type="hidden" name="user_id" value="<?= $pl['id'] ?>">
                                <select name="xp_amount" class="form-select" style="padding: 6px 8px; font-size: 0.78rem; width: 105px; background: var(--bg-surface);">
                                    <option value="50">+50 XP</option>
                                    <option value="100">+100 XP</option>
                                    <option value="250" selected>+250 XP</option>
                                    <option value="500">+500 XP</option>
                                    <option value="1000">+1000 XP</option>
                                </select>
                                <input type="text" name="reason" placeholder="Bounty reason..." class="form-input" style="padding: 6px 8px; font-size: 0.78rem; width: 120px; background: var(--bg-surface);">
                                <button type="submit" name="grant_xp" class="btn-cyber btn-sm" style="font-size: 0.72rem; padding: 6px 10px;">
                                    ⚡ GRANT
                                </button>
                            </form>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
