const mongoose = require("mongoose")
const {User} = require("./User")
const AccountSchema = new mongoose.Schema({
    userOId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
        unique : true
    },
    balance : {
        type : Number,
        required : true,
    }
})
const Account = mongoose.model('Account' , AccountSchema)
module.exports = {
    Account
}