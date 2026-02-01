"use client"
import { useState, useEffect } from "react"
import { FetchFavourites } from "../hooks/FetchFavourites"
import { CardContent, Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import ToggleFavourite from "../components/ToggleFavourite";
import Loading from "../components/Loading";
import { Button } from '@/components/ui/button'
import { useRouter } from "next/navigation";

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

};

export default function FavouritePage() {
  const router = useRouter();
  const { favourites, setFavourites, loading: favLoading } = FetchFavourites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function fetchProducts() {
      if (favourites.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/products?ids=${favourites.join(",")}`)
      const data = await res.json();
      setProducts(data.products || []);
      setLoading(false)
    }
    fetchProducts();
  }, [favourites])

  function handleShopNow() {
    router.push('/Home')
  }





  if (loading || favLoading) {
    return (<>

      <Loading />
    </>)
  }

  return (<>

    <div>
      {favourites.length === 0 ? (
        <div className="h-[50vh] flex flex-col justify-center items-center text-center">
          <p className="font-semibold text-2xl sm:text-lg">No favorites yet.</p>
          <p> Tap ❤️ on products you love to add them here.</p>
          <Button className="mt-3" onClick={handleShopNow}>Shop Now</Button>
        </div>

      ) : (
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

                    <div className=" absolute bottom-2 text-black  opacity-0 group-hover:opacity-100 transition-opacity  transition rounded-lg p-2"> <ToggleFavourite productId={product._id.toString()} favourites={favourites} setFavourites={setFavourites} />  </div>
                  </div>


                </CardContent>
                <CardHeader>
                  <CardTitle>{product?.title} </CardTitle>
                  <span className="text-gray-500 text-lg"> {product?.brand}  </span>

                  <p className="mt-2 text-lg font-semibold">Rs. {product?.price * 10}   <span className="text-gray-500 line-through text-sm ml-2">Rs.{product?.oldPrice}</span> <span className="text-sm text-orange-600">({product?.discountedPrice / 10}%)</span></p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )
      }
    </div>

  </>)
}
