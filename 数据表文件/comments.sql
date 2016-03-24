/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50612
Source Host           : localhost:3306
Source Database       : webo

Target Server Type    : MYSQL
Target Server Version : 50612
File Encoding         : 65001

Date: 2016-03-23 21:39:17
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `comments`
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `c_id` char(14) NOT NULL,
  `user_id` char(14) DEFAULT NULL,
  `comment` text,
  `share_id` char(14) NOT NULL,
  `comment_time` datetime NOT NULL,
  `reply_to_user` char(14) DEFAULT NULL,
  PRIMARY KEY (`c_id`),
  KEY `shareId` (`share_id`),
  KEY `share_user_Id` (`user_id`),
  CONSTRAINT `shareId` FOREIGN KEY (`share_id`) REFERENCES `share` (`s_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `share_user_Id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comments
-- ----------------------------
