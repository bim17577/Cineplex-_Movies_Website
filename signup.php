<?php
// Database connection settings
$conn = new mysqli('localhost', 'root', '', 'cineplex');

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // You may also want to add validation here to ensure that the values are not empty or malformed before proceeding with the database insertion.

    $stmt = $conn->prepare("INSERT INTO registration (name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $password);

    if ($stmt->execute()) {
        echo "Registration Successful";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
