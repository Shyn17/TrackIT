-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: trackit
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '09471739-2c5b-11f1-998e-842afd5302a6:1-261';

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `task_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfknte4fhjhet3l1802m1yqa50` (`task_id`),
  KEY `FKqm52p1v3o13hy268he0wcngr5` (`user_id`),
  CONSTRAINT `FKfknte4fhjhet3l1802m1yqa50` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`),
  CONSTRAINT `FKqm52p1v3o13hy268he0wcngr5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,'hello, testing','2026-04-18 20:23:15.968944',1,3),(2,'hello, testing','2026-04-18 21:33:01.278902',1,3),(3,'i am shayan testing hre','2026-04-23 14:57:16.536162',3,3),(4,'hello, testing again','2026-04-24 14:40:32.601574',1,4),(5,'hello','2026-04-26 00:10:30.160562',2,4),(6,'hello','2026-04-26 00:25:56.507457',2,3),(7,'@shayan i am here','2026-04-26 00:26:06.358514',2,3);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `issue_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `issues`
--

DROP TABLE IF EXISTS `issues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `issues` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `description` text,
  `status` enum('OPEN','IN_PROGRESS','RESOLVED','CLOSED') DEFAULT NULL,
  `priority` enum('LOW','MEDIUM','HIGH') DEFAULT NULL,
  `severity` enum('LOW','MEDIUM','HIGH') DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `assigned_to` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `issues`
--

