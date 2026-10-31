<?php
// Database connection
$host = "localhost";
$username = "root";
$password = "";
$database = "cineplex";

$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$is_admin = true; // Placeholder for actual admin check

if ($is_admin) {
    // Fetch all feedback
    $sql = "SELECT * FROM feedback";
    $result = $conn->query($sql);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Feedback View</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .feedback-container {
            max-width: 800px;
            margin: auto;
            padding: 20px;
        }
        .feedback-item {
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 5px;
        }
        body {
            background-image: url('https://www.hdwallpapers.in/download/white_leaves_branches_white_background_hd_white_background-1600x900.jpg');
            background-size: cover; /* Cover the entire page */
            background-position: center; /* Center the background image */
            background-attachment: fixed; /* Fix the background image position */
            background-repeat: no-repeat; /* Do not repeat the background image */
        }
    </style>
</head>
<body>

<div class="feedback-container">
    <h2>Feedback Received</h2>
    <?php if ($result->num_rows > 0): ?>
        <?php while($row = $result->fetch_assoc()): ?>
            <div class="feedback-item">
                <h4><?php echo htmlspecialchars($row["name"]); ?></h4>
                <p>Email: <?php echo htmlspecialchars($row["email"]); ?></p>
                <p>Service Rating: <?php echo htmlspecialchars($row["service_rating"]); ?></p>
                <p>Improvements: <?php echo htmlspecialchars($row["improvements"]); ?></p>
                <p>Likelihood: <?php echo htmlspecialchars($row["likelihood"]); ?></p>
                <p>Favorite Feature: <?php echo htmlspecialchars($row["favorite_feature"]); ?></p>
                <p>Additional Comments: <?php echo nl2br(htmlspecialchars($row["additional_comments"])); ?></p>
            </div>
        <?php endwhile; ?>
    <?php else: ?>
        <p>No feedback found.</p>
    <?php endif; ?>
</div>

</body>
</html>
