import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAuthUser } from "@/lib/auth";


export async function POST(req: Request) {
    const client = await pool.connect();
    try {

        const user = await getAuthUser();
        const user_id = user?.userId;
        if (!user_id) {
            return NextResponse.json(
                {
                    message: "Unauthorized"
                },
                { status: 401 }
            )

        }

        const { product_id, size, quantity } = await req.json();
        if (!product_id || !size || !quantity) {
            return NextResponse.json({
                message: " Missing fields"
            },
                {
                    status: 400,
                }
            )
        }
        await client.query('BEGIN');

        const existingUser = await client.query(
            'SELECT * FROM cart_items WHERE product_id = $1 AND size = $2',
            [product_id, size]
        );
        if (existingUser.rows.length > 0) {
            return NextResponse.json(

                { message: "Product Already added in the cart" },
                { status: 400 },

            )
        }

        let res = await client.query("SELECT id FROM carts WHERE user_id = $1", [user_id])
        let cart_id: string;
        if (res.rows.length > 0) {
            cart_id = res.rows[0].id;

        }
        else {
            res = await client.query("INSERT INTO carts(user_id) VALUES($1) RETURNING id",
                [user_id]
            );
            cart_id = res.rows[0].id;
        }

        const productRes = await fetch(`https://blackhood-liart.vercel.app/api/productPage/${product_id}`)
        const product = await productRes.json();
        console.log("product ", product.product.price)
        console.log(cart_id);
        console.log(product_id)
        console.log(product.product.title);
        console.log(quantity)
        console.log(size);
        console.log(product.product.price)
        console.log(product.image)

        await client.query(
            "INSERT INTO cart_items(cart_id,product_id,product_name,price ,quantity,size,image) VALUES($1,$2,$3,$4,$5,$6,$7)",
            [cart_id, product_id, product.product.title, product.product.price * 10, quantity, size, product.product.image]
        )
        await client.query("COMMIT");


        return NextResponse.json({
            message: " successfully added to a cart",


        })


    }
    catch (error) {
        console.error("Error in backend cart route:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );

    }

}

export async function GET(req: Request) {
    try {
        const user = await getAuthUser();
        const user_id = user?.userId;
        if (!user_id) {
            return NextResponse.json(
                {
                    message: "Unauthorized"
                },
                { status: 401 }
            )
        }
        const res = await pool.query(
            `SELECT 
            cart_items.id,
            cart_items.product_id,
            cart_items.product_name,
            cart_items.price,
            cart_items.size,
            cart_items.quantity ,
            cart_items.image
            FROM cart_items
            JOIN carts
             ON carts.id = cart_items.cart_id
             WHERE carts.user_id = $1
            `, [user_id]
        );
        return NextResponse.json(res.rows);

    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error in cart api page" }, { status: 500 });
    }
}