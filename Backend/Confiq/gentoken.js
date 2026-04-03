import jwt from "jsonwebtoken"
export const genToken=async (userId)=>
{
    try {
        const token=await jwt.sign({userId},process.env.SECRET_KEY,
        {expiresIn:"7d"} )
     return token;
    } catch (error) {
        console.log("Gentoken Error");
        
    }
}