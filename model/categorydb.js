const mongoose = require('mongoose'); 


const categoryschema =new mongoose.Schema({  
    categoryName:{
    type:String,
    required:true
},
    description:{
    type:String,
    required:true
},

isStatus: { 
    type: Boolean, 
    default: true
},


})

const categoryCollection=mongoose.model("categoryCollection",categoryschema)
module.exports = categoryCollection;