-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: comp_coopdb
-- ------------------------------------------------------
-- Server version	8.0.32-0ubuntu0.22.04.2

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
-- Current Database: `comp_coopdb`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `comp_coopdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `comp_coopdb`;

--
-- Table structure for table `EmailSubscribers`
--

DROP TABLE IF EXISTS `EmailSubscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `EmailSubscribers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `last_sent` date NOT NULL,
  `branch` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `EmailSubscribers`
--

LOCK TABLES `EmailSubscribers` WRITE;
/*!40000 ALTER TABLE `EmailSubscribers` DISABLE KEYS */;
INSERT INTO `EmailSubscribers` VALUES (1,'neelpatel5975@gmail.com','2024-06-14','branch4'),(3,'jimilpatel24@gmail.com','2024-06-02',NULL),(13,'hard062004@gmail.com','2024-06-14','branch4'),(21,'ishvarathod@gmail.com','2024-06-14','branch4');
/*!40000 ALTER TABLE `EmailSubscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserType`
--

DROP TABLE IF EXISTS `UserType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserType` (
  `UserTypeID` int NOT NULL AUTO_INCREMENT,
  `UserType` varchar(50) NOT NULL,
  PRIMARY KEY (`UserTypeID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserType`
--

LOCK TABLES `UserType` WRITE;
/*!40000 ALTER TABLE `UserType` DISABLE KEYS */;
INSERT INTO `UserType` VALUES (1,'Member'),(2,'Manager'),(3,'System Admin');
/*!40000 ALTER TABLE `UserType` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcement_details`
--

