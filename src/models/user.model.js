import mongoose, {Schema} from "mongoose"
import jsonwebtoken from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username:{
            type:String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            require:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type:String,
            require:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String, //cloudinary
            require:true
        },
        coverImage:{
            type:String, //cloudinary
        },
        watchHistory:[
            {
            type:mongoose.Schema.ObjectId,
            ref:"Video"
            }
        ],
        password:{
            type:String,
            require:[true, 'Password is required']
        },
        refreshToken:{
            type:String,
        }
    },
    {
        timestamps:true
    });

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function
(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.method.genereteAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiryIN:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.method.genereteRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiryIN:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema);