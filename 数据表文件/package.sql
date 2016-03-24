/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50612
Source Host           : localhost:3306
Source Database       : webo

Target Server Type    : MYSQL
Target Server Version : 50612
File Encoding         : 65001

Date: 2016-03-23 21:39:41
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `package`
-- ----------------------------
DROP TABLE IF EXISTS `package`;
CREATE TABLE `package` (
  `s_id` char(14) NOT NULL,
  `u_id` char(14) DEFAULT NULL,
  KEY `share` (`s_id`),
  KEY `upload` (`u_id`),
  CONSTRAINT `share` FOREIGN KEY (`s_id`) REFERENCES `share` (`s_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `upload` FOREIGN KEY (`u_id`) REFERENCES `upload` (`u_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of package
-- ----------------------------
