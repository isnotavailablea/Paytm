const {User} = require("../Schema/User")
const { JWT_SECRET } = require("../routes/config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const Auth = async (req , res , next)=>{
    try{
        // console.log("here")
        const body = req.query;
        // console.log(body)
        // console.log(req)
        if(!body){
            return res.status(411).json({
                message : "Invalid Credentials"
            })
        }
        // console.log("hre")
        const decodeJwt = jwt.verify(body.token , JWT_SECRET);
        
        if(!decodeJwt){
            return res.status(411).json({
                message : "Invalid Credentials"
            })
        }

        const user = await User.findOne({
            _id :   mongoose.Types.ObjectId.createFromHexString(decodeJwt.userOId)
        })
        
        if(!user){
            return res.status(411).json({
                message : "No such user Exists"
            })
        }

        next();
    }catch(err){
        // console.log(err)
        return res.status(411).json({
            message : "Some Error Occurred"
        })
    }
}
const Authp = async (req , res , next)=>{
    try{
        const body = req.body;
        // console.log(body)
        if(!body || body.token === undefined){
            return res.status(411).json({
                message : "Invalid Credentials"
            })
        }
    const decodeJwt = jwt.verify(body.token , JWT_SECRET);
    // console.log(typeof(decodeJwt.userOId))
    if(!decodeJwt){
        return res.status(411).json({
            message : "Invalid Credentials"
        })
    }
        // console.log(typeof(decodeJwt.userOId))
        // console.log(mongoose.Types.ObjectId.createFromHexString(decodeJwt.userOId))
        const user = await User.findOne({
            _id :   mongoose.Types.ObjectId.createFromHexString(decodeJwt.userOId)
        })
        
        if(!user){
            return res.status(411).json({
                message : "No such user Exists"
            })
        }
        next();
    }catch(err){
        // console.log(err)
        return res.status(411).json({
            message : "Some Error Occurred"
        })
    }
    
}




module.exports = {
    Auth , Authp
}