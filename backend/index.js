const express = require("express")
const cors = require("cors")
const rootRouter = require("./routes/index")
const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/v1" , rootRouter)
app.get("/hello" , (req , res) => {
    res.json({
        data : "Hello"
    })
})
app.listen(8000 , ()=>{
    console.log("Server Active On Port 8000")
})