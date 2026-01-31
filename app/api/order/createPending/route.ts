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
        if (!totalAmount || totalAmount <= 0) {
            return NextResponse.json({ message: "Invalid total amount" }, { status: 400 });
        }
        console.log(totalAmount)
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
            `INSERT INTO orders (user_id,total_amount,payment_status,payment_method,delivery_date,status) VALUES($1,$2,'PENDING','RAZORPAY',$3,'PROCESSING') RETURNING id`, [user_id, totalAmount, deliveryDate]
        )
        if (!res) {
            console.log("failed")
        }

        const internalOrderId = res.rows[0].id.toString();
        console.log("order id", internalOrderId);

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: 'INR',
            receipt: "receipt_" + internalOrderId.slice(0, 20)
        })
        console.log("razorpay order", razorpayOrder)
        if (!razorpayOrder) {
            console.log("Not found razorpayorder", razorpayOrder);
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
        console.log("error in create pending", error)

        return NextResponse.json(
            {
                message: " Error at createPending",
            },
            { status: 500 }
        )
    }


}
export async function GET(req: Request) {
    try {
        const user = await getAuthUser();
        const user_id = user?.userId;
        if (!user_id) {
            return NextResponse.json(
                {
                    message: "someting went wrong with authorization"
                },
                { status: 401 }
            )
        }
        const ordersRes = await pool.query(
            `SELECT 
       o.id AS order_id ,
       o.order_date,
       o.delivery_date,
       o.status ,
       o.payment_status,
       
       oi.id AS order_item_id,
       oi.product_id,
       oi.quantity,
       oi.size,
       oi.product_image,
       oi.price,
       oi.product_name,
       oi.created_at
       FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.status IN ('IN TRANSIT','DELIVERED') AND o.user_id = $1
       ORDER BY o.created_at DESC
       
       `, [user_id]
        )
        console.log("orders", ordersRes)
        if (ordersRes.rowCount === 0) {
            return NextResponse.json([])
        }
        return NextResponse.json(ordersRes.rows);
    }
    catch (error) {
        console.log("error to get orders", error);
        return NextResponse.json({
            message: "server error in getting orders from db"
        })
    }
}
