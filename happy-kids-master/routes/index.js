var express = require('express');
var router = express.Router();
var images = [];
var multer  = require('multer');
var Product = require('../model/sanpham');
var Cart = require('../model/cart');
var Guest = require('../model/guest');
var productController = require("../controller/product");



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+ '-' + file.originalname)
  }
})
 
var upload = multer({ storage: storage })

/* GET home page. */
// router.get('/', function(req, res, next) {
//   Product.find({}, function (err, dulieu) {
//     res.render('home', { title: 'Home', data: dulieu})
//     }).limit(4);
// });


/* GET shop collection page. */
// router.get('/shop-collect', function(req, res, next) {
//   Product.find({}, function (err, dulieu) {
//     res.render('shop-collect', { title: 'Shop Collection', data: dulieu });
//   })
// });


/* GET our story page. */
// router.get('/our-story', function(req, res, next) {
//   res.render('our-story', { title: 'Our Story' });
// });


/* GET contact page. */
// router.get('/contact', function(req, res, next) {
//   res.render('contact', { title: 'Contact' });
// });

router.post('/contact', function(req, res, next) {
  var contact = {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
  }
  var guestinfo = new Guest(contact);
  guestinfo.save();
  res.redirect('/contact');
});

/* */


/* GET item page. */
// router.get('/item.:id', function(req, res, next) {
//   var id = req.params.id;
//   Product.find({_id: id}, function (err, dulieu) {
//     res.render('item', { title: 'Item', data: dulieu });
//   })
//   //res.render('item', { title: 'Item' });
// });


/* GET my account page. */
router.get('/my-account', function(req, res, next) {
  res.render('my-account', { title: 'Account' });
});


/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log In' });
});


/* GET sign up page. */
router.get('/sign-up', function(req, res, next) {
  res.render('sign-up', { title: 'Sign Up' });
});

// Xem dữ liệu
router.get('/xem', function(req, res, next) {
  Product.find({}, function (err, dulieu) {
    res.render('xem', { title: 'Xem dữ liệu', data: dulieu})
    })
});

// Xóa dữ liệu
router.get('/xoa.:idcanxoa', function(req, res, next) {
  var idcanxoa = req.params.idcanxoa;
  Product.findByIdAndRemove(idcanxoa, function (err, dulieu) {
    dulieu.save();
    res.redirect('/xem');
    });  
});

/* GET them du lieu. */
router.get('/them', function(req, res, next) {
  res.render('them', { title: 'Thêm dữ liệu' });
});

/* Post cho ảnh. */
router.post('/uploadfile', upload.any(), function(req, res, next) {
  images.pop(req.files[0].path); // đưa path của img vào mảng images
  images.push(req.files[0].path); // đưa path của img vào mảng images
  console.log(images);
  res.status(200).send(req.files); // gửi mã 200 khi up thành công
});


// Post cho them du lieu
router.post('/them', function(req, res, next) {
  var phantu = {
    title: req.body.title,
    des: req.body.des,
    price: req.body.price,
    cat: req.body.cat,
    images: images
  }
  var dulieu = new Product(phantu);
  dulieu.save();
  res.redirect('/xem');
});

/* GET sửa du lieu. */
router.get('/sua.:idcansua', function(req, res, next) {
  var idcansua = req.params.idcansua;
  Product.find({_id: idcansua}, function (err, dulieu) {
    res.render('sua', { title: 'Sửa dữ liệu', data: dulieu });
  })
});

// Post dl cho phần sửa
router.post('/sua.:idcansua', function(req, res, next) {
  var idcansua = req.params.idcansua;
  Product.findByIdAndUpdate(idcansua, {$set: {
    title: req.body.title,
    des: req.body.des,
    price: req.body.price,
    cat: req.body.cat
  }}, function (err, dulieu) {
    dulieu.save();
  });
  //console.log(req.body.tuoi);
  res.redirect('/xem');
});

/* GET my cart page. */
router.get("/my-cart", productController.getCart);
router.get("/shop-collect", productController.getShop);
router.get("/", productController.getHome);
router.get("/our-story", productController.getStory);
router.get("/contact", productController.getContact);
router.get("/item.:id", productController.getItem);
// Đẩy dữ liệu giỏ hàng - cart
router.get("/add-to-cart/:productId", productController.addToCart);
// Xóa item giỏ hàng
router.get("/delete-item/:productId", productController.getDeleteItem);
// Xóa giỏ hàng
router.get("/delete-cart", productController.getDeleteCart);
// Chỉnh qty
router.get("/modify-cart", productController.modifyCart);
router.get("/cate.bodysuit", productController.getBody);
router.get("/cate.toy", productController.getToy);
router.get("/cate.tshirt", productController.getTshirt);





/**Tìm cơ bản */
// router.get('/cate.tshirt', function(req, res, next) {
//   Product.find({cat: "T-Shirt"}, function (err, dulieu) {
//     res.render('shop-collect', { title: 'Áo', data: dulieu });
//   })
// });

// router.get('/cate.bodysuit', function(req, res, next) {
//   Product.find({cat: "Bodysuit"}, function (err, dulieu) {
//     res.render('shop-collect', { title: 'Bodysuit', data: dulieu });
//   })
// });

// router.get('/cate.toy', function(req, res, next) {
//   Product.find({cat: "Toy"}, function (err, dulieu) {
//     res.render('shop-collect', { title: 'Toy', data: dulieu });
//   })
// });
/**/


module.exports = router;
