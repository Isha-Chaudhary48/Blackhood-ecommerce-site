"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ToggleFavourite from "@/app/components/ToggleFavourite"
import { FetchFavourites } from "@/app/hooks/FetchFavourites"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loading from "@/app/components/Loading";


type Product = {
  _id: number,
  title: string,
  description: string,
  image: string,
  price: number,
  stock: number,
  brand: string,
  category: string,
  isNew: boolean,
  size: string[],
  rating: number,
  oldPrice: string,
  discountedPrice: number

}


export default function productPage() {
  const params = useParams();
  const productId = params?.id;
  console.log(productId)
  const [product, setProduct] = useState<Product | null>(null);

  const { favourites, setFavourites, loading: favLoading } = FetchFavourites();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchProducts() {
      if (!productId) {
        return;
      }
      const res = await fetch(`/api/productPage/${productId}`);
      const data = await res.json();
      setProduct(data.product);
      setLoading(false);



    }
    fetchProducts();
  }, [productId]);
  if (loading || favLoading) {
    return (<>
     <Loading/></>)
  }

  return (<>
    <div className="flex justify-center items-center w-full p-4">

      <Card className="h-auto w-full max-w-4xl">

        <CardContent className="md:grid md:grid-cols-2 gap-8">
          {product?.image && (
            <div className="relative w-full h-[60vh] ">
              <Image
                src={product?.image}
                alt={product?.title}
                fill

                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

            </div>
          )}

          <div><CardHeader className="flex justify-center mt-4 items-center">
            <CardTitle className="font-bold text-3xl">{product?.title}</CardTitle>
            {product?.isNew && <Badge variant="destructive">New</Badge>}
          </CardHeader>
            <p className="mt-4 text-2xl font-bold">
              ${product?.price}
              <span className="text-gray-500 line-through text-sm ml-2">${product?.oldPrice}</span>
              <span className="text-sm text-orange-600">
                ({product ? Math.round((Number(product.oldPrice) - product.discountedPrice) / Number(product.oldPrice) * 100) : 0}% off)
              </span>
            </p>
            <p className="mt-2 text-gray-600 text-xl">{product?.description}</p>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-lg">Size:</span>
              {

                product?.size.map((s) => (
                  <div key={s} className="flex gap-2 flex-col"><button className="h-8 w-8 rounded-full border-2 border-black 
                 flex items-center justify-center text-sm hover:bg-red-600 hover:text-white
                 " >   {s}</button></div>
                ))
              }
            </div>

            <p className="mt-2 text-gray-500 text-lg">Brand: {product?.brand}</p>
            <p className="mt-2 text-gray-500 text-lg">Category: {product?.category}</p>
            <p className="mt-2 text-gray-500 text-lg">Stock: {product?.stock}</p>
            <p className="mt-2 text-gray-500 text-lg">Rating: {product?.rating}</p>
            
              
              <div className="ml-5 flex gap-4 mt-4">
                
                <ToggleFavourite productId={product?._id.toString() || ""} favourites={favourites} setFavourites={setFavourites} />
                <Button>Add to Bag</Button>
              </div>
            </div>
        </CardContent>






      </Card>

    </div>

  </>)

}