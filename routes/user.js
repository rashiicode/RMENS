const express=require("express")
const router=express.Router()
const userController=require("../controller/userController")
const isActive=require("../middleware/usermon/userStatusCheck")
// const productCollection=require("../model/product")


// const {getHome} = require("../controller/userController")

router.use(isActive)

 
  

//login
router.get("/",userController.home) 
router.get("/login",userController.login) 
router.post("/login",userController.loginPost)
router.get("/landing",userController.landingPage)


// profile INNNN
router.get('/profile',userController.profile)  
router.get('/editProfile/:id',userController.editProfile)     
router.post('/editProfile/:id',userController.editProfilePost)     

router.post('/deleteProfile/:id',userController.deleteProfile)     


// cart details
router.get('/add-to-cart/:id',userController.addCart)
 

router.get('/addProfile',userController.addProfile)   
router.post('/addProfile/:id',userController.addProfilePost)
router.get('/orderDetail',userController.orderDetail)                  


// signup
router.get("/signup",userController.signup) /* 1*/
router.post("/signup",userController.signupPost) /* 2*/
router.get("/signupOtp",userController.signupOtp) /* sendotpmail funcion works after 3*/
router.post('/signupVerifyEmail', userController.signupVerifyEmail); /*4*/
router.post('/signResendOtp', userController.emailResendOtp);/* 5*/



// forgot
router.get('/forgotPage',userController.forgotPage) /* 1*/
router.get('/forgetOtp', userController.getGenerateOTP);/*2 */
router.post('/forgetOtp', userController.generateOtp);/*2 */
router.post("/confirmPage",userController. forgotverifyOtp)
router.post('/reset-passwordChanged', userController.resetPassword);

router.post('/reset-password', userController.forgotverifyOtp);
router.post('/passwordResendOtp', userController.passwordResendOtp );



 


router.get("/confirmPage",userController.confirmPageget)

                                                       



router.get("/suits",userController.suits)
router.get("/shirts",userController.shirts)
router.get("/pants",userController.pants)
router.get("/productDetail/:id",userController.productDetails)
router.get("/wishlist",userController.wishlist)
router.get("/cart",userController.cart)


// router.get(".home",getHome)

router.get("/logout",userController.logout)



module.exports=router