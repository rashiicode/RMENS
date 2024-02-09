const userCollection= require("../model/signupp")
const productCollection = require("../model/product");
const bcrypt=require("bcrypt")
const nodemailer = require('nodemailer');


//const { Collection } = require("mongoose")



const home =async(req,res)=>{
  if(req.session.user){
    console.log("session check");
    const session=req.session.user
    console.log(session);
    const username=await userCollection.find({email:session})
    
    console.log("landing");
    console.log(username[0].name+"name");
      res.render("user/landing",{username:username[0].name})
}

else{

  res.render("user/home")
} 
}


 
const landingPage=async(req,res)=>{
  if(req.session.user){
    console.log("session check");
    const session=req.session.user
    console.log(session);
    const username=await userCollection.find({email:session})

  console.log("landing");
    console.log(username[0].name+"name");
     res.render("user/landing",{username:username[0].name})

    
  }else{
    
    res.redirect("/")
  }
}


const login=(req,res)=>{
 if(req.session.user){
res.redirect('/landing')
 }else{
res.render("user/login")
 }
 
    
 }


 const loginPost = async (req, res) => {
  try {

    const { email, password } = req.body;
    console.log("first");

    // Check if email and password are provided
    if (!email || !password) {
      const signallogin = "All fields are required";
     res.render("user/login", { emptyFieldslogin: signallogin });
    }

    // Check if the user exists in the database
    const user = await userCollection.findOne({ email});
    console.log(user,"after find email in database");

    if(user.isActive==false){  
      console.log("pop");    
  const error= "ENTRY RESTRICTED PLEASE CONTACT ADMINISTRATOR"
  return res.render("user/login",{error});
}
//     // Compare the provided password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.hashedPassword);
    console.log("after hashing");
    


    // If the password matches, set the user session and redirect to the landing page
    if (isPasswordMatch) {
      req.session.user = email;
      console.log("login session okay", email);
     
      //  res.render("user/landing");
      res.redirect("/landing")
      console.log("landing after");
  
    } else{
      console.log("5th");
      
      if (!isPasswordMatch) {
        const error= "Wrong password" 
       return res.render("user/login", { error});
      } else {
        console.log("RESTRICT FIND");
     
      }
    }

    console.log("6th");

  } catch (error) {
    console.error('Login error:', error.message);
    const entrykey = "Wrong Details ";
    return res.render("user/login", { entry: entrykey });
  }
};


   const signup = (req,res) =>{
    
    if(req.session.user){
      console.log("already logged person in signup state");
     res.render("user/signup")
    }else{
        res.render("user/signup") 
    }
      
   }
   const signupPost = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate name, email, and password inputs
        if (!name || !email || !password) {
            return res.render("user/signup", { message: "All fields are required." });
        }

        // Check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.render("user/signup", { message: "Invalid email address." });
        }

        // Check if the password meets the minimum length requirement
        if (password.length < 8) {
            return res.render("user/signup", { message: "Password must be at least 8 characters long." });
        }

        // Check for strong password criteria: at least one uppercase letter, one lowercase letter, one number, and one special character
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\\\|\[\]{};:'",.<>/?]).{8,}$/;
        if (!strongPasswordRegex.test(password)) {
            return res.render("user/signup", { strongPassword: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character." });
        }

        // Check if the email already exists in the database
        const existingUser = await userCollection.findOne({ email });
        if (existingUser) {
            return res.render('user/signup', { message: 'Email already registered.' });
        }

        // Generate a random 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000);

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = new userCollection({
            name,
            email,
            hashedPassword,
            otp: {
                code: otpCode.toString(),
                expiration: new Date(Date.now() + 1 * 60 * 1000) // OTP expiration time (1 minute)
            }
        });


        //

       

        // Send OTP via email
        await sendOtpEmail(email, otpCode);

 await userData.save();
        // Store email in session for OTP verification
        req.session.verifyEmail = email;

        // Redirect to verify OTP page
       return res.render('user/signupOtp');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error for signup' });
    }
};


const signupOtp=(req,res)=>{
res.render("user/signupOtp")
}

