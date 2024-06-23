const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema(
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      profilePicture: { type: String, default:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png" },
      phone: { type: String, required: true },
      password: { type: String, required: true },
      isDeleted: { type: Boolean, default: false },
      role:{type:mongoose.Types.ObjectId, ref:"Role"},
    },
    { timestamps: true }
  );


UserSchema.methods.comparePassword = async function(userPass){
    return await bcrypt.compare(userPass, this.password)
}

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
       return next()
    }
    try {
        if(!this.password){
            throw new Error("password is undefined")
        }
        const hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
        next()
    } catch (error) {
       next(error)
    }
})

module.exports = mongoose.model("User", UserSchema)