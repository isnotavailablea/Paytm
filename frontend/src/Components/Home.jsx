import { useRecoilValue, useSetRecoilState } from "recoil"
import { TOKEN, USERDETAILS } from "../StateStore/UserAuth"
import { useEffect, useState } from "react"
import { fetchBalance, getUsers } from "../AuthFunctions"
import {useNavigate} from "react-router-dom"
const Home = () => {
    return <div>
        <Header/>
        <Card/>
        <SearchUser/>
    </div>
}
const Header = () =>{
    const setToken = useSetRecoilState(TOKEN)
    return <div className="flex justify-between bg-blue-500 p-3">
        <p className="font-mono font-extrabold text-white">Paytm Clone!</p>
        <button className="font-sans font-medium text-white hover:text-red-500" onClick={()=>{
            localStorage.setItem("token" , null);
            setToken(null)
        }}>Logout</button>
    </div>
}
const Card = ()=>{
    const userDetails = useRecoilValue(USERDETAILS)
    const [balance , setBalance] = useState("Fetching...");
    const token = useRecoilValue(TOKEN)
    useEffect(()=>{
        setTimeout(async ()=>{
            try{
                const res = await fetchBalance(token)
                if(!res)throw "Not Good"
                setBalance(res)
            }
            catch(err){
                alert("Unable to Fetch Balance")
            }
        } ,  2000)
    } , [])
    return <div className="flex justify-center">
        <div className="p-5 m-2 bg-sky-900 rounded-2xl">
        <div className="flex m-5">
        <p className="mr-3 font-mono font-black text-white">{userDetails.firstName}</p>        
        <p className="ml-3 font-mono font-black text-white"> {userDetails.lastName}</p>
        </div>
        <div className="font-mono font-bold text-white flex justify-around">Balance: <p className="text-green-500 font-medium ">{balance}</p></div>
        </div>
    </div>
}

const SearchUser = ()=>{
    const [filter , setFilter] = useState("")
    const [searchedUsers , setSearchedUsers] = useState([])
    const token = useRecoilValue(TOKEN)
    const getUrs = async () => {
        try{
            const res = await getUsers(token , filter)
            if(res === null )throw "No Such Users"
            // console.log(res)
            setSearchedUsers(res)
        }catch(err){
            // console.log(err)
            setSearchedUsers([])
        }
    }
    
    return <div className="max-w-md mx-auto">
        {/* <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only ">Search</label> */}
        <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 "  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor"  strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="search"  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 outline-0" placeholder="Search Users..." onChange={(e)=>{
                setFilter(e.target.value)
            }}/>
            <button  className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 " onClick={getUrs}>Search</button>
        </div>
        <ul className="relative">
            {searchedUsers && searchedUsers.map((el)=>{
                return <li key = {el._id}>
                    <SearchResult user = {el}/>
                </li>
            })}

        </ul>
    </div>
}

const SearchResult = ({user})=>{
    const navigate = useNavigate()
    return <div className="bg-blue-700 my-3 p-2 rounded-2xl hover:cursor-pointer" onClick={()=>{
        navigate("/Transfer" , {state : {
            toId : user.userId
        }})
    }
    }>
        <div className="flex py-2 text-sm">
            <p className="mr-1 font-bold font-mono text-white">{user.firstName}</p>
            <p className="font-bold font-mono text-white">{user.lastName}</p>
        </div>
        <div className="flex justify-between">
            <p className="text-xs text-gray-400 font-mono">{user.userId}</p>
            <button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white ">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            </button>

        </div>
    </div>
}
export default Home