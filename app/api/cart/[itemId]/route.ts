import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    {params}: {params: Promise<{itemId:string}>}
)
{
    try{
       const {itemId} = await params;
    await pool.query(
        'DELETE FROM cart_items WHERE id = $1',[itemId]
    );
    return NextResponse.json({
        message : "item Deleted"
    })
    }
    catch(error)
    {
        return NextResponse.json({
            message : "Error in cart delete file"

        })
    }
}

export async function PUT(
    req:Request,
    {params}: {params: Promise<{itemId:string}>}
    
)
{
    try{
        const {itemId} = await params;
        const {quantity} = await req.json();

        if(quantity === 0)
        {
            await pool.query("DELETE FROM cart_items WHERE id = $1",[itemId]);
            return NextResponse.json({
                message: "Item deleted "
            });
        }
        await pool.query("UPDATE cart_items SET quantity = $1 WHERE id = $2",[quantity,itemId]);
        return NextResponse.json({
            message : "Quantity updated"
        })



    }
     catch(error)
    {
        return NextResponse.json({
            message : "Error in cart update  file"

        })
    }
}