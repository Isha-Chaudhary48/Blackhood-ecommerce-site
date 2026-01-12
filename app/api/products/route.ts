
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try{
        const { searchParams } = new URL(req.url);
    const ids = searchParams.get("ids")?.split(",");

    if (!ids || ids.length === 0) {
        return NextResponse.json({ products: [] });
    }

    const res = await fetch(`https://fakestoreapiserver.reactbd.org/api/products/`);
    const result= await res.json();
    console.log("fetched result",result)
    console.log(result.data)

    const filteredProducts = result.data.filter((p: any) => ids.includes(p._id.toString()));
    return NextResponse.json(
        {
            products: filteredProducts
        }
    );

    }
    catch(error)
    {
        console.log("Error in fetching products by ids",error)
    }
    
}