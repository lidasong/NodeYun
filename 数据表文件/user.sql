/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50612
Source Host           : localhost:3306
Source Database       : webo

Target Server Type    : MYSQL
Target Server Version : 50612
File Encoding         : 65001

Date: 2016-03-23 21:39:48
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` char(14) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `home_url` varchar(255) DEFAULT NULL,
  `user_intro` text,
  `s_avatar` varchar(255) NOT NULL DEFAULT 'images/avatar/avatar.jpg',
  `b_avatar` varchar(255) NOT NULL,
  `sex` char(1) DEFAULT 'F',
  `password` varchar(255) NOT NULL,
  `u_key` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`email`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
