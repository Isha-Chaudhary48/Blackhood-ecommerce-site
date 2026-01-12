import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAuthUser } from "@/lib/auth"

export async function GET(req: Request) {
    try {
      
        const user = await getAuthUser();
        const user_id = user?.userId;
       
        if (!user_id) {
            return NextResponse.json({
                success: false, message: " user id is required"
            }, { status: 401 })
        }
        const result = await pool.query(
            `SELECT product_id FROM favourites WHERE user_id = $1`, [user_id]
        );
        

        const favourites = result.rows.map(row => row.product_id)
       
        return NextResponse.json({
            success: true,
            favourites
        }, { status: 200 });

    }
    catch (error) {
        console.log("Error in fetching favourites", error)
        return NextResponse.json({
            success: false,
            message: " failed to fetch favourites"
        }, { status: 500 })
    }

}


export async function POST(req: Request) {
    try {
         
       const user = await getAuthUser();
        const user_id = user?.userId;
        if (!user_id) {
            return NextResponse.json({
                success: false, message: " Login first"
            }, { status: 401 })
        }
       
        const { product_id } = await req.json();
        const existingUser = await pool.query(
            `SELECT id FROM favourites WHERE user_id = $1 AND product_id = $2`, [user_id, product_id]
        );
        

        if (existingUser.rows.length > 0) {
            await pool.query(
                `DELETE FROM favourites WHERE user_id = $1 AND product_id = $2`, [user_id, product_id]
            );
            return NextResponse.json(
                { success: true, message: " Removed from favourite" },
                { status: 200 }
            )
        }

        await pool.query(
            `INSERT INTO favourites (user_id, product_id)
            VALUES($1,$2)
            ON CONFLICT (user_id,product_id) DO NOTHING`,
            [user_id, product_id]
        );
    
        return NextResponse.json(
            {
                success: true,
                message: " Added to favourites"
            },
            {
                status: 200
            }
        )

    }
    catch (error) {
        console.log("Error in adding favourites", error);
        return NextResponse.json(
            { success: false, message: "Failed to add favourite" },
            { status: 500 }
        )
    }
}