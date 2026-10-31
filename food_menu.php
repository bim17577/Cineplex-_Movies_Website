<?php
// The food & drinks menu. Prices are in Sri Lankan rupees (LKR).
// The server always works out the total from THIS list, so a customer can't
// change prices in the browser. Keep it in step with the prices in food.html.
$FOOD_MENU = [
    "popcorn-classic" => ["name" => "Classic Salted Popcorn", "price" => 750],
    "popcorn-caramel" => ["name" => "Caramel Popcorn",        "price" => 950],
    "chicken-wrap"    => ["name" => "Chicken Wrap",           "price" => 1200],
    "coca-cola"       => ["name" => "Coca-Cola",              "price" => 400],
    "nuggets"         => ["name" => "Chicken Nuggets",        "price" => 1100],
    "club-sandwich"   => ["name" => "Club Sandwich",          "price" => 1300],
    "nachos"          => ["name" => "Nachos with Cheese",     "price" => 1000],
    "hot-dog"         => ["name" => "Hot Dog",                "price" => 900],
    "fries"           => ["name" => "French Fries",           "price" => 700],
];

// Turns ["popcorn-classic" => 2, ...] into order lines and a total.
// Returns null if the cart is empty or contains something not on the menu.
function build_food_order($items, $menu) {
    if (!is_array($items) || !$items) {
        return null;
    }

    $lines = [];
    $total = 0;
    foreach ($items as $id => $qty) {
        $qty = (int) $qty;
        if (!isset($menu[$id]) || $qty < 1 || $qty > 20) {
            return null;
        }
        $lineTotal = $menu[$id]["price"] * $qty;
        $lines[] = ["id" => $id, "name" => $menu[$id]["name"], "qty" => $qty, "price" => $menu[$id]["price"], "line_total" => $lineTotal];
        $total += $lineTotal;
    }

    return ["lines" => $lines, "total" => $total];
}

function json_response($status, $data) {
    http_response_code($status);
    header("Content-Type: application/json");
    echo json_encode($data);
    exit;
}

// Calls the Stripe API with cURL (no extra libraries needed)
function stripe_request($method, $path, $params = []) {
    $ch = curl_init("https://api.stripe.com/v1/" . $path);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERPWD, STRIPE_SECRET_KEY . ":");
    if ($method === "POST") {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
    }
    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $data = json_decode($body, true);
    if ($status >= 400 || !is_array($data)) {
        return null;
    }
    return $data;
}
?>
