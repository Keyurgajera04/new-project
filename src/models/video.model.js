import mongoose, {Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema(
    {
        videoFile:{
            type:string, //cloudinary
            require:true
        },
        thumbnail:{
            type:string, //cloudinary
            require:true
        },
        title:{
            type:string, 
            require:true
        },
        discription:{
            type:string,
            require:true
        },
        duretion:{
            type:number,
            require:true
        },
        views:{
            type:number,
            require:true
        },
        isPublished:{
            type:Boolean,
            require:true
        },
        owner:{
            type:mongoose.Schema.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true
    })

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)