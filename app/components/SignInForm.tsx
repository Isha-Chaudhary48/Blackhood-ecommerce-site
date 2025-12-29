"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignInForm()
{
  const router = useRouter();
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [message,setMessage] = useState("")
    
  
     async function handleFormSubmit(e:React.FormEvent)
     {
        e.preventDefault()
        try{
          const res = await fetch('/api/auth/signIn',
          {
            method:'POST',
            headers: {
              "Content-Type":"application/json"
            },
            body:JSON.stringify({email,password})

          }
        )
       
        const data = await res.json()
        if(data.success)
        {
         router.push('/');

        }
        else{
          setMessage(`Invalid Email or Password`)
        }

        }
        catch(err)
        {
          console.log("error occured",err)
           setMessage("Something went wrong");

        }
        


        console.log({email,password})
     }
    return(<>
    <div className="flex min-h-screen items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Sign In
              </CardTitle>
            </CardHeader>
    
            <CardContent>
              <form onSubmit={handleFormSubmit}  className="space-y-4">
                
                
                <div className="space-y-2">
                 <label htmlFor="email">Email</label>
                  <Input
                  type="email"
                  placeholder="you@gmail.com"
                  id="Email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  required
    
                   
                  />
                </div>
    
                <div className="space-y-2">
                  <label htmlFor="password">Password</label>
                  <Input
                  id="password"
                  type="password"
                  placeholder="Set password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  required
                   
                  />
                </div>
    
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
               <div className="space-y-2 mt-3">
                  <label >If account doesn't exist <Link className="text-sm text-blue-600" href="/SignUp">Sign Up</Link></label>
                  
                </div>
                <div className="text-red-700 flex justify-center mt-2"> {message}</div> 
            </CardContent>
          
          </Card>
          
        </div>

    </>)

}