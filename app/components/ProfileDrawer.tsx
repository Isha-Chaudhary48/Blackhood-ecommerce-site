"use client";
import { useEffect, useState } from "react";
import LogoutButton from "../Logout/page";
import Footer from "./Footer";
type User= {
    id: number;
    email:string;
};

export default function ProfileDrawer(
    {
        open,
        setOpen,
    }:
    {
        open : boolean;
        setOpen :(v: boolean)=>void;
    }
)
{
    const [user,setUser] = useState<User |null>(null);
    
    async function fetchUser()
    {
        const res = await fetch("/api/me");
        if(!res.ok)
        {
            setUser(null);
            return;
        }
        const data = await res.json();
         console.log("hello",data)
        setUser(data);
       

    };
    useEffect(()=>{
        fetchUser();
        window.addEventListener("auth-changed",fetchUser);
        return() =>
             window.removeEventListener('auth-changed',fetchUser);

    },[])

  

    
    return (<>
    
    {open && (
        <div onClick={()=>setOpen(false)}
        className="fixed inset-0 bg-black/40 z-40">
           
             </div>
    )}
    <div
        className={`fixed top-0 right-0 h-full md:w-80  bg-white z-50 shadow-lg text-black
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5   border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Profile</h2>
          <button onClick={() => setOpen(false)}>✕</button>
        </div>
       

       {user ? (
  <div  className=" h-[100vh] mt-5">
    <div className="sm:p-2 text-center">
    <strong className="p-2">Email:</strong> {user.email}
    <div className="font-semibold text-lg p-2"><a href="/Orders"> Orders</a></div>
    <div className="p-2"> <LogoutButton /></div>
    </div>
    <div className=" absolute bottom-0 ">
    <Footer/>
    </div>
     
  
 
  </div>
 
):
(
    <p className="text-gray-500">Not logged in</p>

)
}

         
        </div>
        
      
    </>)
}