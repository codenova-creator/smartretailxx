<?php
/**
 * Smartify Tech - Authentication Handler (Login / Register / Quick Switch)
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/gamification.php';

$action = $_GET['action'] ?? $_POST['action'] ?? 'login';

// 1-Click Quick Demo Login Switcher (for fast testing)
if ($action === 'quick_player') {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = 'player01@smartify.lk'");
    $stmt->execute();
    $user = $stmt->fetch();
    if ($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $user['role'];
        setFlash('success', '⚡ Logged in as Player 01 (Tech Explorer)!');
    }
    header('Location: profile.php');
    exit;
}

if ($action === 'quick_admin') {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = 'admin@smartify.lk'");
    $stmt->execute();
    $user = $stmt->fetch();
    if ($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $user['role'];
        setFlash('success', '👑 Admin Command Center Activated!');
    }
    header('Location: admin/index.php');
    exit;
}

if ($action === 'logout') {
    session_destroy();
    header('Location: index.php');
    exit;
}

$error = '';
$success = '';

// Handle Login Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'login') {
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($email && $password) {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_role'] = $user['role'];

            // Log daily login XP
            addPlayerXP($pdo, $user['id'], 25, 'Daily Login Reward');

            setFlash('success', '🎮 Welcome back to Smartify Tech Arena, ' . $user['name'] . '!');
            if (in_array($user['role'], ['admin', 'staff'])) {
                header('Location: admin/index.php');
            } else {
                header('Location: profile.php');
            }
            exit;
        } else {
            $error = 'Invalid email or password. Please try again.';
        }
    } else {
        $error = 'Please fill in all login fields.';
    }
}

// Handle Register Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'register') {
    $name = sanitize($_POST['name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $phone = sanitize($_POST['phone'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($name && $email && $phone && $password) {
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $error = 'A player with this email already exists.';
        } else {
            $hash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'customer')");
            $stmt->execute([$name, $email, $phone, $hash]);
            $newUserId = $pdo->lastInsertId();

            // Create initial player profile with 100 starter XP
            $stmtProfile = $pdo->prepare("INSERT INTO player_profiles (user_id, xp, level, title) VALUES (?, 100, 1, 'TECH ROOKIE')");
            $stmtProfile->execute([$newUserId]);

            // Add XP record
            $stmtXP = $pdo->prepare("INSERT INTO xp_transactions (user_id, xp_amount, reason) VALUES (?, 100, 'Recruit Welcome Bonus')");
            $stmtXP->execute([$newUserId]);

            $_SESSION['user_id'] = $newUserId;
            $_SESSION['user_name'] = $name;
            $_SESSION['user_email'] = $email;
            $_SESSION['user_role'] = 'customer';

            setFlash('success', '⚡ Recruit ID Created! +100 Starter XP Awarded.');
            header('Location: profile.php');
            exit;
        }
    } else {
        $error = 'Please fill in all registration fields.';
    }
}

$pageTitle = ($action === 'register') ? 'Register Player ID — Smartify Tech' : 'Login — Smartify Tech';
require_once __DIR__ . '/includes/header.php';
?>

<main class="container" style="padding: 60px 20px; max-width: 540px;">
    <div style="background: var(--bg-card); border: 1px solid var(--primary-purple); border-radius: 12px; padding: 35px; box-shadow: var(--glow-purple-sm); clip-path: polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px);">
        
        <div style="text-align: center; margin-bottom: 25px;">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon); letter-spacing: 2px;">SMARTIFY AUTH PROTOCOL</span>
            <h1 style="font-family: var(--font-heading); font-size: 1.8rem; color: #fff; margin-top: 5px;">
                <?= ($action === 'register') ? '⚡ CREATE SMARTIFY ID' : '🎮 ACCESS SYSTEM' ?>
            </h1>
        </div>

        <?php if ($error): ?>
            <div style="background: rgba(255, 0, 85, 0.15); border: 1px solid var(--hot-pink); color: #ff6699; padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 0.9rem;">
                ⚠️ <?= $error ?>
            </div>
        <?php endif; ?>

        <?php if ($action === 'register'): ?>
            <!-- REGISTER FORM -->
            <form action="auth.php?action=register" method="POST">
                <div class="form-group">
                    <label class="form-label">Player Codename / Full Name</label>
                    <input type="text" name="name" class="form-input" placeholder="e.g. Alex CyberViper" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" name="email" class="form-input" placeholder="player@domain.lk" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Mobile Number (Sri Lanka)</label>
                    <input type="text" name="phone" class="form-input" placeholder="077 123 4567" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Security Passcode</label>
                    <input type="password" name="password" class="form-input" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn-cyber" style="width: 100%; margin-top: 10px;">
                    🚀 ACTIVATE SMARTIFY ID (+100 XP)
                </button>
            </form>
            <div style="text-align: center; margin-top: 20px; font-size: 0.9rem; color: var(--text-muted);">
                Already have an ID? <a href="auth.php?action=login" style="color: var(--cyan-neon); font-weight: bold;">Login here</a>
            </div>
        <?php else: ?>
            <!-- LOGIN FORM -->
            <form action="auth.php?action=login" method="POST">
                <div class="form-group">
                    <label class="form-label">Player Email</label>
                    <input type="email" name="email" class="form-input" placeholder="player01@smartify.lk" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Passcode</label>
                    <input type="password" name="password" class="form-input" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn-cyber" style="width: 100%; margin-top: 10px;">
                    ⚡ LOGIN TO LOADOUT
                </button>
            </form>

            <!-- Quick Demo Login Buttons for Tester -->
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--border-subtle); text-align: center;">
                <p style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim); margin-bottom: 12px;">QUICK DEMO ACCESS FOR EVALUATION:</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <a href="auth.php?action=quick_player" class="btn-cyber-cyan btn-sm" style="font-size: 0.75rem;">
                        🎮 LOGIN PLAYER 01
                    </a>
                    <a href="auth.php?action=quick_admin" class="btn-cyber-pink btn-sm" style="font-size: 0.75rem;">
                        👑 LOGIN ADMIN
                    </a>
                </div>
            </div>

            <div style="text-align: center; margin-top: 20px; font-size: 0.9rem; color: var(--text-muted);">
                Need a Gamer ID? <a href="auth.php?action=register" style="color: var(--cyan-neon); font-weight: bold;">Register & get +100 XP</a>
            </div>
        <?php endif; ?>

    </div>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
