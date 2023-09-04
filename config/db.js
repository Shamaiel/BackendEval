const mongoose = require("mongoose")


require("dotenv").config()
const connection = mongoose.connect(process.env.MONGO_URL)
        
    module.exports = {
        connection
    }


//    const connection = mongoose.connect("mongodb://127.0.0.1:27017/ptweb13")