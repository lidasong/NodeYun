/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50612
Source Host           : localhost:3306
Source Database       : webo

Target Server Type    : MYSQL
Target Server Version : 50612
File Encoding         : 65001

Date: 2016-03-23 21:39:06
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `message`
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `m_id` char(14) NOT NULL,
  `msg_time` datetime DEFAULT NULL,
  `is_read` char(1) NOT NULL DEFAULT '0',
  `sender_id` char(14) NOT NULL,
  `receiver_id` char(14) NOT NULL,
  `type` char(1) NOT NULL COMMENT '0=>like,1=>follow,2=>comment,3=>reply',
  `data` text,
  PRIMARY KEY (`m_id`),
  KEY `sender` (`sender_id`),
  KEY `receiver` (`receiver_id`),
  CONSTRAINT `receiver` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `sender` FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of message
-- ----------------------------
