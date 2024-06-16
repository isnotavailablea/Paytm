import { useRecoilValue} from 'recoil';
import {  Routes , Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Components/Home.jsx';
import EntryPoint from './Components/EntryPoint.jsx';
import { LOGGEDIN , TOKEN , USERDETAILS } from './StateStore/UserAuth.js';
import { fetchUser} from "./AuthFunctions"
import { useRecoilState } from "recoil";
import {useNavigate} from "react-router-dom"
import Transfer from "./Components/Transfer.jsx"
function App() {
  const token = useRecoilValue(TOKEN)
    const [userDetails , setUserDetails] = useRecoilState(USERDETAILS)
    const [loggedin , setLoggedin] = useRecoilState(LOGGEDIN)
    const navigate = useNavigate("/")
    useEffect(() =>{
        const getUser = fetchUser(token)
                        .then((res) => {
                            // console.log(res)
                            if(!res)throw "Null Value"
                            setUserDetails(res)
                            setLoggedin(true)
                            navigate("/Home")
                        })
                        .catch((err) =>{
                            // console.log(err.message)
                            navigate("")
                            console.log("Error While Fetching...")
                        })
    } , [token])
  return ( 
    <>
    <Routes>
        <Route path = "/" element = {<EntryPoint/>}/>
        <Route path="/Home" element = {<Home/>}/>
        <Route path="/Transfer" element={<Transfer/>}/>
      </Routes>
    </>
  )
}

export default App
