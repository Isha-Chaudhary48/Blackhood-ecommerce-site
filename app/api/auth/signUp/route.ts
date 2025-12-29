import pool from "@/lib/db"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server";

export async function POST(req : Request)
{
    try{
        const {name,email,password} = await req.json();
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        )
        if(existingUser.rows.length > 0)
        {
            return NextResponse.json({error:'user already exists please signIn'},{status: 400})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await pool.query(
            "INSERT INTO users(name,email,password) VALUES($1,$2,$3)",[name,email,hashedPassword]
        );


        return NextResponse.json({success:true},{status:201});
    }
    catch(err)
    {
        console.log(err);
        return NextResponse.json({err: "Internal server error"},{status: 500});
    }
}