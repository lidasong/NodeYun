/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50612
Source Host           : localhost:3306
Source Database       : webo

Target Server Type    : MYSQL
Target Server Version : 50612
File Encoding         : 65001

Date: 2016-03-23 21:39:30
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `bucket`
-- ----------------------------
DROP TABLE IF EXISTS `bucket`;
CREATE TABLE `bucket` (
  `bucket_name` varchar(255) NOT NULL,
  `access_key` char(40) NOT NULL,
  `secret_key` char(40) NOT NULL,
  `domain` varchar(255) NOT NULL,
  PRIMARY KEY (`bucket_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of bucket
-- ----------------------------
