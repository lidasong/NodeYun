/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50612
Source Host           : localhost:3306
Source Database       : webo

Target Server Type    : MYSQL
Target Server Version : 50612
File Encoding         : 65001

Date: 2016-03-23 21:40:04
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `answers`
-- ----------------------------
DROP TABLE IF EXISTS `answers`;
CREATE TABLE `answers` (
  `answer_id` char(14) NOT NULL,
  `community_id` char(14) NOT NULL,
  `answer_user_id` char(14) NOT NULL,
  `content` text NOT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `answerUId` (`answer_user_id`),
  KEY `comId` (`community_id`),
  CONSTRAINT `answerUId` FOREIGN KEY (`answer_user_id`) REFERENCES `user` (`user_id`) ON UPDATE CASCADE,
  CONSTRAINT `comId` FOREIGN KEY (`community_id`) REFERENCES `community` (`com_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of answers
-- ----------------------------
