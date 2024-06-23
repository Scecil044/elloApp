const mongoose = require("mongoose")

const connectDb = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo connection successful".cyan.red)
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDb