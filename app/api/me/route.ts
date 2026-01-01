import { getAuthUser } from "@/lib/auth";
import pool from "@/lib/db";

export  async function GET(req: Request)
{
    const user =  await getAuthUser();

    if(!user)
    {
        return new Response('Not logged in', {status : 401})
    }
    const result = await pool.query(

        'SELECT id, email FROM users WHERE id = $1',[user.userId]


    )
    return Response.json(result.rows[0]);

}