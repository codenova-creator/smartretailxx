<?php
/**
 * Smartify Tech - Footer Component
 */
?>
    <!-- FOOTER TRUST BANNER -->
    <section style="background: #0b0a1a; border-top: 1px solid var(--border-subtle); padding: 35px 0;">
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 25px;">
                <div style="display: flex; gap: 15px; align-items: center;">
                    <div style="font-size: 2.2rem; color: var(--cyan-neon);">⚡</div>
                    <div>
                        <h4 style="font-family: var(--font-heading); font-size: 0.95rem; color: #fff;">1-3 DAYS DELIVERY</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">Islandwide tracked express shipping</p>
                    </div>
                </div>
                <div style="display: flex; gap: 15px; align-items: center;">
                    <div style="font-size: 2.2rem; color: var(--primary-violet);">🛡️</div>
                    <div>
                        <h4 style="font-family: var(--font-heading); font-size: 0.95rem; color: #fff;">100% GENUINE GEAR</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">Official agent & brand warranty</p>
                    </div>
                </div>
                <div style="display: flex; gap: 15px; align-items: center;">
                    <div style="font-size: 2.2rem; color: var(--emerald-xp);">💳</div>
                    <div>
                        <h4 style="font-family: var(--font-heading); font-size: 0.95rem; color: #fff;">KOKO 3-INSTALLMENTS</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">Buy now, pay in 3 zero-interest slices</p>
                    </div>
                </div>
                <div style="display: flex; gap: 15px; align-items: center;">
                    <div style="font-size: 2.2rem; color: var(--amber-gold);">👑</div>
                    <div>
                        <h4 style="font-family: var(--font-heading); font-size: 0.95rem; color: #fff;">LEVEL UP REWARDS</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">Earn XP on every order & unlock perks</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- MAIN FOOTER -->
    <footer class="main-footer">
        <div class="container">
            <div class="footer-grid">
                <!-- Column 1: Brand & Bio -->
                <div class="footer-col">
                    <div class="brand-logo" style="margin-bottom: 15px;">
                        <div class="brand-logo-icon">⚡</div>
                        <div>
                            <div class="brand-title">SMARTIFY<span>TECH</span></div>
                            <span class="brand-subtitle">THE GAMING HARDWARE ARENA</span>
                        </div>
                    </div>
                    <p style="color: var(--text-muted); font-size: 0.88rem; margin-bottom: 20px; max-width: 320px;">
                        Sri Lanka's premiere destination for high-performance esports gear, next-gen consoles, audio battle stations, and high-wattage power gear.
                    </p>
                    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan-neon);">
                        SYSTEM STATUS: <span style="color: var(--emerald-xp);">● ARENA ONLINE // 99.9% UPTIME</span>
                    </div>
                </div>

                <!-- Column 2: Quick Quests -->
                <div class="footer-col">
                    <h4>QUICK LINKS</h4>
                    <ul class="footer-links">
                        <li><a href="shop.php">Enter The Arena (Shop)</a></li>
                        <li><a href="shop.php?flash=1">Flash Drops & Deals</a></li>
                        <li><a href="cart.php">Your Loadout Cart</a></li>
                        <li><a href="order-tracking.php">Track Delivery Mission</a></li>
                        <li><a href="profile.php">Smartify ID & Stats</a></li>
                    </ul>
                </div>

                <!-- Column 3: Gear Categories -->
                <div class="footer-col">
                    <h4>GEAR ARSENAL</h4>
                    <ul class="footer-links">
                        <li><a href="shop.php?cat=gaming-consoles">PlayStation & Rigs</a></li>
                        <li><a href="shop.php?cat=gaming-gear">Razer & Logitech G</a></li>
                        <li><a href="shop.php?cat=audio-headsets">SteelSeries & JBL Audio</a></li>
                        <li><a href="shop.php?cat=power-charging">Anker Fast Chargers</a></li>
                        <li><a href="shop.php?cat=phones-gadgets">Apple & Samsung Tech</a></li>
                    </ul>
                </div>

                <!-- Column 4: XP Newsletter & Payment Methods -->
                <div class="footer-col">
                    <h4>JOIN INTEL SQUAD</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
                        Subscribe for secret flash drop alerts & earn <strong>+25 XP</strong> instantly.
                    </p>
                    <form onsubmit="event.preventDefault(); window.showXPToast('Intel Squad Joined', 'Welcome to drops feed', 25); this.reset();" style="display: flex; gap: 8px; margin-bottom: 20px;">
                        <input type="email" placeholder="gamer@email.lk" required style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 10px 14px; border-radius: 4px; color: #fff; font-size: 0.85rem; flex: 1; outline: none;">
                        <button type="submit" class="btn-cyber btn-sm" style="white-space: nowrap;">JOIN</button>
                    </form>

                    <h4 style="font-size: 0.85rem; margin-bottom: 10px;">SECURE CHECKOUT PARTNERS</h4>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">
                        <span style="background: #15142b; border: 1px solid var(--border-subtle); padding: 4px 8px; border-radius: 4px;">💳 VISA / MASTERCARD</span>
                        <span style="background: #15142b; border: 1px solid var(--primary-purple); color: var(--cyan-neon); padding: 4px 8px; border-radius: 4px;">⚡ KOKO 3-PAY</span>
                        <span style="background: #15142b; border: 1px solid var(--border-subtle); padding: 4px 8px; border-radius: 4px;">💵 CASH ON DELIVERY</span>
                    </div>
                </div>
            </div>

            <!-- Bottom Row -->
            <div class="footer-bottom-bar">
                <div>
                    &copy; <?= date('Y') ?> <strong>SMARTIFY TECH SRI LANKA</strong>. All Rights Reserved.
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.75rem;">
                    BUILT FOR GAMERS & PROS // POWERED BY CYBER ENGINE
                </div>
            </div>
        </div>
    </footer>

    <!-- Floating XP Toast Container -->
    <div id="xpToastContainer" class="xp-toast-container"></div>

    <!-- Client Controller Script -->
    <script src="assets/js/app.js"></script>
</body>
</html>
