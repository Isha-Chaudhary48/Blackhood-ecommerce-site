"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ToggleFavourite from "@/app/components/ToggleFavourite"
import { FetchFavourites } from "@/app/hooks/FetchFavourites"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Loading from "../components/Loading";



type Product = {
  _id: number,
  title: string,
  isNew: boolean,
  price: number,
  discountedPrice: number,
  description: string,
  type: string,
  category: string,
  stock: number,
  brand: string,
  size: string[],
  image: string,
  rating: number,
  oldPrice: string,


}

export default  function Home() {
  const [products, setProducts] = useState<Product[]>([]);
   
   const { favourites, setFavourites, loading:favLoading } = FetchFavourites();
   const [loading, setLoading] = useState(true);
 
 
   useEffect(()=>{
      async function fetchProducts() {
      
       const res = await fetch(`/api/productPage/`);
       const data = await res.json();
       setProducts(data.products);
       setLoading(false);
 
 
 
     }
     fetchProducts();
   },[]);
   if(loading || favLoading )
   {
     return(<>
     <Loading/>
   </>)
   }
  
  console.log(products)
  return (<>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
      {products.map((product) => (
        <Link key={product._id} href={`Home/${product._id}`}>

          <Card className="group" key={product._id}>

            <CardContent>
              <div className="relative w-full h-64 flex justify-center ">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded"
                />
                <div className="absolute  bottom-0 text-center gap-1 bg-black w-full opacity-100 transition-opacity group-hover:opacity-0 ">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className="text-yellow-500">
                      {i < Math.floor(product.rating) ? "⭐" : "☆"}
                    </span>
                  ))}
                  <span className="ml-2 text-gray-500 text-sm">{product.rating.toFixed(1)}</span>
                </div>
              
                <div className=" absolute bottom-2 text-black opacity-0 group-hover:opacity-100 transition-opacity  transition rounded-lg p-2"><ToggleFavourite productId={product._id.toString()} favourites={favourites} setFavourites={setFavourites} />  </div>
              </div>
              
              
            </CardContent>
            <CardHeader>
              <CardTitle>{product.title} </CardTitle>
              <span className="text-gray-500 text-lg"> {product.brand}  {product.isNew && <Badge variant="outline">New</Badge>}</span>
             
              <p className="mt-2 text-lg font-semibold">Rs. {product.price * 10}  <span className="text-gray-500 line-through text-sm ml-2">Rs. {product.oldPrice}</span> <span className="text-sm text-orange-600">({product.discountedPrice/10}%)</span></p>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  </>)
}