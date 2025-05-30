const jwt=require('jsonwebtoken');
// middleware to authenticate JWT tokens for admin users
const adminAuth=(req,res,next)=>{
    const authHeader=req.header('Authorization');
    if(!authHeader) {
        return res.status(400).json({message:"Access denied. No token provided."});
    }
    const token=authHeader.split(' ')[1];
    if(!token) {
        return res.status(400).json({message:"Access denied. Invalid token format."});
    }
    try {
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        req.user=verified;
        if(req.user.role!='admin') {
            return res.status(403).json({message:"Access denied. Admins only."});
        }
    }catch(err) {
        return res.status(400).json({message:"Invalid Token"});
    }
    next();
}
module.exports=adminAuth;
// This middleware checks if the user is an admin by verifying the JWT token