DROP TABLE IF EXISTS `announcement_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement_details` (
  `announcement_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `date` date DEFAULT NULL,
  `public` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`announcement_id`),
  KEY `announcement_id` (`announcement_id`),
  CONSTRAINT `announcement_details_ibfk_1` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`announcement_id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement_details`
--

LOCK TABLES `announcement_details` WRITE;
/*!40000 ALTER TABLE `announcement_details` DISABLE KEYS */;
INSERT INTO `announcement_details` VALUES (56,'Here is another announcement','and some more content','2024-06-30',0);
/*!40000 ALTER TABLE `announcement_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `announcement_id` int NOT NULL AUTO_INCREMENT,
  `branch_id` int DEFAULT NULL,
  PRIMARY KEY (`announcement_id`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (56,1);
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch_managers`
--

DROP TABLE IF EXISTS `branch_managers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch_managers` (
  `branch_id` int NOT NULL,
  `manager_email` varchar(255) NOT NULL,
  PRIMARY KEY (`branch_id`,`manager_email`),
  KEY `manager_email` (`manager_email`),
  CONSTRAINT `branch_managers_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `branch_managers_ibfk_2` FOREIGN KEY (`manager_email`) REFERENCES `user` (`email`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch_managers`
--

LOCK TABLES `branch_managers` WRITE;
/*!40000 ALTER TABLE `branch_managers` DISABLE KEYS */;
INSERT INTO `branch_managers` VALUES (3,'hard@gmail.com'),(2,'manager@cooked.com'),(1,'manager1@managerrequest.com');
/*!40000 ALTER TABLE `branch_managers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch_user`
--

DROP TABLE IF EXISTS `branch_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch_user` (
  `branch_id` int NOT NULL,
  `user_email` varchar(255) NOT NULL,
  PRIMARY KEY (`branch_id`,`user_email`),
  KEY `user_email` (`user_email`),
  CONSTRAINT `branch_user_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `branch_user_ibfk_2` FOREIGN KEY (`user_email`) REFERENCES `user` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch_user`
--

LOCK TABLES `branch_user` WRITE;
/*!40000 ALTER TABLE `branch_user` DISABLE KEYS */;
INSERT INTO `branch_user` VALUES (2,'matilda.cotton@gmail.com'),(1,'matilda@clubcotton.id.au'),(3,'random@random.com');
/*!40000 ALTER TABLE `branch_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(255) NOT NULL,
  `members` json NOT NULL,
  `events` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `branch_image` varchar(255) DEFAULT NULL,
  `manager_ids` varchar(255) DEFAULT NULL,
  `addressid` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_addressid` (`addressid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,'Adelaide Hills Branch','[\"johndoe@example.com\", \"member@cooked.com\", \"member@cooked.com\", \"member@cooked.com\", \"member@cooked.com\", \"member@cooked.com\", \"member@cooked.com\", \"member@cooked.com\", \"member@cooked.com\", \"\\\"neelpatel5975@gmail.com\\\"\", \"\\\"neelpatel5975@gmail.com\\\"\", \"\\\"neelpatel5975@gmail.com\\\"\"]','[]','2024-05-26 14:39:32','/images/adelaide-hills-branch.jpg','cooked@test.com',NULL),(2,'Port Willunga Branch','[]','[]','2024-05-26 14:39:32','/images/port-willunga-branch.jpg',NULL,NULL),(3,'Barossa Branch','[]','[]','2024-05-30 13:29:12','/images/barossa-branch.jpg','3',NULL),(4,'Adelaide Branch','[]','[]','2024-05-26 14:39:32','/images/adelaide-branch.jpg','[]',NULL);
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_details`
--

DROP TABLE IF EXISTS `event_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_details` (
  `eventid` int NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_description` text,
  `event_image` varchar(255) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `addressid` int DEFAULT NULL,
  `event_public` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`eventid`),
  KEY `addressid` (`addressid`),
  CONSTRAINT `event_details_ibfk_1` FOREIGN KEY (`eventid`) REFERENCES `events` (`eventid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_details`
--

LOCK TABLES `event_details` WRITE;
/*!40000 ALTER TABLE `event_details` DISABLE KEYS */;
INSERT INTO `event_details` VALUES (1,'First Event SQL','test event using sql','/images/event-image.jpeg','2024-10-02',NULL,NULL),(4,'Neel','patel','','2024-06-12',NULL,NULL),(8,'This is a test event','Please work','','2024-06-14',NULL,NULL),(10,'Second Event ','Adelaide Hills Event','/images/default-event.jpg','2024-06-22',NULL,0),(11,'Public Event','Adelaide Hills Event Public','/images/default-event.jpg','2024-06-22',NULL,1),(12,'Hards Event ','Barossa Event','/images/default-event.jpg','2024-06-18',NULL,1),(13,'Hards Second Event','Event','/images/default-event.jpg','2024-06-15',NULL,1);
/*!40000 ALTER TABLE `event_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_rsvp`
--

DROP TABLE IF EXISTS `event_rsvp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_rsvp` (
  `user_email` varchar(255) DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  KEY `user_email` (`user_email`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_rsvp_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `user` (`email`),
  CONSTRAINT `event_rsvp_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`eventid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_rsvp`
--

LOCK TABLES `event_rsvp` WRITE;
/*!40000 ALTER TABLE `event_rsvp` DISABLE KEYS */;
INSERT INTO `event_rsvp` VALUES ('test@test.com',1),('test@test.com',7),('test@test.com',4),('random@random.com',9);
/*!40000 ALTER TABLE `event_rsvp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `eventid` int NOT NULL AUTO_INCREMENT,
  `branchid` int NOT NULL,
  PRIMARY KEY (`eventid`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,1),(3,2),(4,2),(7,1),(8,2),(9,1),(10,1),(11,1),(12,3),(13,3);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `managers`
--

DROP TABLE IF EXISTS `managers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `managers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `managers`
--

LOCK TABLES `managers` WRITE;
/*!40000 ALTER TABLE `managers` DISABLE KEYS */;
/*!40000 ALTER TABLE `managers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pending_requests`
--

DROP TABLE IF EXISTS `pending_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pending_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `user_type` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pending_requests`
--

LOCK TABLES `pending_requests` WRITE;
/*!40000 ALTER TABLE `pending_requests` DISABLE KEYS */;
INSERT INTO `pending_requests` VALUES (6,'test8@gmail.com','Ishva','Rathod','Manager','$2b$10$GQFJLtAlXW11A33zMPxBL.0Wqkx95eUn3AlPw2ky5CUYatoKtetf.');
/*!40000 ALTER TABLE `pending_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(70) DEFAULT NULL,
  `givenName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `password` varchar(60) NOT NULL,
  `UserTypeID` int NOT NULL,
  `subscriptions` json DEFAULT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (4,'member@cooked.com','hard','patel','cooked789',1,'[1]'),(5,'manager@cooked.com','hard','patel','cooked456',2,'[]'),(6,'admin@cooked.com','hard','patel','cooked123',3,'[]'),(7,'neelpatel5975@gmail.com','Neel','Patel','neel',1,'[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3]'),(8,'Neelpatel5975@cooked.com','Neel','patel','test',1,'[\"Adelaide City\"]'),(9,'matilda@test.com','Matilda','Cotton','12345678',1,'[\"Lightsview\", \"Adelaide City\", \"Brighton\"]'),(10,'test@test.com','Test1','Cotton','12345678',1,'[\"Lightsview\", \"Adelaide City\", \"Brighton\"]'),(11,'hashcook@gmail.com','Hard','Patel','$2b$10$rZ0NiDXyCtTY0EZH8cONt.8d6Oy7wUFNdlfUDPKpp7W8Vd47eVaM2',1,NULL),(12,'validtest@gmail.com','Jeremy','Clarkson','$2b$10$iybzKxs2pLFSmLC9wcGInutavQgkgeT5XBjqHpWtxRKF5pdPTPu8S',1,NULL),(13,'hsh@gmail.com','h','patel','$2b$10$WEOhKqiPtMcgkZuaqCv4kuSIDPaMcsNhfCIyhHs8jxHdjIYIx5J/e',1,NULL),(15,'hssh@gmail.com','h','patel','$2b$10$hc6C0hK8zIGOw7UvwUL/beZTVFWkwRm7DQT.qV3U.A98CKzFIZ81O',1,NULL),(16,'hsash@gmail.com','h','patel','$2b$10$DxwEUlfVmQjzTc4eL3Ex6eZRw1HxgQGwWR8tynNtBTsbbfppRjNDK',1,NULL),(17,'hsashj@gmail.com','h','patel','$2b$10$Wn01JzYlXjzB28B7hbyEZ.05pg1CWvAPex6nji6zhmGzQWTYf/d6e',1,NULL),(18,'matilda@clubcotton.id.au','Matilda','Cotton','$2b$10$WcAl/I5Hu8nvSHRxrRQageXKePsvZNnHvpZUyLiev0Aw.s45d/X8i',1,NULL),(19,'matilda.cotton@gmail.com','Matilda','Cotton','$2b$10$H.IFDOYmM2Xfrg7eEveB1e/MqTApjevSt5FSsZxVh3ebLDBkxmcZ2',1,NULL),(20,'admin@hashed.com','System','Admin','$2b$10$KPcpiJ73FMdIQz/xm3k7N.ZpF3TDmMks6kDisCy17qZfidi0n68tq',3,NULL),(21,'hard062004@gmail.com','Hard','Patel','$2b$10$VNNwD1rwgzvaIvkIqAHZq.8WpcJpLA.mzny6NNQlOC1M0XS8ZppBi',1,NULL),(22,'manager@hashed.com','manager','cooked','$2b$10$HEi.f6Ms0ANlxCsQMAMmwu1VPCImOED39Cm3ND4rsNVNjXlbbQHVe',2,NULL),(26,'random@random.com','Test','User','$2b$10$CsE4./gYab4Zpo2ouoikBO2EIx0hRooe695wCOjpQ3EioiHL/iU86',1,NULL),(27,'manager1@managerrequest.com','Manager1','ManagerTest','$2b$10$Nu8Ip7QWGEW6i/vaLY9bG.6gTWIhqJUZWFwTE7oJxzcxiGLmsoxX.',2,NULL),(28,'dhdhdh@gmail.com','dhdhdhd','dhdhdhdh','$2b$10$swTHAZxjt8PKidMrKjKIyOgl6kF3rhxcz/tnv1S.ZAruuzkp6NX.e',1,NULL),(29,'hard@gmail.com','Hard','Patel','$2b$10$Ofs7HaBKUWXBNVyhia1mEevLCZqEWMqIFdYZ9KYby.MFzTGXhyhNq',2,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-14 12:55:36
