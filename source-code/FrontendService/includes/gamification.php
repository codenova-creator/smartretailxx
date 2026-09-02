<?php
/**
 * Smartify Tech - Gamification Engine
 * Handles XP calculations, Level progression, Quest Badges, and Loadout Power
 */

/**
 * Get Level configuration and tier metadata
 */
function getLevelTiers() {
    return [
        1 => ['title' => 'TECH ROOKIE',     'min_xp' => 0,    'max_xp' => 200,  'color' => '#94A3B8', 'icon' => '🛡️', 'discount' => '0%'],
        2 => ['title' => 'GADGET HUNTER',   'min_xp' => 201,  'max_xp' => 500,  'color' => '#06B6D4', 'icon' => '⚡', 'discount' => '2%'],
        3 => ['title' => 'TECH EXPLORER',   'min_xp' => 501,  'max_xp' => 1000, 'color' => '#8B5CF6', 'icon' => '🔮', 'discount' => '5%'],
        4 => ['title' => 'GEAR MASTER',     'min_xp' => 1001, 'max_xp' => 2500, 'color' => '#EC4899', 'icon' => '⚔️', 'discount' => '8%'],
        5 => ['title' => 'SMARTIFY LEGEND', 'min_xp' => 2501, 'max_xp' => 99999,'color' => '#F59E0B', 'icon' => '👑', 'discount' => '12%'],
    ];
}

/**
 * Determine Level and Title based on XP
 */
function computeLevelFromXP($xp) {
    $xp = (int)$xp;
    if ($xp >= 2501) return [5, 'SMARTIFY LEGEND'];
    if ($xp >= 1001) return [4, 'GEAR MASTER'];
    if ($xp >= 501)  return [3, 'TECH EXPLORER'];
    if ($xp >= 201)  return [2, 'GADGET HUNTER'];
    return [1, 'TECH ROOKIE'];
}

/**
 * Add XP to a player and update their Level and title
 */
function addPlayerXP($pdo, $userId, $xpAmount, $reason = 'Mission Activity') {
    if (!$userId) return false;
    $xpAmount = (int)$xpAmount;
    if ($xpAmount <= 0) return false;

    // 1. Log transaction
    $stmt = $pdo->prepare("INSERT INTO xp_transactions (user_id, xp_amount, reason) VALUES (?, ?, ?)");
    $stmt->execute([$userId, $xpAmount, $reason]);

    // 2. Ensure player profile exists
    $stmt = $pdo->prepare("SELECT id, xp, level FROM player_profiles WHERE user_id = ?");
    $stmt->execute([$userId]);
    $profile = $stmt->fetch();

    if (!$profile) {
        $stmt = $pdo->prepare("INSERT INTO player_profiles (user_id, xp, level, title) VALUES (?, ?, 1, 'TECH ROOKIE')");
        $stmt->execute([$userId, $xpAmount]);
        $currentXP = $xpAmount;
    } else {
        $stmt = $pdo->prepare("UPDATE player_profiles SET xp = xp + ? WHERE user_id = ?");
        $stmt->execute([$xpAmount, $userId]);
        $currentXP = $profile['xp'] + $xpAmount;
    }

    // 3. Compute new level
    list($newLevel, $newTitle) = computeLevelFromXP($currentXP);

    $levelUpOccurred = false;
    if ($profile && $newLevel > $profile['level']) {
        $levelUpOccurred = true;
    }

    $stmt = $pdo->prepare("UPDATE player_profiles SET level = ?, title = ? WHERE user_id = ?");
    $stmt->execute([$newLevel, $newTitle, $userId]);

    return [
        'xp_added' => $xpAmount,
        'current_xp' => $currentXP,
        'level' => $newLevel,
        'title' => $newTitle,
        'leveled_up' => $levelUpOccurred
    ];
}

/**
 * Fetch detailed player profile with progress % and next tier info
 */
