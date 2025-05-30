const express=require('express');
const router=express.Router();
const WalletModel=require('../models/wallet');
const userModel=require('../models/user');
const auth=require('../middleware/auth');
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');
const { body, validationResult } = require('express-validator');
router.get('/',auth,async(req,res)=>{
    const wallet=await WalletModel.findOne({userId:req.user.id});
    if(!wallet) {
        return res.status(404).json({message:"No Transactions found for this user as no wallet exists"});
    }
    const transactions=wallet.transactions;
    return res.status(200).json({message:"Transaction history fetched: ",
        transactions:transactions.map(transaction => ({
            type: transaction.type,
            amount: transaction.amount,
            toUser: transaction.toUser ? transaction.toUser.username : null,
            currency: transaction.currency,
            date: transaction.date
        }))
    })
    
})





module.exports=router;