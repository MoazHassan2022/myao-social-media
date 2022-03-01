create database MYAO;

use MYAO;

DROP TABLE IF EXISTS `admin`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `admin` (
  `Admin_Id` varchar (12) NOT NULL,
  `Type` smallint NOT NULL,
  PRIMARY KEY (`Admin_Id`)
);

DROP TABLE IF EXISTS `surfer`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `surfer` (
  `Id` varchar (12) NOT NULL,
  `Fname` varchar (20) NOT NULL,
  `Lname` varchar (20) NOT NULL,
  `Email` varchar (50) NOT NULL,
  `Password` varchar (20) NOT NULL,
  `photo` longtext,
  `Gender` tinyint (1) NOT NULL,
  `Birth_Date` date NOT NULL,
  `Closed_Admin` varchar (12) DEFAULT NULL,
  `Last_Login` TIMESTAMP NOT NULL,
  `Is_Active` tinyint (1) NOT NULL,
  `Created_Date` date NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_Surfer_Admin` (`Closed_Admin`),
  CONSTRAINT `FK_Surfer_Admin` FOREIGN KEY (`Closed_Admin`) REFERENCES `admin` (`Admin_Id`)
);

DROP TABLE IF EXISTS `marketer`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `marketer` (
  `Id` varchar (12) NOT NULL,
  `Fname` varchar (20) NOT NULL,
  `Lname` varchar (20) NOT NULL,
  `Email` varchar (50) NOT NULL,
  `Password` varchar (20) NOT NULL,
  `photo` longtext,
  `Closed_Admin` varchar (12) DEFAULT NULL,
  `Is_Active` tinyint (1) NOT NULL,
  `Last_Published` TIMESTAMP DEFAULT NULL,
  `Founded_at` date NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_marketer_Admin` (`Closed_Admin`),
  CONSTRAINT `FK_marketer_Admin` FOREIGN KEY (`Closed_Admin`) REFERENCES `admin` (`Admin_Id`)
);

DROP TABLE IF EXISTS `post`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `post` (
  `id` varchar (12) NOT NULL,
  `post_text` longtext NOT NULL,
  `Surfer_id` varchar (12) NOT NULL,
  `has_multiMedia` tinyint (1) NOT NULL,
  `created_Date` TIMESTAMP NOT NULL,
  `comment_counter` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_Post_Surfer` (`Surfer_id`),
  CONSTRAINT `FK_Post_Surfer` FOREIGN KEY (`Surfer_id`) REFERENCES `surfer` (`Id`)
);

DROP TABLE IF EXISTS `comment`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `comment` (
  `post_id` varchar (12) NOT NULL,
  `comment_user_id` varchar (12) NOT NULL,
  `comment_content` longtext NOT NULL,
  `comment_time` TIMESTAMP NOT NULL,
  `Id` varchar (12) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_Comment_Post` (`post_id`),
  KEY `FK_Comment_Surfer` (`comment_user_id`),
  CONSTRAINT `FK_Comment_Post` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON
DELETE CASCADE,
  CONSTRAINT `FK_Comment_Surfer` FOREIGN KEY (`comment_user_id`) REFERENCES `surfer` (`Id`) ON
DELETE CASCADE
);

DROP TABLE IF EXISTS `favpost`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `favpost` (
  `post_id` varchar (12) NOT NULL,
  `Surfer_id` varchar (12) NOT NULL,
  PRIMARY KEY (`post_id`, `Surfer_id`),
  KEY `FK_Favpost_Surfer` (`Surfer_id`),
  CONSTRAINT `FK_Favpost_Post` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON
DELETE CASCADE,
  CONSTRAINT `FK_Favpost_Surfer` FOREIGN KEY (`Surfer_id`) REFERENCES `surfer` (`Id`) ON
DELETE CASCADE
);

DROP TABLE IF EXISTS `friend`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `friend` (
  `source_id` varchar (12) NOT NULL,
  `target_id` varchar (12) NOT NULL,
  `friendship_time` TIMESTAMP DEFAULT NULL,
  `blocked` tinyint (1) NOT NULL,
  PRIMARY KEY (`source_id`, `target_id`),
  KEY `FK_Friend_Surfer1` (`target_id`),
  CONSTRAINT `FK_Friend_Surfer` FOREIGN KEY (`source_id`) REFERENCES `surfer` (`Id`),
  CONSTRAINT `FK_Friend_Surfer1` FOREIGN KEY (`target_id`) REFERENCES `surfer` (`Id`) ON
DELETE CASCADE
);

DROP TABLE IF EXISTS `like`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `like` (
  `type` smallint NOT NULL,
  `post_id` varchar (12) NOT NULL,
  `liker_id` varchar (12) NOT NULL,
  `like_time` TIMESTAMP NOT NULL,
  PRIMARY KEY (`post_id`, `liker_id`),
  CONSTRAINT `FK_like_Post` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON
DELETE CASCADE,
  CONSTRAINT `FK_like_Surfer` FOREIGN KEY (`post_id`) REFERENCES `surfer` (`Id`) ON
DELETE CASCADE
);

