"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import ProfileDrawer from "../ProfileDrawer";

export default function Navbar() {
  const [user,setUser] = useState<any>(null);
  const [loading,setLoading] = useState(true);
  const [open,setOpen] = useState(false);
  

  useEffect(()=>
  {
    const fetchUser=()=>{
      fetch('/api/me').then(async(res)=>{
      if(!res.ok) {return null};
      return res.json();

    }).then((data)=>{
      setUser(data);
      setLoading(false);
    })
    }
    fetchUser();

    window.addEventListener("auth-changed",fetchUser);
    return()=>{
      window.removeEventListener("auth-changed",fetchUser)
    }
    
  },[]);
  if(loading) return null;

  return (
    <>
      <div className="flex items-center justify-between p-4 md:p-8 bg-zinc-900 sm:p-4 md:p-8 sm:px-4 text-white mb-5  " >
        <Link href="/">
          <h1 className="text-xl font-bold  ">Blackhood</h1>
        </Link>
        <div className="flex gap-4 ">
          <Link href="/Home">
            <button className="text-white ">Home </button>
          </Link>
          <Link href="/Favourites">
            <button className="text-white">Favourites</button>
          </Link>
          <Link href="/YourCart">
            <button className="text-white">Cart</button>
          </Link>
          {
            user ?(
              <div>
                <button onClick={()=>setOpen(true)} className="text-white">Profile</button>
             <ProfileDrawer
        open={open}
        setOpen={setOpen}
      />
              </div>
              
            
          
          

            ) : (
               <Link href="/SignIn">
            <button className="text-white">Sign In </button>
          </Link>

            )
          }
         
        </div>
      </div></>
  )
}
