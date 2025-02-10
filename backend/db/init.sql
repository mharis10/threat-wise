-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (arm64)
--
-- Host: localhost    Database: phishing-defender-db
-- ------------------------------------------------------
-- Server version	8.0.38

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
-- Table structure for table `campaignRecipients`
--

DROP TABLE IF EXISTS `campaignRecipients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaignRecipients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaignId` int NOT NULL,
  `userId` int NOT NULL,
  `emailOpenCount` int NOT NULL DEFAULT '0',
  `reportPhishingCount` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `campaignRecipients_campaigns_FK` (`campaignId`),
  KEY `campaignRecipients_users_FK` (`userId`),
  CONSTRAINT `campaignRecipients_campaigns_FK` FOREIGN KEY (`campaignId`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE,
  CONSTRAINT `campaignRecipients_users_FK` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaignRecipients`
--

LOCK TABLES `campaignRecipients` WRITE;
/*!40000 ALTER TABLE `campaignRecipients` DISABLE KEYS */;
INSERT INTO `campaignRecipients` VALUES (1,1,27,0,1),(3,1,48,0,0);
/*!40000 ALTER TABLE `campaignRecipients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaigns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companyId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `createdTimestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `campaigns_companies_FK` (`companyId`),
  CONSTRAINT `campaigns_companies_FK` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT INTO `campaigns` VALUES (1,3,'Test Group 1','2024-07-20 10:03:49');
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaignStats`
--

DROP TABLE IF EXISTS `campaignStats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaignStats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campaignId` int NOT NULL,
  `emailOpenCount` int NOT NULL DEFAULT '0',
  `reportPhishingCount` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `campaignStats_unique` (`campaignId`),
  CONSTRAINT `campaignStats_campaigns_FK` FOREIGN KEY (`campaignId`) REFERENCES `campaigns` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaignStats`
--

LOCK TABLES `campaignStats` WRITE;
/*!40000 ALTER TABLE `campaignStats` DISABLE KEYS */;
INSERT INTO `campaignStats` VALUES (1,1,0,1);
/*!40000 ALTER TABLE `campaignStats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `industry` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `address` varchar(500) NOT NULL,
  `contractStartDate` date NOT NULL,
  `contractLength` varchar(100) NOT NULL,
  `currentMailBoxes` int NOT NULL DEFAULT '0',
  `maxMailBoxes` int NOT NULL DEFAULT '0',
  `chatgptIntegration` tinyint(1) NOT NULL DEFAULT '0',
  `trainingVideos` tinyint(1) NOT NULL DEFAULT '0',
  `smsPhishingSimulation` tinyint(1) NOT NULL DEFAULT '0',
  `widget` tinyint(1) NOT NULL DEFAULT '0',
  `rewards` tinyint(1) NOT NULL DEFAULT '0',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `companies_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (3,'Tech Innovations Inc.','Technology','info@techinnovations.com','1234 Tech Park, Silicon Valley, CA 94025','2024-05-01','3 years',150,300,1,0,0,1,1,1999.90,1,'2024-05-04 19:23:48','2024-05-05 15:12:01'),(4,'221B Softwares','Software House','linkskashif4@gmail.com','Bahria Town','2024-05-01','1 year',50,100,1,0,0,0,1,100.00,1,'2024-05-05 14:31:39','2024-05-05 14:31:39');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emailTemplates`
--

DROP TABLE IF EXISTS `emailTemplates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emailTemplates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `body` text NOT NULL,
  `tags` text,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `emailTemplates_users_FK` (`userId`),
  CONSTRAINT `emailTemplates_users_FK` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emailTemplates`
--

LOCK TABLES `emailTemplates` WRITE;
/*!40000 ALTER TABLE `emailTemplates` DISABLE KEYS */;
INSERT INTO `emailTemplates` VALUES (8,9,'Test Email','Test Subject','<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<title>${title}</title>\n<style>\n  body {\n    font-family: \'Arial\', sans-serif;\n    background-color: #f4f4f4;\n    color: #333333;\n    margin: 0;\n    padding: 0;\n  }\n  .email-container {\n    max-width: 600px;\n    margin: auto;\n    background-color: #ffffff;\n    padding: 20px;\n    border: 1px solid #dddddd;\n  }\n  .content {\n    padding: 20px;\n    text-align: left;\n  }\n  .footer {\n    font-size: 12px;\n    text-align: center;\n    color: #999999;\n    padding: 20px;\n  }\n  .report-button {\n    padding: 10px 15px;\n    color: #ffffff !important;\n    background-color: #FF0000;\n    text-decoration: none;\n    border-radius: 4px;\n    float: right;\n  }\n</style>\n</head>\n<body>\n  <div class=\"email-container\">\n    <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n      <tr>\n        <td align=\"right\">\n          <a href=\"{{Report Phishing Url}}\" class=\"report-button\">Report</a>\n        </td>\n      </tr>\n    </table>\n    <div class=\"content\">\n      <p> Hi {{First Name}} {{Last Name}},</p><p><br></p><p>Company:  {{Company Name}} </p>\n    </div>\n  </div>\n  <img src=\"{{Tracking Pixel Url}}\" alt=\"\" style=\"display:none;\" />\n</body>\n</html>\n','{{First Name}},{{Last Name}},{{Company Name}}',1,'2024-05-31 08:04:50','2024-05-31 08:04:50'),(9,10,'Contact Inquiry','New Contact Inquiry','<h1>New Contact Inquiry!</h1><p>A potential client has reached out through our contact form. Please find the details below:</p><p><strong>Client First Name:</strong> {{First Name}}</p><p><strong>Client Last Name:</strong> {{Last Name}}</p><p><strong>Client Email:</strong> <span class=\"no-link\">{{Email}}</span></p><p><strong>Client Message:</strong> {{Phone Number}}</p><p>Please respond to this inquiry promptly to maintain effective communication.</p>','{{First Name}},{{Last Name}},{{Email}},{{Phone Number}}',1,'2024-05-31 20:01:13','2024-06-13 09:23:50'),(10,10,'Test','Test','<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<title>${title}</title>\n<style>\n  body {\n    font-family: \'Arial\', sans-serif;\n    background-color: #f4f4f4;\n    color: #333333;\n    margin: 0;\n    padding: 0;\n  }\n  .email-container {\n    max-width: 600px;\n    margin: auto;\n    background-color: #ffffff;\n    padding: 20px;\n    border: 1px solid #dddddd;\n  }\n  .content {\n    padding: 20px;\n    text-align: left;\n  }\n  .footer {\n    font-size: 12px;\n    text-align: center;\n    color: #999999;\n    padding: 20px;\n  }\n  .report-button {\n    padding: 10px 15px;\n    color: #ffffff !important;\n    background-color: #FF0000;\n    text-decoration: none;\n    border-radius: 4px;\n    float: right;\n  }\n</style>\n</head>\n<body>\n  <div class=\"email-container\">\n    <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n      <tr>\n        <td align=\"right\">\n          <a href=\"{{Report Phishing Url}}\" class=\"report-button\">Report</a>\n        </td>\n      </tr>\n    </table>\n    <div class=\"content\">\n      <p> {{First Name}} {{Last Name}} {{Email}} {{Phone Number}} {{Mobile Number}} {{Company Name}} {{Language}} {{Department}} {{Location}} {{LinkedIn}} {{Job Title}} {{Company Email}} {{Line Manager First Name}} {{Line Manager Last Name}} {{Line Manager Email}} {{Location}}                </p>\n    </div>\n  </div>\n  <img src=\"{{Tracking Pixel Url}}\" alt=\"\" style=\"display:none;\" />\n</body>\n</html>\n','{{First Name}},{{Last Name}},{{Email}},{{Phone Number}},{{Mobile Number}},{{Company Name}},{{Language}},{{Department}},{{Location}},{{LinkedIn}},{{Job Title}},{{Company Email}},{{Line Manager First Name}},{{Line Manager Last Name}},{{Line Manager Email}}',1,'2024-06-03 14:07:35','2024-06-03 14:07:35'),(11,10,'Test1','Test1','<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<title>${title}</title>\n<style>\n  body {\n    font-family: \'Arial\', sans-serif;\n    background-color: #f4f4f4;\n    color: #333333;\n    margin: 0;\n    padding: 0;\n  }\n  .email-container {\n    max-width: 600px;\n    margin: auto;\n    background-color: #ffffff;\n    padding: 20px;\n    border: 1px solid #dddddd;\n  }\n  .content {\n    padding: 20px;\n    text-align: left;\n  }\n  .footer {\n    font-size: 12px;\n    text-align: center;\n    color: #999999;\n    padding: 20px;\n  }\n  .report-button {\n    padding: 10px 15px;\n    color: #ffffff !important;\n    background-color: #FF0000;\n    text-decoration: none;\n    border-radius: 4px;\n    float: right;\n  }\n</style>\n</head>\n<body>\n  <div class=\"email-container\">\n    <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n      <tr>\n        <td align=\"right\">\n          <a href=\"{{Report Phishing Url}}\" class=\"report-button\">Report</a>\n        </td>\n      </tr>\n    </table>\n    <div class=\"content\">\n      <p> {{First Name}} {{Company Email}} {{Line Manager First Name}} {{Last Name}} {{Job Title}} {{Line Manager Last Name}} {{Email}} {{LinkedIn}} {{Line Manager Email}} {{Location}} {{Phone Number}} {{Mobile Number}} {{Department}} {{Language}} {{Company Name}}               </p>\n    </div>\n  </div>\n  <img src=\"{{Tracking Pixel Url}}\" alt=\"\" style=\"display:none;\" />\n</body>\n</html>\n','{{First Name}},{{Company Email}},{{Line Manager First Name}},{{Last Name}},{{Job Title}},{{Line Manager Last Name}},{{Email}},{{LinkedIn}},{{Line Manager Email}},{{Location}},{{Phone Number}},{{Mobile Number}},{{Department}},{{Language}},{{Company Name}}',1,'2024-06-03 14:10:05','2024-06-03 14:10:05'),(12,10,'Test','Test','<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<title>${title}</title>\n<style>\n  body {\n    font-family: \'Arial\', sans-serif;\n    background-color: #f4f4f4;\n    color: #333333;\n    margin: 0;\n    padding: 0;\n  }\n  .email-container {\n    max-width: 600px;\n    margin: auto;\n    background-color: #ffffff;\n    padding: 20px;\n    border: 1px solid #dddddd;\n  }\n  .content {\n    padding: 20px;\n    text-align: left;\n  }\n  .footer {\n    font-size: 12px;\n    text-align: center;\n    color: #999999;\n    padding: 20px;\n  }\n  .report-button {\n    padding: 10px 15px;\n    color: #ffffff !important;\n    background-color: #FF0000;\n    text-decoration: none;\n    border-radius: 4px;\n    float: right;\n  }\n</style>\n</head>\n<body>\n  <div class=\"email-container\">\n    <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n      <tr>\n        <td align=\"right\">\n          <a href=\"{{Report Phishing Url}}\" class=\"report-button\">Report</a>\n        </td>\n      </tr>\n    </table>\n    <div class=\"content\">\n      <p>{{First Name}} </p>\n    </div>\n  </div>\n  <img src=\"{{Tracking Pixel Url}}\" alt=\"\" style=\"display:none;\" />\n</body>\n</html>\n','{{First Name}}',1,'2024-06-05 13:14:15','2024-06-05 13:14:15'),(13,10,'Test','Test','<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<title>${title}</title>\n<style>\n  body {\n    font-family: \'Arial\', sans-serif;\n    background-color: #f4f4f4;\n    color: #333333;\n    margin: 0;\n    padding: 0;\n  }\n  .email-container {\n    max-width: 600px;\n    margin: auto;\n    background-color: #ffffff;\n    padding: 20px;\n    border: 1px solid #dddddd;\n  }\n  .content {\n    padding: 20px;\n    text-align: left;\n  }\n  .footer {\n    font-size: 12px;\n    text-align: center;\n    color: #999999;\n    padding: 20px;\n  }\n  .report-button {\n    padding: 10px 15px;\n    color: #ffffff !important;\n    background-color: #FF0000;\n    text-decoration: none;\n    border-radius: 4px;\n    float: right;\n  }\n</style>\n</head>\n<body>\n  <div class=\"email-container\">\n    <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n      <tr>\n        <td align=\"right\">\n          <a href=\"{{Report Phishing Url}}\" class=\"report-button\">Report</a>\n        </td>\n      </tr>\n    </table>\n    <div class=\"content\">\n      <p><span style=\"color: rgb(55, 65, 81);\">Dear {{First Name}},</span></p><p><br></p><p><span style=\"color: rgb(55, 65, 81);\">We are thrilled to welcome you to the {{Company Name}} family! Your expertise and enthusiasm are valuable additions to our {{Department}}. As you settle into your new role as {{Job Title}}, please do not hesitate to reach out if you have any questions or need assistance.</span></p><p><br></p><p><span style=\"color: rgb(55, 65, 81);\">To help you get started, here are some important points of contact:</span></p><p><span style=\"color: rgb(55, 65, 81);\">- Your Line Manager: {{Line Manager First Name}} {{Line Manager Last Name}} ({{Line Manager Email}})</span></p><p><span style=\"color: rgb(55, 65, 81);\">- General Inquiries: {{Company Email}}</span></p><p><br></p><p><span style=\"color: rgb(55, 65, 81);\">Remember, communication is key to our collective success, so keep in touch through your preferred channel, whether it\'s email, phone, or LinkedIn.</span></p><p><br></p><p><span style=\"color: rgb(55, 65, 81);\">Once again, welcome aboard! We are excited to see what we can achieve together.</span></p><p><br></p><p><span style=\"color: rgb(55, 65, 81);\">Best regards,</span></p><p><br></p><p><span style=\"color: rgb(55, 65, 81);\">The {{Department}} Team</span></p><p><span style=\"color: rgb(55, 65, 81);\">{{Company Name}}</span></p><p><span style=\"color: rgb(55, 65, 81);\">{{Location}}</span></p>\n    </div>\n  </div>\n  <img src=\"{{Tracking Pixel Url}}\" alt=\"\" style=\"display:none;\" />\n</body>\n</html>\n','{{First Name}},{{Company Name}},{{Department}},{{Job Title}},{{Line Manager First Name}},{{Line Manager Last Name}},{{Line Manager Email}},{{Company Email}},{{Department}},{{Company Name}},{{Location}}',1,'2024-06-05 13:32:49','2024-06-05 13:32:49');
/*!40000 ALTER TABLE `emailTemplates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groupMembers`
--

DROP TABLE IF EXISTS `groupMembers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupMembers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `groupId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `groupMembers_unique` (`groupId`,`userId`),
  KEY `groupMembers_users_FK` (`userId`),
  CONSTRAINT `groupMembers_groups_FK` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `groupMembers_users_FK` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupMembers`
--

LOCK TABLES `groupMembers` WRITE;
/*!40000 ALTER TABLE `groupMembers` DISABLE KEYS */;
INSERT INTO `groupMembers` VALUES (3,2,48);
/*!40000 ALTER TABLE `groupMembers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `companyId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `createdTimestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `groups_unique` (`companyId`,`name`),
  CONSTRAINT `groups_companies_FK` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (2,3,'Test Group 1','2024-06-27 15:17:18');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loginAudit`
--

DROP TABLE IF EXISTS `loginAudit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loginAudit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `loginIP` varchar(500) NOT NULL,
  `loginTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `loginAudit_users_FK` (`userId`),
  CONSTRAINT `loginAudit_users_FK` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loginAudit`
--

LOCK TABLES `loginAudit` WRITE;
/*!40000 ALTER TABLE `loginAudit` DISABLE KEYS */;
INSERT INTO `loginAudit` VALUES (39,9,'::1','2024-05-31 05:40:47'),(40,10,'::1','2024-05-31 05:44:57'),(41,9,'::1','2024-05-31 07:26:43'),(42,27,'::1','2024-05-31 16:58:13'),(43,27,'::1','2024-05-31 16:58:44'),(44,27,'::1','2024-05-31 16:58:54'),(45,9,'::1','2024-05-31 19:43:23'),(46,10,'::1','2024-05-31 19:43:59'),(47,27,'::1','2024-05-31 19:44:17'),(48,10,'::1','2024-05-31 19:44:28'),(49,10,'::1','2024-06-01 08:38:57'),(50,10,'::1','2024-06-03 14:22:06'),(51,27,'::1','2024-06-04 10:49:51'),(52,10,'::1','2024-06-04 10:50:06'),(53,10,'::1','2024-06-04 19:11:27'),(54,10,'::1','2024-06-05 09:44:22'),(55,10,'::1','2024-06-07 12:32:02'),(56,10,'::1','2024-06-07 12:47:53'),(57,10,'::1','2024-06-12 11:24:22'),(58,10,'::1','2024-06-12 11:45:18'),(59,9,'::1','2024-06-12 12:21:19'),(60,10,'::1','2024-06-17 19:34:29'),(61,10,'::1','2024-06-18 07:34:55'),(62,10,'::1','2024-06-18 13:25:21'),(63,10,'::1','2024-06-18 13:27:55'),(64,10,'::1','2024-06-27 15:06:12'),(65,10,'::1','2024-06-27 15:22:42'),(66,10,'::1','2024-06-27 16:12:43'),(67,10,'::1','2024-07-06 14:37:23'),(68,10,'::1','2024-07-06 14:57:30'),(69,10,'::1','2024-07-06 15:39:07'),(70,10,'::1','2024-07-20 10:03:45');
/*!40000 ALTER TABLE `loginAudit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `action` varchar(100) NOT NULL,
  `message` varchar(500) NOT NULL,
  `createdTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `logs_users_FK` (`userId`),
  CONSTRAINT `logs_users_FK` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
INSERT INTO `logs` VALUES (50,9,'Register Super Admin','Super Admin registered with ID 9','2024-05-31 05:40:00'),(51,9,'User Login','User with ID 9 logged in with IP ::1','2024-05-31 05:40:47'),(52,9,'Register Company Admin','Company Admin registered with ID 10','2024-05-31 05:42:42'),(53,10,'Password Update','User with ID 10 set up his password','2024-05-31 05:44:49'),(54,10,'User Login','User with ID 10 logged in with IP ::1','2024-05-31 05:44:57'),(55,9,'User Login','User with ID 9 logged in with IP ::1','2024-05-31 07:26:43'),(56,9,'Create Email Template','Email Template registered with ID 6','2024-05-31 07:28:01'),(57,9,'Create Email Template','Email Template registered with ID 7','2024-05-31 07:33:42'),(58,9,'Create Email Template','Email Template registered with ID 8','2024-05-31 08:04:50'),(59,27,'User Login','User with ID 27 logged in with IP ::1','2024-05-31 16:58:13'),(60,27,'User Login','User with ID 27 logged in with IP ::1','2024-05-31 16:58:44'),(61,27,'User Login','User with ID 27 logged in with IP ::1','2024-05-31 16:58:54'),(62,9,'User Login','User with ID 9 logged in with IP ::1','2024-05-31 19:43:23'),(63,10,'User Login','User with ID 10 logged in with IP ::1','2024-05-31 19:43:59'),(64,27,'User Login','User with ID 27 logged in with IP ::1','2024-05-31 19:44:17'),(65,10,'User Login','User with ID 10 logged in with IP ::1','2024-05-31 19:44:28'),(66,10,'Create Email Template','Email Template registered with ID 9','2024-05-31 20:01:14'),(67,10,'Email Template Update','Email Template with ID 9 updated its data','2024-05-31 21:08:02'),(68,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-01 08:38:57'),(69,10,'Create Email Template','Email Template registered with ID 10','2024-06-03 14:07:35'),(70,10,'Create Email Template','Email Template registered with ID 11','2024-06-03 14:10:05'),(71,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-03 14:22:06'),(72,27,'Password Update','User with ID 27 reset his password','2024-06-04 10:49:29'),(73,27,'User Login','User with ID 27 logged in with IP ::1','2024-06-04 10:49:51'),(74,27,'User Logout','User with ID 27 logged out','2024-06-04 10:49:57'),(75,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-04 10:50:06'),(76,10,'Register Company Employee','Company Employee registered with ID 47','2024-06-04 11:10:06'),(77,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-04 19:11:27'),(78,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-05 09:44:22'),(79,10,'Create Email Template','Email Template registered with ID 12','2024-06-05 13:14:15'),(80,10,'Create Email Template','Email Template registered with ID 13','2024-06-05 13:32:49'),(81,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-07 12:32:02'),(82,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-07 12:47:53'),(83,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-12 11:24:22'),(84,10,'User Update','User with ID 10 updated his/her data','2024-06-12 11:32:26'),(85,10,'User Update','User with ID 10 updated his/her data','2024-06-12 11:33:39'),(86,10,'User Update','User with ID 10 updated his/her data','2024-06-12 11:37:36'),(87,10,'User Update','User with ID 10 updated his/her data','2024-06-12 11:37:45'),(88,10,'User Update','User with ID 10 updated his/her data','2024-06-12 11:37:45'),(89,10,'User Update','User with ID 10 updated his/her data','2024-06-12 11:38:22'),(90,10,'User Update','User with ID 27 updated his/her data','2024-06-12 11:40:34'),(91,10,'User Update','User with ID 27 updated his/her data','2024-06-12 11:40:38'),(92,10,'User Update','User with ID 27 updated his/her data','2024-06-12 11:40:39'),(93,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-12 11:45:18'),(94,9,'User Login','User with ID 9 logged in with IP ::1','2024-06-12 12:21:19'),(95,10,'Email Template Disabled','Email Template disabled with ID 9','2024-06-13 09:23:49'),(96,10,'Email Template Enabled','Email Template enabled with ID 9','2024-06-13 09:23:50'),(97,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-17 19:34:29'),(98,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-18 07:34:55'),(99,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-18 13:25:21'),(100,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-18 13:27:55'),(101,10,'Register Company Employee','Company Employee registered with ID 48','2024-06-18 14:15:05'),(102,10,'Register Company Employee','Company Employee registered with ID 49','2024-06-18 17:11:22'),(103,10,'Register Company Employee','Company Employee registered with ID 50','2024-06-18 19:20:36'),(104,10,'Register Company Employee','Company Employee registered with ID 51','2024-06-18 19:22:11'),(105,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-27 15:06:12'),(106,10,'User Delete','User with ID 51 deleted','2024-06-27 15:06:32'),(107,10,'Create Group','Group created with ID 1','2024-06-27 15:14:10'),(108,10,'Group Update','Group with ID 1 updated its data','2024-06-27 15:17:09'),(109,10,'Group Delete','Group with ID 1 deleted','2024-06-27 15:17:14'),(110,10,'Create Group','Group created with ID 2','2024-06-27 15:17:18'),(111,10,'Add Group Member','Group members added to group with ID 2','2024-06-27 15:18:29'),(112,10,'Remove Group Member','Group members removed from group with ID 2','2024-06-27 15:21:10'),(113,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-27 15:22:42'),(114,10,'User Login','User with ID 10 logged in with IP ::1','2024-06-27 16:12:43'),(115,10,'User Login','User with ID 10 logged in with IP ::1','2024-07-06 14:37:23'),(116,10,'User Login','User with ID 10 logged in with IP ::1','2024-07-06 14:57:30'),(117,10,'User Login','User with ID 10 logged in with IP ::1','2024-07-06 15:39:07'),(118,10,'User Login','User with ID 10 logged in with IP ::1','2024-07-20 10:03:45'),(119,10,'Create Campaign','Campaign created with ID 2','2024-07-20 10:04:53'),(120,10,'Campaign Update','Campaign with ID 1 updated its data','2024-07-20 10:05:39'),(121,10,'Campaign Delete','Campaign with ID 2 deleted','2024-07-20 10:05:54'),(122,10,'Add Campaign Recipient','Recipients added to campaign with ID 1','2024-07-20 10:09:22'),(123,10,'Remove Campaign Recipient','Campaign Recipients removed from campaign with ID 1','2024-07-20 10:10:52');
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refreshTokens`
--

DROP TABLE IF EXISTS `refreshTokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refreshTokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `token` text NOT NULL,
  `expiresAt` date NOT NULL,
  `isValid` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `refreshTokens_unique` (`userId`),
  CONSTRAINT `refreshTokens_users_FK` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refreshTokens`
--

LOCK TABLES `refreshTokens` WRITE;
/*!40000 ALTER TABLE `refreshTokens` DISABLE KEYS */;
INSERT INTO `refreshTokens` VALUES (56,9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZmlyc3ROYW1lIjoiSHV6YWlmYWgiLCJsYXN0TmFtZSI6IlRhcmlxIiwiZW1haWwiOiJodXphaWZhaHRhcmlxQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjoiMDkwMDc4NjAxIiwibW9iaWxlTnVtYmVyIjoiMDkwMDc4NjAxIiwiY29tcGFueUlkIjpudWxsLCJqb2JUaXRsZSI6IkNvbXBhbnkgQWRtaW4iLCJsb2NhdGlvbiI6IlBha2lzdGFuIiwiZGVwYXJ0bWVudCI6IkVuZ2luZWVyaW5nIiwibGFuZ3VhZ2UiOiJFbmdsaXNoIiwibGluZU1hbmFnZXJJZCI6bnVsbCwicm9sZSI6IlN1cGVyIEFkbWluIiwic3RhcnREYXRlIjpudWxsLCJlbmREYXRlIjpudWxsLCJpc0FjdGl2ZSI6dHJ1ZSwiaWF0IjoxNzE4MTk0ODc5LCJleHAiOjE3MjA3ODY4Nzl9.__jVaaStpYvtYHR_gfPPezND4amAOstOkfKmSjXbwQE','2024-07-12',1),(58,10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImZpcnN0TmFtZSI6Ikh1emFpZmFoIiwibGFzdE5hbWUiOiJUYXJpcSIsImVtYWlsIjoiaHV6YWlmYWgwOEBnbWFpbC5jb20iLCJwaG9uZU51bWJlciI6IjA5MDA3ODYwMSIsIm1vYmlsZU51bWJlciI6IjA5MDA3ODYwMSIsImNvbXBhbnlJZCI6Mywiam9iVGl0bGUiOiJDb21wYW55IEFkbWluIiwibG9jYXRpb24iOiJUZXN0IiwiZGVwYXJ0bWVudCI6IkVuZ2luZWVyaW5nIiwibGFuZ3VhZ2UiOiJUZXN0IiwibGluZU1hbmFnZXJJZCI6bnVsbCwicm9sZSI6IkNvbXBhbnkgQWRtaW4iLCJzdGFydERhdGUiOiIyMDI0LTA1LTAxIiwiZW5kRGF0ZSI6IjIwMjUtMDUtMDEiLCJpc0FjdGl2ZSI6dHJ1ZSwiaWF0IjoxNzIxNDY5ODI1LCJleHAiOjE3MjQwNjE4MjV9.JZ6u4KpdEb9dNEIEd3Bxc3Y_-WsuXejggeepeSrt014','2024-08-19',1),(61,27,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjcsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IkRvZSIsImVtYWlsIjoiaHV6YWlmYWh0YXJpcTA4QGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjoiKCs0NCkwMTkxODQ2NTc3NDUiLCJtb2JpbGVOdW1iZXIiOiIoKzQ0KTA3ODQ3NTYzNTQ0IiwiY29tcGFueUlkIjozLCJqb2JUaXRsZSI6Ik1hbmFnZXIiLCJsb2NhdGlvbiI6IkxvbmRvbiIsImRlcGFydG1lbnQiOiJNYXJrZXRpbmciLCJsYW5ndWFnZSI6ImVuLVVTIiwibGluZU1hbmFnZXJJZCI6bnVsbCwicm9sZSI6IkNvbXBhbnkgRW1wbG95ZWUiLCJzdGFydERhdGUiOiIyMDIwLTAxLTE1IiwiZW5kRGF0ZSI6bnVsbCwiaXNBY3RpdmUiOnRydWUsImlhdCI6MTcxNzQ5ODE5MSwiZXhwIjoxNzIwMDkwMTkxfQ.3YYZBO-GYvYc2rYQwcfagHnWRhAQTv2wdwRzwB-e1o8','2024-07-04',0),(84,48,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDgsImZpcnN0TmFtZSI6IlRlc3QiLCJsYXN0TmFtZSI6IlRlc3QiLCJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiIxMjM0NTY3ODkwMSIsIm1vYmlsZU51bWJlciI6IjAzMDA0MTcxMzgyIiwiY29tcGFueUlkIjozLCJqb2JUaXRsZSI6IlRlc3R0aW5nIiwibG9jYXRpb24iOiJUZXN0dGluZyIsImRlcGFydG1lbnQiOiJUZXN0dGluZyIsImxhbmd1YWdlIjoiVGVzdHRpbmciLCJsaW5lTWFuYWdlcklkIjpudWxsLCJyb2xlIjoiQ29tcGFueSBFbXBsb3llZSIsInN0YXJ0RGF0ZSI6IjIwMjQtMDYtMDEiLCJlbmREYXRlIjoiMjAyNC0wNi0zMCIsImlzQWN0aXZlIjp0cnVlLCJpYXQiOjE3MTg3MjAxMDUsImV4cCI6MTcyMTMxMjEwNX0.RgRIfssYw5ynFJFuaUK_WeMtKrevwwvqFjteMwQWzMM','2024-07-18',1),(85,49,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDksImZpcnN0TmFtZSI6IlRlc3QiLCJsYXN0TmFtZSI6IlRlc3QiLCJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjpudWxsLCJtb2JpbGVOdW1iZXIiOm51bGwsImNvbXBhbnlJZCI6Mywiam9iVGl0bGUiOiJIZWxsbyIsImxvY2F0aW9uIjoiVGVzdHRpbmciLCJkZXBhcnRtZW50IjoiVGVzdHRpbmciLCJsYW5ndWFnZSI6IlRlc3QiLCJsaW5lTWFuYWdlcklkIjpudWxsLCJyb2xlIjoiQ29tcGFueSBFbXBsb3llZSIsInN0YXJ0RGF0ZSI6IjIwMjQtMDYtMDEiLCJlbmREYXRlIjpudWxsLCJpc0FjdGl2ZSI6dHJ1ZSwiaWF0IjoxNzE4NzMwNjgyLCJleHAiOjE3MjEzMjI2ODJ9.UU94ZorR4tgQ4QIZKXLNpOBa70W-0X4Wb9lcTNWcnkM','2024-07-18',1),(86,50,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTAsImZpcnN0TmFtZSI6IlRlc3QiLCJsYXN0TmFtZSI6IlRlc3QiLCJlbWFpbCI6InRlc3QyQGdtYWlsLmNvbSIsInBob25lTnVtYmVyIjpudWxsLCJtb2JpbGVOdW1iZXIiOm51bGwsImNvbXBhbnlJZCI6Mywiam9iVGl0bGUiOiJUZXN0IiwibG9jYXRpb24iOiJUZXN0IiwiZGVwYXJ0bWVudCI6IlRlc3QiLCJsYW5ndWFnZSI6IlRlc3QiLCJsaW5lTWFuYWdlcklkIjpudWxsLCJyb2xlIjoiQ29tcGFueSBFbXBsb3llZSIsInN0YXJ0RGF0ZSI6IjIwMjQtMDYtMDEiLCJlbmREYXRlIjpudWxsLCJpc0FjdGl2ZSI6dHJ1ZSwiaWF0IjoxNzE4NzM4NDM2LCJleHAiOjE3MjEzMzA0MzZ9.kjjj_Vaa3h12eGOjsomOoDCqDDtmsBJFs6nXgpJmsyE','2024-07-18',1);
/*!40000 ALTER TABLE `refreshTokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(500) DEFAULT NULL,
  `phoneNumber` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `mobileNumber` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `companyId` int DEFAULT NULL,
  `jobTitle` varchar(100) NOT NULL,
  `linkedin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `location` varchar(100) NOT NULL,
  `department` varchar(100) NOT NULL,
  `language` varchar(50) NOT NULL,
  `lineManagerId` int DEFAULT NULL,
  `role` enum('Super Admin','Company Admin','Company Employee') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_unique` (`email`),
  KEY `users_companies_FK` (`companyId`),
  KEY `users_users_FK` (`lineManagerId`),
  CONSTRAINT `users_companies_FK` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `users_users_FK` FOREIGN KEY (`lineManagerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=1053 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (9,'Huzaifah','Tariq','huzaifahtariq@gmail.com','$2b$10$ht5Lx2yQVarPzPvVCKJCZ.I0fZUlQbikkBdG20y7mT/xgAhD/S7gG','090078601','090078601',NULL,'Company Admin','http://www.google.com','Pakistan','Engineering','English',NULL,'Super Admin',NULL,NULL,1,'2024-05-31 05:40:00','2024-05-31 05:41:24'),(10,'Huzaifah','Tariq','huzaifah08@gmail.com','$2b$10$VSqzj1jBWyprvVbK7HbxZOyhh.a/Z7cayDJrjlcuwCwHURF4MCYta','090078601','090078601',3,'Company Admin','http://www.google.com','Test','Engineering','Test',NULL,'Company Admin','2024-05-01','2025-05-01',1,'2024-05-31 05:42:42','2024-06-12 11:32:26'),(27,'Huzaifah','Tariq','huzaifahtariq08@gmail.com','$2b$10$mRZnPf8DqVJDBfQhKnCKs.JrJ6TK/AYsizOcWHxmYzFKN8HnPSwcq','090078601','090078601',3,'Test','https://www.linkedin.com/in/carpentersteve/','Test','Marketing','Test',10,'Company Employee','2020-01-15','2020-01-15',1,'2024-05-31 07:30:15','2024-06-12 11:40:34'),(48,'John','Doe','john.doe@example.com',NULL,'(+44)019184657745','(+44)07847563544',3,'Manager','https://www.linkedin.com/in/carpentersteve/','London','Marketing','en-US',1050,'Company Employee','2020-01-15',NULL,1,'2024-06-18 14:15:05','2024-06-27 16:17:52'),(49,'Test','Test','test1@gmail.com',NULL,NULL,NULL,3,'Hello','','Testting','Testting','Test',NULL,'Company Employee','2024-06-01',NULL,1,'2024-06-18 17:11:22','2024-06-18 17:11:22'),(50,'Test','Test','test2@gmail.com',NULL,NULL,NULL,3,'Test','','Test','Test','Test',NULL,'Company Employee','2024-06-01',NULL,1,'2024-06-18 19:20:35','2024-06-18 19:20:35'),(1050,'Jane','Smith','jane.smith@example.com',NULL,'(+44)019184657745','(+44)07847563544',3,'Director','https://www.linkedin.com/in/carpentersteve/','London','Human Resources','en-US',NULL,'Company Employee','2018-03-22',NULL,1,'2024-06-27 16:17:52','2024-06-27 16:17:52'),(1051,'Alice','Johnson','alice.johnson@example.com',NULL,'(+44)019184657745','(+44)07847563544',3,'Engineer','https://www.linkedin.com/in/carpentersteve/','Leeds','Development','en-US',48,'Company Employee','2021-07-01',NULL,1,'2024-06-27 16:17:52','2024-06-27 16:17:52'),(1052,'Bob','Lee','bob.lee@example.com',NULL,'(+44)019184657745','(+44)07847563544',3,'Technician','https://www.linkedin.com/in/carpentersteve/','Sheffield','Support','en-US',1050,'Company Employee','2019-11-30',NULL,1,'2024-06-27 16:17:52','2024-06-27 16:17:52');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userStats`
--

DROP TABLE IF EXISTS `userStats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userStats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `emailOpenCount` int NOT NULL DEFAULT '0',
  `reportPhishingCount` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `userStats_unique` (`userId`),
  CONSTRAINT `userStats_users_FK` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userStats`
--

LOCK TABLES `userStats` WRITE;
/*!40000 ALTER TABLE `userStats` DISABLE KEYS */;
INSERT INTO `userStats` VALUES (1,27,0,2);
/*!40000 ALTER TABLE `userStats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'phishing-defender-db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-20 15:18:04
