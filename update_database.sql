-- Run this ONCE on an existing `cineplex` database (phpMyAdmin → cineplex → SQL tab)
-- to add hall/seat booking and food orders. A fresh import of cineplex.sql
-- already includes these changes.

ALTER TABLE `bookings`
  ADD COLUMN `hall` varchar(10) NOT NULL DEFAULT '' AFTER `showtime`,
  ADD COLUMN `seats` varchar(255) NOT NULL DEFAULT '' AFTER `hall`;

CREATE TABLE IF NOT EXISTS `food_orders` (
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
