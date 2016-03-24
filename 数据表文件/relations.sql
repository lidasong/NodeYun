/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50612
Source Host           : localhost:3306
Source Database       : webo

Target Server Type    : MYSQL
Target Server Version : 50612
File Encoding         : 65001

Date: 2016-03-23 21:37:25
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `relations`
-- ----------------------------
DROP TABLE IF EXISTS `relations`;
CREATE TABLE `relations` (
  `followed_id` char(14) NOT NULL,
  `follower_id` char(14) NOT NULL,
  `follow_time` datetime DEFAULT NULL,
  KEY `followingId` (`followed_id`),
  KEY `followedId` (`follower_id`),
  CONSTRAINT `followedId` FOREIGN KEY (`follower_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `followingId` FOREIGN KEY (`followed_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of relations
-- ----------------------------
