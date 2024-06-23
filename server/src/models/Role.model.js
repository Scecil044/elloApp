const mongoose = require("mongoose")


const RoleSchema = new mongoose.Schema({
    roleName:{type:String,unique:true, enum:["isAdmin","isTeacher","isStudent"]},
    roleId:{type:Number, unique:true, enum:[1,2,3]},
    isDeleted:{type:Boolean, default:false}
},{timestamps:true})

RoleSchema.pre("save", async function(next){
    switch(this.roleName){
        case "isAdmin":
            this.roleId =1;
            break;
        case "isTeacher":
            this.roleId =2;
            break;
        case "isStudent":
            this.roleId =3;
            break;
        default:
            return next(new Error("Invalid rolename"))

    }
})
module.exports = mongoose.model("Role", RoleSchema)