import pool from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
export  async function POST(req: Request) {

    try {
        const { email, password } = await req.json();
        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (userResult.rows.length === 0) {
            return NextResponse.json(
                { error: "User does not exist please Sign up " },
                { status: 400 }
            );
        }
        const user = userResult.rows[0];

        const isPasswordCorrect = await bcrypt.compare(
            password, user.password
        );
        if (!isPasswordCorrect) {
            return NextResponse.json({
                error: " Invalid email or password"
            },
                { status: 401 })
        }

        return NextResponse.json(
            {
                success: true,
                
            },
            {status: 200}
        )
    } 
    catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                error: "Internal server error"
            }
            ,{
                status: 500
            }
        );

    }
}
