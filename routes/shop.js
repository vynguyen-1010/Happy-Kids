var express = require("express");
var mongoose = require('mongoose');

var router = express.Router();
const productController = require("../controllers/product");

// Get homepage và collection page

router.get("/", productController.getIndexProducts);

router.get("/products/:productType?/:productChild?",productController.getProducts);

router.post("/products/:productType*?", productController.postNumItems);

router.get("/search", productController.getSearch);

// Xử lý Cart

router.get("/shopping_cart", productController.getCart);

router.get("/add-to-cart/:productId", productController.addToCart);

router.get("/modify-cart", productController.modifyCart);

router.get("/add-order", productController.addOrder);

router.post("/add-order", productController.postAddOrder);

router.get("/delete-cart", productController.getDeleteCart);

router.get("/delete-item/:productId", productController.getDeleteItem);

router.get("/merge-cart", productController.mergeCart);

// Quản lý sản phẩm
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+ '-' + file.originalname)
    }
  });
var upload = multer({ storage: storage });

// up ảnh slide
var storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './image_slides')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+ '-' + file.originalname)
    }
  });
var upLoadImageSlide = multer({ storage: storage1 });

//up ảnh theo chủ đề
var storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './image_theme')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+ '-' + file.originalname)
    }
  });
var upLoadImageTheme = multer({ storage: storage2 });


router.post('/upimage', upload.any(), productController.getImage);
router.post('/upimageslides', upLoadImageSlide.any(), productController.getImageSlides);
router.post('/upimagetheme', upLoadImageTheme.any(), productController.getImageTheme);

router.post("/admin/product/add", productController.postAddProduct);

router.get("/admin/product/add", productController.getAddProduct);

router.get("/delete.:idcanxoa", productController.getDeleteProduct);
router.get("/edit.:idcansua", productController.getEditProduct);
router.post("/edit.:idcansua", productController.postEditProduct);

router.get("/admin/product", productController.viewProductList);

router.get("/admin/order", productController.viewOrderList);

router.post("/admin/order", productController.changeOrderStatus);

router.get("/admin/category", productController.viewCategoryList);

router.post("/admin/category/add", productController.postAddCategory);

router.get("/admin/category/add", productController.getAddCategory);

router.get("/policy", productController.getPolicy);
router.get("/info", productController.getInfomation);
router.get("/return", productController.getReturn);







// router.get("/admin/content", productController.getAddContent);
router.get("/admin/content", productController.getEditContent);
router.post("/admin/content", productController.postEditContent);

// router.get("/admin/content.:idcansua", productController.getEditContent1);
// router.post("/admin/content.:idcansua", productController.postEditContent1);




  
module.exports = router;
