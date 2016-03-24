/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50612
Source Host           : localhost:3306
Source Database       : webo

Target Server Type    : MYSQL
Target Server Version : 50612
File Encoding         : 65001

Date: 2016-03-23 21:39:53
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `upload`
-- ----------------------------
DROP TABLE IF EXISTS `upload`;
CREATE TABLE `upload` (
  `u_id` char(14) NOT NULL,
  `type` int(11) DEFAULT NULL COMMENT '0=>图片；1=>ppt；2=>doc;3=>pdf;4=>audio;5=>vedio;6=>others;7=>文件夹',
  `parent_id` char(13) DEFAULT NULL,
  `owner_id` char(13) NOT NULL,
  `file_name` varchar(500) DEFAULT NULL,
  `order_x` char(11) DEFAULT NULL,
  `is_processing` char(11) DEFAULT NULL,
  `is_publish` char(1) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `mod_time` datetime DEFAULT NULL,
  `is_dir` char(1) DEFAULT NULL,
  `bucket` varchar(255) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `persistent_id` varchar(500) DEFAULT NULL,
  `mime_type` varchar(255) DEFAULT NULL,
  `key_original` varchar(500) DEFAULT NULL,
  `key_preview` varchar(500) DEFAULT NULL,
  `key_thumb` varchar(500) NOT NULL,
  PRIMARY KEY (`u_id`),
  KEY `ownerId` (`owner_id`),
  CONSTRAINT `ownerId` FOREIGN KEY (`owner_id`) REFERENCES `user` (`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of upload
-- ----------------------------
