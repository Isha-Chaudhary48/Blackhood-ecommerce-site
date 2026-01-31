
import toast from "react-hot-toast";


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
    razorpayOrderId,
    onSuccess

}: {

    amount: number,
    razorpayOrderId: string,
    onSuccess?: () => void,
}) => {

    console.log("razor pay id ", razorpayOrderId
    )
    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
        amount: amount * 100,
        currency: "INR",
        order_id: razorpayOrderId
        ,


        handler: async function (response: any) {
            console.log("Payment Success HIII ", response)

            const verifyPayment = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({

                    razorpayOrderId: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,

                })
            })

            const data = await verifyPayment.json();

            if (data.success) {
                toast.success("payment successful")
                if (onSuccess) onSuccess();


            }
            else {
                toast.error(data.message || "payment verification failed")
            }



        }

    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();

}
