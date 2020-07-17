var mongoose = require('mongoose');
var sanpham = new mongoose.Schema({
    title: {type: String, require: true},
    des: {type: String, require: true},
    price: {type: Number, require: true},
    images: {type: Array, require: true},
    cat: {type: String, require: true},
},{collection: 'sanpham'});
module.exports = mongoose.model('Product', sanpham)