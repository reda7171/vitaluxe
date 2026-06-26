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
INSERT INTO `Address` VALUES ('addr-001','cmmfpuyyb000111ix04hx37yg','home','Sara','Benali','0612345678','12 Rue Hassan II','Casablanca',1,'2026-03-07 02:40:50.074');
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
INSERT INTO `Brand` VALUES ('cmmfpuz3o000c11ixcdgmm6ep','La Roche-Posay','la-roche-posay','https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/La_Roche-Posay_logo.svg/200px-La_Roche-Posay_logo.svg.png'),('cmmfpuz4a000d11ixz5zjl3nv','Vichy','vichy','https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Vichy_Laboratoires_logo.svg/200px-Vichy_Laboratoires_logo.svg.png'),('cmmfpuz4s000e11ixlrkouh4k','CeraVe','cerave','https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/CeraVe_logo.svg/200px-CeraVe_logo.svg.png'),('cmmfpuz5d000f11ixz17r6ox8','Eucerin','eucerin','https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Eucerin_logo.svg/200px-Eucerin_logo.svg.png'),('cmmfpuz5t000g11ix5ob89pqb','Av├¿ne','avene','https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Eau_thermale_Av%C3%A8ne_logo.svg/200px-Eau_thermale_Av%C3%A8ne_logo.svg.png');
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
INSERT INTO `Category` VALUES ('cmmfpuyyw000211ixihpummyq','Visage','visage','https://images.unsplash.com/photo-1615397323608-d2ba9cae5436?q=80&w=600'),('cmmfpuyzj000311ixxlgcudmz','Corps','corps','https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600'),('cmmfpuz01000411ixqt1eqwyu','Cheveux','cheveux','https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600'),('cmmfpuz0h000511ixw2mt0mkd','B├®b├®','bebe','https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600'),('cmmfpuz0z000611ixto6xatzc','Homme','homme','https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=600'),('cmmfpuz1g000711ixq5s3pixz','Hygi├¿ne','hygiene','https://images.unsplash.com/photo-1584949514120-f13e73a696c1?q=80&w=600'),('cmmfpuz1w000811ix79xn0e4b','Solaire','solaire','https://images.unsplash.com/photo-1574621100236-d25b64dfad96?q=80&w=600'),('cmmfpuz2g000911ixrb5i6nw0','Compl├®ments','complements','https://images.unsplash.com/photo-1550572017-edb799be0d36?q=80&w=600'),('cmmfpuz2v000a11ixv6fbr6yl','├ëpicerie','epicerie','https://images.unsplash.com/photo-1585238218764-839cc609139a?q=80&w=600'),('cmmfpuz39000b11ix8f1xf97a','Sport','sport','https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600');
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
INSERT INTO `Order` VALUES ('cmmfpuzg8001i11ixxgfrxv14','cmmfpuyyb000111ix04hx37yg',433,'DELIVERED','CARD','2026-03-07 02:40:50.169'),('cmmfpuzgs001n11ixonhucpr5','cmmfpuyyb000111ix04hx37yg',85,'SHIPPED','COD','2026-03-07 02:40:50.188'),('cmmfpuzha001r11ixqn8y6b3q','cmmfpuyyb000111ix04hx37yg',355,'PENDING','PAYPAL','2026-03-07 02:40:50.206'),('cmmfpuzhq001w11ixmbbfwjhp','cmmfpuyyb000111ix04hx37yg',130,'CANCELLED','CARD','2026-03-07 02:40:50.222'),('cmmfq39wd000h119aq0k88c8z','cmmfpuyyb000111ix04hx37yg',385,'PENDING','Paiement ├á la livraison','2026-03-07 02:47:16.958'),('cmmfq8gms0001pbmuhn01118v','cmmfpuyyb000111ix04hx37yg',385,'PENDING','Paiement ├á la livraison','2026-03-07 02:51:18.964');
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
INSERT INTO `OrderItem` VALUES ('cmmfpuzg9001k11ix6s70dgj0','cmmfpuzg8001i11ixxgfrxv14','cmmfpuz6c000i11ix6a12c39b',2,149),('cmmfpuzg9001l11ixy2p3pmc5','cmmfpuzg8001i11ixxgfrxv14','cmmfpuz86000o11ix7o3wil7v',1,135),('cmmfpuzgs001p11ix43bt7hiu','cmmfpuzgs001n11ixonhucpr5','cmmfpuz9r000u11ixd6e51lk4',1,85),('cmmfpuzha001t11ixi7r1ov4d','cmmfpuzha001r11ixqn8y6b3q','cmmfpuzbo001211ixm2h4mnqr',1,175),('cmmfpuzha001u11ix45t22wpy','cmmfpuzha001r11ixqn8y6b3q','cmmfpuzc7001411ixdxnq1fny',2,90),('cmmfpuzhq001y11ixul7kstzq','cmmfpuzhq001w11ixmbbfwjhp','cmmfpuz71000k11ixl0znmxm4',1,130),('cmmfq39we000j119adm7g16ly','cmmfq39wd000h119aq0k88c8z','cmmfpuzco001611ixmz0x8yjp',1,350),('cmmfq8gms0003pbmulj2d9z1c','cmmfq8gms0001pbmuhn01118v','cmmfpuzco001611ixmz0x8yjp',1,350);
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
  `images` json DEFAULT NULL,
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
INSERT INTO `Product` VALUES ('cmmfpuz6c000i11ix6a12c39b','Effaclar Gel Purifiant','effaclar-gel-purifiant','Gel nettoyant visage pour peaux grasses et sensibles.',189,149,50,'\"[\\\"https://images.unsplash.com/photo-1615397323608-d2ba9cae5436?q=80&w=600\\\"]\"','cmmfpuyyw000211ixihpummyq','La Roche-Posay','2026-03-07 02:40:49.812'),('cmmfpuz71000k11ixl0znmxm4','Cr├¿me Hydratante Cerave','creme-hydratante-cerave','Cr├¿me hydratante visage et corps ├á l\'acide hyaluronique et c├®ramides.',150,130,30,'\"[\\\"https://images.unsplash.com/photo-1615397323608-d2ba9cae5436?q=80&w=600\\\"]\"','cmmfpuyyw000211ixihpummyq','CeraVe','2026-03-07 02:40:49.837'),('cmmfpuz7o000m11ix7hlkv1kn','Baume Lipikar AP+M','baume-lipikar-ap','Baume relipidant anti-grattage pour les peaux extr├¬mement s├¿ches.',290,NULL,45,'\"[\\\"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600\\\"]\"','cmmfpuyzj000311ixxlgcudmz','La Roche-Posay','2026-03-07 02:40:49.860'),('cmmfpuz86000o11ix7o3wil7v','Shampooing Dercos Anti-Pelliculaire','dercos-anti-pelliculaire','├ëlimine 100% des pellicules visibles. Pour cheveux normaux ├á gras.',160,135,60,'\"[\\\"https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600\\\"]\"','cmmfpuz01000411ixqt1eqwyu','Vichy','2026-03-07 02:40:49.879'),('cmmfpuz8p000q11ixljvoai7k','Huile Lact├®e Capillaire','huile-lactee-capillaire','Soin protecteur hydratant pour cheveux expos├®s au soleil.',199,179,25,'\"[\\\"https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600\\\"]\"','cmmfpuz01000411ixqt1eqwyu','Nuxe','2026-03-07 02:40:49.897'),('cmmfpuz99000s11ix5kv8tbqe','Gel Lavant Doux Mustela','gel-lavant-doux-mustela','Nettoie en douceur le corps et le cuir chevelu de l\'enfant et du nourrisson.',120,95,80,'\"[\\\"https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600\\\"]\"','cmmfpuz0h000511ixw2mt0mkd','Mustela','2026-03-07 02:40:49.917'),('cmmfpuz9r000u11ixd6e51lk4','Cr├¿me Change 1 2 3','creme-change-123','Pr├®vient, soulage et r├®pare les irritations et rougeurs du si├¿ge.',85,NULL,100,'\"[\\\"https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600\\\"]\"','cmmfpuz0h000511ixw2mt0mkd','Mustela','2026-03-07 02:40:49.936'),('cmmfpuza8000w11ixtcw3fomy','Gel de Rasage Anti-Irritations','gel-rasage-homme','Gel ├á raser peaux sensibles. Pr├®vient les rougeurs et tiraillements.',90,75,40,'\"[\\\"https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=600\\\"]\"','cmmfpuz0z000611ixto6xatzc','Vichy Homme','2026-03-07 02:40:49.953'),('cmmfpuzao000y11ix8c5l8z0y','Gel Douche Nutritif','gel-douche-nutritif','Gel douche respectueux du microbiome protecteur naturel de la peau.',65,NULL,120,'\"[\\\"https://images.unsplash.com/photo-1584949514120-f13e73a696c1?q=80&w=600\\\"]\"','cmmfpuz1g000711ixq5s3pixz','Sanex','2026-03-07 02:40:49.968'),('cmmfpuzb4001011ixgemsozqk','Anthelios UVMune 400 Invisible Fluide','anthelios-uvmune-400','Tr├¿s haute protection solaire SPF50+. Fini invisible, r├®sistant ├á l\'eau.',220,190,55,'\"[\\\"https://images.unsplash.com/photo-1574621100236-d25b64dfad96?q=80&w=600\\\"]\"','cmmfpuz1w000811ix79xn0e4b','La Roche-Posay','2026-03-07 02:40:49.984'),('cmmfpuzbo001211ixm2h4mnqr','Photoderm Max Brume Solaire','photoderm-max-brume','Brume solaire transparente SPF 50+. Application sans ├®talement.',195,175,35,'\"[\\\"https://images.unsplash.com/photo-1574621100236-d25b64dfad96?q=80&w=600\\\"]\"','cmmfpuz1w000811ix79xn0e4b','Bioderma','2026-03-07 02:40:50.004'),('cmmfpuzc7001411ixdxnq1fny','Magn├®sium B6','magnesium-b6','R├®duit la fatigue et maintient un fonctionnement normal du syst├¿me nerveux.',110,90,70,'\"[\\\"https://images.unsplash.com/photo-1550572017-edb799be0d36?q=80&w=600\\\"]\"','cmmfpuz2g000911ixrb5i6nw0','Arkopharma','2026-03-07 02:40:50.023'),('cmmfpuzco001611ixmz0x8yjp','Miel de Manuka IAA 10+','miel-manuka-iaa-10','Miel d\'une qualit├® exceptionnelle connu pour ses propri├®t├®s uniques.',350,NULL,13,'\"[\\\"https://images.unsplash.com/photo-1585238218764-839cc609139a?q=80&w=600\\\"]\"','cmmfpuz2v000a11ixv6fbr6yl','Comptoirs & Compagnies','2026-03-07 02:40:50.040'),('cmmfpuzd5001811ix9nmjhluu','BCAA Acides Amin├®s','bcaa-acides-amines','Soutien musculaire avant et apr├¿s l\'effort. Ratio 2:1:1.',280,240,25,'\"[\\\"https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600\\\"]\"','cmmfpuz39000b11ix8f1xf97a','EA Fit','2026-03-07 02:40:50.057');
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
  `images` json DEFAULT NULL,
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
  `boutique` json DEFAULT NULL,
  `livraison` json DEFAULT NULL,
  `paiement` json DEFAULT NULL,
  `notifs` json DEFAULT NULL,
  `apparence` json DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
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
INSERT INTO `User` VALUES ('cmmfpuyxg000011ixmnca5ana','Admin Vitaluxe','admin@vitaluxe.ma','$2b$10$5XIjWxDZAK.NsbCdztEFJeOvJncuLACqHFjbcgVhJejH63icNv6gm','ADMIN','2026-03-07 02:40:49.492',NULL,NULL),('cmmfpuyyb000111ix04hx37yg','Sara Benali','client@vitaluxe.ma','$2b$10$Vd42XxeQ0g9zGKaR8hD0AOQ4.NpCwQARRnXCtfBKZL.4w.OBh7p62','CUSTOMER','2026-03-07 02:40:49.523','0612345678',NULL);
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
INSERT INTO `Wishlist` VALUES ('cmmfpuze7001a11ixgbn168pk','cmmfpuyyb000111ix04hx37yg','cmmfpuz6c000i11ix6a12c39b','2026-03-07 02:40:50.095'),('cmmfpuzer001c11ixo7anc93s','cmmfpuyyb000111ix04hx37yg','cmmfpuz71000k11ixl0znmxm4','2026-03-07 02:40:50.116'),('cmmfpuzf8001e11ixerolipws','cmmfpuyyb000111ix04hx37yg','cmmfpuz7o000m11ix7hlkv1kn','2026-03-07 02:40:50.133'),('cmmfpuzfp001g11ixg2bfabk9','cmmfpuyyb000111ix04hx37yg','cmmfpuz86000o11ix7o3wil7v','2026-03-07 02:40:50.149');
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

-- Dump completed on 2026-03-07 17:10:55
