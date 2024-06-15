const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        userId : {
            type : String,
            required: true,
            unique : true,
            minLength : 3,
            maxLength : 10,
            trim : true
        },
        firstName :{
            type : String,
            required: true,
            minLength : 3,
            maxLength : 10,
            trim : true
        },
        lastName :{
            type : String,
            required: true,
            minLength : 3,
            maxLength : 10,
            trim : true
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
            maxLength: 12,
            trim : true
        }
    }
);


const User = mongoose.model('User' , UserSchema)

module.exports = {
    User
}