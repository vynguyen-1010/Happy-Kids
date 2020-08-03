var express = require("express");
var mongoose = require('mongoose');
var router = express.Router();
const detailController = require("../controllers/detail");

router.get("/:productId", detailController.getProduct);

router.post("/:productId", detailController.postComment);

module.exports = router;