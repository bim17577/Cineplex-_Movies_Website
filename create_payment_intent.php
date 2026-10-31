<?php
// Step 1 of a card payment: ask Stripe to prepare a payment for the cart total.
require "stripe_config.php";
require "food_menu.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    json_response(405, ["error" => "Method not allowed"]);
}

$input = json_decode(file_get_contents("php://input"), true);
$order = build_food_order($input["items"] ?? null, $FOOD_MENU);
if (!$order) {
    json_response(400, ["error" => "Your cart is empty or has an unknown item."]);
}

$intent = stripe_request("POST", "payment_intents", [
    "amount" => $order["total"] * 100, // Stripe counts in cents
    "currency" => STRIPE_CURRENCY,
    "payment_method_types[]" => "card",
    "description" => "Cineplex food order",
]);

if (!$intent) {
    json_response(502, ["error" => "Could not start the card payment. Check the Stripe keys in stripe_config.php."]);
}

json_response(200, ["clientSecret" => $intent["client_secret"], "total" => $order["total"]]);
?>
