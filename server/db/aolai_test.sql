/*
 Navicat MySQL Data Transfer

 Source Server         : rk
 Source Server Type    : MySQL
 Source Server Version : 80021
 Source Host           : 127.0.0.1:3306
 Source Schema         : aolai_test

 Target Server Type    : MySQL
 Target Server Version : 80021
 File Encoding         : 65001

 Date: 06/05/2024 10:57:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address`  (
  `userId` int NULL DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tel` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `province` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `district` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `isDefault` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of address
-- ----------------------------
INSERT INTO `address` VALUES (1, 1, 'rr', '13255555555', '陕西省', '咸阳市', '秦都区', '世纪大道', '1');
INSERT INTO `address` VALUES (1, 2, 'rr', '13255555555', '福建省', '厦门市', '湖里区', '锦业一路22', '0');
INSERT INTO `address` VALUES (1, 3, '13255555555', '13255555555', '陕西省', '西安市', '新城区', '市中心1号公馆', '0');
INSERT INTO `address` VALUES (1, 4, '13255555555', '13255555555', '陕西省', '铜川市', '王益区', '市中心1号', '0');

-- ----------------------------
-- Table structure for goods_cart
-- ----------------------------
DROP TABLE IF EXISTS `goods_cart`;
CREATE TABLE `goods_cart`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `pprice` decimal(10, 2) NULL DEFAULT NULL,
  `num` int NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `color` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `imgUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `chekced` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `uid` int NULL DEFAULT NULL,
  `goods_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of goods_cart
-- ----------------------------
INSERT INTO `goods_cart` VALUES (1, 369.00, 3, '美女', '白色', '../../static/img/1.jpg', 'false', 1, 11);
INSERT INTO `goods_cart` VALUES (2, 599.00, 2, '美女', '白色', '../../static/img/2.jpg', 'false', 1, 12);

-- ----------------------------
-- Table structure for goods_search
-- ----------------------------
DROP TABLE IF EXISTS `goods_search`;
CREATE TABLE `goods_search`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `imgUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `pprice` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `oprice` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `discount` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `brand` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of goods_search
-- ----------------------------
INSERT INTO `goods_search` VALUES (12, '../../static/img/1.jpg', '美女', '369', '258', '6', '分类');
INSERT INTO `goods_search` VALUES (11, '../../static/img/2.jpg', '食品', '588', '577', '7', '分类');
INSERT INTO `goods_search` VALUES (13, '../../static/img/3.jpg', '生活用品', '699', '599', '8', '分类');
INSERT INTO `goods_search` VALUES (1, '../../static/img/4.jpg', '美女', '499', '399', '6', '分类');
INSERT INTO `goods_search` VALUES (2, '../../static/img/5.jpg', '美女', '899', '799', '6', '分类');
INSERT INTO `goods_search` VALUES (3, '../../static/img/6.jpg', '美女', '1099', '999', '8', '分类');

-- ----------------------------
-- Table structure for store_order
-- ----------------------------
DROP TABLE IF EXISTS `store_order`;
CREATE TABLE `store_order`  (
  `uid` int NOT NULL,
  `order_id` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `goods_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `goods_price` decimal(10, 2) NULL DEFAULT NULL,
  `goods_num` int NULL DEFAULT NULL,
  `order_status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of store_order
-- ----------------------------
INSERT INTO `store_order` VALUES (1, '20240506094319550949', '美女', 1107.00, 3, '1');
INSERT INTO `store_order` VALUES (1, '20240506094405676136', '美女,美女', 2305.00, 5, '1');
INSERT INTO `store_order` VALUES (1, '20240506100639127823', '美女,美女', 2305.00, 5, '1');
INSERT INTO `store_order` VALUES (1, '2024050610165993131', '美女,美女', 2305.00, 5, '1');
INSERT INTO `store_order` VALUES (1, '20240506101826843411', '美女,美女', 2305.00, 5, '1');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `userPwd` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `imgUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `nickName` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `token` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `provider` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `openid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '13255555555', '123456', '13255555555', '', 'rr', NULL, NULL, NULL);
INSERT INTO `user` VALUES (2, '13266666666', '123456', '13266666666', NULL, 'rr', NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