DROP TABLE IF EXISTS `location`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `location` (
  `Id` varchar (12) NOT NULL,
  `Surfer_id` varchar (12) NOT NULL,
  `Description` longtext NOT NULL,
  `Maplink` longtext NOT NULL,
  `created_Date` TIMESTAMP NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_Location_Surfer` (`Surfer_id`),
  CONSTRAINT `FK_Location_Surfer` FOREIGN KEY (`Surfer_id`) REFERENCES `surfer` (`Id`) ON
DELETE CASCADE
);

DROP TABLE IF EXISTS `mar_reports_mar`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `mar_reports_mar` (
  `Reported_Id` varchar (12) NOT NULL,
  `Reporter_Id` varchar (12) NOT NULL DEFAULT '-1',
  `Report_Option` smallint NOT NULL,
  PRIMARY KEY (`Reported_Id`, `Reporter_Id`),
  KEY `Reporter_FK` (`Reporter_Id`),
  CONSTRAINT `Reported_FK` FOREIGN KEY (`Reported_Id`) REFERENCES `marketer` (`Id`) ON
DELETE CASCADE,
  CONSTRAINT `Reporter_FK` FOREIGN KEY (`Reporter_Id`) REFERENCES `marketer` (`Id`)
);

DROP TABLE IF EXISTS `post_media`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `post_media` (
  `link` longtext NOT NULL,
  `post_id` varchar (12) NOT NULL,
  `type` tinyint (1) NOT NULL,
  KEY `FK_Post_Media_Post` (`post_id`),
  CONSTRAINT `FK_Post_Media_Post` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON
DELETE CASCADE
);

DROP TABLE IF EXISTS `product`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `product` (
  `id` varchar (12) NOT NULL,
  `marketer_id` varchar (12) NOT NULL,
  `product_text` longtext NOT NULL,
  `avg_rating` decimal (2, 1) NOT NULL,
  `price` decimal (8, 2) NOT NULL,
  `created_date` TIMESTAMP NOT NULL,
  `reviews_counter` int NOT NULL,
  `Product_Name` varchar (20) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_Product_marketer` FOREIGN KEY (`id`) REFERENCES `marketer` (`Id`) ON
DELETE CASCADE
);

DROP TABLE IF EXISTS `product_media`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `product_media` (
  `link` longtext NOT NULL,
  `product_id` varchar (12) NOT NULL,
  `type` tinyint (1) NOT NULL,
  KEY `FK_Product_media_Product` (`product_id`),
  CONSTRAINT `FK_Product_media_Product` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON
DELETE CASCADE
);

DROP TABLE IF EXISTS `review`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `review` (
  `Surfer_id` varchar (12) NOT NULL,
  `product_id` varchar (12) NOT NULL,
  `rating` decimal (2, 1) NOT NULL,
  `rating_time` TIMESTAMP NOT NULL,
  `rating_content` longtext,
  `Id` varchar (12) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_review_Product` (`product_id`),
  CONSTRAINT `FK_review_Product` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON
DELETE CASCADE,
  CONSTRAINT `FK_review_surfser` FOREIGN KEY (`Id`) REFERENCES `surfer` (`Id`) ON
DELETE CASCADE
);

DROP TABLE IF EXISTS `sur_rep_mar`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `sur_rep_mar` (
  `Sur_id` varchar (12) NOT NULL,
  `Mar_id` varchar (12) NOT NULL,
  `report_option` smallint NOT NULL,
  KEY `FK_Sur_rep_Mar_marketer` (`Mar_id`),
  KEY `FK_Sur_rep_Mar_Surfer` (`Sur_id`),
  CONSTRAINT `FK_Sur_rep_Mar_marketer` FOREIGN KEY (`Mar_id`) REFERENCES `marketer` (`Id`) ON
DELETE CASCADE,
  CONSTRAINT `FK_Sur_rep_Mar_Surfer` FOREIGN KEY (`Sur_id`) REFERENCES `surfer` (`Id`)
);

DROP TABLE IF EXISTS `sur_rep_post`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `sur_rep_post` (
  `Sur_id` varchar (12) NOT NULL,
  `Post_id` varchar (12) NOT NULL,
  `report_option` smallint NOT NULL,
  PRIMARY KEY (`Sur_id`, `Post_id`),
  KEY `FK_Sur_rep_post_Post` (`Post_id`),
  CONSTRAINT `FK_Sur_rep_post_Post` FOREIGN KEY (`Post_id`) REFERENCES `post` (`id`) ON
DELETE CASCADE,
  CONSTRAINT `FK_Sur_rep_post_Surfer` FOREIGN KEY (`Sur_id`) REFERENCES `surfer` (`Id`)
);

DROP TABLE IF EXISTS `sur_rep_pro`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `sur_rep_pro` (
  `Sur_id` varchar (12) NOT NULL,
  `Pro_id` varchar (12) NOT NULL,
  `report_option` smallint NOT NULL,
  PRIMARY KEY (`Sur_id`, `Pro_id`),
  KEY `FK_Sur_rep_pro_Product` (`Pro_id`),
  CONSTRAINT `FK_Sur_rep_pro_Product` FOREIGN KEY (`Pro_id`) REFERENCES `product` (`id`) ON
DELETE CASCADE,
  CONSTRAINT `FK_Sur_rep_pro_Surfer` FOREIGN KEY (`Sur_id`) REFERENCES `surfer` (`Id`)
);

DROP TABLE IF EXISTS `sur_rep_sur`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `sur_rep_sur` (
  `reporter_id` varchar (12) NOT NULL,
  `reported_id` varchar (12) NOT NULL,
  `report_option` smallint NOT NULL,
  PRIMARY KEY (`reporter_id`, `reported_id`),
  KEY `FK_Sur_rep_Sur_Surfer1` (`reported_id`),
  CONSTRAINT `FK_Sur_rep_Sur_Surfer` FOREIGN KEY (`reporter_id`) REFERENCES `surfer` (`Id`),
  CONSTRAINT `FK_Sur_rep_Sur_Surfer1` FOREIGN KEY (`reported_id`) REFERENCES `surfer` (`Id`) ON
DELETE CASCADE
);