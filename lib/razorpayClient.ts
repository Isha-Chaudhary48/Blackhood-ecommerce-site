

export const loadRazorpay = () => {

    return new Promise<boolean>((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
            resolve(true);
        }

        script.onerror = () => {
            resolve(false);
        }

        document.body.appendChild(script);



    })

}
export const openRazorpay = ({
    amount,
    orderId,
    razorpay_order_id
}: {
   
    amount: number,
    orderId: string,
     razorpay_order_id :string,
}) => {
     console.log("Razorpay orderid",orderId)
     console.log("razor pay id ",  razorpay_order_id)
    const options={
        key:process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
        amount :amount * 100,
        currency:"INR",
        order_id :   razorpay_order_id,
       

        handler: async function(response: any){
            console.log("Payment Success HIII ",response)

            const verifyPayment = await fetch('/api/payment/verify',{
                method:'POST',
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id:response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderId
                })
            })
            const data = await verifyPayment.json();

            if(data.success)
            {
                alert("Payment verified and order placed");
            }
            else{
                alert("Payment verification failed");
            }



        }

    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();

}
