# SMARTIFY TECH — Gamified E-Commerce Platform Specification & Prompt Guide

> **Project Target:** PHP Native / Modern Custom PHP (or Laravel/PHP stack) E-Commerce Web Application with Gamified Shopping Journey (`Smartify Quest`).
> **Brand Name:** Smartify Tech
> **Design Theme:** Dark Cyberpunk / Gaming UI (Deep Purple, Neon Violet, Slate Grey, Glow Accents)
> **Target Market:** Sri Lanka (LKR / Rs. Currency, Islandwide Delivery, Payment methods like Koko, Cards, Cash on Delivery).

---

## 🎮 Executive Summary & Core Concept

**Smartify Tech** is a high-performance tech-gadget e-commerce store designed around a **Gamified Shopping Journey**. The application turns everyday online shopping into a RPG-style mission without sacrificing checkout speed, security, or usability.

### 🗺️ The Smartify Quest Flow
```text
🎮 GAME START (Hero & Intro)
      ↓
🗺️ EXPLORE ARENA (Categories & Brands)
      ↓
🎯 SELECT GEAR (Product Pages & Spec Cards)
      ↓
🎒 BUILD LOADOUT (Interactive Gamified Cart)
      ↓
⚔️ CHECKOUT QUEST (Streamlined 4-Step Checkout)
      ↓
⚡ MISSION STARTED (Order Processing Animation)
      ↓
🚚 DELIVERY MISSION (Interactive Quest Order Tracker)
      ↓
🏆 MISSION COMPLETE (XP & Level Up Reward)


-- Database Schema for Smartify Tech Gamified E-Commerce

CREATE DATABASE IF NOT EXISTS smartify_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartify_db;

-- 1. Users & Player Profiles
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'staff', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
);

-- 2. Categories & Brands
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon_svg TEXT,
    banner_img VARCHAR(255)
);

CREATE TABLE brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(255)
);

-- 3. Products & Inventory
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
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);

-- 4. Orders & Quest Tracking
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
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 5. XP History & Gamification Logs
CREATE TABLE xp_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    xp_amount INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
Code Snippet Guide for Implementation
PHP Database Connection Helper (config/db.php)
PHP
<?php
$host = 'localhost';
$db   = 'smartify_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
?>
Gamification Helper Functions (includes/gamification.php)
PHP
<?php
function addPlayerXP($pdo, $userId, $xpAmount, $reason) {
    // 1. Log transaction
    $stmt = $pdo->prepare("INSERT INTO xp_transactions (user_id, xp_amount, reason) VALUES (?, ?, ?)");
    $stmt->execute([$userId, $xpAmount, $reason]);

    // 2. Update user profile total XP
    $stmt = $pdo->prepare("UPDATE player_profiles SET xp = xp + ?, gear_acquired = gear_acquired + 1 WHERE user_id = ?");
    $stmt->execute([$xpAmount, $userId]);

    // 3. Check for level up
    $stmt = $pdo->prepare("SELECT xp FROM player_profiles WHERE user_id = ?");
    $stmt->execute([$userId]);
    $currentXP = $stmt->fetchColumn();

    $newLevel = 1;
    $title = 'TECH ROOKIE';

    if ($currentXP >= 2500) { $newLevel = 5; $title = 'SMARTIFY LEGEND'; }
    else if ($currentXP >= 1000) { $newLevel = 4; $title = 'GEAR MASTER'; }
    else if ($currentXP >= 500) { $newLevel = 3; $title = 'TECH EXPLORER'; }
    else if ($currentXP >= 200) { $newLevel = 2; $title = 'GADGET HUNTER'; }

    $stmt = $pdo->prepare("UPDATE player_profiles SET level = ?, title = ? WHERE user_id = ?");
    $stmt->execute([$newLevel, $title, $userId]);
}
?>
🕹️ Detailed Module Implementation Requirements
Module 1: Homepage — "Game Start"
Hero Section: High-impact banner with PS5 / Controller artwork, headline "LEVEL UP YOUR GAME" or "LEVEL UP YOUR TECH", subtitle, primary CTA button [ 🎮 START SHOPPING ] and quick link [ EXPLORE DEALS ].

System Online Animation (First Visit):

Trigger short modal overlay transition when clicking START SHOPPING:

Plaintext
SMARTIFY TECH // SYSTEM ONLINE // PLAYER 01 READY? // 3... 2... 1... ⚡ GAME START
Store preference in localStorage.setItem('skip_intro', 'true') so returning users skip directly to shop.

Top Bar Badges:

🚚 FAST DELIVERY (Islandwide)

🛡️ 100% GENUINE Products

👑 TRUSTED STORE (Since 2023)

Quick Category Navigation Bar: Gaming, Audio, Phones, Laptops, Accessories, Smart Home.

Flash Deals & Hot Deals Grid: Real-time countdown timer 02 : 14 : 36, product discount badges (-30%, -25%), one-click quick add button.

Module 2: Shop — "Enter the Arena"
Category Matrix & Filter System:

Dynamic filtering by Brand (Apple, Samsung, Anker, UGREEN, JBL, Sony, Baseus, ASUS, Logitech) and Category.

Hover states: Cyberpunk border glow on cards and categories.

Product Card UI:

Image preview, rating star badges (e.g., ★ 4.9), badge tag (In Stock), Price display in Rs. (LKR), quick loadout button [ 🛒 ADD TO LOADOUT ].

Module 3: Product Detail — "Select Your Gear"
Layout: High-res image display + thumbnails, variant selectors (e.g., Digital Edition vs Disc Edition, Storage capacity 825GB SSD, Ray Tracing Support, 4K Gaming spec pills).

Gamified Action:

Button text: 🎮 ADD TO LOADOUT

On-Click Pop-up / Toast:

Plaintext
+ ITEM ACQUIRED
Anker PowerCore 20000mAh
Added to your Loadout!
XP +50
[ CONTINUE SHOPPING ]  [ VIEW LOADOUT ]
Module 4: Cart — "Your Loadout"
Title: 🎒 YOUR LOADOUT

Loadout Stats Display:

Item list with thumbnails, prices, quantity increment/decrement.

Loadout Power Bar: Dynamic visual indicator showing system readiness (e.g., ⚡ Loadout Power: 87% | LOADOUT READY ██████████ 100%).

Total items calculation & total price in LKR.

CTA Button: [ CHECKOUT QUEST → ].

Module 5: Checkout — "Checkout Quest" (Fast & Reliable)
Strict UX Rule: Fast, clean, reliable checkout. No mandatory games during payment.

Step 01: 📍 Player Details (Name, Email, Mobile Number).

Step 02: 🚚 Delivery Mission (Islandwide Address, District, Delivery method).

Step 03: 💳 Payment Battle (Select option: Koko 3-Installments, Credit/Debit Cards Visa/Mastercard, Cash on Delivery).

Step 04: 🏆 Confirm Mission (Order Summary review & [ 🚀 PLACE ORDER ] trigger).

Module 6: "Place Order" & Confirmation Experience
Interactive Loading Animation upon submission:

Plaintext
⚡ MISSION STARTED ⚡
VERIFYING LOADOUT...  ██████░░░░ 62%
SECURING YOUR GEAR... ██████████ 100%
✓ ORDER CONFIRMED!
Order Confirmation Page:

Headline: 🏆 MISSION COMPLETE

Order Code: #SMT10293

Item loadout summary

XP Earned Callout: +350 XP

CTA Button: [ 📦 TRACK MY MISSION ]

Module 7: Order Tracking — "Delivery Mission"
Interactive progress stepper map:

[✓] ORDER CONFIRMED

[✓] LOADOUT VERIFIED

[🟣] GEAR BEING PREPARED (Current Status Highlight)

[○] DELIVERY MISSION

[🏆] MISSION COMPLETE

Updates in real-time based on database state modified by staff in Admin Panel.

Module 8: Staff / Admin Dashboard
PHP Backend Management Panel:

Manage Products, Inventory, Categories, and Orders.

Quest Status Updater:

Staff changes status dropdown: Confirmed ➔ Processing ➔ Packed ➔ Dispatched ➔ Delivered.

Triggers automated XP credit to user profile upon status completion.

Module 9: Player Profile — "Smartify ID"
Digital ID Card Interface for customer account:

Player Level (e.g., LEVEL 04 - TECH EXPLORER)

XP Progress Bar (820 / 1000 XP)

Stats Counters: 8 Missions Completed | 14 Gear Acquired | 5 Reviews

Level Tier System:

Level 01: TECH ROOKIE (0 - 200 XP)

Level 02: GADGET HUNTER (201 - 500 XP)

Level 03: TECH EXPLORER (501 - 1000 XP)

Level 04: GEAR MASTER (1001 - 2500 XP)

Level 05: SMARTIFY LEGEND (2500+ XP)