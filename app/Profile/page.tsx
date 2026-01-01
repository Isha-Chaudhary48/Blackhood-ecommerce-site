"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import LogoutButton from "../Logout/page";
export default function ProfilePage()
{
    const router = useRouter();
    const [user,setUser] = useState<any>(null)

    useEffect(()=>{
        fetch('/api/me').then((res)=>{
            if(res.status === 401)
            {
                router.push('/SignIn')
                return null;
                
            }
            return res.json();
        }).then((data)=>setUser(data))
    },[]);
    
    if(!user)
    {
        return (
            <>
            <p>Loading...</p>
            </>
        )
    }
    return (<>
    <div>
        <h1> Profile</h1>
       <p>{user.email}</p>
       <div> <LogoutButton/></div>
       
      
    </div>
    </>)


}