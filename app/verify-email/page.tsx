"use client"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"


export default function VerifEmail() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState("Verifying...");

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setMessage("Invalid verification link");
            return;
        }

        fetch(`/api/verify-email?token=${token}`)
            .then(res => res.json())
            .then(data => {
                if (data.message === "Email verified successfully") {
                    setMessage("Email verified! Redirecting to Sign In...")
                    router.push('/SignIn');
                }
                else if (data.message === "Email already verified") {
                    setMessage("Email already verified! Redirecting to Sign In...")
                    router.push('/SignIn');

                }
                else {
                    setMessage(data.message)
                }
            })
    }, [searchParams, router])
    return (<>
        <div className="h-[100%] w-[100%] text-center">
            <p> {message}</p>

        </div>

    </>)
}