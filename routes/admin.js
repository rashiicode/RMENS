const express = require("express")
const router = express.Router();  
const bodyParser=require('body-parser');
const multer = require('multer'); 
const adminController=require("../controller/adminController")
const adminsession = require("../middleware/adminsession");
 

const storage = multer.diskStorage({ 
    destination: (req, file, cb)    => {
      cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024, // 1 MB limit
    },
    fileFilter: function (req, file, cb) {
        // Add your file filter logic here
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// login 
router.get("/login",adminController.adminlogin);
router.post("/login",adminController.adminpost);
router.get("/dashboard",adminController.admindashboard);



// User block and  un-block
router.get("/user",adminController.adminUser);
router.post("/block/:userId", adminController.blockUser);
router.post("/unblock/:userId", adminController.unblockUser);


router.post("/blockProduct/:productId", adminController.blockProduct);
router.post("/unblockProduct/:productId", adminController.unblockProduct);

router.post("/blockCategory/:CategoryId", adminController.blockCategory);
router.post("/unblockCategory/:CategoryId", adminController.unblockCategory);



// category
router.get("/category",adminController.adminCategory)/*1*/ 
//add cateory
router.get("/addCategory",adminController.addcategory);/*1*/ 
router.post("/addNewCategory",adminController.addNewCategory);/*2*/ 
//edit categry
router.get("/editCategory/:id",adminController.editCategory);/*1*/ 
router.post("/updateCategory/:id",adminController.updateCategory);/*2*/ 
//delete catgeory
// router.get("/categoryDelete/:id",adminController.deletecategory);/*1*/ 



// product listing
router.get("/product",adminController.adminProduct);/*1*/ 
//add product
router.get("/addproduct",adminController.addProduct);/*1*/ 
router.post("/addproductPost",upload.fields([{ name: 'images[]', maxCount: 5 }]),adminController.addproductPost);/*2*/ 
//produt edit
router.get("/productEdit/:id",adminController.ProductEditGet);/*1*/ 
router.post("/producEditPostPassed/:id",upload.fields([{ name: 'images[]', maxCount: 5 }]),adminController.producEditPostPassed);/*2*/ 
//product delete 
// router.get("/ProductDelete/:id",adminController.ProductDelete);


// product detail page 
router.get("/productDetail",adminController.productDetails)
router.post("/productDetail",adminController.productDetailsPost)



//order
router.get("/order",adminController.adminOrder);



// logout 
router.get("/logout",adminController.adminlogout)

module.exports=router;
