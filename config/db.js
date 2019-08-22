if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config({path: __dirname + '/.env'})
}

const mongoose = require("mongoose")

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

module.exports = db
