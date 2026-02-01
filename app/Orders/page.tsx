'use client'
import { useEffect, useState } from "react"
import Loading from "../components/Loading"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link";
import { Button } from "@/components/ui/button";




export default function OrdersPage() {

    const [orders, setOrders] = useState<TOrderItem[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/order/createPending', {
                    method: 'GET',
                    credentials: "include"
                });
                console.log(res)
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Failed to fetch orders")

                }
                setLoading(false)
                setOrders(data);

            }
            catch (error) {
                console.log("orders error", orders)
            }


        }
        fetchOrders();
    }, [])
    if (loading) {
        return <Loading />
    }

    console.log("user orders", orders)


    return (<>


        <div>
            {orders.length === 0 ? (
                <div className="h-[50vh] flex flex-col justify-center orders-center text-center">
                    <p className="font-semibold text-2xl">Looks like you haven’t ordered anything yet! 🛒</p>
                    <p>Add some items to see them appear here.</p>
                </div>
            ) : (
                <>
                    <div className="sm:w-[65%] md:w-[50%] sm:p-4 mx-auto space-y-4 p-4 ">
                        {orders.map((order) => (

                            <Card key={order.order_item_id} className=" rounded-lg mt-4 ">



                                <Link

                                    href={`/Home/${order.product_id}`}
                                    className=" flex justify-center items-center gap-1   "

                                >



                                    <div className=" ">
                                        {order.product_image && (
                                            <Image
                                                src={order.product_image}
                                                alt={order.product_name}

                                                width={200}
                                                height={200}
                                                className="object-cover rounded-lg"
                                            />

                                        )}
                                    </div>




                                    <div className="p-8">
                                        <CardTitle className="text-xl font-bold">{order.product_name}</CardTitle>
                                        <div className="mt-2 font-semibold "><span>Rs. {order.price}</span></div>
                                        <div className="font-semibold text-sm text-gray-500  flex  md:flex gap-1 mt-2  ">
                                            <span >Size: {order.size}</span> <span className="text-black">|</span>
                                            <span >Qty: {order.quantity}</span>
                                        </div>

                                        <span> <hr className="my-2"></hr></span>

                                        {
                                            order.status === 'DELIVERED' ? (
                                                <div>
                                                    <div className="text-green-600   font-semibold rounded-lg ">Delivered</div>
                                                    <div className="text-gray-600 text-sm">🚛 Delivered on {new Date(order.delivery_date).toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "short",
                                                    })}</div>

                                                </div>

                                            ) :
                                                (
                                                    <div className=" mt-1 text-gray-600 ">
                                                        <div className="text-sm">📅 Ordered on {new Date(order.order_date).toLocaleDateString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                        })}</div>
                                                        <div className="text-sm">📦 Delivered by {new Date(order.delivery_date).toLocaleDateString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                        })}</div>
                                                        {order.status === 'IN TRANSIT' && <div className="text-blue-600 font-semibold "><span className="text-sm">🟢</span>In Transit</div>}
                                                    </div>
                                                )
                                        }
                                        <span> <hr className="my-2"></hr></span>



                                    </div>
                                </Link>
                            </Card>

                        ))}
                    </div>






                </>
            )}
        </div>

    </>)
}
