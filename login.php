<?php
// Database configuration
$host = 'localhost'; // Change this if your MySQL database is hosted elsewhere
$username = 'root'; // Your MySQL username
$password = ''; // Your MySQL password
$database = 'cineplex'; // Your database name

// Connect to the database
$mysqli = new mysqli($host, $username, $password, $database);

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get username and password from the form
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepare a SQL statement to retrieve user details
    $sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    $stmt = $mysqli->prepare($sql);
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if user exists
    if ($result->num_rows == 1) {
        // Fetch user data
        $user = $result->fetch_assoc();
        
        // Redirect users based on their role
        switch ($user['role']) {
            case 'admin':
                header("Location: admindashboard.php");
                break;
            case 'customer':
                header("Location: Movies.html");
                break;
            case 'staff':
                header("Location: staffdashboard.php");
                break;
            default:
                echo "Unknown role";
        }
        exit; // Stop further execution after redirection
    } else {
        // User does not exist or invalid credentials, display error message
        echo "Invalid username or password";
    }

    // Close statement and database connection
    $stmt->close();
    $mysqli->close();
}
?>
