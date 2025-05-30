const mongoose = require('mongoose');
const walletSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance: {
        type: Number,
        default: 0,

    },
    transactions: [
        {
            type: {
                type:String,
                enum: ['credit','debit','transfer'],
                required:true
            },
            amount: {
                type:Number,
                required:true

            },
            toUser: {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            currency:{
                type:String,
                default:'INR',
                required:true,
                enum:['INR','USD','EUR']
            },
            date: {
                type: Date,
                default: Date.now
            },
            flag:
            {
                type: Boolean,
                default: false
            }
        }
    ]
});
const walletModel=mongoose.model('Wallet',walletSchema);
module.exports=walletModel;