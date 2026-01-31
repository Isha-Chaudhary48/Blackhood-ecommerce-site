import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
    try {
        const auth = req.headers.get("authorization");
        if (auth != `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json(
                { message: "unauthorized" },
                { status: 401 }
            )

        }
        await pool.query(
            `UPDATE orders
             SET status = 'DELIVERED'
             WHERE delivery_date <= CURRENT_DATE
             AND status != 'DELIVERED'`
        );
        return NextResponse.json(
            {
                message: "order status updated"
            },
            { status: 200 }
        )

    }
    catch (error) {
        console.log('Cron job error', error)
        return NextResponse.json(
            {
                message: "Error in cron job order status"
            },
            {
                status: 500
            }
        )
    }
}