<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Database connection details
    $servername = "localhost"; // Change this to your MySQL server address
    $username = "root"; // Change this to your MySQL username
    $password = ""; // Change this to your MySQL password
    $dbname = "cineplex"; // Change this to your MySQL database name

    // Return errors as values instead of exceptions (PHP 8.1+ throws by default)
    mysqli_report(MYSQLI_REPORT_OFF);

    // Create connection
    $conn = @new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Set parameters
    $movie = $_POST["movie"];
    $date = $_POST["date"];
    $showtime = $_POST["showtime"];
    $email = $_POST["email"];
    $name = $_POST["name"];
    $hall = $_POST["hall"] ?? "";
    $seats = $_POST["seats"] ?? "";

    // Hall must be one we have, seats must look like "A1,A2,B10"
    if (!in_array($hall, ["B1", "B2"], true)) {
        die("Error: please select a hall.");
    }
    if (!preg_match('/^[A-H]\d{1,2}(,[A-H]\d{1,2}){0,9}$/', $seats)) {
        die("Error: please select your seats.");
    }

    // Make sure nobody has booked these seats for the same show in the meantime
    $check = $conn->prepare("SELECT seats FROM bookings WHERE movie = ? AND date = ? AND showtime = ? AND hall = ?");
    if (!$check) {
        die("Error: the bookings table has no hall/seats columns yet. Run update_database.sql in phpMyAdmin.");
    }
    $check->bind_param("ssss", $movie, $date, $showtime, $hall);
    $check->execute();
    $result = $check->get_result();

    $requested = explode(",", $seats);
    $taken = [];
    while ($row = $result->fetch_assoc()) {
        $taken = array_merge($taken, array_intersect($requested, explode(",", $row["seats"])));
    }
    $check->close();

    if ($taken) {
        die("Sorry, these seats were just booked by someone else: " . htmlspecialchars(implode(", ", $taken)) . ". Please go back and pick other seats.");
    }

    // Prepare and bind the SQL statement
    $stmt = $conn->prepare("INSERT INTO bookings (movie, date, showtime, hall, seats, email, name) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssss", $movie, $date, $showtime, $hall, $seats, $email, $name);

    if ($stmt->execute() === TRUE) {
        echo "Booking successful! Hall " . htmlspecialchars($hall) . ", seats " . htmlspecialchars(str_replace(",", ", ", $seats)) . ".";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
