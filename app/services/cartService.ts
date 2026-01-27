export async function AddToCart({product_id,size,quantity}:
    { product_id : string;
         size: string; 
        quantity: number}
)
{
    try{
        const res = await fetch('/api/cart',{
        method: 'POST',
        headers:{
            'Content-Type':"application/json"
        },
        credentials: "include",
        body: JSON.stringify({product_id,size,quantity})
    });
    const data = await res.json();
    if(!res.ok)
    {
        console.log(data.message)
      throw new Error(data.message || "Failed to add to cart. Are you logged in?");


    }
    return data;


    }
    catch(error)
    {
        console.log("Add to cart eerror",error)
        throw error;
    }
    

   
}