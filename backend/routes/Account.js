const express = require("express")
const {JWT_SECRET} = require("./config.js")
const jwt = require("jsonwebtoken")
const router = express.Router();
const {Account} = require("../Schema/Account.js")
const {User} = require("../Schema/User.js")
const {Authp , Auth} = require("../Middleware/Auth.js")
const zod = require("zod")
const mongoose = require("mongoose")
const AccountSchema = zod.object({
    userOId : zod.string().refine((val)=>{
        return mongoose.Types.ObjectId.isValid(val)
    }),
    balance : zod.number().int().positive().optional()
})

router.get("/self" , Auth ,  async (req , res)=>{
    const body = req.query;
    const decodeJwt = jwt.verify(body.token , JWT_SECRET)                          
    if(!decodeJwt || !AccountSchema.safeParse(decodeJwt).success){
        return res.status(411).json({
            message : "Token Was not verified Successfully Please try login again"
         }
        )
    }
    try{
        // console.log((decodeJwt))
        const accountDetail = await Account.findOne({
            userOId : mongoose.Types.ObjectId.createFromHexString(decodeJwt.userOId)
        })
        // console.log(accountDetail)
        if(!accountDetail){
            return res.status(411).json({
                message : "No Such Account Was Found"
            })
        }
        return res.status(200).json({
            message : "Here Are Account Details",
            data : accountDetail
        })
    }catch(err){
        return res.status(411).json({
            message : "Some Error Occured"
        })
    }
})


//Both Accounts are valid ?
//Transfer Money is valid ? 
//Current Balance is Enough to Carry Out Transaction
//No other Transaction is being Carried Out at the Same Time
router.post("/transfer" , Authp , async (req , res)=>{
    
    try{
        
        const body = req.body;
        const decodeJwt = jwt.verify(body.token , JWT_SECRET)
        
        if(!decodeJwt  || !AccountSchema.safeParse(decodeJwt).success){
            return res.status(411).json({
                message : "Token Was not verified Successfully Please try login again"
            }
            )
        }
        
   
        const session = await mongoose.startSession();

        session.startTransaction();
        const userTo = await User.findOne({
            userId : body.toId
        }).session(session)
        if(!userTo){
            return res.status(411).json({
                message : "No Such User Was Found"
            })
        }
        const ToAccount = await Account.findOne({
            userOId : (userTo._id)
        }).session(session)
        if(!ToAccount){
            await session.abortTransaction();
            return res.status(411).json({
                message : "RECIEVER DOES NOT EXIST!"
            })
        }
        const FromAccount = await Account.findOne({
            userOId : mongoose.Types.ObjectId.createFromHexString(decodeJwt.userOId)
        }).session(session)
        if(!FromAccount || FromAccount.balance < body.value){
            await session.abortTransaction()
            return res.status(411).json({
                message : "NOT ENOUGH MONEY IN YOUR ACCOUNT!"
            })
        }
        if(decodeJwt.userOId === userTo._id.toString()){
            return res.status(411).json({
                message : "Both Receiver and sender cannot be same!"
            })
        }
        await Account.updateOne({ userOId: mongoose.Types.ObjectId.createFromHexString(decodeJwt.userOId) }, { $inc: { balance: -body.value } }).session(session);
        await Account.updateOne({ userOId: (userTo._id) }, { $inc: { balance: body.value } }).session(session);
        await session.commitTransaction();
        res.status(200).json({
            message: "Transfer successful"
        });
    }catch(err){
        console.log(err)
        res.status(411).json({
            message : "Transfer Failed!"
        })
    }
})

module.exports = router