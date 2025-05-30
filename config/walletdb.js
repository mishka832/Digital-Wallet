const mongoose= require('mongoose');
const dbConnection=mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Wallet Database connected successfully');
}).catch((err)=>{
    console.error('Wallet Database connection failed:', err.message);
});
module.exports=dbConnection;