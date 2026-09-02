<?php
/**
 * Smartify Tech - Streamlined 4-Step "Checkout Quest"
 */

require_once __DIR__ . '/config/db.php';
require_once __DIR__ . '/includes/gamification.php';

$loadout = $_SESSION['loadout'] ?? [];
if (empty($loadout)) {
    header('Location: shop.php');
    exit;
}

// Calculate totals
$subtotal = 0.0;
$totalItems = 0;
foreach ($loadout as $item) {
    $qty = (int)($item['qty'] ?? 1);
    $totalItems += $qty;
    $subtotal += ((float)$item['price']) * $qty;
}

$promoDiscount = 0.0;
if (!empty($_SESSION['promo_code'])) {
    if ($_SESSION['promo_code'] === 'CYBER10') $promoDiscount = $subtotal * 0.10;
    if ($_SESSION['promo_code'] === 'LEVELUP') $promoDiscount = $subtotal * 0.15;
}

$loadoutPower = calculateLoadoutPower($loadout, $subtotal);
$shippingFee = ($subtotal >= 50000 || $loadoutPower >= 100) ? 0.00 : 750.00;
$grandTotal = max(0, $subtotal - $promoDiscount + $shippingFee);
$xpToEarn = min(500, max(50, round($subtotal / 1000) * 10));

// Fetch user info for auto-fill
$user = null;
if (isLoggedIn()) {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([getCurrentUserId()]);
    $user = $stmt->fetch();
}

$districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
];

$pageTitle = 'CHECKOUT QUEST — Smartify Tech 4-Step Checkout';
require_once __DIR__ . '/includes/header.php';
?>

