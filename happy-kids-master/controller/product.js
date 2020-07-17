var Product = require("../model/sanpham");
var Cart = require("../model/cart");

exports.getCart = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }
  res.render("my-cart", {
    title: "Giỏ hàng",
    user: req.user,
    cartProduct: cartProduct
  }); 
};


exports.getShop = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  };  
  Product.find({}, function (err, dulieu) {
         res.render('shop-collect', { 
           title: 'Shop Collection', 
           data: dulieu ,
           cartProduct: cartProduct,
           user: req.user
          });
       }) 
};
exports.getHome = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  };  
  Product.find({}, function (err, dulieu) {
         res.render('home', { 
           title: 'Home', 
           data: dulieu ,
           cartProduct: cartProduct,
           user: req.user
          });
       }).limit(4);
};
exports.getStory = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  };  
  Product.find({}, function (err, dulieu) {
         res.render('our-story', { 
           title: 'Story', 
           data: dulieu ,
           cartProduct: cartProduct,
           user: req.user
          });
       })
};
exports.getContact = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  };  
  Product.find({}, function (err, dulieu) {
         res.render('contact', { 
           title: 'Contact', 
           data: dulieu ,
           cartProduct: cartProduct,
           user: req.user
          });
       })
};
exports.getBody = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }; 
  
  Product.find({cat: "Bodysuit"}, function (err, dulieu) {
         res.render('shop-collect', { 
           title: 'Bodysuit', 
           data: dulieu ,
           cartProduct: cartProduct,
           user: req.user
          });
       })
};
exports.getToy = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }; 
  
  Product.find({cat: "Toy"}, function (err, dulieu) {
         res.render('shop-collect', { 
           title: 'Toy', 
           data: dulieu ,
           cartProduct: cartProduct,
           user: req.user
          });
       })
};
exports.getTshirt = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  }; 
  
  Product.find({cat: "T-Shirt"}, function (err, dulieu) {
         res.render('shop-collect', { 
           title: 'Áo', 
           data: dulieu ,
           cartProduct: cartProduct,
           user: req.user
          });
       })
};
exports.getItem = (req, res, next) => {
  var cartProduct;
  if (!req.session.cart) {
    cartProduct = null;
  } else {
    var cart = new Cart(req.session.cart);
    cartProduct = cart.generateArray();
  };  
  var id = req.params.id;
  Product.find({_id: id}, function (err, dulieu) {
    res.render('item', { title: 'Item', data: dulieu, cartProduct: cartProduct,
    user: req.user  });
  })  
};

exports.addToCart = (req, res, next) => {
  var prodId = req.params.productId;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(prodId, (err, product) => {
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
  Product.findById(prodId, (err, product) => {
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

exports.modifyCart = (req, res, next) => {
  var prodId = req.query.id;
  var qty = req.query.qty;
  if (qty == 0) {
    return res.redirect("back");
  }
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(prodId, (err, product) => {
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