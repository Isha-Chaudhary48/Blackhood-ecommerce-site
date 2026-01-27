"use client"
import { useEffect, useState } from "react"
import Loading from "../components/Loading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { loadRazorpay, openRazorpay } from "@/lib/razorpayClient";

export default function YourCart() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchCartItems = async () => {

      try {
        const res = await fetch('/api/cart',
          {
            method: "GET",
            credentials: "include"
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data from the backend ")
        }
        const data = await res.json();
        setCartItems(data || []);
        setLoading(false);


      }
      catch (error) {
        console.log("cart fetch error", error);
      }
      finally {
        setLoading(false);
      }

    }
    fetchCartItems();
  }

    , []);

  const updateQuantity = async (itemId: string, newQty: number) => {

    if (newQty === 0) {
      deleteItem(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));

    await fetch(`/api/cart/${itemId}`,
      {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quantity: newQty
        }),
        credentials: "include"
      }
    )



  };

  const deleteItem = async (itemId: string) => {

    const res = await fetch(`/api/cart/${itemId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Failed to delete item");
    }
    console.log(itemId);

    setCartItems(prev => prev.filter(item => item.id !== itemId));


  }



  if (loading) {
    return (<>
      <Loading /></>)
  }
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const handlePayment = async () => {

    try {

      const pendingPaymentRes = await fetch('/api/order/createPending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalAmount: totalPrice })

      });


      const data = await pendingPaymentRes.json();
      const loaded = await loadRazorpay();
      if (!loaded) {
        alert("Razorpay failed to load");
        return;
      }
      console.log(data)
      openRazorpay({

        orderId: data.internalOrderId,
        razorpay_order_id: data.razorpay_order_id,
        amount: data.amount



      });
    }
    catch (error) {
      console.error("Checkout error", error);

    }

  }
  return (<>

    {cartItems.length === 0 ? (
      <div className="h-[50vh] flex flex-col justify-center items-center text-center">
        <p className="font-semibold text-2xl">Hey, it feels so light! 🥺</p>
        <p>There is nothing in your cart. Let's add some items</p>
      </div>
    ) : (
      <>
        <div className="sm:w-[65%] md:w-[50%] sm:p-4 mx-auto space-y-4 p-4 ">
          {cartItems.map((item) => (

            <Card key={item.id} className=" rounded-lg mt-4 ">
              <button onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteItem(item.id);
              }} className=" relative top-2   left-[40%] text-grey-400 text-xl">X</button>



              <Link

                href={`/Home/${item.product_id}`}
                className=" flex justify-center items-center  gap-8   "

              >



                <div className=" ">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.product_name}

                      width={200}
                      height={200}
                      className="object-cover rounded-lg"
                    />
                  )}
                </div>




                <div className="p-8">
                  <CardTitle className="text-xl font-bold">{item.product_name}</CardTitle>

                  <span className="text-gray-500 text-lg">
                    {item.brand} {item.isNew && <Badge variant="outline">New</Badge>}
                  </span>
                  <div className="font-semibold mt-2 flex  md:flex gap-2  ">
                    <span className="mt-3">Size: {item.size}</span>
                    <p style={{ backgroundColor: "orange" }} className="border border-2  flex justify-center  rounded-lg  ">
                      <button onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity - 1)
                      }} className="text-lg"> <FiMinus /></button> <span className="p-2"> {item.quantity}</span><button onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateQuantity(item.id, item.quantity + 1)
                      }}><FiPlus /></button>
                    </p>

                  </div>
                  <p className="mt-2 text-lg font-semibold">
                    Rs. {item.price }{" "}
                    {item.oldPrice && (
                      <span className="text-gray-500 line-through text-sm ml-2">
                        Rs. {item.oldPrice}
                      </span>
                    )}
                    {item.discountedPrice && (
                      <span className="text-sm text-orange-600">
                        ({(item.discountedPrice / 10).toFixed(0)}%)
                      </span>
                    )}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-semibold">7 days</span> return available
                  </p>
                </div>
              </Link>
            </Card>

          ))}
        </div>
        <div className="flex justify-center"> <Card className="   h-auto sm:w-[70%] md:w-[50%] bg-orange-400   mt-4 p-4 text-black rounded-lg text-center  " >

          <hr className="border border-1 border-white " ></hr>
          <p className=" text-lg">Price details:</p>
          <div className="   text-xl font-bold">
            Total price :  Rs. {(totalPrice ).toFixed(1)}

          </div>

          <Button onClick={handlePayment} className=" bg-white text-black font-semibold hover:bg-black hover:text-white pb-4" >Prodceed to Order</Button>
        </Card></div>





      </>
    )}



  </>)




}