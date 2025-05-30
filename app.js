// this route fetches the transactions of a user with amount,type and date.
const express=require('express');
const app=express();
const dotenv=require('dotenv');
dotenv.config();
const mongoose=require('mongoose');
const userModel=require('./models/user');
const walletModel=require('./models/wallet');
connection=async() => {
    
    const dbConnection= await require('./config/db');
    const walletDbConnection=await require('./config/walletdb');
}
connection();
const userRoute=require('./routes/userRoute');
const walletRoute=require('./routes/walletRoute');
const transactionRoute=require('./routes/transactionRoute');
const fraudRoute=require('./routes/fraudRoute');
const adminRoute=require('./routes/adminRoute');
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));
app.set('view engine','ejs');
app.use('/api/user',userRoute);
app.use('/api/wallet',walletRoute);
app.use('/api/transaction',transactionRoute);
app.use('/api/fraud',fraudRoute);
app.use('/api/admin',adminRoute);
app.get('/',(req,res)=>{
    res.send('Hello world');
})
app.listen(3000)