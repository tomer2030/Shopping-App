-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2023 at 09:05 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shoppingcart`
--
CREATE DATABASE IF NOT EXISTS `shoppingcart` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `shoppingcart`;

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `cartId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `cartStartDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`cartId`, `userId`, `cartStartDate`) VALUES
(2, 12345623, '2023-03-31'),
(3, 12345623, '2023-03-31'),
(36, 12345623, '2023-06-04');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `categoryId` int(11) NOT NULL,
  `categoryName` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`categoryId`, `categoryName`) VALUES
(1, 'Soft Drinks'),
(2, 'Fruits and Vegetable'),
(3, 'Meat'),
(4, 'Lactic'),
(5, 'Snacks');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `orderId` int(11) NOT NULL,
  `cartId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `finalPrice` int(11) NOT NULL,
  `deliveryCity` varchar(20) NOT NULL,
  `deliveryStreet` varchar(20) NOT NULL,
  `deliveryDate` date NOT NULL,
  `orderDate` date NOT NULL,
  `creditcard` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`orderId`, `cartId`, `userId`, `finalPrice`, `deliveryCity`, `deliveryStreet`, `deliveryDate`, `orderDate`, `creditcard`) VALUES
(3, 2, 12345623, 250, 'gan yavne', 'hamalkosh', '2023-03-25', '2023-03-29', 234234),
(4, 3, 12345623, 250, 'gan yavne', 'hamalkosh', '2023-03-23', '2023-03-31', 234234);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `productId` int(11) NOT NULL,
  `productName` varchar(20) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `imageName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`productId`, `productName`, `categoryId`, `price`, `imageName`) VALUES
(1, 'Coca Cola', 1, 8, '4f1ab560-7d5a-4309-9360-8d14b7974a72.jpg'),
(2, 'Fanta', 1, 7, 'cb53c7c6-904d-4ff2-923f-f58396049088.jpg'),
(3, 'Sprite', 1, 9, 'c138f57f-d426-49f3-aa29-eb1baf6baa08.jpg'),
(4, 'Tomato', 2, 2, '263fd738-7a6f-4939-887f-d6b3d487fb23.jpg'),
(5, 'Apple', 2, 3, '12d2e771-e522-474d-9b64-ccf5e5bb83ca.jpg'),
(6, 'Banana', 2, 4, '5a88969d-5234-4673-a23d-6f7eacb28a40.jpg'),
(7, 'Antrikot', 3, 100, '268edd73-8950-4949-9cf5-993b7f91e44b.jpg'),
(8, 'Asado', 3, 80, '5bb6dae3-0898-4f21-b5f0-f4f8adda09ad.jpg'),
(9, 'Blue Cheese', 4, 15, '77de1c3f-660b-4892-83d1-31bad17cb9f9.jpg'),
(10, 'Cheddar', 4, 16, 'a29df51e-2afe-4815-836d-91c8fb48f997.jpg'),
(11, 'Oreo', 5, 7, 'b0c03859-3665-4492-8770-1e982ab3c205.jpg'),
(12, 'Milka', 5, 12, 'afea266e-749d-4d65-ba10-362848af27d2.jpg'),
(13, 'Milk', 4, 5, '320831b1-a334-4cae-8700-b6e3818ce4ec.jpg'),
(14, 'Bamba', 5, 3, 'ca51e599-0c96-4fb8-b433-950a871123f3.jpg'),
(15, 'Avocado', 2, 18, 'bdb1bf8c-2aa2-477f-b0d5-67d981bd7303.jpg'),
(16, 'XL', 1, 4, 'f3109974-124c-46a5-aebf-d027656eeeac.jpg'),
(23, 'muzzarela', 4, 15, '8de9cc3f-7e36-4974-97b3-45184f4bb513.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `productscart`
--

CREATE TABLE `productscart` (
  `productCartId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `totalPrice` int(11) NOT NULL,
  `cartId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `productscart`
--

INSERT INTO `productscart` (`productCartId`, `productId`, `quantity`, `totalPrice`, `cartId`) VALUES
(84, 2, 2, 14, 36),
(85, 3, 2, 18, 36);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `roleId` int(11) NOT NULL,
  `role` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`roleId`, `role`) VALUES
(1, 'admin'),
(2, 'customer');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `firstName` varchar(20) NOT NULL,
  `lastName` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL,
  `city` varchar(20) NOT NULL,
  `street` varchar(20) NOT NULL,
  `roleId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `firstName`, `lastName`, `email`, `password`, `city`, `street`, `roleId`) VALUES
(12345623, 'Tomer', 'Viner', 'tomerviner@gmail.com', '8bbb9f3f45777ed44a85514e8837b90b047d8c49fd4ed7683e41e495a7ebdc4899cc933019e95b041dc0efb0830ca49546a0de4bb7bd1ae4e1f301e0e5db956f', 'Gan Yavne', 'Hamalkosh', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cartId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`categoryId`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`orderId`),
  ADD KEY `cartId` (`cartId`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`productId`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `productscart`
--
ALTER TABLE `productscart`
  ADD PRIMARY KEY (`productCartId`),
  ADD KEY `productId` (`productId`),
  ADD KEY `productscart_ibfk_1` (`cartId`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`roleId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `role` (`roleId`),
  ADD KEY `roleId` (`roleId`),
  ADD KEY `roleId_2` (`roleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `cartId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `categoryId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `orderId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `productId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `productscart`
--
ALTER TABLE `productscart`
  MODIFY `productCartId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`cartId`) REFERENCES `carts` (`cartId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`categoryId`);

--
-- Constraints for table `productscart`
--
ALTER TABLE `productscart`
  ADD CONSTRAINT `productscart_ibfk_1` FOREIGN KEY (`cartId`) REFERENCES `carts` (`cartId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productscart_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `roles` (`roleId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
