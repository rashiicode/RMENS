const userCollection = require("../model/signupp")
const categoryCollection = require("../model/categorydb");
const productCollection = require("../model/product");
    


const adminlogin= async (req,res)=>{
try{ 
   if(req.session.admin){
   res.redirect("/admin/dashboard") 
}
   return res.render("admin/admin")
 }catch(error){
    console.log("adminilogin   ");
}

}


const adminpost=(req,res)=>{ 

    console.log("admin getted");
    const admindata={

        emaill:"rashi123@gmail.com",    
        passwordd:"111"
        }

        if( !req.body.email || !req.body.password) {
            const signaladmin= "All fields are required";
             return res.render("admin/admin", { signaladmin});
          }
           if(admindata.emaill===req.body.email&&admindata.passwordd===req.body.password){
            req.session.admin=req.body.email
             res.redirect("/admin/dashboard")
        }else{  
            res.render("admin/admin")
            console.error(error)
        }
}

const admindashboard=(req,res)=>{
    if(req.session.admin){
     return   res.render("admin/dashboard") 
    }
    res.redirect("/admin/login")

};


const adminlogout=(req,res)=>{
 req.session.destroy((err)=>{   
    if(err){
        console.log("error get on logout time")  
 }
    res.redirect("/admin/login")
    return
}) 
}; 


const adminOrder=(req,res)=>{
    if(req.session.admin){
        res.render("admin/order") 
     }  
     res.redirect("/admin/login")
 
 }




const adminProduct=async(req,res)=>{
    try{
        const productList = await productCollection.find();
        res.render("admin/products",{productList});

    }catch(error){
        res.send(error.message);
    }
    

}



const addProduct=async (req,res)=>{ 
    if(req.session.admin){

        const  categoryExist=await categoryCollection.find()

        res.render("admin/addproduct",{categoryExist}) 

     }else{
        res.redirect("/admin/login")
     }
     
 
 };

 const addproductPost = async (req,res) => {
    try {
        const { Name, category, price, rating, stock, brand, colour, description } = req.body;

        const existingPr= await productCollection.findOne({ Name: Name });
        const  categoryExist=await categoryCollection.find()
        console.log("ii exist  cheqqqq");
        console.log(existingPr);

        if (existingPr) {
            const errormeg = 'product with this name already exists';
           return res.render('admin/addproduct', { errormeg,categoryExist });
        }
        // Assuming 'images' is an array of file paths
        const images = req.files['images[]'].map(file => file.path);
console.log(images,"HEllo image in create product")
        const newProduct = new productCollection({
            Name,
            category,
            price,
            rating,
            stock,
            brand, 
            colour,
            description,
            images,
        });
        console.log("th$$!$!$!$!@$",newProduct);
        // Save the new product to the database
        await newProduct.save();

        // Redirect or send a response as needed
        res.redirect('/admin/product'); // Redirect to a page displaying the added products, change the URL as needed
    } catch (error) {
        console.error('Error adding product:', error.message);
        // Handle errors and send an appropriate response
        res.status(500).send('Internal Server Error');
    }
};



 
 const adminUser = async (req,res) => {
    try{
        console.log("admin checking");
    if (req.session.admin) {
       
        console.log(req.session.admin);
        const users = await userCollection.find();
        res.render("admin/user", { users });
    } else {
        res.redirect("/admin/login");
    } 
    }catch(error){
        console.log(error.message);
    }
   
};

const adminCategory=async(req,res)=>{

if(req.session.admin){
    const categoryListing = await categoryCollection.find();

    res.render("admin/category",{categoryListing});
}else{
    res.redirect("/admin/login")
}

} 

const blockUser = async (req,res) => {
console.log("one");
    try {

        console.log("block check a");
        const userId = req.params.userId;
        
      const data=  await userCollection.findByIdAndUpdate(userId, { isActive: false });
        console.log(data);
 res.redirect("/admin/user");
    } catch (error) {
        console.error("Error blocking user:", error);
        res.status(500).send("Internal Server Error");
    }
};  



