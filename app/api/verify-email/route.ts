import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request)
{
    try{
         const { searchParams} = new URL(req.url);
    const token = searchParams.get("token");

    if(!token)
    {
        return NextResponse.json(
            {
                message:"Invalid token"
            },
            { status: 400},
        )
    }
    const res = await pool.query(
        `SELECT * FROM users WHERE verification_token = $1`,[token]
    );
    if(res.rows.length === 0)
    {
        return NextResponse.json(
            {message: "Invalid token or token expired"},
            {status: 400},
        );
    }
    const user = res.rows[0];
    if(user.is_verified)
    {
        return NextResponse.json({message:"Email alredy verified"});
    }

    await pool.query(
        `UPDATE users
        SET  is_verified = true,
        verification_token = NULL
        WHERE verification_token= $1`,[token]
    );
    return NextResponse.json(
        {
            message: "Email verified successfully"
        }
    )


    }
    catch(error)
    {
        return NextResponse.json({
            message: `Error in email verification ${error}`
        })
    }
   
}