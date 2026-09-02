<?php
/**
 * Smartify Tech - Database Connection & App Helpers
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$host = '127.0.0.1';
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
    // If database doesn't exist yet, attempt connecting without db to allow auto-setup
    try {
        $pdo = new PDO("mysql:host=$host;charset=$charset", $user, $pass, $options);
        // If we are not on setup_db.php, redirect to setup_db.php
        $currentScript = basename($_SERVER['PHP_SELF'] ?? '');
        if ($currentScript !== 'setup_db.php') {
            header('Location: setup_db.php');
            exit;
        }
    } catch (\PDOException $e2) {
        die('<div style="background:#0A0915;color:#FF0055;font-family:sans-serif;padding:30px;text-align:center;">' .
            '<h2>⚡ SMARTIFY TECH DATABASE ERROR</h2>' .
            '<p>Could not connect to MySQL server. Please ensure MySQL is running on port 3306.</p>' .
            '<p style="color:#888;">' . htmlspecialchars($e->getMessage()) . '</p>' .
            '</div>');
    }
}

// Currency Formatter for Sri Lankan Rupees
function formatLKR($amount) {
    return 'Rs. ' . number_format((float)$amount, 0, '.', ',');
}

// Input Sanitizer
function sanitize($data) {
    return htmlspecialchars(trim((string)$data), ENT_QUOTES, 'UTF-8');
}

// Flash Message Helpers
function setFlash($type, $message) {
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

function getFlash() {
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}

// User Auth Helpers
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

function getCurrentUserRole() {
    return $_SESSION['user_role'] ?? 'guest';
}

function isAdmin() {
    return isset($_SESSION['user_role']) && in_array($_SESSION['user_role'], ['admin', 'staff']);
}

// Ensure default demo player session if not logged in
if (!isLoggedIn()) {
    if (!isset($_SESSION['guest_id'])) {
        $_SESSION['guest_id'] = 'GUEST_' . substr(md5(uniqid(mt_rand(), true)), 0, 8);
    }
}

// Cart session initialize
if (!isset($_SESSION['loadout'])) {
    $_SESSION['loadout'] = []; // [product_id => ['qty' => 1, 'price' => 100, ...]]
}