const unblockUser = async (req,res) => {
    console.log("toooo");
    try {
        const userId = req.params.userId;
        await userCollection.findByIdAndUpdate(userId, { isActive: true });
        res.redirect("/admin/user");
    } catch (error) {
        console.error("Error unblocking user:", error);
        res.status(500).send("Internal Server Error");
    }
};

const blockProduct= async (req,res) => {
    console.log("CATEGORYYY   ONEEEEEE");
        try {
    
            console.log("block check a");
            const userIdd= req.params.productId;
            
          const dataProduct=  await productCollection.findByIdAndUpdate(userIdd, { isStatus: false });
            console.log(dataProduct);
     res.redirect("/admin/product");
        } catch (error) {
            console.error("Error blocking user:", error);
            res.status(500).send("Internal Server Error");
        }
    };  
    

    const unblockProduct= async (req,res) => {
        console.log("CATEGORYYYt   tOOOOOOEEEE");
            try {
        
                console.log("block check a");
                const userIdd= req.params.productId;
                
              const dataProduct=  await productCollection.findByIdAndUpdate(userIdd, { isStatus:true });
                console.log(dataProduct);
         res.redirect("/admin/product");
            } catch (error) {
                console.error("Error blocking user:", error);
                res.status(500).send("Internal Server Error");
            }
        };  
        
    
        const blockCategory= async (req,res) => {
            console.log("BLOCK PRODUCTTTTT");
                try {
            
                    console.log("block check a");
                    const BlId= req.params.CategoryId;
                    
                  const dataProduct=  await categoryCollection.findByIdAndUpdate(BlId, { isStatus: false });
                    console.log(dataProduct);
             res.redirect("/admin/category");
                } catch (error) {
                    console.error("Error blocking user:", error);
                    res.status(500).send("Internal Server Error");
                }
            };  
    
            const unblockCategory= async (req,res) => {
                console.log("UNNNBLOCK PRODUCTTTTT");
                    try {
                
                        console.log("block check a");
                        const UnnId= req.params.CategoryId;
                        
                    const dataProduct=  await categoryCollection.findByIdAndUpdate(UnnId, { isStatus:true });
                        console.log(dataProduct);
                 res.redirect("/admin/category");
                    } catch (error) {
                        console.error("Error blocking user:", error);
                        res.status(500).send("Internal Server Error");
                    }
                };     



const productDetails=async (req,res)=>{

    const productList=await productCollection.find()
   res.render("admin/products",{productList}) 


}



const productDetailsPost = async (req,res)=>{
   

 }

const addcategory = async(req,res)=>{
    try{
        res.render('admin/categoryAdd',{error:''});
    }catch(error){
       res.send(error);
    }
};

