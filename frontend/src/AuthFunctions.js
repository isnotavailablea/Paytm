import Axios from "axios"

const fetchUser = async (token) =>{
    try{
        const res = await Axios.get("http://localhost:8000/api/v1/user/verify" , {
            params : {
                token 
            }
        })
        return res.data.data
    }catch(err){
        return null
    }
}

const addUser = async (firstName , lastName  , userId , password) => {
   try{
    const res = await Axios.post("http://localhost:8000/api/v1/user/signup" , {
        lastName , firstName , password , userId
    })
    if(!res){
        return null
    }
    return res.data.data
   }catch(err){
    return null
   }
}

const loginUser = async (userId , password) =>{
     try{
        const res = await Axios.get("http://localhost:8000/api/v1/user/login" , {
            params : {
                userId , password
            }
         })
         if(!res){
            return null
         }
         return res.data.data
     }catch(err){
        return null
     }
}

const fetchBalance =  async (token) => {
    try{
        // console.log(token)
        const res = await Axios.get("http://localhost:8000/api/v1/account/self" , {
            params : {
                token
            }
        })
        if(!res){
            return null
        }
        return res.data.data.balance
    }
    catch(err){
        return null
    }
}

const getUsers = async (token , filter) =>{
    try{
        // console.log(token)
        const res = await Axios.get("http://localhost:8000/api/v1/user/find" , {
            params : {
                token , filter
            }
        })
        // console.log(res)
        if(!res){
            return null
        }
        return res.data.data
    }
    catch(err){
        return null
    }
}

const giveMoney = async (token , toId , value) => {
    try{
        const res = await Axios.post("http://localhost:8000/api/v1/account/transfer" , {
            token , toId , value
        })
        // console.log(res.message)
        if(!res)throw "Unable to Complete Transaction!"
        return true
    }
    catch(err){
        // console.log(err.data)
        return false;
    }
}


export {
    fetchUser , addUser , loginUser , fetchBalance , getUsers , giveMoney
}