import mongoose, { model } from "mongoose";

const user= new mongoose.Schema(
    {
        username:{
            type:String,
            require:true
        },
        email:{
            type:String,
            unique:true,
            require:true
        },
        Password:{
            type:String,
            require:true
        },
        image:{
            type:String,
            default:""
        },
         name:{                 
        type:String,
        default:""
    },
    },
    {timestamps:true}
)
const userModel = mongoose.model("Users", user);
export default userModel;