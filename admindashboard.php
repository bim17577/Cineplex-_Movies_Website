<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css">
    <style>
        body {
            background-image: url('https://zameenblog.s3.amazonaws.com/blog/wp-content/uploads/2019/08/Cover-1440x625-1.jpg');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            color: #fff;
        }
        .dashboard-container {
            padding-top: 20px;
        }
        .action-card {
            background: rgba(0,0,0,.6);
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 20px rgba(0,0,0,.5);
        }
        .action-form {
            margin-top: 30px;
        }
        .form-label {
            color: #f8f9fa;
        }
        .form-section {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container dashboard-container">
        <div class="text-center mb-4">
            <h1>Welcome to Admin Dashboard</h1>
        </div>
        <!-- View Bookings Button -->
        <div class="mb-4 text-center">
            <a href="viewbookings.php" class="btn btn-info">View Bookings <i class="fas fa-eye"></i></a>
        </div>
        <!-- View Feedback Button -->
        <div class="mb-4 text-center">
            <a href="feedback.php" class="btn btn-success">View Feedback <i class="fas fa-comments"></i></a>
        </div>
        <!-- Existing Content -->
        <div class="card action-card">
            <div class="card-body">
                <!-- Your existing form and content -->
            </div>
        </div>
    </div>

    <!-- Existing Scripts -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script>
        // Your existing JavaScript code
    </script>
</body>
</html>
