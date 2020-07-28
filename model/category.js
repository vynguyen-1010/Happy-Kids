const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const category = new Schema({
    title: String
});

module.exports = mongoose.model('category', category);

//thêm chức năng add category nếu cần
//https://medium.com/@jaouad_45834/full-stack-shopping-cart-with-mevn-stack-part-1-89dae1f35378