const sendOtpEmail = async (email, otp) => {
  try {
    // Replace the following with your nodemailer setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user : process.env.MAIL_USER,
        pass : process.env.MAIL_PASS

      
     

      }
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Verification otp',
      text: `Your verification code is: ${otp}`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error(error);
    throw new Error('Error sending email');
  }
};









     const signupVerifyEmail = async (req, res) => {
      try {
          let verifyEmail = "";

   
          const { otp } = req.body;
          console.log(otp,"showing otp");
  
          // Retrieve the email from the session
          if (req.session.verifyEmail) {
              verifyEmail = req.session.verifyEmail;
          }
  
          const user = await userCollection.findOne({ email: verifyEmail });
          console.log(user, "verifyEmail in verifyOtp");
  
          if (!user) {
            console.log('User not found signupVerifyOtp')
          }
      
          // Check if OTP is expired 
          if (user.otp.expiration && user.otp.expiration < new Date()) {
           const message=  'OTP has expired'
            return res.render({ message});
          }
      
          // Check if the entered OTP matches the stored OTP
          if (user.otp.code !== otp) {
           const wrongOtp="Invalid OTP, Recheck Your OTP"

            return res.render("user/signupOtp",{wrongOtp})
      
          }
      
          // Clear the OTP details after successful verification
          user.otp = {
            code: null,
            expiration: null
          };
      
          await user.save();
          console.log('OTP verified successfully in verifyOtp. Please Login Again')
          res.redirect('/login')
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error while verifying OTP' });
        }
      }
  

    const emailResendOtp = async (req, res) => {
    try {
      if (req.session.verifyEmail) {
        verifyEmail = req.session.verifyEmail;
      }
  
      const user = await userCollection.findOne({ email: verifyEmail });
  
      if (!user) {
        console.log('User not found emailResendOtp');
      }
  
      // Check if 60 seconds have passed since the last OTP request
      const lastOtpRequestTime = user.otp.lastRequestTime || 0;
      const currentTime = new Date().getTime();
  
      if (currentTime - lastOtpRequestTime < 60000) {
        return res.render("user/signupOtp",{ message: 'Wait for 60 seconds before requesting a new OTP' });
      }
   
      // Generate a new OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000);
  
      // Set the new OTP in the user document and update the last request time
      user.otp = {
        code: otpCode.toString(),
        expiration: new Date(Date.now() + 1 * 60 * 2000), // One minute expiration

        lastRequestTime: currentTime
      };
  
      await user.save();
  
      // Send the new OTP via email
      await sendOtpEmail(verifyEmail, otpCode);
      console.log('New OTP sent successfully');
  
      res.render('user/signupOtp'); // Redirect to the verification page
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error while resending OTP' });
    }
  };

let verifyEmail=""
  const passwordResendOtp = async (req, res) => {
    try {
        
        // Retrieve verifyEmail from session
        const verifyEmail = req.session.forgotpasswordEmail;

        // Log verifyEmail to ensure it's retrieved correctly
        console.log(verifyEmail);

        // Find user by email in the database
        const user = await userCollection.findOne({ email: verifyEmail });

        // Handle case where user is not found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure user document includes otp property
        if (!user.otp) {
            return res.status(400).json({ message: 'OTP not found for the user' });
        }


        // Check if 60 seconds have passed since the last OTP request
        const lastOtpRequestTime = user.otp.lastRequestTime || 0;
        const currentTime = new Date().getTime();

        if (currentTime - lastOtpRequestTime < 60000) {
          console.log("res.status(429).json")  
          return res.status(429).json({ message: 'Wait for 60 seconds before requesting a new OTP' });
        }

        // Generate a new OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000);

        // Set the new OTP in the user document and update the last request time
        user.otp = {
            code: otpCode.toString(),
            expiration: new Date(Date.now() + 1 * 60 * 2000), // One minute expiration
            lastRequestTime: currentTime
        };

        await user.save();

        // Send the new OTP via email
        await sendOtpEmail(verifyEmail, otpCode); // Use verifyEmailb here
        console.log('New OTP sent successfully');

        res.render('user/forgotOtp'); // Redirect to the verification page
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal Server Error while resending OTP' });
    }
};



const forgotPage=(req,res)=>{
res.render("user/forgotPage")
}


const forgotOtpGet=(req,res)=>{

  res.render("user/forgotOtp")


}





const forgotOtp = async (req, res) => {
 

  res.render("user/forgotOtp")

}



const confirmPage=(req,res)=>{

  res.render("user/confirmPage")

}

const confirmPageget=(req,res)=>{
  res.render("user/confirmPage")
}







const suits=async (req,res)=>{
  // console.log(req.session.user)
  //   if(req.session.user){
  //  return   res.render("user/suits")
  //   }else{
  //     res.redirect("/login")
  //   } 
  const productList = await productCollection.find();     
     
  return res.render("user/suits",{productList});





   }
   
    const shirts= async (req,res)=>{
      // console.log(req.session.user);
      //     try{
      //   if(req.session.user){
          
      const productList = await productCollection.find();     
     
         return res.render("user/shirts",{productList});
        // }else{
        //   console.log("ashish dout");
        //   res.redirect("/login")
    }
      // }catch(error){
      //   res.send(error.message);
      //   console.log("error in the shorts ejs");
      //   console.log("error:",error.message);
      // }
        // }
        
  
    const pants=async (req,res)=>{
  
      // if(req.session.user){
      //   res.render("user/pants")
      // }else{
      //   res.render("user/home")
      // } 
      const productList = await productCollection.find();     
     
      return res.render("user/pants",{productList});
    
      
      }
       
