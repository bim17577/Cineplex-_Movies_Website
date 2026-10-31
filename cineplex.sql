-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 11, 2024 at 01:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cineplex`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `movie` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `showtime` varchar(20) NOT NULL,
  `hall` varchar(10) NOT NULL DEFAULT '',
  `seats` varchar(255) NOT NULL DEFAULT '',
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `booking_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `movie`, `date`, `showtime`, `email`, `name`, `booking_date`) VALUES
(1, 'Hotel Trasylvania3', '2024-03-12', '10:00 AM', 'bimashajayy@gmail.com', 'bimasha ', '2024-03-10 14:04:49'),
(2, 'Centtral Intelligence', '2024-03-22', '10:00 AM', 'kavi@gmail.com', 'jayani', '2024-03-10 14:54:37'),
(3, 'Jumanji', '2024-03-21', '1:00 PM', 'kisi@gmail.com', 'jayani', '2024-03-10 15:12:06'),
(4, 'Avatar2', '2024-03-15', '10:00 AM', 'gg@gmail.com', 'jayani', '2024-03-10 15:15:01'),
(5, 'Hotel Trasylvania3', '2024-03-22', '1:00 PM', 'bim@gmail.com', 'bimasha ', '2024-03-10 16:43:28');

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `service_rating` int(11) NOT NULL,
  `improvements` text NOT NULL,
  `likelihood` varchar(50) NOT NULL,
  `favorite_feature` varchar(255) NOT NULL,
  `additional_comments` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `name`, `email`, `service_rating`, `improvements`, `likelihood`, `favorite_feature`, `additional_comments`, `created_at`) VALUES
(1, 'bimasha ', 'bimashajayy@gmail.com', 8, 'good', '9', 'special promotions', 'Host movie nights or special events tailored to specific audience demographics, such as family-friendly screenings or themed movie marathons.', '2024-03-10 14:29:33'),
(2, 'krishmi', 'kisi@gmail.com', 6, 'sgfrd', '6', 'special promotions', 'rgregege', '2024-03-10 15:17:10'),
(3, 'bimasha jayathunga', 'bim@gmail.com', 7, ' I think having more variety in snack options would be great, especially healthier choices. Also, ensuring that the seating is always clean and comfortable would enhance the overall experience.', '5', ' I love the convenience of booking tickets online and being able to choose my seats in advance. It saves a lot of time and hassle.', 'good', '2024-03-10 17:04:12');

-- --------------------------------------------------------

--
-- Table structure for table `food_orders`
--

CREATE TABLE `food_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `items` text NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `payment_method` enum('card','cash') NOT NULL,
  `payment_status` varchar(30) NOT NULL,
  `stripe_payment_intent` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `stripe_payment_intent` (`stripe_payment_intent`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `registration`
--

CREATE TABLE `registration` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registration`
--

INSERT INTO `registration` (`id`, `name`, `email`, `password`) VALUES
(1, 'bimasha ', 'bima@gmail.com', '123'),
(2, 'kavindu', 'kavi@gmail.com', '555'),
(3, 'Jay Bima', 'JayBima@gmail.com', '9999'),
(4, 'gaya', 'gaya@gmail.com', 'password123'),
(6, 'gaya', 'gaya@gmail.com', 'password123'),
(7, 'user2', 'user2@example.com', 'password2'),
(8, 'bim', 'user2@example.com', 'password2'),
(9, 'hashi', 'user3@example.com', 'password3'),
(10, 'bimasha ', 'bima@gmail.com', '123'),
(11, 'salman', 'salman@gmail.com', 'ffff');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin','staff','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`) VALUES
(1, 'user1', 'password1', 'customer'),
(2, 'admin1', 'adminpassword1', 'admin'),
(3, 'user3', 'staffpassword1', 'staff');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `registration`
--
ALTER TABLE `registration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `registration`
--
ALTER TABLE `registration`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
