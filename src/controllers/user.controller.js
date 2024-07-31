import { asyncHandler } from "../utils/aysncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler ( async (req,res) => {
    //get user details from frontend -> postman
    //validation -not empty
    //check user is already exist (username,email)
    //check for image,check from avatar
    //upload them cloudinary, avatar
    //create user object - create entry in db
    //remove password and refreshToken field
    //check for user creation
    //retuen response

    //get user details from frontend -> postman
    const {fullname,email,username,password} =req.body
    console.log("fullname:",fullname)
    console.log("email:",email)
    console.log("username:",username)
    console.log("password:",password)

    //validation -not empty  
    if([fullname,email,username,password].some((field) => field?.trim() === ""))
        {
        throw new ApiErrors(400, "All field are required")
        console.log("Error")
    }

    //check user is already exist (username,email)
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiErrors(409,"User with email or username already exists")
    }

    //check for image,check from avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new ApiErrors(400, "Avatar file is required")
    }

    //upload them cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiErrors(400, "Avatar file is required.Avatar is not uplode in cloudinary")
    }

    //create user object - create entry in db
    const user = await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    //remove password and refreshToken field
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    //check for user creation
    if(!createdUser){
        throw new ApiErrors(500, "Something went wrong while registring the user")
    }  
    
    //retuen response
    return res.status(200).json(
        new ApiResponse(200, createdUser, "User registration successfully")
    )

})

export{
    registerUser
}