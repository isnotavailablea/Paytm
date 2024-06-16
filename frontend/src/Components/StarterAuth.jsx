import { useEffect, useState } from "react"
import {addUser , loginUser , fetchUser} from "../AuthFunctions"
import { useRecoilState } from "recoil";
import {useNavigate} from "react-router-dom"
import {TOKEN , USERDETAILS} from "../StateStore/UserAuth"
const StarterAuth = ()=>{
    const [checkStatus , setCheckStatus] = useState(0);
    const [token , setToken] = useRecoilState(TOKEN)
    const [userDetails , setUserDetails] = useRecoilState(USERDETAILS)
    const navigate = useNavigate()
    useEffect(() =>{
        const getUser = fetchUser(token)
                        .then((res) => {
                            // console.log(res)
                            setUserDetails(res)
                            setCheckStatus(true);
                            navigate("/Home")
                        })
                        .catch((err) =>{
                            console.log(err.message)
                            // console.log("Error While Fetching...")
                        })
    } , [])
    return <div>
        starterAuthPe
    </div>
}

export default StarterAuth