import { NextResponse } from "next/server";

export async function GET() {

  try{
     const res = await fetch(
    "https://fakestoreapiserver.reactbd.org/api/products/"
  );
  if(!res.ok)
  {
    return NextResponse.json({products:[]})
  }
  const data = await res.json();


  return NextResponse.json({ products: data.data });

  }
  catch(error)
  {
    console.log("Error in fetching data in api/productsPage",error)
  }
 
}