const productDetails=async (req,res)=>{
if(req.session.user){
  const theRealId = req.params.id;
  console.log("@#@#@##",theRealId);
  
const productList = await productCollection.findById(theRealId);
console.log(productList);
res.render("user/productDetail",{productList})
console.log("the logged details:",productList);

}else{
res.redirect("/landing")
}
}
  



 

const logout=(req,res)=>{
  req.session.destroy((err)=>{
    if(err){
        console.error('Error destroying session:',err);
    }
    res.redirect("/login")
})
}

const getGenerateOTP = async (req, res) => {
  console.log("post or get dout");
  if (req.session.user) {
  
    res.render('user/landing')

  } 
  else {
console.log("ready for post forrget otP");
    res.redirect('/forgotOtp')
  }
}



const generateOtp = async (req, res) => {
  try {

    const email = req.body.email;
    console.log(email, "This is from generateOtp")
    const user = await userCollection.findOne({ email });
    console.log(user, "This is from User")
    if (!user) {
      return res.status(404).json({ message: 'User not found generateOtp' });
    }

    req.session.forgotpasswordEmail = user.email
    console.log(req.session.forgotpasswordEmail, "my eamil")
    // Generate a random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000);

    // Set OTP in the user document and its expiration time (e.g., 5 minutes from now)
    user.otp = {
      code: otpCode.toString(),
      expiration: new Date(Date.now() + 15 * 60 * 1000)
    };

    await user.save();

    // Send OTP via email
    await sendOtpEmail(email, otpCode);
    console.log('OTP sent successfully')
    res.render("user/forgotOtp")
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error for Sending OTP' });
  }
}




const forgotverifyOtp = async (req, res) => {
  try {

    console.log("confirm checkkk");
    let veryEmail = ''; 
    const { otp } = req.body;
    
    if (req.session.forgotpasswordEmail) {
      veryEmail = req.session.forgotpasswordEmail
    }

    const user = await userCollection.findOne({ email: veryEmail });

    if (!user) {
      console.log('User not found in verifyOtp');
      return res.render('user/error', { message: 'User not found' }); // Render an error page with a message
    }

    // Check if OTP is expired
    if (user.otp.expiration && new Date() > user.otp.expiration) {
      console.log('OTP has expired');
      return res.render('user/error', { message: 'OTP has expired' }); // Render an error page with a message
    }

    // Check if the entered OTP matches the stored OTP
    if (user.otp.code !== otp) {
      console.log('Invalid OTP, Recheck Your OTP');
      return res.render('user/error', { message: 'Invalid OTP' }); // Render an error page with a message
    }

    // Clear the OTP details after successful verification
    user.otp = {
      code: null,
      expiration: null
    };
    await user.save();
    console.log('OTP verified successfully in verifyOtp');
    res.render('user/confirmPage');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error while verifying OTP' });
  }
};

const verifyOTP = (req, res) => {
  const enteredOTP = req.body.otp; 

 
  const storedOTP = '123456';

  if (enteredOTP === storedOTP) {
      res.send('OTP verified successfully!'); // Handle successful verification
  } else {
      res.send('Invalid OTP. Please try again.'); // Handle failed verification
  }
};


const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    // Check if the passwords match
    if (newPassword !== confirmPassword) {
      console.log('Passwords do not match');
      return res.redirect('/password-reset'); // Redirect to password reset page with error message
    }

    // Retrieve the email from the session
    const email = req.session.forgotpasswordEmail;

    // Find the user by email
    const user = await userCollection.findOne({ email });

    if (!user) {
      console.log('User not found');
      return res.redirect('/password-reset'); // Redirect to password reset page with error message
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password with the hashed password
    user.hashedPassword = hashedPassword;

    // Save the updated user to the database
    await user.save();

    console.log('Password reset successfully');
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const wishlist=(req,res)=>{
res.render("user/wishlist")
}
const cart=(req,res)=>{
  res.render("user/cart")
}



module.exports={
   forgotOtp,loginPost,
   logout,home,login,signup,signupPost
   ,signupVerifyEmail,emailResendOtp,
   suits,pants,shirts,forgotPage,getGenerateOTP,
   verifyOTP,generateOtp ,forgotverifyOtp,signupOtp,
   confirmPage,forgotOtpGet,confirmPageget,passwordResendOtp,
   landingPage,
   productDetails,resetPassword,wishlist,cart}
    

