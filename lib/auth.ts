import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

type JwtPayload={
    userId : number;
    email: string;
};
export  async function getAuthUser() : Promise<JwtPayload | null>
{
    const cookie = await cookies();
    const token = cookie.get("token")?.value;

    if(!token)
    {
        return null;
    }
    
    try{
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as JwtPayload;
        return decoded;
    }
    catch (err) {
    console.log("JWT verification failed:", err);
    return null;
}

}