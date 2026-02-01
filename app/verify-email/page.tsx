"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"


function VerifyEmailComponent() {
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
                if (data.message === "Email verified successfully" || data.message === "Email already verified") {
                    setMessage(`${data.message}! Redirecting to Sign In...`);
                    setTimeout(() => router.push('/SignIn'), 2000);
                } else {
                    setMessage(data.message);
                }
            })
            .catch(() => setMessage("An error occurred during verification."));
    }, [searchParams, router]);

    return (
        <div className="h-[100%] w-[100%] text-center p-10">
            <p className="text-lg font-medium">{message}</p>
        </div>
    );
}


export default function VerifEmailPage() {
    return (
        <Suspense fallback={<div className="text-center p-10">Loading...</div>}>
            <VerifyEmailComponent />
        </Suspense>
    );
}