const mongoose=require("mongoose")


const productschema =new mongoose.Schema({     

    Name:{
        type:String,
         required:true, 
    },
   category:{
        type:String,
        required:true,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'user',
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    colour:{
        type:String,
        
    },
    rating:{
        type:Number,
    },

    images:[String],
    
    isStatus: { 
        type: Boolean, 
        default: true
    },

})


const collectionmodel=mongoose.model("productCollection",productschema)
module.exports=collectionmodel;