<?php
/**
 * Smartify Tech - Mission Processing Animation & Order Saving
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/gamification.php';

$loadout = $_SESSION['loadout'] ?? [];
if (empty($loadout) && empty($_POST['total_amount'])) {
    header('Location: shop.php');
    exit;
}

// Receive form data
$name = sanitize($_POST['name'] ?? 'Player 01');
$email = sanitize($_POST['email'] ?? 'player01@smartify.lk');
$phone = sanitize($_POST['phone'] ?? '077 123 4567');
$address = sanitize($_POST['address'] ?? '') . ', ' . sanitize($_POST['city'] ?? '') . ' (' . sanitize($_POST['district'] ?? 'Colombo') . ')';
$paymentMethod = sanitize($_POST['payment_method'] ?? 'card');
$totalAmount = (float)($_POST['total_amount'] ?? 0);
$xpEarned = (int)($_POST['xp_earned'] ?? 350);

// Generate unique order number (e.g. SMT10294)
$orderNumber = 'SMT' . rand(10000, 99999);

// Resolve User ID
$userId = getCurrentUserId();
if (!$userId) {
    // Check if user with this email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $existing = $stmt->fetch();
    if ($existing) {
        $userId = $existing['id'];
    } else {
        // Create new user & profile
        $dummyPass = password_hash('password', PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'customer')");
        $stmt->execute([$name, $email, $phone, $dummyPass]);
        $userId = $pdo->lastInsertId();

        $stmt = $pdo->prepare("INSERT INTO player_profiles (user_id, xp, level, title) VALUES (?, 100, 1, 'TECH ROOKIE')");
        $stmt->execute([$userId]);
    }
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_name'] = $name;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_role'] = 'customer';
}

// Insert Order into Database
$paymentStatus = ($paymentMethod === 'cod') ? 'pending' : 'paid';
$stmt = $pdo->prepare("
    INSERT INTO orders (
        order_number, user_id, total_amount, xp_earned, shipping_name, shipping_phone, shipping_address, payment_method, payment_status, order_status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', NOW())
");
$stmt->execute([
    $orderNumber, $userId, $totalAmount, $xpEarned, $name, $phone, $address, $paymentMethod, $paymentStatus
]);
$orderId = $pdo->lastInsertId();

// Insert Order Items
$stmtItem = $pdo->prepare("INSERT INTO order_items (order_id, product_id, price, quantity) VALUES (?, ?, ?, ?)");
$totalGearCount = 0;
foreach ($loadout as $pId => $item) {
    $stmtItem->execute([$orderId, $pId, $item['price'], $item['qty']]);
    $totalGearCount += (int)$item['qty'];
}

// Award XP to player profile
addPlayerXP($pdo, $userId, $xpEarned, "Mission Deployment #$orderNumber Completed");

// Update Missions Completed count & gear acquired
$stmt = $pdo->prepare("UPDATE player_profiles SET missions_completed = missions_completed + 1, gear_acquired = gear_acquired + ? WHERE user_id = ?");
$stmt->execute([$totalGearCount, $userId]);

// Clear session loadout and promo
$_SESSION['loadout'] = [];
unset($_SESSION['promo_code']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>⚡ MISSION STARTED — Smartify Tech</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        body {
            background: #06050e;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }
        .mission-screen {
            max-width: 620px;
            width: 100%;
            background: #0f0e21;
            border: 1px solid var(--cyan-neon);
            border-radius: 12px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 0 50px rgba(0, 240, 255, 0.3);
            clip-path: polygon(25px 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%, 0 25px);
        }
        .progress-bar-term {
            width: 100%;
            height: 14px;
            background: #05040a;
            border-radius: 7px;
            overflow: hidden;
            margin: 20px 0;
            border: 1px solid var(--border-subtle);
        }
        .progress-bar-term-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, var(--primary-purple), var(--cyan-neon), var(--emerald-xp));
            transition: width 0.3s ease;
            box-shadow: 0 0 15px var(--cyan-glow);
        }
    </style>
</head>
<body>

    <div class="mission-screen">
        <div style="font-size: 3.5rem; margin-bottom: 10px; animation: pulse 1.2s infinite;">⚡</div>
        <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--cyan-neon); letter-spacing: 3px;">
            SMARTIFY CORE DEPLOYMENT PROTOCOL
        </span>
        <h1 style="font-family: var(--font-heading); font-size: 2rem; color: #fff; margin: 10px 0 20px;">
            ⚡ MISSION STARTED ⚡
        </h1>

        <div id="termLogs" style="background: #05040a; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 18px; font-family: var(--font-mono); font-size: 0.85rem; color: var(--emerald-xp); text-align: left; min-height: 120px; line-height: 1.8;">
            <div>> INITIATING SECURE MISSION PROTOCOL...</div>
        </div>

        <div class="progress-bar-term">
            <div id="termProgressFill" class="progress-bar-term-fill"></div>
        </div>

        <p id="statusMsg" style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">
            VERIFYING LOADOUT HARDWARE...
        </p>
    </div>

    <script src="assets/js/app.js"></script>
    <script>
        const logs = document.getElementById('termLogs');
        const fill = document.getElementById('termProgressFill');
        const statusMsg = document.getElementById('statusMsg');
        const targetUrl = 'order-confirmation.php?order=<?= $orderNumber ?>';

        const steps = [
            { pct: 35, log: '> VERIFYING LOADOUT GEAR... 35%', status: 'RESERVING ARSENAL UNITS...' },
            { pct: 68, log: '> LOCKING INVENTORY & MISSION XP... 68%', status: 'ENCRYPTING DELIVERY MISSION...' },
            { pct: 100, log: '> ✓ ORDER CONFIRMED! DEPLOYING COURIER SQUAD... 100%', status: 'REDIRECTING TO MISSION BRIEFING...' }
        ];

        let index = 0;
        const interval = setInterval(() => {
            if (index < steps.length) {
                const s = steps[index];
                fill.style.width = s.pct + '%';
                logs.innerHTML += `<div>${s.log}</div>`;
                statusMsg.textContent = s.status;
                if (window.cyberAudio) window.cyberAudio.playBeep(450 + (index * 250), 0.08);
                index++;
            } else {
                clearInterval(interval);
                if (window.cyberAudio) window.cyberAudio.playLevelUp();
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 800);
            }
        }, 650);
    </script>
</body>
</html>
