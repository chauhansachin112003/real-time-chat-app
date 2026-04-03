import mongoose from "mongoose";

const conversationschema=mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users"
        }
    ],
    message:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message"
        }
    ]
},{timestamps:true})
const Conversation=mongoose.model("Conversation",conversationschema)
export default Conversation