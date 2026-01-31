import pool from '@/lib/db';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const {
            razorpayOrderId,
            razorpay_payment_id,
            razorpay_signature,

        } = await req.json();
        if (!razorpayOrderId || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ success: false, message: "Missing payment details" }, { status: 400 });
        }

        const body = razorpayOrderId + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_TEST_KEY_SECRET!).update(body).digest('hex')
        console.log(expectedSignature)

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({
                success: false,
                message: "Payment signature verification failed"
            },
                {
                    status: 400
                })
        }

        const orderRes = await pool.query(
            `SELECT id, user_id FROM orders WHERE razorpay_order_id = $1`, [razorpayOrderId]

        );
        if (orderRes.rowCount === 0) {
            return NextResponse.json({
                message: "order not found",
                success: false
            })
        }
        const userId = orderRes.rows[0].user_id;
        const orderId = orderRes.rows[0].id;

        const cartRes = await pool.query(
            `SELECT id from carts WHERE user_id = $1`, [userId]
        )

        if (cartRes.rowCount === 0) {
            return NextResponse.json({
                success: false,
                message: "No cart items found"
            })
        }
        const cartId = cartRes.rows[0].id;

        const cartItems = await pool.query(
            `SELECT product_name,price,quantity,size,image,product_id FROM cart_items WHERE cart_id = $1 `, [cartId]
        )

        for (const item of cartItems.rows) {
            await pool.query(
                `INSERT INTO order_items (order_id,product_id,quantity,price,size,product_image,product_name) VALUES($1,$2,$3,$4,$5,$6,$7)`, [orderId, item.product_id, item.quantity, item.price, item.size, item.image, item.product_name]
            )
        }

        await pool.query(
            `DELETE FROM cart_items WHERE cart_id=$1`, [cartId]
        );

        await pool.query(
            `UPDATE orders 
             SET payment_status = 'PAID',
             status='IN TRANSIT',
            razorpay_payment_id=$1
            WHERE id = $2`, [razorpay_payment_id, orderId]
        );
        return NextResponse.json({
            success: true,
            message: "payment verified and order placed successfully"
        })


    }
    catch (error) {
        console.error("Payment verification error", error)
        return NextResponse.json({
            success: false,
            message: "Server error during payment verification",

        }, { status: 500 })

    }
}