<?php
/**
 * Smartify Tech - AJAX Loadout Handler
 */

header('Content-Type: application/json');
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../includes/gamification.php';

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$productId = isset($_POST['product_id']) ? (int)$_POST['product_id'] : (int)($_GET['product_id'] ?? 0);
$quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : (int)($_GET['quantity'] ?? 1);

if ($action === 'add' && $productId > 0) {
    // Fetch product details
    $stmt = $pdo->prepare("SELECT id, title, price, discount_price, image_main, stock FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $product = $stmt->fetch();

    if ($product) {
        $finalPrice = ($product['discount_price'] > 0) ? $product['discount_price'] : $product['price'];
        
        if (isset($_SESSION['loadout'][$productId])) {
            $_SESSION['loadout'][$productId]['qty'] += max(1, $quantity);
        } else {
            $_SESSION['loadout'][$productId] = [
                'id' => $product['id'],
                'title' => $product['title'],
                'price' => (float)$finalPrice,
                'image' => $product['image_main'],
                'qty' => max(1, $quantity)
            ];
        }

        // Award small browsing XP if logged in
        if (isLoggedIn()) {
            addPlayerXP($pdo, getCurrentUserId(), 50, "Gear Loadout Sync: " . $product['title']);
        }
    }
} elseif ($action === 'update' && $productId > 0) {
    if ($quantity <= 0) {
        unset($_SESSION['loadout'][$productId]);
    } elseif (isset($_SESSION['loadout'][$productId])) {
        $_SESSION['loadout'][$productId]['qty'] = $quantity;
    }
} elseif ($action === 'remove' && $productId > 0) {
    unset($_SESSION['loadout'][$productId]);
} elseif ($action === 'clear') {
    $_SESSION['loadout'] = [];
}

// Calculate totals
$totalItems = 0;
$totalPrice = 0.0;

foreach ($_SESSION['loadout'] as $item) {
    $qty = (int)($item['qty'] ?? 1);
    $totalItems += $qty;
    $totalPrice += ((float)$item['price']) * $qty;
}

$power = calculateLoadoutPower($_SESSION['loadout'], $totalPrice);

echo json_encode([
    'success' => true,
    'total_items' => $totalItems,
    'total_price' => $totalPrice,
    'formatted_total' => formatLKR($totalPrice),
    'loadout_power' => $power,
    'loadout' => array_values($_SESSION['loadout'])
]);
