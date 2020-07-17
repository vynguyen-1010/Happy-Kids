var mongoose = require('mongoose');
var guest = new mongoose.Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    subject: {type: String, require: true},
    message: {type: String, require: true},
},{collection: 'guest'});
module.exports = mongoose.model('guest', guest)