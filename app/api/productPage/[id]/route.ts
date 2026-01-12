import { NextResponse } from "next/server";

export  async function GET(req: Request,{params}:{params:Promise<{id:string}>})
{
    try{
         
    const {id} = await params
    console.log(id)
    if(!id)
        {
            return NextResponse.json({
                product: null,
            });
        }
        const res = await fetch(`https://fakestoreapiserver.reactbd.org/api/products/${id}`)
        const data = await res.json();
        console.log("fetched data by id",data)
        return NextResponse.json({
            product: data,
        })

    }
    catch(error)
    {
        console.log("Error in fetching product by id",error);
        return NextResponse.json({
            product: null
        })
    }
   
        
}