"use client"
import { useRouter } from "next/navigation";

export default function LogoutButton()
{
    const router = useRouter();

   async function logout()
   {
    const res = await fetch('/api/logout',
        {method : "POST"}
    );
    window.dispatchEvent(new Event('auth-changed'))
    router.push('/SignIn')
    


   }
   return(<>
   <button onClick={logout}> Logout</button>
   </>)
}
