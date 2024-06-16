import { useLocation, useNavigate } from "react-router-dom"
import { useRecoilValue } from "recoil"
import { TOKEN } from "../StateStore/UserAuth"
import { fetchBalance, getUsers, giveMoney } from "../AuthFunctions"
import {  useEffect, useState } from "react"

const Transfer =  ()=>{
    const {state} = useLocation()
    const token = useRecoilValue(TOKEN)
    const [balance , setBalance] = useState("Fetching..")
    const [reciever , setReceiver] = useState({
        firstName : "Fetching..." , 
        lastName : "Fetching...",
        userId : "Fetching"
    })
    const [doit , setDoit] = useState(false);
    const [amount , setAmount] = useState(0)
    const navigate = useNavigate()
    const getBalance = async () =>{
        try{
            const res = await fetchBalance(token)
            if(res === null)throw "DImd"
            return res
        }catch(err){
            console.log("Error While Fetching Balance!")
        }
    }
    const getReciever = async ()=>{
        try{
            const res = await getUsers(token ,state.toId)
            // console.log(res)
            if(res === null){
                throw "User Not Found"
            }
            return res[0]
        }
        catch(err){
            alert("Receiver Doesnot Exists!")
            navigate("/Home")
        }
    }
    useEffect(()=>{
        getBalance()
        .then((res) => setBalance(res)).catch((err) => alert("Unable to Fetch!"))
        getReciever().then(res => setReceiver(res)).catch(err => alert("Reciever Doesnot Exist"))
    } , [token , state])
    return <div display="flex w-screen justify-center align-center h-screen bg-blue-500">
       {!doit &&  <div className="max-w-md mx-auto h-screen  flex flex-col item-center justify-center">
            <div>
            <div className="font-mono font-bold text-red-500">Paying TO: </div>
            <SearchResult user = {reciever}/>
            <div className="flex justify-between px-8">
                <p className="font-mono font-black text-red-500">Amount : </p>
                <input type="number" className="p-1 w-50 border border-sky-300 text-green-500 outline-0 focus:outline-0 focus:border focus:border-red-800" value = {amount} onChange={(e)=>{
                    setAmount(e.target.value)
                }}/>
            </div>
            <div className="m-3 flex justify-center"> <button className="bg-blue-700 flex p-4 font-mono font-bold text-white rounded-2xl hover:text-green-500" onClick={()=>setDoit(true)}>Pay!</button></div>
            </div>
        </div>}
        {doit && <MakePayment toId = {reciever.userId} token = {token} value = {amount}/>}
    </div>
}
const SearchResult = ({user})=>{
    return <div className="bg-blue-700 my-3 p-2 rounded-2xl hover:cursor-pointer" >
        <div className="flex py-2 text-sm">
            <p className="mr-1 font-bold font-mono text-white">{user.firstName}</p>
            <p className="font-bold font-mono text-white">{user.lastName}</p>
        </div>
        <div className="flex justify-between">
            <p className="text-xs text-gray-400 font-mono">{user.userId}</p>

        </div>
    </div>
}

const MakePayment = ({toId , token , value})=>{
    const [processing , setProcessing] = useState(true)
    const navigate = useNavigate()
    useEffect(()=>{
        setTimeout(()=>{
            giveMoney(token , toId , value)
            .then((res)=>{
                if(res){
                    setProcessing(false)
                }
                else{
                    alert("Transfer May Have Failed!! Please Check Your Balance")
                    navigate("/Home")
                }
            }).catch((err)=>{
                alert("Error Occured While Making A transfer!")
                navigate("/Home")
            })
        },3000)
    } , [])
    return <div>
        {processing && <div><div className="font-mono font-bold flex justify-center">Sending {value} to {toId}</div>
        <div role="status">
    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
</div></div>}
        {!processing && <div className="flex  flex-col justify-center h-screen items-center">
                    <div className="font-mono font-bold text-center">Transfer SucessFull!</div>
                    <button onClick={()=>navigate("/Home")}>Go Back to Home page</button>
            </div>}
    </div>
}
export default Transfer