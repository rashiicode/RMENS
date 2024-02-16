const mongoose = require('mongoose');


    const addressSchema = new mongoose.Schema({

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:  'UserCollection'   // Reference to the profil model
        }, 
        address: [{
        
            street: {
                type: String
            },
            phonenumber:{
               type:String
            },

            city: {
                type: String
            },
            state: {
                type: String
            },
            zipcode: {
                type: String
            },
            
        }]
    });

    const addressCollection = mongoose.model('addressCollection', addressSchema);
    module.exports = addressCollection;

 