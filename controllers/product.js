var express = require("express");
const Products = require("../models/product");
const Categories = require("../models/productCategory");
const Cart = require("../models/cart");
var Users = require("../models/user");
const Order = require("../models/order");
const order = require("../models/order");
const Content = require("../models/content");

const { all } = require("../routes/shop");

var ITEM_PER_PAGE = 12;
var SORT_ITEM;
var sort_value = "PRICE: LOW TO HIGH";
var ptype;
var ptypesub;
var pprice = 999999;
var psize;
var plabel;
var plowerprice;
var price;
var viewCounts;
var searchText;
var chuyenObjectId = require('mongodb').ObjectID;

exports.getIndexProducts = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  Products.find()
    .limit(4)
    .then(products => {
      Products.find()
        .limit(4)
        .sort("buyCounts")
        .then(products2 => {
          Content.find({}, function (err, content) { 
            res.render("index", {
              title: "HOME",
              user: req.user,
              trendings: products,
              hots: products2,
              cartProduct: cartProduct,
              cont: content             
              
            });
           })
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {  
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  let productType = req.params.productType;
  let productChild = req.params.productChild;

  ptype = req.query.type !== undefined ? req.query.type : ptype;
  ptypesub = req.query.type !== undefined ? req.query.type : ptypesub;
  pprice = req.query.price !== undefined ? req.query.price : 999999;
  psize = req.query.size !== undefined ? req.query.size : psize;
  plabel = req.query.label !== undefined ? req.query.label : plabel;
  plowerprice = pprice !== 999999 ? pprice - 50 : 0;
  plowerprice = pprice == 1000000 ? 200 : plowerprice;
  SORT_ITEM = req.query.orderby;

  if (SORT_ITEM == -1) {
    sort_value = "PRICE: HIGH TO LOW";
    price = "-1";
  }
  if (SORT_ITEM == 1) {
    sort_value = "PRICE: LOW TO HIGH";
    price = "1";
  }
  
  if (SORT_ITEM == -2) {
    sort_value = "VIEW: HIGH TO LOW";
    viewCounts = "-1";
  }
  if (SORT_ITEM == 2) {
    sort_value = "VIEW: LOW TO HIGH";
    viewCounts = "1";
  }

  if (Object.entries(req.query).length == 0) {
    ptype = "";
    psize = "";
    plabel = "";
    ptypesub = "";
  }

  var page = +req.query.page || 1;
  let totalItems;
  let catName = [];
  Categories.find({}, (err, cats) => {
    cats.forEach(cat => {
      catName.push(cat.name);
    });
  });

  let childType;
  if (productType == undefined) {
    productType = "";
  } else {
    Categories.findOne({ name: `${productType}` }, (err, data) => {
      if (err) console.log(err);
      if (data) {
        childType = data.childName || "";
      } else {
        childType = "";
      }
    });
  }

  if (productChild == undefined) {
    productChild = "";
  }

  Products.find({
    "productType.main": new RegExp(productType, "i"),
    "productType.sub": new RegExp(productChild, "i"),
    size: new RegExp(psize, "i"),
    price: { $gt: plowerprice, $lt: pprice },
    labels: new RegExp(plabel, "i")
  })
    .countDocuments()
    .then(numProduct => {
      totalItems = numProduct;
      return Products.find({
        "productType.main": new RegExp(productType, "i"),
        "productType.sub": new RegExp(productChild, "i"),
        size: new RegExp(psize, "i"),
        price: { $gt: plowerprice, $lt: pprice },
        labels: new RegExp(plabel, "i")
      })
        .skip((page - 1) * ITEM_PER_PAGE)
        .limit(ITEM_PER_PAGE)
        .sort({
          price,
          viewCounts,
        });
    })
    .then(products => {
      res.render("products", {
        title: "COLLECTION",
        user: req.user,
        allProducts: products,
        currentPage: page,
        categories: catName,
        currentCat: productType,
        currentChild: productChild,
        categoriesChild: childType,
        hasNextPage: ITEM_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
        ITEM_PER_PAGE: ITEM_PER_PAGE,
        sort_value: sort_value,
        cartProduct: cartProduct
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postNumItems = (req, res, next) => {
  ITEM_PER_PAGE = parseInt(req.body.numItems);
  res.redirect("back");
};

exports.getSearch = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  searchText =
    req.query.searchText !== undefined ? req.query.searchText : searchText;
  const page = +req.query.page || 1;

  Products.createIndexes({}).catch(err => {
    console.log(err);
  });
  Products.find({
    $text: { $search: searchText }
  })
    .countDocuments()
    .then(numProduct => {
      totalItems = numProduct;
      return Products.find({
        $text: { $search: searchText }
      })
        .skip((page - 1) * 12)
        .limit(12);
    })
    .then(products => {
      res.render("search-result", {
        title: "Kết quả tìm kiếm cho " + searchText,
        user: req.user,
        searchProducts: products,
        searchT: searchText,
        currentPage: page,
        hasNextPage: 12 * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / 12),
        cartProduct: cartProduct
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  res.render("shopping-cart", {
    title: "Giỏ hàng",
    user: req.user,
    cartProduct: cartProduct
  });
};

exports.addToCart = (req, res, next) => {
  var prodId = req.params.productId;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Products.findById(prodId, (err, product) => {
    if (err) {
      return res.redirect("back");
    }
    cart.add(product, prodId);
    req.session.cart = cart;
    if (req.user) {
      req.user.cart = cart;
      req.user.save();
    }
    res.redirect("back");
  });
};

exports.modifyCart = (req, res, next) => {
  var prodId = req.query.id;
  var qty = req.query.qty;
  if (qty == 0) {
    return res.redirect("back");
  }
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Products.findById(prodId, (err, product) => {
    if (err) {
      return res.redirect("back");
    }
    cart.changeQty(product, prodId, qty);
    req.session.cart = cart;
    if (req.user) {
      req.user.cart = cart;
      req.user.save();
    }
    res.redirect("back");
  });
};

exports.getDeleteCart = (req, res, next) => {
  req.session.cart = null;
  if (req.user) {
    req.user.cart = {};
    req.user.save();
  }
  res.redirect("back");
};

exports.getDeleteItem = (req, res, next) => {
  var prodId = req.params.productId;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Products.findById(prodId, (err, product) => {
    if (err) {
      return res.redirect("back");
    }
    cart.deleteItem(prodId);
    req.session.cart = cart;
    if (req.user) {
      req.user.cart = cart;
      req.user.save();
    }
    console.log(req.session.cart);
    res.redirect("back");
  });
};

exports.addOrder = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  res.render("add-address", {
    title: "Order Infomation",
    user: req.user,
    cartProduct: cartProduct
  });
};

exports.postAddOrder = (req, res, next) => {
  console.log(req.session.cart);
  if (req.session.cart.totalQty) {
    var order = new Order({
      user: req.user,
      cart: req.session.cart,
      address: req.body.address,
      phoneNumber: req.body.phone,
      orderStatus: req.body.orderStatus
    });

    for (var id in req.session.cart.items) {
      Products.findOne({ _id: id })
        .then(product => {
          product.buyCounts += parseInt(req.session.cart.items[id].qty);
          product.save();
        })
        .catch(err => console.log(err));
    }

    order.save((err, result) => {
      req.flash("success", "Thanh toán thành công!");
      req.session.cart = null;
      req.user.cart = {};
      req.user.save();
      res.redirect("/account");
    });
  } else {
    req.flash("error", "Giỏ hàng rỗng!");
    res.redirect("/account");
  }
};

exports.mergeCart = (req, res, next) => {
  if (req.user.cart != {} && req.user.cart) {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart = cart.addCart(req.user.cart);
    req.session.cart = cart;
    req.user.cart = cart;
    req.user.save();
  }
  res.redirect("/");
};


exports.viewProductList = (req, res, next) => {
  Products.find({}).then(
    product => {
        res.render("viewProduct", {
          title: "Product List",
          prod: product,
        });
      }
    );
};




exports.postAddProduct = (req, res, next) => {
  var product = new Products({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    stock: req.body.stock,
    size: req.body.size,
    dateAdded: req.body.dateAdded,
    labels: req.body.labels,
    materials: req.body.materials,
    productType: { 
      main: req.body.main, 
      sub: req.body.sub,
    },
    tags: req.body.tags,

    images: images,
  }); 
  product.save();
  res.redirect("/admin/product");
};

exports.getAddProduct = (req, res, next) => {
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  Categories.find({}, (err, category) => {
    res.render("addProduct", {
      title: "Add Product",
      cartProduct: cartProduct,
      category: category,
    });
  });
};

/* Post cho ảnh. */
var images = [];
exports.getImage = (req, res, next) => {
  images.unshift(req.files[0].path); // đưa path của img vào mảng images  
  res.status(200).send(req.files); // gửi mã 200 khi up thành công
};
var imageSlide = [];
exports.getImageSlides = (req, res, next) => {
  imageSlide.unshift(req.files[0].path); // đưa path của img vào mảng images  
  res.status(200).send(req.files); // gửi mã 200 khi up thành công
};
var imageTheme = [];
exports.getImageTheme = (req, res, next) => {
  imageTheme.unshift(req.files[0].path); // đưa path của img vào mảng images  
  res.status(200).send(req.files); // gửi mã 200 khi up thành công
};

exports.getDeleteProduct = (req, res, next) => {
  //var prodId = req.params.productId;
  var idcanxoa = chuyenObjectId(req.params.idcanxoa);
  //Products.findByIdAndDelete({_id: idcanxoa});
    // prodId, (err, product) => {
    // if (err) {
    //   return res.redirect("back");
    // }
    // product.save();
    //res.redirect("/admin/product");
  //});
  Products.find({_id: idcanxoa}, function (err, prod) {
    Products.deleteOne({_id: idcanxoa}, function (err, prod) {
      res.redirect('/admin/product');
    });
  })
};


exports.viewOrderList = (req, res, next) => {
  Order.find({}, (err, order) => {
    res.render('viewOrder', {
      order: order,
    });
});
};


exports.changeOrderStatus = (req, res, next) => {
  var orderStatus = new Order({
    orderStatus: req.body.orderStatus,
  }); 
  order.save();
  res.redirect("/admin/order");
};


exports.viewCategoryList= (req, res, next) => {
  Categories.find({}, (err, category) => {
    res.render('viewCategory', {
      category: category,
    });
});
};

exports.postAddCategory = (req, res, next) => {
  var category = new Categories({
    name: req.body.name,
    childName: req.body.childName,
  }); 
  category.save();
  res.redirect("/admin/category");
};

exports.getAddCategory = (req, res, next) => {
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  res.render("addCategory", {
    title: "Add Category",
    cartProduct: cartProduct
  });
};



exports.getEditContent = (req, res, next) => {
  res.render("content", {
    title: "Add Content Page",
    //content: content
  });
};
// exports.getEditContent1 = (req, res, next) => {
//   var idcansua = req.params.idcansua;
//   Content.find({_id: idcansua}, function (err, content) {
//     res.render('editcontent', { cont: content });
//   })
// };
exports.postEditContent = (req, res, next) => {
  var content = new Content({
    title1: req.body.title1,
    title2: req.body.title2,
    title3: req.body.title3,
    policy: req.body.policy,
    info: req.body.info,
    returnexchange: req.body.returnexchange,
    payment: req.body.payment,
    imageSlide: imageSlide,
    imageTheme: imageTheme
  });
  content.save();
  res.redirect("/admin/content");
};
// exports.postAddProduct = (req, res, next) => {
//   var product = new Products({
//     name: req.body.name,
//     description: req.body.description,
//     price: req.body.price,
//     stock: req.body.stock,
//     size: req.body.size,
//     dateAdded: req.body.dateAdded,
//     labels: req.body.labels,
//     materials: req.body.materials,
//     productType: { 
//       main: req.body.main, 
//       sub: req.body.sub,
//     },
//     tags: req.body.tags,

//     images: images,
//   }); 
//   product.save();
//   res.redirect("/admin/product");
// };
// exports.getAddProduct = (req, res, next) => {
//   if (!req.session.cart) {
//     cartProduct = null;
//   } else {
//     var cart = new Cart(req.session.cart);
//     cartProduct = cart.generateArray();
//   }
//   Categories.find({}, (err, category) => {
//     res.render("addProduct", {
//       title: "Add Product",
//       cartProduct: cartProduct,
//       category: category,
//     });
//   });
// };



exports.getPolicy = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  // Content.find({}, function (err, content) { 
  //   res.render("policy",{
  //     cont: content
  //   });
  //  })
  Products.find()
    .limit(4)
    .then(products => {
      Products.find()
        .limit(4)
        .sort("buyCounts")
        .then(products2 => {
          Content.find({}, function (err, content) { 
            res.render("policy", {
              title: "Policy",
              user: req.user,
              trendings: products,
              hots: products2,
              cartProduct: cartProduct,
              cont: content             
              
            });
           })
        });
    })
    .catch(err => {
      console.log(err);
    });
};


exports.getInfomation = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  Products.find()
    .limit(4)
    .then(products => {
      Products.find()
        .limit(4)
        .sort("buyCounts")
        .then(products2 => {
          Content.find({}, function (err, content) { 
            res.render("info", {
              title: "ABOUT US",
              user: req.user,
              trendings: products,
              hots: products2,
              cartProduct: cartProduct,
              cont: content             
              
            });
           })
        });
    })
    .catch(err => {
      console.log(err);
    });
};
exports.getReturn = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  Products.find()
    .limit(4)
    .then(products => {
      Products.find()
        .limit(4)
        .sort("buyCounts")
        .then(products2 => {
          Content.find({}, function (err, content) { 
            res.render("return", {
              title: "RETURNS AND EXCHANGE",
              user: req.user,
              trendings: products,
              hots: products2,
              cartProduct: cartProduct,
              cont: content             
              
            });
           })
        });
    })
    .catch(err => {
      console.log(err);
    });
};
