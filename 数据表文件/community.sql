/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50612
Source Host           : localhost:3306
Source Database       : webo

Target Server Type    : MYSQL
Target Server Version : 50612
File Encoding         : 65001

Date: 2016-03-23 21:39:59
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `community`
-- ----------------------------
DROP TABLE IF EXISTS `community`;
CREATE TABLE `community` (
  `com_id` char(14) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `mod_time` datetime DEFAULT NULL,
  `creator_id` char(14) NOT NULL,
  `type` char(14) DEFAULT NULL,
  PRIMARY KEY (`com_id`),
  KEY `creator` (`creator_id`),
  CONSTRAINT `creator` FOREIGN KEY (`creator_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of community
-- ----------------------------
