const express = require('express');
const userRouter = require("./User");
const accountRouter = require("./Account");
const {ConnectionStr} = require("./config")
const mongoose = require("mongoose")
// mongoose.connect("mongodb://0.0.0.0:27017/paytm1" )//, { replicaSet: 'mongodb-replset22' }
// mongoose.connect("mongodb://0.0.0.0:27017/replicaSet=rs")
try{
mongoose.connect(ConnectionStr)
console.log("success")
}catch(err){
    console.log(err)
}
const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);

module.exports = router;