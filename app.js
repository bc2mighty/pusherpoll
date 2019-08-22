
if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config({path: __dirname + '/.env'})
}
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const cors = require("cors")

//DB Config
// require("./config/db")

const mongoose = require("mongoose")

const app = express()

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})

const db = mongoose.connection

db.on("error", error => {
    console.log("Error connecting to db", error)
})

db.once("open",() => {
    console.log("Connected to DB");
})

const poll = require("./routes/poll")

app.use(express.static(path.join(__dirname, "public")))

app.use(bodyParser.json({"limit":"5mb"}))
app.use(bodyParser.urlencoded({extended: false}))

app.use(cors())

app.use("/poll",poll)

const port = 3000

app.listen(port, () => console.log(`Server started on port ${port}`))