const addNewCategory = async (req,res) => {
    try {
        const newCategory = {
            categoryName: req.body.categoryName,
            description: req.body.description,
        };

        // Check if the category with the same name already exists
        const existingCategory = await categoryCollection.findOne({ categoryName: newCategory.categoryName });

        if (existingCategory) {
            const errormeg = 'Category with this name already exists';
            return res.render('admin/categoryAdd', { errormeg });
        }

        console.log("Function reached");

        // Check if both fields are filled
        if (newCategory.categoryName.trim() === '' || newCategory.description.trim() === '') {
            const error = 'Please fill both fields';
            return res.render('admin/categoryAdd', { error });
        }

        console.log("Category Name is: ", newCategory.categoryName);

        // Create the new category
        const result = await categoryCollection.create(newCategory);

        if (result) {
            res.redirect('/admin/category');
        } else {
            res.send("Error adding category");
        }
    } catch (error) { 
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


const editCategory = async(req,res)=>{
    try{
    const editId=req.params.id;
    console.log("paramsId",editId); 
    console.log("reached@####!!!");
    const editData = await categoryCollection.findOne({_id:editId});

    console.log("he editted data is %%:",editData)
    res.render('admin/categoryedit',{editData});
    console.log("reached reached reached reached");

    }catch(error){
        res.send(error);
    }

};

// const deletecategory = async (req,res) => {
//     try {
//         console.log("entered!!!!!!!!!!!!!!!!!!!");
//         const removingCategory = req.params.id;
//         console.log("removing category Id", removingCategory);
//         await categoryCollection.findByIdAndDelete(removingCategory);
//         // const categoryListing = await categoryCollection.find();
//         // res.render("admin/category", { categoryListing });
//         res.redirect('/admin/category');
//     } catch (error) {
//         console.log(error);
//         res.send(error);
//     }
// };






// const updateCategory = async(req,res)=>{
//     try{
//         const updatedCategory = {
//             categoryName:req.body.categoryName,
//             description:req.body.description,
//         }
//        console.log("updated category is:",updatedCategory.categoryName);
//        console.log("updated category is:",updatedCategory.description);
//         const success =  await categoryCollection.updateMany([{categoryName:updatedCategory.categoryName,description:updatedCategory.description}]);

//         if(success){
//             res.redirect('/admin/category');
//         }
//         // const categoryListing = await categoryCollection.find();
//         //     res.render("admin/category",{categoryListing});
//     }catch(error){
//      console.log("error",error);
//     }
// } 
const updateCategory = async (req,res) => {
    try {

        
        const filter = { _id: req.params.id };

        
        const update = {
            $set: {
                categoryName: req.body.categoryName,    
                description: req.body.description,
            },
        };
        //  const findData= await categoryCollection.findOne({categoryName:req.body.categoryName})
        //  if(findData){
        //     const editData = await categoryCollection.findOne({_id:filter});
        //     const message="already registered category"
        //       res.render("admin/categoryedit",{message});
        //  }else{

        //          await categoryCollection.updateOne(filter, update);
        //  }
                 await categoryCollection.updateOne(filter, update);

        

        res.redirect('/admin/category');
    } catch (error) {
        console.log("error", error);
    }
}

const ProductEditGet=async (req,res)=>{
    try{ 
        
        console.log("enterred in the edit page");
        const TheProduct = req.params.id;
        const  productedit = await productCollection.findOne({_id:TheProduct});
        console.log("!@#$%^&*() is:",productedit)
        const  categoryExist=await categoryCollection.find()

        
        res.render("admin/productEdit",{productedit,categoryExist});


    }catch(error){
        console.log(error);
    }
 };

 const producEditPostPassed = async (req, res) => {
    try {
        const _id = req.params.id;
        console.log("t", _id);

        const { Name, category, price, rating, stock, brand, colour, description } = req.body;
        console.log(Name, category, price, rating, stock, brand, colour, description, req.files);

        const productedit = await productCollection.findOne({ Name: Name });
        const categoryExist = await categoryCollection.find();
        console.log("ii exist check");
        console.log(productedit);

        if (productedit && productedit._id.toString() !== _id) {
            const errormeg = 'Product with this name already exists';
            return res.render('admin/productEdit', { errormeg, productedit, categoryExist });
        }

        let images = [];
        if (req.files && req.files['images[]']) {
            images = req.files['images[]'].map(file => file.path);
            console.log(images);
        }

        const updatedProduct = await productCollection.findByIdAndUpdate(
            _id,
            {
                Name,
                category,
                price,
                rating,
                stock,
                brand,
                colour,
                description,
                images
            },
            { new: true }
        );

        console.log(updatedProduct);
        return res.redirect('/admin/product');
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

const ProductDelete= async(req,res)=>{
    try{
        const theDeleteId = req.params.id;
        console.log("the id is:",theDeleteId);
        await productCollection.findByIdAndDelete(theDeleteId);
        return res.redirect('/admin/product'); 
    }catch(error){
       console.log(error.message);
    }
}



module.exports={
adminlogin,admindashboard,addproductPost,
adminpost,adminlogout,adminOrder,
addProduct,adminProduct,adminUser,blockUser,unblockUser,
adminCategory,productDetails,productDetailsPost,addcategory,ProductDelete,
ProductEditGet,addNewCategory,editCategory,updateCategory,producEditPostPassed,unblockProduct,blockProduct,blockCategory,unblockCategory}
