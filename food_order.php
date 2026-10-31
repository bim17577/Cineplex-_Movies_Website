<?php
// Saves a food order. Card orders are only saved after checking with Stripe
// that the payment really succeeded for the right amount.
require "stripe_config.php";
require "food_menu.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    json_response(405, ["error" => "Method not allowed"]);
}

$input = json_decode(file_get_contents("php://input"), true);
$name = trim($input["name"] ?? "");
$email = trim($input["email"] ?? "");
$method = $input["payment_method"] ?? "";
$paymentIntentId = $input["payment_intent_id"] ?? null;

$order = build_food_order($input["items"] ?? null, $FOOD_MENU);
if (!$order) {
    json_response(400, ["error" => "Your cart is empty or has an unknown item."]);
}
if ($name === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(400, ["error" => "Please enter your name and a valid email."]);
}
if (!in_array($method, ["card", "cash"], true)) {
    json_response(400, ["error" => "Please choose a payment method."]);
}

if ($method === "card") {
    $intent = $paymentIntentId ? stripe_request("GET", "payment_intents/" . urlencode($paymentIntentId)) : null;
    if (!$intent || $intent["status"] !== "succeeded" || $intent["amount"] !== $order["total"] * 100 || $intent["currency"] !== STRIPE_CURRENCY) {
        json_response(402, ["error" => "We couldn't confirm your card payment."]);
    }
    $status = "paid";
} else {
    $paymentIntentId = null;
    $status = "pay_at_counter";
}

// Database connection details
$servername = "localhost"; // Change this to your MySQL server address
$username = "root"; // Change this to your MySQL username
$password = ""; // Change this to your MySQL password
$dbname = "cineplex"; // Change this to your MySQL database name

// Return errors as values instead of exceptions (PHP 8.1+ throws by default)
mysqli_report(MYSQLI_REPORT_OFF);

$conn = @new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    json_response(500, ["error" => "Database connection failed."]);
}

$items = json_encode($order["lines"]);
$total = $order["total"];
$stmt = $conn->prepare("INSERT INTO food_orders (name, email, items, total, payment_method, payment_status, stripe_payment_intent) VALUES (?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    json_response(500, ["error" => "The food_orders table is missing. Run update_database.sql."]);
}
$stmt->bind_param("sssdsss", $name, $email, $items, $total, $method, $status, $paymentIntentId);

if (!$stmt->execute()) {
    // The unique key on stripe_payment_intent stops one payment being used for two orders
    json_response(409, ["error" => "This order could not be saved."]);
}

json_response(200, ["orderId" => $stmt->insert_id, "total" => $total, "status" => $status]);
?>
