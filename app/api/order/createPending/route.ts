import { NextResponse } from "next/server";
import pool from "@/lib/db"
import { getAuthUser } from "@/lib/auth";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_TEST_KEY_SECRET!,
})

export async function POST(req: Request) {
    try {

        const { totalAmount } = await req.json();
        const user = await getAuthUser();
        const user_id = user?.userId;
        console.log(user_id)
        if (!user_id) {
            return NextResponse.json({
                message: " user id  required"
            }, { status: 401 })

        }
        const deliveryDate = new Date();
deliveryDate.setDate(deliveryDate.getDate() + 5);

        const res = await pool.query(
            `INSERT INTO orders (user_id,total_amount,payment_status,payment_method,delivery_date,status) VALUES($1,$2,'PENDING','RAZORPAY',$3,'PROCESSING') RETURNING id`, [user_id, totalAmount,deliveryDate]
        )
        if(!res)
        {
            console.log("failed")
        }
        
        const internalOrderId = res.rows[0].id;
        console.log(internalOrderId)

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: 'INR',
            receipt: "receipt_" +  internalOrderId.slice(0, 20)
        })
        if(!razorpayOrder)
        {
            console.log(razorpayOrder);
            return;
        }

        await pool.query(
            `UPDATE orders SET razorpay_order_id = $1 WHERE id = $2`, [razorpayOrder.id, internalOrderId]
        )

        return NextResponse.json({
            internalOrderId,
            razorpay_order_id: razorpayOrder.id,
            amount: totalAmount
        })



    }
    catch (error) {
        console.log("error in create pending",error)

        return NextResponse.json(
            {
                message: " Error at createPending",
            },
            { status: 500 }
        )
    }


}
export async function GET(req:Request)
{
    try{
        const user = await getAuthUser();
        const user_id = user?.userId;
        if(!user_id)
        {
            return NextResponse.json(
                {
                    message:"someting went wrong with authorization"
                },
                {status: 401}
            )
        }
        const ordersRes = await pool.query(
            `SELECT * FROM orders WHERE user_id = $1 RETURNING id`,[user_id]
        )  
        if(ordersRes.rowCount ===0)
            {
                return NextResponse.json({
                    message:"NO ORDER FOUND"
                })
            }
            return NextResponse.json(ordersRes.rows);   
    }
    catch(error)
    {
        console.log("error to get orders",error);
        return NextResponse.json({
            message:"server error in getting orders from db"
        })
    }
}
