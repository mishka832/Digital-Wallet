const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    username: {
        type: String,
        required:true,
        unique:true,
        trim:true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password: {
        type: String,
        required:true,
        minlength: 6,
        maxlength: 1024
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
})
const userModel=mongoose.model('User',userSchema);
module.exports=userModel;