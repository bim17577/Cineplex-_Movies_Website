<!DOCTYPE html>
<html lang="en">
<head>
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View Bookings</title>
    <!-- Bootstrap CSS CDN -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous">
    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9Ih8Df4YY9SxVuMgaOQkEjPlp8l0yBvNfNSgTCEelWfR51U8J1LQuKnB" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8F6F2FTvsEHCpJYx8XjgjvDd/3OykPYp4g8fpG" crossorigin="anonymous"></script>
    <style>
        body {
            background-image: url('https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3JtMjY3LW51bm55LTA0Yi5qcGc.jpg');
            background-size: cover;
            background-position: center;
        }
    </style>
</head>
<body>
    <div class="container mt-5">
        <?php
        // Database connection details
        $servername = "localhost"; // Change this to your MySQL server address
        $username = "root"; // Change this to your MySQL username
        $password = ""; // Change this to your MySQL password
        $dbname = "cineplex"; // Change this to your MySQL database name

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // SQL to fetch bookings
        $sql = "SELECT id, movie, date, showtime, hall, seats, email, name FROM bookings";
        $result = $conn->query($sql);

        // Check if we have bookings
        if ($result->num_rows > 0) {
            // Start the table with Bootstrap classes
            echo '<table class="table table-striped"><thead><tr><th>ID</th><th>Movie</th><th>Date</th><th>Showtime</th><th>Hall</th><th>Seats</th><th>Email</th><th>Name</th></tr></thead><tbody>';
            // output data of each row
            while($row = $result->fetch_assoc()) {
                $row = array_map("htmlspecialchars", $row);
                echo "<tr><td>".$row["id"]."</td><td>".$row["movie"]."</td><td>".$row["date"]."</td><td>".$row["showtime"]."</td><td>".$row["hall"]."</td><td>".$row["seats"]."</td><td>".$row["email"]."</td><td>".$row["name"]."</td></tr>";
            }
            echo "</tbody></table>";
        } else {
            echo "0 results";
        }
        $conn->close();
        ?>
    </div>
</body>
</html>
