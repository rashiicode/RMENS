const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/RMensproject").then(()=>{
    console.log("mongoDb connected"); 
}).catch(()=>{
    console.log("mongoDb nott connected");
})
 
const Schema=new mongoose.Schema({

    name:{
        type:String,
    },
    email:{
        type:String,
        // required:true
    },
    hashedPassword:{
        type:String,
        // required:true
        //ee case ondel mathrame poguloo ilenghil ath ilelm pogm

    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    otp: {
        code: {
            type: String,
            default: null
        },
        expiration: {
            type: Date,
            default: null
        }
    }
}, { 
    
    timestamps: true 



})







const collectionmodel=mongoose.model("signupCollection",Schema)
module.exports=collectionmodel;