<main class="container" style="padding: 40px 20px 80px; max-width: 960px;">
    <!-- Title & XP Bounty Callout -->
    <div style="text-align: center; margin-bottom: 35px;">
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon); letter-spacing: 2px;">MISSION DEPLOYMENT PROTOCOL</span>
        <h1 style="font-family: var(--font-heading); font-size: 2.4rem; color: #fff; margin: 4px 0 8px;">
            ⚔️ CHECKOUT QUEST
        </h1>
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(0, 255, 157, 0.1); border: 1px solid var(--emerald-xp); padding: 4px 14px; border-radius: 20px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--emerald-xp);">
            <span>⚡ BOUNTY REWARD:</span> <strong>+<?= $xpToEarn ?> XP</strong> UPON MISSION SUCCESS
        </div>
    </div>

    <!-- 4-Step Stepper Bar -->
    <div class="checkout-stepper-bar">
        <div class="step-indicator-item active" data-step="1">
            <div class="step-circle">01</div>
            <span class="step-label">📍 Player Intel</span>
        </div>
        <div class="step-indicator-item" data-step="2">
            <div class="step-circle">02</div>
            <span class="step-label">🚚 Delivery Base</span>
        </div>
        <div class="step-indicator-item" data-step="3">
            <div class="step-circle">03</div>
            <span class="step-label">💳 Payment Battle</span>
        </div>
        <div class="step-indicator-item" data-step="4">
            <div class="step-circle">04</div>
            <span class="step-label">🏆 Confirm Mission</span>
        </div>
    </div>

    <!-- MAIN CHECKOUT FORM (Posts to order-process.php) -->
    <form action="order-process.php" method="POST" id="checkoutQuestForm">
        <input type="hidden" name="total_amount" value="<?= $grandTotal ?>">
        <input type="hidden" name="xp_earned" value="<?= $xpToEarn ?>">

        <!-- ===================================================================
             STEP 1: PLAYER DETAILS
             =================================================================== -->
        <div class="checkout-step-pane active" data-step="1">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 15px;">
                <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: #fff;">
                    STEP 01 // 📍 PLAYER IDENTIFICATION
                </h2>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon);">STEP 1 OF 4</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">Player Codename / Full Legal Name *</label>
                    <input type="text" name="name" class="form-input" placeholder="e.g. Alex Silva" value="<?= htmlspecialchars($user['name'] ?? '') ?>" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email Address (For Mission Briefing) *</label>
                    <input type="email" name="email" class="form-input" placeholder="player@domain.lk" value="<?= htmlspecialchars($user['email'] ?? '') ?>" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Mobile Number (Sri Lanka +94) *</label>
                    <input type="tel" name="phone" class="form-input" placeholder="077 123 4567" value="<?= htmlspecialchars($user['phone'] ?? '') ?>" required>
                </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 30px;">
                <button type="button" class="btn-cyber btn-next-step" data-next="2">
                    PROCEED TO DELIVERY MISSION →
                </button>
            </div>
        </div>

        <!-- ===================================================================
             STEP 2: DELIVERY MISSION ADDRESS
             =================================================================== -->
        <div class="checkout-step-pane" data-step="2">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 15px;">
                <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: #fff;">
                    STEP 02 // 🚚 DELIVERY MISSION BASE
                </h2>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon);">STEP 2 OF 4</span>
            </div>

            <div class="form-group">
                <label class="form-label">Street Address / Base Location *</label>
                <input type="text" name="address" class="form-input" placeholder="No. 42, Cyber Street, Level 4" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group">
                    <label class="form-label">City / Town *</label>
                    <input type="text" name="city" class="form-input" placeholder="e.g. Colombo 03, Kandy, Galle" required>
                </div>
                <div class="form-group">
                    <label class="form-label">District (Sri Lanka) *</label>
                    <select name="district" class="form-select" required>
                        <option value="">-- Select Destination District --</option>
                        <?php foreach ($districts as $d): ?>
                            <option value="<?= $d ?>" <?= ($d === 'Colombo') ? 'selected' : '' ?>><?= $d ?> District</option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Delivery Protocol Selection</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <label style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 6px; cursor: pointer; display: flex; gap: 10px; align-items: center;">
                        <input type="radio" name="delivery_method" value="standard" checked>
                        <div>
                            <strong style="color: #fff;">Islandwide Standard Express</strong>
                            <div style="font-size: 0.78rem; color: var(--text-muted);">1-3 Business Days // <?= ($shippingFee == 0) ? 'FREE (Perk Unlocked)' : formatLKR(750) ?></div>
                        </div>
                    </label>
                    <label style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 14px; border-radius: 6px; cursor: pointer; display: flex; gap: 10px; align-items: center;">
                        <input type="radio" name="delivery_method" value="colombo_fast">
                        <div>
                            <strong style="color: var(--cyan-neon);">Colombo Hyper-Speed (24h)</strong>
                            <div style="font-size: 0.78rem; color: var(--text-muted);">Same-day or next morning priority</div>
                        </div>
                    </label>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                <button type="button" class="btn-cyber-outline btn-prev-step" data-prev="1">
                    ← BACK TO INTEL
                </button>
                <button type="button" class="btn-cyber btn-next-step" data-next="3">
                    CHOOSE PAYMENT WEAPON →
                </button>
            </div>
        </div>

        <!-- ===================================================================
             STEP 3: PAYMENT BATTLE
             =================================================================== -->
        <div class="checkout-step-pane" data-step="3">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 15px;">
                <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: #fff;">
                    STEP 03 // 💳 PAYMENT METHOD
                </h2>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon);">STEP 3 OF 4</span>
            </div>

            <div class="payment-method-selector">
                <!-- Option 1: Cards -->
                <div class="payment-option-card selected">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 1.6rem;">💳</div>
                        <input type="radio" name="payment_method" value="card" checked>
                    </div>
                    <strong style="color: #fff;">Credit / Debit Card</strong>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">Visa, MasterCard, Amex via 256-Bit Gateway.</p>
                </div>

                <!-- Option 2: Koko 3-Pay -->
                <div class="payment-option-card">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 1.6rem; color: var(--cyan-neon);">⚡</div>
                        <input type="radio" name="payment_method" value="koko">
                    </div>
                    <strong style="color: var(--cyan-neon);">Koko 3-Installments</strong>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">Pay in 3 zero-interest slices (<?= formatLKR(round($grandTotal / 3)) ?>/mo).</p>
                </div>

                <!-- Option 3: COD -->
                <div class="payment-option-card">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 1.6rem; color: var(--emerald-xp);">💵</div>
                        <input type="radio" name="payment_method" value="cod">
                    </div>
                    <strong style="color: #fff;">Cash on Delivery</strong>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">Pay cash when gear reaches your base.</p>
                </div>
            </div>

            <!-- Standard Card Details Demo Mockup -->
            <div id="cardFieldsBox" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon); margin-bottom: 12px;">CARD DETAILS (SANDBOX READY)</div>
                <div class="form-group">
                    <label class="form-label">Card Number</label>
                    <input type="text" class="form-input" placeholder="4111 2222 3333 4444" value="4111 •••• •••• 4242">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label class="form-label">Expiry (MM/YY)</label>
                        <input type="text" class="form-input" placeholder="12/28" value="12/28">
                    </div>
                    <div class="form-group">
                        <label class="form-label">CVC / CVV</label>
                        <input type="password" class="form-input" placeholder="•••" value="777">
                    </div>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 30px;">
                <button type="button" class="btn-cyber-outline btn-prev-step" data-prev="2">
                    ← BACK TO DELIVERY
                </button>
                <button type="button" class="btn-cyber btn-next-step" data-next="4">
                    CONFIRM &amp; REVIEW MISSION →
                </button>
            </div>
        </div>

        <!-- ===================================================================
             STEP 4: CONFIRM MISSION & PLACE ORDER
             =================================================================== -->
        <div class="checkout-step-pane" data-step="4">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 15px;">
                <h2 style="font-family: var(--font-heading); font-size: 1.4rem; color: #fff;">
                    STEP 04 // 🏆 FINAL MISSION REVIEW
                </h2>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--emerald-xp);">READY TO LAUNCH</span>
            </div>

            <!-- Order Review Table -->
            <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <h4 style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--cyan-neon); margin-bottom: 12px;">EQUIPPED LOADOUT SUMMARY:</h4>
                <?php foreach ($loadout as $item): ?>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.9rem;">
                        <span style="color: #fff;"><?= htmlspecialchars($item['title']) ?> (x<?= $item['qty'] ?>)</span>
                        <span style="font-family: var(--font-mono); color: var(--cyan-neon);"><?= formatLKR($item['price'] * $item['qty']) ?></span>
                    </div>
                <?php endforeach; ?>

                <div style="display: flex; justify-content: space-between; margin-top: 15px; font-size: 0.95rem; color: var(--text-muted);">
                    <span>Delivery Islandwide:</span>
                    <span style="font-family: var(--font-mono); color: <?= ($shippingFee == 0) ? 'var(--emerald-xp)' : '#fff' ?>;">
                        <?= ($shippingFee == 0) ? 'FREE' : formatLKR($shippingFee) ?>
                    </span>
                </div>

                <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-subtle); font-family: var(--font-heading); font-size: 1.4rem; color: #fff;">
                    <span>FINAL TOTAL:</span>
                    <span style="color: var(--cyan-neon); text-shadow: 0 0 10px var(--cyan-glow);"><?= formatLKR($grandTotal) ?></span>
                </div>
            </div>

            <!-- XP Reward Banner -->
            <div style="background: rgba(124, 58, 237, 0.15); border: 1px solid var(--primary-purple); border-radius: 8px; padding: 18px; display: flex; align-items: center; gap: 15px; margin-bottom: 30px;">
                <div style="font-size: 2rem;">⚡</div>
                <div>
                    <strong style="color: #fff; font-family: var(--font-heading); font-size: 1rem;">MISSION XP BOUNTY: +<?= $xpToEarn ?> XP</strong>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
                        This order will immediately credit <strong>+<?= $xpToEarn ?> XP</strong> to your Smartify ID and level up your player profile.
                    </p>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center;">
                <button type="button" class="btn-cyber-outline btn-prev-step" data-prev="3">
                    ← EDIT DETAILS
                </button>
                <button type="submit" class="btn-cyber" style="font-size: 1.1rem; padding: 16px 36px;" id="btnPlaceOrderSubmit">
                    🚀 PLACE ORDER (DEPLOY MISSION)
                </button>
            </div>
        </div>
    </form>
</main>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
