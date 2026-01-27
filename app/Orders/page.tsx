export default async function OrdersPage()
{
    try{
        const res = await fetch('/api/orders/createPending',{
            method:"GET",
            credentials:"include"
        });
        const data = await res.json();
        console.log("orders",data)
        if(!res.ok)
        {
            throw new Error(data.message || "failed to fetch data from orders")
        }
        }
        catch(error)
        {
            console.log("error fetching orders",error);

        }
    }
