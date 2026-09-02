<?php
/**
 * Smartify Tech - Database Setup & Seeder Script
 */

$host = '127.0.0.1';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

echo "<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <title>Smartify Tech - Database Migration</title>
    <style>
        body { background: #0A0915; color: #E2E8F0; font-family: 'Courier New', monospace; padding: 40px; line-height: 1.6; }
        .box { max-width: 800px; margin: 0 auto; background: #121124; border: 1px solid #7C3AED; border-radius: 8px; padding: 30px; box-shadow: 0 0 30px rgba(124, 58, 237, 0.3); }
        h1 { color: #00F0FF; margin-top: 0; text-shadow: 0 0 10px rgba(0, 240, 255, 0.5); }
        .success { color: #00FF9D; }
        .step { margin: 8px 0; }
        .btn { display: inline-block; background: #7C3AED; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; border: 1px solid #00F0FF; box-shadow: 0 0 15px rgba(124, 58, 237, 0.6); }
        .btn:hover { background: #6D28D9; }
    </style>
</head>
<body>
<div class='box'>
    <h1>⚡ SMARTIFY TECH // SYSTEM INITIALIZATION</h1>
";

try {
    $pdoRoot = new PDO("mysql:host=$host;charset=$charset", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    echo "<div class='step'>[1/6] Connecting to MySQL Server... <span class='success'>ONLINE</span></div>";

    // 1. Create Database
    $pdoRoot->exec("CREATE DATABASE IF NOT EXISTS smartify_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdoRoot->exec("USE smartify_db");
    echo "<div class='step'>[2/6] Initializing `smartify_db` database... <span class='success'>READY</span></div>";

    // 2. Drop existing tables if re-running
    $pdoRoot->exec("SET FOREIGN_KEY_CHECKS = 0;");
    $tables = ['xp_transactions', 'order_items', 'orders', 'products', 'brands', 'categories', 'player_profiles', 'users'];
    foreach ($tables as $t) {
        $pdoRoot->exec("DROP TABLE IF EXISTS `$t`");
    }
    $pdoRoot->exec("SET FOREIGN_KEY_CHECKS = 1;");

    // 3. Create Tables
    $pdoRoot->exec("
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            phone VARCHAR(20) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('customer', 'staff', 'admin') DEFAULT 'customer',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB;

        CREATE TABLE player_profiles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            xp INT DEFAULT 0,
            level INT DEFAULT 1,
            title VARCHAR(50) DEFAULT 'TECH ROOKIE',
            missions_completed INT DEFAULT 0,
            gear_acquired INT DEFAULT 0,
            reviews_count INT DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;

        CREATE TABLE categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            slug VARCHAR(100) UNIQUE NOT NULL,
            icon_svg TEXT,
            banner_img VARCHAR(255)
        ) ENGINE=InnoDB;

        CREATE TABLE brands (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            logo VARCHAR(255)
        ) ENGINE=InnoDB;

        CREATE TABLE products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            category_id INT,
            brand_id INT,
            title VARCHAR(200) NOT NULL,
            slug VARCHAR(200) UNIQUE NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            discount_price DECIMAL(10,2) NULL,
            stock INT DEFAULT 0,
            rating DECIMAL(2,1) DEFAULT 5.0,
            reviews_count INT DEFAULT 0,
            description TEXT,
            specifications JSON,
            image_main VARCHAR(255),
            is_flash_deal TINYINT(1) DEFAULT 0,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
            FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL
        ) ENGINE=InnoDB;

        CREATE TABLE orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_number VARCHAR(20) UNIQUE NOT NULL,
            user_id INT NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL,
            xp_earned INT DEFAULT 0,
            shipping_name VARCHAR(100) NOT NULL,
            shipping_phone VARCHAR(20) NOT NULL,
            shipping_address TEXT NOT NULL,
            payment_method ENUM('card', 'koko', 'cod') NOT NULL,
            payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
            order_status ENUM('confirmed', 'loadout_verified', 'gear_preparing', 'dispatched', 'out_for_delivery', 'mission_complete') DEFAULT 'confirmed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        ) ENGINE=InnoDB;

        CREATE TABLE order_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            product_id INT NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            quantity INT NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id)
        ) ENGINE=InnoDB;

        CREATE TABLE xp_transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            xp_amount INT NOT NULL,
            reason VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");

    echo "<div class='step'>[3/6] Creating Database Schema Tables... <span class='success'>CREATED</span></div>";

    // 4. Seed Categories & Brands
    $categories = [
        ['Gaming Consoles & Rigs', 'gaming-consoles', '🎮', 'assets/images/cat-gaming.jpg'],
        ['Audio & Pro Headsets', 'audio-headsets', '🎧', 'assets/images/cat-audio.jpg'],
        ['PC Gaming Gear & Keyboards', 'gaming-gear', '⌨️', 'assets/images/cat-gear.jpg'],
        ['Phones & Smart Gadgets', 'phones-gadgets', '📱', 'assets/images/cat-phones.jpg'],
        ['Power & Fast Charging', 'power-charging', '⚡', 'assets/images/cat-power.jpg'],
        ['Streaming & Creator Tech', 'streaming-creator', '🎙️', 'assets/images/cat-streaming.jpg']
    ];
    $stmtCat = $pdoRoot->prepare("INSERT INTO categories (name, slug, icon_svg, banner_img) VALUES (?, ?, ?, ?)");
    foreach ($categories as $cat) {
        $stmtCat->execute($cat);
    }

    $brands = [
        ['Sony PlayStation', 'assets/images/brands/sony.png'],
        ['Apple', 'assets/images/brands/apple.png'],
        ['ASUS ROG', 'assets/images/brands/asus.png'],
        ['Razer', 'assets/images/brands/razer.png'],
        ['Logitech G', 'assets/images/brands/logitech.png'],
        ['Anker', 'assets/images/brands/anker.png'],
        ['JBL', 'assets/images/brands/jbl.png'],
        ['Samsung', 'assets/images/brands/samsung.png'],
        ['SteelSeries', 'assets/images/brands/steelseries.png'],
        ['Baseus', 'assets/images/brands/baseus.png']
    ];
    $stmtBrand = $pdoRoot->prepare("INSERT INTO brands (name, logo) VALUES (?, ?)");
    foreach ($brands as $brand) {
        $stmtBrand->execute($brand);
    }
    echo "<div class='step'>[4/6] Seeding Categories & Brands... <span class='success'>POPULATED</span></div>";

    // 5. Seed Users & Demo Profiles
    $password = password_hash('password', PASSWORD_BCRYPT);
    $adminPassword = password_hash('admin123', PASSWORD_BCRYPT);

    // Customer: Player 01
    $stmtUser = $pdoRoot->prepare("INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)");
    $stmtUser->execute(['Player 01 (Tech Pioneer)', 'player01@smartify.lk', '0771234567', $password, 'customer']);
    $player1Id = $pdoRoot->lastInsertId();

    $stmtProfile = $pdoRoot->prepare("INSERT INTO player_profiles (user_id, xp, level, title, missions_completed, gear_acquired, reviews_count) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmtProfile->execute([$player1Id, 750, 3, 'TECH EXPLORER', 6, 11, 4]);

    // XP Logs for Player 01
    $stmtXP = $pdoRoot->prepare("INSERT INTO xp_transactions (user_id, xp_amount, reason, created_at) VALUES (?, ?, ?, ?)");
    $stmtXP->execute([$player1Id, 100, 'Recruit Welcome Bonus', date('Y-m-d H:i:s', strtotime('-10 days'))]);
    $stmtXP->execute([$player1Id, 300, 'Mission #SMT9012 Completed', date('Y-m-d H:i:s', strtotime('-5 days'))]);
    $stmtXP->execute([$player1Id, 50, 'Loadout Weapon Acquired (Razer Mouse)', date('Y-m-d H:i:s', strtotime('-3 days'))]);
    $stmtXP->execute([$player1Id, 300, 'Mission #SMT9488 Completed', date('Y-m-d H:i:s', strtotime('-1 days'))]);

    // Admin User
    $stmtUser->execute(['Commander Admin', 'admin@smartify.lk', '0779998877', $adminPassword, 'admin']);
    $adminId = $pdoRoot->lastInsertId();
    $stmtProfile->execute([$adminId, 5000, 5, 'SMARTIFY LEGEND', 99, 150, 20]);

    // 6. Seed Products
    $products = [
        [
            1, 1, // Category: Gaming Consoles, Brand: Sony
            'Sony PlayStation 5 Pro Edition 2TB (Play Has No Limits)',
            'sony-playstation-5-pro-2tb',
            259990.00, 239990.00, 14, 5.0, 38,
            'Experience revolutionary gaming power with the PlayStation 5 Pro. Featuring advanced 4K 120Hz Ray Tracing, custom 2TB ultra-fast SSD, PlayStation Spectral Super Resolution (PSSR), and the immersive DualSense haptic feedback controller.',
            json_encode([
                'Processor' => 'Custom AMD Zen 2 (8-core / 16-thread @ 3.85GHz)',
                'Graphics' => 'RDNA 3 GPU 16.7 TFLOPS with Advanced Ray Tracing',
                'Memory' => '16GB GDDR6 + 2GB DDR5',
                'Storage' => '2TB Ultra-High Speed NVMe SSD',
                'Video Output' => 'HDMI 2.1 (4K 120Hz, 8K HDR, VRR)',
                'Audio' => 'Tempest 3D AudioTech',
                'Warranty' => '1 Year Official Sony Warranty'
            ]),
            'assets/images/products/ps5-pro.png',
            1
        ],
        [
            3, 3, // Category: PC Gaming Gear, Brand: ASUS ROG
            'ASUS ROG Swift OLED PG27AQDM 27" 240Hz 0.03ms Gaming Monitor',
            'asus-rog-swift-oled-pg27aqdm',
            345000.00, 319990.00, 8, 4.9, 24,
            'The ROG Swift OLED PG27AQDM features a 27-inch 1440p OLED panel with a blazing 240Hz refresh rate and 0.03ms response time. Equipped with a custom heatsink and intelligent voltage optimization for peak gaming visuals without burn-in.',
            json_encode([
                'Panel Size' => '26.5-inch OLED Anti-Glare',
                'Resolution' => '2560 x 1440 (QHD)',
                'Refresh Rate' => '240Hz',
                'Response Time' => '0.03ms (GTG)',
                'HDR' => 'HDR10 (1000 nits peak brightness)',
                'Color Gamut' => '99% DCI-P3 / sRGB 135%',
                'G-Sync / FreeSync' => 'G-SYNC Compatible'
            ]),
            'assets/images/products/rog-monitor.png',
            1
        ],
        [
            3, 4, // Category: PC Gaming Gear, Brand: Razer
            'Razer DeathAdder V3 Pro Wireless Esports Gaming Mouse (63g)',
            'razer-deathadder-v3-pro',
            45500.00, 38990.00, 25, 4.8, 62,
            'Victory takes on a new shape with the Razer DeathAdder V3 Pro. Refined and reforged with the aid of top esports pros, its iconic ergonomic form is now more than 25% lighter, backed by Razer Focus Pro 30K Optical Sensor.',
            json_encode([
                'Sensor' => 'Focus Pro 30K Optical Sensor (30,000 DPI)',
                'Max Speed / Accel' => '750 IPS / 70 G',
                'Weight' => '63 grams ultra-lightweight',
                'Battery Life' => 'Up to 90 Hours Continuous Play',
                'Switches' => 'Optical Mouse Switches Gen-3 (90M clicks)',
                'Connectivity' => 'Razer HyperSpeed Wireless 2.4GHz + USB-C'
            ]),
            'assets/images/products/razer-deathadder.png',
            1
        ],
        [
            2, 9, // Category: Audio & Headsets, Brand: SteelSeries
            'SteelSeries Arctis Nova Pro Wireless Multi-System Gaming Headset',
            'steelseries-arctis-nova-pro-wireless',
            115000.00, 99990.00, 12, 4.9, 41,
            'Almighty Audio combines high-fidelity hardware and Sonar Software for sound never heard before. Active Noise Cancellation, Infinity Power dual-battery system with hot-swapping, and simultaneous 2.4GHz + Bluetooth 5.0.',
            json_encode([
                'Drivers' => 'High-Res Neodymium 40mm Drivers',
                'Frequency Response' => '10–40,000 Hz',
                'Noise Cancellation' => '4-mic Hybrid Active Noise Cancellation (ANC)',
                'Microphone' => 'ClearCast Gen 2 Fully Retractable Bi-directional',
                'Battery System' => 'Dual Battery System (Unlimited Play via Hot-swap)',
                'Compatibility' => 'PC, PS5, PS4, Switch, Mobile, Mac'
            ]),
            'assets/images/products/arctis-nova-pro.png',
            1
        ],
        [
            5, 6, // Category: Power, Brand: Anker
            'Anker Prime 27,650mAh Power Bank (250W Total Output, Smart App)',
            'anker-prime-27650mah-250w',
            49500.00, 42990.00, 30, 4.9, 53,
            'The ultimate mobile powerhouse. Delivers up to 250W multi-device fast charging, 140W single-port charging capable of fast-charging a 16-inch MacBook Pro or gaming laptops. Features a smart digital display and Bluetooth companion app.',
            json_encode([
                'Capacity' => '27,650mAh / 99.54Wh (Airline Approved)',
                'Max Output' => '250W Total Output (2x USB-C @ 140W + 1x USB-A @ 65W)',
                'Display' => 'Full-Color Smart Digital Screen with real-time stats',
                'Recharging' => '170W Ultra-Fast dual-input recharge in 37 mins',
                'App Connectivity' => 'Anker App via Bluetooth'
            ]),
            'assets/images/products/anker-prime.png',
            1
        ],
        [
            2, 1, // Category: Audio, Brand: Sony
            'Sony WH-1000XM5 Wireless Industry-Leading Noise Canceling Headphones',
            'sony-wh-1000xm5-black',
            118000.00, 104990.00, 18, 5.0, 89,
            'Industry-leading noise canceling with two processors and 8 microphones. Specially developed 30mm driver unit with carbon fiber composite material delivers magnificent Hi-Res Audio and crystal-clear hands-free calling.',
            json_encode([
                'ANC' => 'Auto NC Optimizer + 8 Microphone Noise Canceling',
                'Battery Life' => 'Up to 30 Hours (3 min charge = 3 hours playback)',
                'Audio Codecs' => 'LDAC, AAC, SBC, Hi-Res Wireless Certified',
                'Connectivity' => 'Bluetooth 5.2 Multipoint Connection',
                'Weight' => '250g ultra-comfortable soft fit leather'
            ]),
            'assets/images/products/sony-wh1000xm5.png',
            0
        ],
        [
            3, 5, // Category: PC Gaming Gear, Brand: Logitech
            'Logitech G915 LIGHTSPEED Wireless RGB Mechanical Gaming Keyboard (TKL)',
            'logitech-g915-tkl-wireless',
            76000.00, 68500.00, 16, 4.8, 33,
            'A breakthrough in design and engineering, the G915 TKL features pro-grade LIGHTSPEED wireless, advanced LIGHTSYNC RGB, and high-performance low-profile mechanical switches. Crafted from aircraft-grade 5052 aluminum alloy.',
            json_encode([
                'Form Factor' => 'Tenkeyless (TKL) Ultra-Slim',
                'Switches' => 'Low Profile GL Tactile / Linear Switches',
                'Wireless Tech' => 'LIGHTSPEED 1ms Wireless + Bluetooth',
                'Lighting' => 'Per-Key LIGHTSYNC RGB with 16.8M colors',
                'Battery' => 'Up to 40 Hours at 100% brightness',
                'Body' => 'Aircraft-Grade 5052 Brushed Aluminum'
            ]),
            'assets/images/products/logitech-g915.png',
            0
        ],
        [
            4, 2, // Category: Phones & Gadgets, Brand: Apple
            'Apple Watch Ultra 2 GPS + Cellular 49mm Titanium Case (Ocean Band)',
            'apple-watch-ultra-2-titanium',
            275000.00, 248990.00, 9, 5.0, 19,
            'The most rugged and capable Apple Watch. Powered by the all-new S9 SiP with double tap gesture, brightest Apple display ever (3000 nits), precision dual-frequency GPS, and up to 72 hours battery life in Low Power Mode.',
            json_encode([
                'Case' => '49mm Aerospace-grade Titanium with Sapphire Crystal',
                'Display' => 'Always-On Retina OLED (3000 nits peak brightness)',
                'Chip' => 'S9 SiP with 64-bit dual-core processor and 4-core Neural Engine',
                'Sensors' => 'Depth Gauge, Water Temp Sensor, ECG, SpO2, Heart Rate',
                'Water Resistance' => '100m Water-Resistant (EN13319 Dive Certified)',
                'Connectivity' => 'Cellular + Wi-Fi 6 + Bluetooth 5.3 + UWB Gen 2'
            ]),
            'assets/images/products/apple-watch-ultra.png',
            0
        ],
        [
            2, 7, // Category: Audio, Brand: JBL
            'JBL Quantum 910 Wireless Over-Ear Active Noise Cancelling Gaming Headset',
            'jbl-quantum-910-wireless',
            84000.00, 72990.00, 15, 4.7, 28,
            'Gain the audio edge with JBL QuantumSPHERE 360 integrated head-tracking. Hi-Res certified 50mm neodymium drivers, active noise cancellation tuned for gaming, and dual wireless solutions with lossless 2.4GHz + Bluetooth 5.2.',
            json_encode([
                'Spatial Audio' => 'JBL QuantumSPHERE 360 with Integrated Head-Tracking',
                'Drivers' => '50mm Dynamic Hi-Res Certified Drivers',
                'Connectivity' => '2.4GHz Lossless Wireless + Bluetooth 5.2 + 3.5mm Aux',
                'Noise Cancelling' => 'Gaming-Tuned Active Noise Cancelling',
                'Microphone' => 'Boom Mic with Voice Focus & Auto Mute'
            ]),
            'assets/images/products/jbl-quantum-910.png',
            0
        ],
        [
            6, 3, // Category: Streaming, Brand: ASUS ROG
            'ASUS ROG Carnyx Professional Cardioid Studio Condenser Gaming Microphone',
            'asus-rog-carnyx-studio-mic',
            65000.00, 56990.00, 11, 4.8, 17,
            'The ROG Carnyx is a professional-grade USB cardioid microphone featuring a 25mm studio-grade condenser capsule, 192 kHz / 24-bit sampling rate, built-in pop filter, premium metal shock mount, and ASUS Aura Sync RGB lighting.',
            json_encode([
                'Capsule' => '25mm Studio-Grade Condenser Capsule',
                'Sampling Rate' => '192 kHz / 24-bit Studio Quality',
                'Polar Pattern' => 'Cardioid with High-Pass Filter (80Hz)',
                'Shock Mount' => 'Integrated Metal Shock Mount with Elastic Cord',
                'Controls' => 'One-Touch Mute Button with Multi-Function Control Knob',
                'Lighting' => 'ASUS Aura Sync RGB'
            ]),
            'assets/images/products/rog-carnyx-mic.png',
            0
        ],
        [
            5, 10, // Category: Power, Brand: Baseus
            'Baseus Blade HD 100W Ultra-Thin 20,000mAh Power Bank for Laptops',
            'baseus-blade-hd-100w-20000mah',
            32000.00, 26500.00, 22, 4.7, 45,
            'Ultra-slim 18mm profile power bank capable of charging laptops, Steam Decks, and smartphones with 100W Power Delivery. Features dual Type-C and dual USB-A ports with a crisp status display showing charge time and wattage.',
            json_encode([
                'Capacity' => '20,000mAh / 74Wh',
                'Thickness' => 'Only 18mm Ultra-Thin Laptop Fit',
                'Max Output' => '100W PD Fast Charging (2x USB-C + 2x USB-A)',
                'Display' => 'Real-time Digital Power, Current, and Time remaining display',
                'Compatibility' => 'MacBook, ROG Ally, Steam Deck, iPhone, Samsung Galaxy'
            ]),
            'assets/images/products/baseus-blade.png',
            0
        ],
        [
            4, 8, // Category: Phones & Gadgets, Brand: Samsung
            'Samsung Galaxy Buds3 Pro True Wireless AI Noise Canceling Earbuds',
            'samsung-galaxy-buds3-pro',
            68000.00, 59990.00, 20, 4.8, 31,
            'Galaxy AI-powered adaptive noise cancellation and live real-time interpreter. Featuring dual amplifiers with planar tweeters, 24-bit 96kHz Hi-Fi audio, and Blade design with customizable Blade Lights.',
            json_encode([
                'Sound' => 'Enhanced 2-Way Speaker with Planar Tweeter & Dual Amps',
                'Audio Quality' => '24-bit / 96kHz Seamless Hi-Fi Codec',
                'AI Features' => 'Adaptive Noise Control, Siren Detect, Voice Detect, Live Interpreter',
                'Design' => 'Ergonomic Blade with LED Blade Lights',
                'Durability' => 'IP57 Water & Dust Resistance'
            ]),
            'assets/images/products/samsung-buds3-pro.png',
            0
        ]
    ];

    $stmtProd = $pdoRoot->prepare("
        INSERT INTO products (
            category_id, brand_id, title, slug, price, discount_price, stock, rating, reviews_count, description, specifications, image_main, is_flash_deal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    foreach ($products as $p) {
        $stmtProd->execute($p);
    }
    echo "<div class='step'>[5/6] Seeding 12 High-End Gaming & Tech Products in LKR... <span class='success'>LOADED</span></div>";

    // 7. Seed Sample Orders for Player 01 (for realistic tracking and order history)
    $orders = [
        [
            'SMT10293', $player1Id, 38990.00, 350, 'Player 01', '0771234567',
            'No. 42, Cyberpunk Avenue, Colombo 03, Western Province',
            'card', 'paid', 'gear_preparing', date('Y-m-d H:i:s', strtotime('-1 day'))
        ],
        [
            'SMT9488', $player1Id, 42990.00, 300, 'Player 01', '0771234567',
            'No. 42, Cyberpunk Avenue, Colombo 03, Western Province',
            'koko', 'paid', 'mission_complete', date('Y-m-d H:i:s', strtotime('-7 days'))
        ]
    ];
    $stmtOrder = $pdoRoot->prepare("
        INSERT INTO orders (
            order_number, user_id, total_amount, xp_earned, shipping_name, shipping_phone, shipping_address, payment_method, payment_status, order_status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmtOrderItem = $pdoRoot->prepare("
        INSERT INTO order_items (order_id, product_id, price, quantity) VALUES (?, ?, ?, ?)
    ");

    foreach ($orders as $ord) {
        $stmtOrder->execute($ord);
        $orderId = $pdoRoot->lastInsertId();
        // Link product 3 (Razer DeathAdder) or product 5 (Anker Prime)
        $prodId = ($ord[0] === 'SMT10293') ? 3 : 5;
        $stmtOrderItem->execute([$orderId, $prodId, $ord[2], 1]);
    }
    echo "<div class='step'>[6/6] Initializing Demo Missions & Quest History... <span class='success'>SYSTEM DEPLOYED</span></div>";

    echo "
        <hr style='border-color: #2D2B55; margin: 25px 0;'>
        <p style='color:#A855F7; font-size:1.1em;'>🎮 <strong>SMARTIFY TECH ECOSYSTEM READY!</strong></p>
        <p><strong>Demo Player Account:</strong> <code>player01@smartify.lk</code> | Password: <code>password</code> (Level 3 - TECH EXPLORER, 750 XP)</p>
        <p><strong>Admin Commander Account:</strong> <code>admin@smartify.lk</code> | Password: <code>admin123</code> (Level 5 - SMARTIFY LEGEND)</p>
        <div style='display:flex; gap:15px; flex-wrap:wrap;'>
            <a href='index.php' class='btn'>⚡ ENTER SMARTIFY ARENA (HOMEPAGE)</a>
            <a href='shop.php' class='btn' style='background:#06B6D4;'>🛒 EXPLORE GEAR STORE</a>
            <a href='admin/index.php' class='btn' style='background:#F43F5E;'>👑 ADMIN COMMAND CENTER</a>
        </div>
    ";

} catch (\PDOException $e) {
    echo "<div style='color:#FF0055; margin-top:20px;'><strong>ERROR:</strong> " . htmlspecialchars($e->getMessage()) . "</div>";
}

echo "
</div>
</body>
</html>";
?>