LOCK TABLES `issues` WRITE;
/*!40000 ALTER TABLE `issues` DISABLE KEYS */;
/*!40000 ALTER TABLE `issues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `is_read` bit(1) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `type` enum('COMMENT_ADDED','SYSTEM_ALERT','TASK_ASSIGNED','TASK_COMPLETED','TASK_UPDATED') DEFAULT NULL,
  `recipient_id` bigint DEFAULT NULL,
  `task_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfcyn9rsga73dqnorl7owfyl4a` (`recipient_id`),
  KEY `FKg6e8dcyvu9qdcfds2o3pj9qen` (`task_id`),
  CONSTRAINT `FKfcyn9rsga73dqnorl7owfyl4a` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKg6e8dcyvu9qdcfds2o3pj9qen` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,'2026-04-23 14:10:24.567750',_binary '','You have been assigned to task: Test Task','TASK_ASSIGNED',3,1),(2,'2026-04-23 14:10:26.979618',_binary '','You have been assigned to task: Test Task','TASK_ASSIGNED',3,2),(3,'2026-04-23 14:10:30.726113',_binary '','You have been assigned to task: Bug in login','TASK_ASSIGNED',3,3),(4,'2026-04-23 14:10:32.493884',_binary '','You have been assigned to task: Crash on login','TASK_ASSIGNED',3,4),(5,'2026-04-23 14:21:47.506603',_binary '','You have been assigned to task: Test Task','TASK_ASSIGNED',3,1),(6,'2026-04-24 14:44:12.894426',_binary '\0','You have been assigned to task: Bug','TASK_ASSIGNED',3,5),(7,'2026-04-28 10:44:14.233809',_binary '\0','Your task \'Test Task\' has been marked as RESOLVED','TASK_COMPLETED',1,1),(8,'2026-04-28 10:44:19.401008',_binary '\0','Task \'Test Task\' assigned to you has been marked as RESOLVED','TASK_COMPLETED',3,1),(9,'2026-04-28 10:44:23.569524',_binary '\0','Task \'Test Task\' has been marked as RESOLVED','TASK_COMPLETED',4,1),(10,'2026-04-29 22:13:04.518338',_binary '\0','You have been assigned to task: cssdcds','TASK_ASSIGNED',3,10),(11,'2026-04-29 22:14:41.685131',_binary '\0','Your task \'Test Task\' has been marked as CLOSED','TASK_COMPLETED',1,2),(13,'2026-04-29 22:15:23.831375',_binary '\0','Task \'Test Task\' has been marked as CLOSED','TASK_COMPLETED',4,2),(14,'2026-04-29 22:15:44.940543',_binary '\0','Task \'Test Task\' has been marked as CLOSED','TASK_COMPLETED',6,2);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'2026-04-23 13:55:55.826495','jiasjaijskanxksknxkmskmxksmkm','subhah'),(2,'2026-04-28 11:03:26.739543','TESTING HERE','TEST1'),(3,'2026-04-28 11:03:36.896650','test','TEST'),(4,'2026-04-29 21:59:53.341623','dsvd','vsvdv'),(5,'2026-04-30 00:32:51.367847','sdasd','sdad');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `setting_key` varchar(255) DEFAULT NULL,
  `setting_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(2000) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `assigned_to` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `priority` enum('HIGH','LOW','MEDIUM') DEFAULT NULL,
  `severity` enum('CRITICAL','MAJOR','MINOR') DEFAULT NULL,
  `project_id` bigint DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `reporter_email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbhwpp8tr117vvbxhf5sbkdkc9` (`user_id`),
  KEY `FK4amgamieqvrq9ej2wy2oe6878` (`assigned_to`),
  KEY `FK59mygkh6yxl8yj6j8ocg1k73a` (`project_id`),
  CONSTRAINT `FK4amgamieqvrq9ej2wy2oe6878` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`),
  CONSTRAINT `FK59mygkh6yxl8yj6j8ocg1k73a` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `FKbhwpp8tr117vvbxhf5sbkdkc9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (1,'This is my first task','RESOLVED','Test Task',1,3,NULL,NULL,NULL,NULL,'2026-04-28 10:44:14.192235',NULL),(2,'Testing JWT','CLOSED','Test Task',1,3,NULL,NULL,NULL,NULL,'2026-04-29 22:14:41.642449',NULL),(3,'Fix login issue','IN_PROGRESS','Bug in login',1,3,NULL,NULL,NULL,NULL,NULL,NULL),(4,'App crashes when clicking login','RESOLVED','Crash on login',2,3,NULL,'HIGH','CRITICAL',NULL,NULL,NULL),(5,'jsdjsjcbjsbcj','IN_PROGRESS','Bug',4,3,'2026-04-24 14:16:49.563487','HIGH','MAJOR',NULL,'2026-04-24 14:44:12.880725',NULL),(6,'jsdjsjcbjsbcj','OPEN','Bug',4,NULL,'2026-04-24 14:58:53.269156','HIGH','MAJOR',NULL,'2026-04-24 14:58:53.269156',NULL),(7,'jsdjsjcbjsbcj','OPEN','Bug',4,NULL,'2026-04-24 19:09:44.215332','HIGH','MAJOR',NULL,'2026-04-24 19:09:44.215332',NULL),(8,'jsdjsjcbjsbcj','OPEN','Bug',4,NULL,'2026-04-25 15:29:19.341524','HIGH','MAJOR',NULL,'2026-04-25 15:29:19.341524',NULL),(9,'kxmsknckxn','OPEN','cnxjcn',2,NULL,'2026-04-26 00:28:48.015139','MEDIUM','CRITICAL',1,'2026-04-26 00:28:48.015139',NULL),(10,'dsdbsvchdshvch','IN_PROGRESS','cssdcds',2,3,'2026-04-28 10:34:01.268571','HIGH','MAJOR',NULL,'2026-04-29 22:13:04.438822',NULL),(11,'mkmcksamcmk','OPEN','snajcnsjn',2,NULL,'2026-04-30 00:16:12.558104','MEDIUM','CRITICAL',1,'2026-04-30 00:16:12.558104','reporter@test.com'),(12,'akjskajkaj','OPEN','ksakdskd',2,NULL,'2026-04-30 00:26:59.801576','LOW','CRITICAL',2,'2026-04-30 00:26:59.801576','reporter@test.com'),(13,'zyx','OPEN','xyz',4,NULL,'2026-04-30 00:34:17.904095','MEDIUM','MAJOR',1,'2026-04-30 00:34:17.904095','shayan12@test.com');
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_attachments`
--

DROP TABLE IF EXISTS `task_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_attachments` (
  `task_id` bigint NOT NULL,
  `attachments` varchar(255) DEFAULT NULL,
  KEY `FKcrb86lsrm7nlgny32gtoi2lh4` (`task_id`),
  CONSTRAINT `FKcrb86lsrm7nlgny32gtoi2lh4` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_attachments`
--

LOCK TABLES `task_attachments` WRITE;
/*!40000 ALTER TABLE `task_attachments` DISABLE KEYS */;
INSERT INTO `task_attachments` VALUES (9,'1777145328010_bknd.pdf'),(10,'1777354441247_CCP_SCD.pdf'),(11,'1777490172549_Rehan LAB 10.pdf'),(12,'1777490819790_Lab Task 10.pdf');
/*!40000 ALTER TABLE `task_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','DEVELOPER','REPORTER') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'shayan2@test.com','$2a$10$n9exUDqWknkJcA1odnQI/eRQgzeRckY5yf.RziggZk55sm3W3UfDq','ADMIN'),(2,NULL,'reporter@test.com','$2a$10$mzZsVJcZTsJYSK8HLT36uOSfyOo2JWDRppQWfhhDmEOVkikVKc.kG','REPORTER'),(3,NULL,'Developer@test.com','$2a$10$htbOsPMKRSFLyu86MZolZ.xKf8qGWL6YreBnNbMNB09vZl8q8seTm','DEVELOPER'),(4,'shayan','shayan12@test.com','$2a$10$nnC0z4YqYVee2v49yb6MW.5Dj1/vtMXDqY9ZX4hc3MHw9iaOccZJ6','ADMIN'),(5,'jxzjxn','zxnxnz@gmail.com','kzmxkzm','REPORTER'),(6,'admin_tester','admin@test.com','$2a$10$tMjaUjHAntdk0JEy3cstAelnsOQ4I3J4ZTgY77EUZOA5xlEt8EvoO','ADMIN'),(7,'admin','admin@trackit.com','$2a$10$yji9EnmA/uKd6vaOfHEN0uoZBxbh69Fv.KyqseMMdzlhH8YNGxatW','DEVELOPER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-01 16:31:00
