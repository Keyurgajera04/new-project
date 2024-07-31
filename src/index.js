import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js"


dotenv.config(
    {
        path: './.env'
    }
)

const port = process.env.PORT || 8000;
connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`server is running at port: ${port}`);
    })
})
.catch((error)=>{
    console.log("mongoDB connection failed !!!",error);
})
