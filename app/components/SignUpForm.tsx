"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
    const router = useRouter()
    const [name, setName] = useState("");
    const [ email, setEmail] = useState("")
    const [ password, setPassword] = useState("")
    const [message, setMessage] = useState("")
   async function handleFormSubmit(e:React.FormEvent)
    {
      
        e.preventDefault()
        const res = await fetch('/api/auth/signUp',{
          method :"POST",
          headers : { "Content-Type" : "application/json"},
          body:JSON.stringify({name,email,password}),
        });
        console.log(await res.text)
        const data = await res.json();
        if(data.success) {
          setMessage('Sign up successfully! Please check our email and verify your account with  your registered email')
          
          } 
        else{setMessage(`${data.error}`)}

    }


    return (<>
        <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Sign Up
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleFormSubmit}  className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <Input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
               
              />
            </div>
            
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
              Sign up
            </Button>
            
          </form>
          <div className="space-y-2 mt-3">
                  <label >If account already exists <Link className="text-sm text-blue-600" href="/SignIn">Sign In</Link></label>
                  
                </div>
                 <div className="text-red-700 flex justify-center mt-2"> {message}</div>

        </CardContent>
       
      </Card>
    </div>
    


    </>)
}