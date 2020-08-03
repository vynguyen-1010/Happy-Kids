const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const removeAccent = require("../util/removeAccent");

const productSchema = new Schema({
  name: {
    type: String,
    text: true,
    required: true
  },
  description: {
    type: String,
    required: false,
  },
  stock: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: [String],
    required: true
  },
  productType: {
    main: String,
    sub: String,
  },
  color: {
    type: [String],
  },
  pattern: {
    type: [String],
  },
  tags: {
    type: [String],
  },
  images: {
    type: [String],
    required: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  isSale: {
    status: {
      type: Boolean,
      default: false
    },
    percent: {
      type: Number,
      default: 0
    },
    end: {
      type: Date
    }
  },
  ofSellers: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    name: String
  },
  labels: {
    type: String,
    required: true
  },
  materials: {
    type: [String],
    required: true
  },
  buyCounts: {
    type: Number,
    default: 0
  },
  viewCounts: {
    type: Number,
    default: 0
  },
  rating: {
    byUser: String,
    content: String,
    star: Number
  },
  index: {
    type: Number,
    default: 0
  },
  comment: {
    total: {
      type: Number,
      require: false,
      default: 0
    },
    items: [
      {
        title: {
          type: String
        },
        content: {
          type: String
        },
        name: {
          type: String
        },
        date: {
          type: Date,
          default: Date.now
        },
        star: {
          type: Number
        }
      }
    ]
  }
});

productSchema.methods.getNonAccentType = function() {
  return removeAccent(this.productType.main);
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