function getPlayerProfile($pdo, $userId) {
    if (!$userId) {
        // Return default guest recruit profile
        return [
            'user_id' => 0,
            'name' => 'RECRUIT GUEST',
            'email' => 'guest@smartify.lk',
            'phone' => '',
            'xp' => 100,
            'level' => 1,
            'title' => 'TECH ROOKIE',
            'missions_completed' => 0,
            'gear_acquired' => 0,
            'reviews_count' => 0,
            'next_level_xp' => 200,
            'current_tier_min' => 0,
            'current_tier_max' => 200,
            'progress_percent' => 50,
            'tier_info' => getLevelTiers()[1]
        ];
    }

    $stmt = $pdo->prepare("
        SELECT u.id as user_id, u.name, u.email, u.phone, u.role, u.created_at,
               p.xp, p.level, p.title, p.missions_completed, p.gear_acquired, p.reviews_count
        FROM users u
        LEFT JOIN player_profiles p ON u.id = p.user_id
        WHERE u.id = ?
    ");
    $stmt->execute([$userId]);
    $data = $stmt->fetch();

    if (!$data) return null;

    $xp = (int)($data['xp'] ?? 0);
    list($calculatedLevel, $calculatedTitle) = computeLevelFromXP($xp);
    $data['level'] = $calculatedLevel;
    $data['title'] = $calculatedTitle;

    $tiers = getLevelTiers();
    $currentTier = $tiers[$calculatedLevel];
    $data['tier_info'] = $currentTier;

    if ($calculatedLevel < 5) {
        $nextTier = $tiers[$calculatedLevel + 1];
        $range = $currentTier['max_xp'] - $currentTier['min_xp'];
        $progressInRange = $xp - $currentTier['min_xp'];
        $percent = ($range > 0) ? min(100, max(0, round(($progressInRange / $range) * 100))) : 100;
        $data['next_level_xp'] = $currentTier['max_xp'];
        $data['progress_percent'] = $percent;
    } else {
        $data['next_level_xp'] = 'MAX LEVEL';
        $data['progress_percent'] = 100;
    }

    return $data;
}

/**
 * Fetch player recent XP activity log
 */
function getRecentXPTransactions($pdo, $userId, $limit = 10) {
    if (!$userId) return [];
    $stmt = $pdo->prepare("SELECT * FROM xp_transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT " . (int)$limit);
    $stmt->execute([$userId]);
    return $stmt->fetchAll();
}

/**
 * Get dynamic badges for a player
 */
function getPlayerBadges($profile) {
    $xp = (int)($profile['xp'] ?? 0);
    $missions = (int)($profile['missions_completed'] ?? 0);
    $gear = (int)($profile['gear_acquired'] ?? 0);
    $level = (int)($profile['level'] ?? 1);

    return [
        [
            'id' => 'first_blood',
            'name' => 'FIRST BLOOD',
            'desc' => 'Joined Smartify Tech & Activated ID',
            'icon' => '⚡',
            'unlocked' => true,
            'date' => 'Active'
        ],
        [
            'id' => 'gear_hoarder',
            'name' => 'GEAR HOARDER',
            'desc' => 'Acquired 5+ pieces of gaming gear',
            'icon' => '🎒',
            'unlocked' => $gear >= 5,
            'date' => $gear >= 5 ? 'Unlocked' : "$gear / 5 Gear"
        ],
        [
            'id' => 'mission_ace',
            'name' => 'MISSION ACE',
            'desc' => 'Successfully completed 3+ delivery missions',
            'icon' => '🚚',
            'unlocked' => $missions >= 3,
            'date' => $missions >= 3 ? 'Unlocked' : "$missions / 3 Missions"
        ],
        [
            'id' => 'high_roller',
            'name' => 'HIGH ROLLER',
            'desc' => 'Reached Level 3 (Tech Explorer) or higher',
            'icon' => '🔮',
            'unlocked' => $level >= 3,
            'date' => $level >= 3 ? 'Unlocked' : "Level $level / 3"
        ],
        [
            'id' => 'cyber_legend',
            'name' => 'CYBER LEGEND',
            'desc' => 'Attained 2500+ XP and Smartify Legend status',
            'icon' => '👑',
            'unlocked' => $level >= 5,
            'date' => $level >= 5 ? 'Unlocked' : "$xp / 2500 XP"
        ]
    ];
}

/**
 * Calculate dynamic Loadout Power % from cart items
 */
function calculateLoadoutPower($cartItems, $totalAmount) {
    $count = 0;
    foreach ($cartItems as $item) {
        $count += (int)($item['qty'] ?? 1);
    }

    // Power is based on items + total value synergy
    // 1 item = 35%, 2 items = 65%, 3+ items = 90% + value bonus (up to 100%)
    if ($count === 0) return 0;
    $base = min(75, $count * 30);
    $valueBonus = min(25, round(($totalAmount / 50000) * 25));
    $power = min(100, $base + $valueBonus);

    return $power;
}
?>
