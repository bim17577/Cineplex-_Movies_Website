<?php
// Returns the seats already sold for one show as JSON, e.g. {"seats":["A1","A2"]}
header("Content-Type: application/json");

$movie = $_GET["movie"] ?? "";
$date = $_GET["date"] ?? "";
$showtime = $_GET["showtime"] ?? "";
$hall = $_GET["hall"] ?? "";

if ($movie === "" || $date === "" || $showtime === "" || $hall === "") {
    echo json_encode(["seats" => []]);
    exit;
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
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$stmt = $conn->prepare("SELECT seats FROM bookings WHERE movie = ? AND date = ? AND showtime = ? AND hall = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "The bookings table has no hall/seats columns yet. Run update_database.sql."]);
    exit;
}
$stmt->bind_param("ssss", $movie, $date, $showtime, $hall);
$stmt->execute();
$result = $stmt->get_result();

$seats = [];
while ($row = $result->fetch_assoc()) {
    foreach (explode(",", $row["seats"]) as $seat) {
        if ($seat !== "") {
            $seats[] = $seat;
        }
    }
}

echo json_encode(["seats" => array_values(array_unique($seats))]);

$stmt->close();
$conn->close();
?>
