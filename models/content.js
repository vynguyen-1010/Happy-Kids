const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentSchema = new Schema({
  
  title1: { //tiêu đề lớn nằm trên slide
    type: String,
    default:""
  },
  title2: {
    type: String,
    default:""
  },
  title3: { //tiêu đề nhỏ nằm trên slide
    type: String,
    default:""
  },
  policy: {
    type: String,
    default:""
  },
  info: {
    type: String,
    default: ""
  },
  location: {
    type: String,
  },
  returnexchange: {
    type: String,
    default: ""
  },
  payment: {
    type: String,
    default: ""
  },
  imageSlide: {
    type: [String],
    required: true
  },
  imageTheme: {
    type: [String],
    required: true
  }
}, {collection: 'content'});

const Content = mongoose.model("Content", contentSchema);
module.exports = Content;
