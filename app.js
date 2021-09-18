require('dotenv').config();

const mongoose = require("mongoose")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const userRoutes = require("./routes/user")
const authRoutes = require("./routes/auth")
const rescollectionRoutes = require("./routes/rescollection")

mongoose.connect("mongodb+srv://somnathmishra:somnathmishra@cluster0.7qwn4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
   }).then(() => {
           console.log("DB CONNECTED")
   }).catch(() => {
       console.log("DB NOT CONNECTED");
   })

//Middlewares
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//My Routes
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", rescollectionRoutes)


//dot env see docs for more explaination
const port = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log(`app is running at ${port}`)
})