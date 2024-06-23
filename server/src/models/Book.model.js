const mongoose = require("mongoose")


const BookSchema = new mongoose.Schema({
    title:{type:String},
    readingLevel:{type:String, enum:["beginner", "intermediate", "advanced"]},
    author:{type:String, required:true},
    coverPhotoURL:{type:String},
    assignedUsers:[{type:mongoose.Types.ObjectId, ref:"User"}],
    isDeleted:{type:Boolean, default:false}

},{timestamps:true})

module.exports = mongoose.model("Book", BookSchema)