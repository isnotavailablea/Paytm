const express = require('express');
const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("./config.js")
const {User} = require("../Schema/User.js")
const {Account} = require("../Schema/Account.js")
const router = express.Router();
const zod = require("zod")
const mongoose = require("mongoose")
const {Auth} = require("../Middleware/Auth.js")
const userSchema = zod.object({
        userId : zod.string().min(3).max(10),
        firstName : zod.string().min(3).max(10),
        lastName : zod.string().min(3).max(10),
        password : zod.string().min(6).max(12)
})

const AccountSchema = zod.object({
        userOId : zod.string().refine((val)=>{
            return mongoose.Types.ObjectId.isValid(val)
        }),
        balance : zod.number().int().positive()
})


router.post("/signup" , async (req , res) =>{
    const body = req.body;
    // console.log(body)
    const zodCheck = userSchema.safeParse(body);
    if(!zodCheck.success){
        // console.log(zodCheck.error)
        return res.status(411).json({
            message : "Signup Body invalid"
        })
    }
    try{
        const CheckUserExistence = await User.findOne({
            userId : body.userId
        })
        if(CheckUserExistence){
            return res.status(411).json({
                message : "User Already Exists"
        })
        }
        const CreateUser = await User.create(body)
        if(!CreateUser){
            return res.status(411).json({
                    message : "Unable To Create User At the Moment"
                 })
        }
        const accObj = {
            userOId : CreateUser._id.toString(),
            balance : Math.floor(Math.random() * (100000))//Three Zeros to make it Go in Range of 0 to 999 and two other zeros for point calcualtions 
        }
        // console.log(accObj)
        const token = jwt.sign({
            userOId : CreateUser._id
        } , JWT_SECRET)

        // console.log((CreateUser._id.toString()))
        if(!AccountSchema.safeParse(accObj).success){
            // console.log(AccountSchema.safeParse(accObj).error)
            return res.status(411).json({
                message :  "Paytm Account Creation Failed Please Try Again Later User creation was Success",
                data : {
                    token,
                    firstName : CreateUser.firstName,
                    lastName : CreateUser.lastName
                }
         })
        }
        accObj.userOId = CreateUser._id
        const accountDetail = await Account.findOne({
            userOId : accObj.userOId
        })
        if(accountDetail){
            return res.status(411).json({
                message : "Account Already Exists"
            })
        }
        const CreateAccount = await Account.create(accObj)
        // console.log(accObj)
        if(!CreateAccount){
            // console.log(CreateAccount)
            return res.status(411).json({
               message :  "Paytm Account Creation Failed Please Try Again Later User creation was Success",
               data : {
                token,firstName : CreateUser.firstName,
                lastName : CreateUser.lastName
               }
        })
        }
        return res.status(200).json({
            message : "User Created!!",
            data : {
                token,
                firstName : CreateUser.firstName,
                lastName : CreateUser.lastName
            }
        })
    }catch(err){
        // console.log("Error")
        // console.log(err)
        return res.status(411).json({
            message : "Error While Creating a User"
        })
    }
})

const loginSchema = zod.object({
    userId : zod.string().min(3).max(10),
    password : zod.string().min(6).max(12)
})


router.get("/login" , async (req , res)=>{
    try{
        const body = req.query;
    // console.log(body)
        const zodCheck = loginSchema.safeParse(body);
        if(!zodCheck.success){
            return res.status(411).json({
                message : "Login Body invalid"
            })
        }
        const userDetails = await User.findOne({
            userId : body.userId,
            password : body.password
        })
        // console.log(userDetails)
        if(!userDetails){
            return res.status(411).json({
                message : "No User with such Credentials!"
            })
        }
        const token = jwt.sign({
            userOId : userDetails._id,
        } , JWT_SECRET)
        return res.status(200).json({
            message : "Welcome",
            data : {
                token,
                firstName : userDetails.firstName,
                lastName : userDetails.lastName
            }
        })
    }
    catch(err){
        return res.status(411).json({
            message : "Unable to Login!"
        })
    }
})

router.get("/find" , Auth  ,  async (req , res)=>{
    try{
        // console.log("hre")
        const filter = req.query.filter || "";
        console.log(filter)
        const users = await User.find({
            $or: [{
                firstName: {
                    "$regex": filter
                }
            }, {
                lastName: {
                    "$regex": filter
                }},{
                    userId : {
                        "$regex" :filter
                    }
                }
            ]});
            // console.log(users)
            const data = users.map(el => {
                return {
                    firstName: el.firstName,
                    lastName : el.lastName,
                    userId : el.userId
                }
            })
            // console.log(data)
        return res.status(200).json({
            message : "Here Is What We Could Find",
            data 
         })
    }
    catch(err){
        return res.status(411).json({
            message : "Some Error Occured"
        })
    }
})



router.get("/verify" , Auth , async (req , res) => {
    // console.log("verifying")
    try{
        const decodeJwt = jwt.verify(req.query.token , JWT_SECRET);
        // console.log(userOId)
        const user = await User.findOne({
            _id : mongoose.Types.ObjectId.createFromHexString(decodeJwt.userOId)
        })
        // console.log(user)
        if(!user){
            throw "Not able to Find User";
        }
        // console.log("Deep")
        return res.status(200).json({
            message : "Welcome Back!",
            data : {
                token : req.query.token,
                firstName: user.firstName,
                lastName: user.lastName
            }
        })}
    catch(err){
        // console.log(err)
        return res.status(411).json({
            message : "Cannot Find The User"
        })
    }
})
module.exports = router