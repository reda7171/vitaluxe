-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: vitaluxe
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `AbandonedCart`
--

DROP TABLE IF EXISTS `AbandonedCart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `AbandonedCart` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `items` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalAmount` double NOT NULL,
  `sentAt` datetime(3) DEFAULT NULL,
  `recoveredAt` datetime(3) DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `AbandonedCart_email_key` (`email`),
  KEY `AbandonedCart_sentAt_idx` (`sentAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `AbandonedCart`
--

LOCK TABLES `AbandonedCart` WRITE;
/*!40000 ALTER TABLE `AbandonedCart` DISABLE KEYS */;
/*!40000 ALTER TABLE `AbandonedCart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Address`
--

DROP TABLE IF EXISTS `Address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Address` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'home',
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Address_userId_fkey` (`userId`),
  CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Address`
--

LOCK TABLES `Address` WRITE;
/*!40000 ALTER TABLE `Address` DISABLE KEYS */;
INSERT INTO `Address` VALUES ('addr-001','cmnxhd58t0001sonhymmdf06h','home','Sara','Benali','0612345678','12 Rue Hassan II','Casablanca',1,'2026-04-13 17:42:35.780');
/*!40000 ALTER TABLE `Address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Banner`
--

DROP TABLE IF EXISTS `Banner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Banner` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageUrl` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `link` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '/',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `position` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'HERO',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Banner`
--

LOCK TABLES `Banner` WRITE;
/*!40000 ALTER TABLE `Banner` DISABLE KEYS */;
/*!40000 ALTER TABLE `Banner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Brand`
--

DROP TABLE IF EXISTS `Brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Brand` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Brand_name_key` (`name`),
  UNIQUE KEY `Brand_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Brand`
--

LOCK TABLES `Brand` WRITE;
/*!40000 ALTER TABLE `Brand` DISABLE KEYS */;
INSERT INTO `Brand` VALUES ('cmnxhd5fd000csonhye0vj4rm','La Roche-Posay','la-roche-posay','https://logo.clearbit.com/laroche-posay.fr'),('cmnxhd5fx000dsonhrv9c097y','Vichy','vichy','https://logo.clearbit.com/vichy.fr'),('cmnxhd5gd000esonh00f9k76j','CeraVe','cerave','https://logo.clearbit.com/cerave.fr'),('cmnxhd5gx000fsonhso1hvps1','Eucerin','eucerin','https://logo.clearbit.com/eucerin.fr'),('cmnxhd5hv000gsonhcdvjqmlh','Avène','avene','https://logo.clearbit.com/avene.com'),('cmnxhd5ia000hsonhe2j00eks','Bioderma','bioderma','https://logo.clearbit.com/bioderma.fr'),('cmnxhd5iu000isonhfxttb1ie','Nuxe','nuxe','https://logo.clearbit.com/nuxe.com'),('cmnxhd5jc000jsonhe9zfklvm','Caudalie','caudalie','https://logo.clearbit.com/caudalie.com'),('cmnxhd5js000ksonh5mamkti4','Uriage','uriage','https://logo.clearbit.com/uriage.com'),('cmnxhd5ka000lsonh544zqon3','Neutrogena','neutrogena','https://logo.clearbit.com/neutrogena.com'),('cmnxhd5kt000msonhfaengssx','Garnier','garnier','https://logo.clearbit.com/garnier.fr'),('cmnxhd5lb000nsonhlgmitf0f','L\'Oréal Paris','loreal-paris','https://logo.clearbit.com/loreal-paris.fr'),('cmnxhd5lo000osonhtia3bnwg','Nivea','nivea','https://logo.clearbit.com/nivea.fr'),('cmnxhd5m3000psonh5hj7tjra','Dove','dove','https://logo.clearbit.com/dove.com'),('cmnxhd5mf000qsonhdwz1ytfb','Weleda','weleda','https://logo.clearbit.com/weleda.fr'),('cmnxhd5mr000rsonh03txqg24','SVR','svr','https://logo.clearbit.com/svr.com'),('cmnxhd5n2000ssonht9ocgt7o','Filorga','filorga','https://logo.clearbit.com/filorga.com'),('cmnxhd5nf000tsonhrz34z5dt','Clarins','clarins','https://logo.clearbit.com/clarins.fr'),('cmnxhd5ns000usonhs1pa5i8t','Kérastase','kerastase','https://logo.clearbit.com/kerastase.fr'),('cmnxhd5o4000vsonhwfltzek7','L\'Oréal Professionnel','loreal-professionnel','https://logo.clearbit.com/lorealprofessionnel.fr'),('cmnxhd5og000wsonhbk3ht045','Schwarzkopf','schwarzkopf','https://logo.clearbit.com/schwarzkopf.fr'),('cmnxhd5ow000xsonhlkx6bppz','Head & Shoulders','head-shoulders','https://logo.clearbit.com/headandshoulders.com'),('cmnxhd5pl000ysonh6n45dr8r','Elsève','elseve','https://logo.clearbit.com/loreal-paris.fr'),('cmnxhd5q2000zsonhsyrv0uvj','René Furterer','rene-furterer','https://logo.clearbit.com/renefurterer.com'),('cmnxhd5ql0010sonh1njltwme','Mustela','mustela','https://logo.clearbit.com/mustela.com'),('cmnxhd5r40011sonhgupbfycg','Bébé Cadum','bebe-cadum','https://logo.clearbit.com/cadum.fr'),('cmnxhd5rh0012sonhcjsf5nvg','Chicco','chicco','https://logo.clearbit.com/chicco.fr'),('cmnxhd5ug0013sonhz7wqvab4','Dodie','dodie','https://logo.clearbit.com/dodie.fr'),('cmnxhd5ut0014sonhkrik6jfn','Ambre Solaire','ambre-solaire','https://logo.clearbit.com/garnier.fr'),('cmnxhd5v80015sonhu0ucxqxq','Hawaiian Tropic','hawaiian-tropic','https://logo.clearbit.com/hawaiiantropic.com'),('cmnxhd5vr0016sonhdnkumv4d','Altruist','altruist','https://logo.clearbit.com/altruistuk.com'),('cmnxhd5w30017sonhxpctbip0','Arkopharma','arkopharma','https://logo.clearbit.com/arkopharma.fr'),('cmnxhd5we0018sonhzx6a1dji','Pileje','pileje','https://logo.clearbit.com/pileje.com'),('cmnxhd5wn0019sonhzavg2ewk','Isostar','isostar','https://logo.clearbit.com/isostar.com'),('cmnxhd5x0001asonhqc3y55sp','Omega Pharma','omega-pharma','https://logo.clearbit.com/omegapharma.com'),('cmnxhd5xs001bsonhl0sl3kxi','Boiron','boiron','https://logo.clearbit.com/boiron.fr'),('cmnxhd5y8001csonhevun39l0','Bulldog','bulldog','https://logo.clearbit.com/bulldogskincare.com'),('cmnxhd5yj001dsonhq7q8a5or','Vichy Homme','vichy-homme','https://logo.clearbit.com/vichy.fr'),('cmnxhd5yv001esonh363306a0','Nickel','nickel','https://logo.clearbit.com/nickel.fr'),('cmnxhd5z6001fsonht3nh8ovl','Optimum Nutrition','optimum-nutrition','https://logo.clearbit.com/optimumnutrition.com'),('cmnxhd5zh001gsonhdszikkji','EA Fit','ea-fit','https://logo.clearbit.com/eafit.com'),('cmnxhd5zt001hsonhmo9up9tl','Decathlon','decathlon','https://logo.clearbit.com/decathlon.fr'),('cmnxhd603001isonhqmvf4t6j','Sanex','sanex','https://logo.clearbit.com/sanex.eu'),('cmnxhd60h001jsonhqzhnkgqg','Colgate','colgate','https://logo.clearbit.com/colgate.com'),('cmnxhd60t001ksonhx03cmgyn','Oral-B','oral-b','https://logo.clearbit.com/oralb.com'),('cmnxhd616001lsonhmo3hnloi','Gillette','gillette','https://logo.clearbit.com/gillette.com'),('cmnxhd61j001msonhn2isl9h3','Cattier','cattier','https://logo.clearbit.com/cattier-paris.com'),('cmnxhd61x001nsonhpuhkjc9g','Melvita','melvita','https://logo.clearbit.com/melvita.com'),('cmnxhd62a001osonh5tbq6s3s','Sanoflore','sanoflore','https://logo.clearbit.com/sanoflore.net');
/*!40000 ALTER TABLE `Brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Category`
--

DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES ('cmnxhd59i0002sonhm0hj14v7','Visage','visage','https://images.unsplash.com/photo-1615397323608-d2ba9cae5436?q=80&w=600'),('cmnxhd5ab0003sonhv00swmrh','Corps','corps','https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600'),('cmnxhd5au0004sonhn2f2y07z','Cheveux','cheveux','https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600'),('cmnxhd5bg0005sonhkux36d71','Bébé','bebe','https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600'),('cmnxhd5c00006sonheripbqp8','Homme','homme','https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=600'),('cmnxhd5cj0007sonhk79nwt5k','Hygiène','hygiene','https://images.unsplash.com/photo-1584949514120-f13e73a696c1?q=80&w=600'),('cmnxhd5d10008sonhxpqbad0f','Solaire','solaire','https://images.unsplash.com/photo-1574621100236-d25b64dfad96?q=80&w=600'),('cmnxhd5dm0009sonhguwik4rj','Compléments','complements','https://images.unsplash.com/photo-1550572017-edb799be0d36?q=80&w=600'),('cmnxhd5e6000asonhr6r80dou','Épicerie','epicerie','https://images.unsplash.com/photo-1585238218764-839cc609139a?q=80&w=600'),('cmnxhd5ep000bsonhghod219q','Sport','sport','https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ContactMessage`
--

DROP TABLE IF EXISTS `ContactMessage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ContactMessage` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('UNREAD','READ','REPLIED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UNREAD',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ContactMessage`
--

LOCK TABLES `ContactMessage` WRITE;
/*!40000 ALTER TABLE `ContactMessage` DISABLE KEYS */;
/*!40000 ALTER TABLE `ContactMessage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `NewsletterLead`
--

DROP TABLE IF EXISTS `NewsletterLead`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `NewsletterLead` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `NewsletterLead_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `NewsletterLead`
--

LOCK TABLES `NewsletterLead` WRITE;
/*!40000 ALTER TABLE `NewsletterLead` DISABLE KEYS */;
/*!40000 ALTER TABLE `NewsletterLead` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Order`
--

DROP TABLE IF EXISTS `Order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Order` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `totalAmount` double NOT NULL,
  `status` enum('PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Order_userId_fkey` (`userId`),
  CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Order`
--

LOCK TABLES `Order` WRITE;
/*!40000 ALTER TABLE `Order` DISABLE KEYS */;
/*!40000 ALTER TABLE `Order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `OrderItem`
--

DROP TABLE IF EXISTS `OrderItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OrderItem` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `price` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `OrderItem_orderId_fkey` (`orderId`),
  KEY `OrderItem_productId_fkey` (`productId`),
  CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `OrderItem`
--

LOCK TABLES `OrderItem` WRITE;
/*!40000 ALTER TABLE `OrderItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `OrderItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PasswordResetToken`
--

DROP TABLE IF EXISTS `PasswordResetToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PasswordResetToken` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PasswordResetToken_userId_key` (`userId`),
  UNIQUE KEY `PasswordResetToken_token_key` (`token`),
  CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PasswordResetToken`
--

LOCK TABLES `PasswordResetToken` WRITE;
/*!40000 ALTER TABLE `PasswordResetToken` DISABLE KEYS */;
/*!40000 ALTER TABLE `PasswordResetToken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Prescription`
--

DROP TABLE IF EXISTS `Prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Prescription` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `image` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Prescription_userId_fkey` (`userId`),
  CONSTRAINT `Prescription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Prescription`
--

LOCK TABLES `Prescription` WRITE;
/*!40000 ALTER TABLE `Prescription` DISABLE KEYS */;
/*!40000 ALTER TABLE `Prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Product`
--

DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Product` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `salePrice` double DEFAULT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `images` longtext COLLATE utf8mb4_unicode_ci,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Product_slug_key` (`slug`),
  KEY `Product_categoryId_fkey` (`categoryId`),
  KEY `Product_createdAt_idx` (`createdAt`),
  CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Product`
--

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PromoCode`
--

DROP TABLE IF EXISTS `PromoCode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PromoCode` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount` double NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'percent',
  `maxUses` int DEFAULT NULL,
  `uses` int NOT NULL DEFAULT '0',
  `expiresAt` datetime(3) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `PromoCode_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PromoCode`
--

LOCK TABLES `PromoCode` WRITE;
/*!40000 ALTER TABLE `PromoCode` DISABLE KEYS */;
/*!40000 ALTER TABLE `PromoCode` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Review`
--

DROP TABLE IF EXISTS `Review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Review` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `images` longtext COLLATE utf8mb4_unicode_ci,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `Review_productId_fkey` (`productId`),
  KEY `Review_userId_fkey` (`userId`),
  CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Review`
--

LOCK TABLES `Review` WRITE;
/*!40000 ALTER TABLE `Review` DISABLE KEYS */;
/*!40000 ALTER TABLE `Review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `StoreSettings`
--

DROP TABLE IF EXISTS `StoreSettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `StoreSettings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1',
  `boutique` longtext COLLATE utf8mb4_unicode_ci,
  `livraison` longtext COLLATE utf8mb4_unicode_ci,
  `paiement` longtext COLLATE utf8mb4_unicode_ci,
  `notifs` longtext COLLATE utf8mb4_unicode_ci,
  `apparence` longtext COLLATE utf8mb4_unicode_ci,
  `updatedAt` datetime(3) NOT NULL,
  `footer` longtext COLLATE utf8mb4_unicode_ci,
  `header` longtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StoreSettings`
--

LOCK TABLES `StoreSettings` WRITE;
/*!40000 ALTER TABLE `StoreSettings` DISABLE KEYS */;
/*!40000 ALTER TABLE `StoreSettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','CUSTOMER') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES ('cmnxhd57r0000sonhg55ifuft','Admin Vitaluxe','admin@vitaluxe.ma','$2b$10$z2gn.XmBs6N5kBpRG33IfuxsCo9gBdmCw4mrxQ9B5FL81sEL/hTLK','ADMIN','2026-04-13 17:42:34.407',NULL,NULL),('cmnxhd58t0001sonhymmdf06h','Sara Benali','client@vitaluxe.ma','$2b$10$7X18AATSnMSQhy/abc1eJu3kiarT1enWhVnx3WKNMAoSAcJjOHvMi','CUSTOMER','2026-04-13 17:42:34.445','0612345678',NULL);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Wishlist`
--

DROP TABLE IF EXISTS `Wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Wishlist` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Wishlist_userId_productId_key` (`userId`,`productId`),
  KEY `Wishlist_productId_fkey` (`productId`),
  CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Wishlist`
--

LOCK TABLES `Wishlist` WRITE;
/*!40000 ALTER TABLE `Wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `Wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-05 15:41:02
