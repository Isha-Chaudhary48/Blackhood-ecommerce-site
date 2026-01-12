"use client";
import { useState, useEffect } from "react";

export  function FetchFavourites()
{
    const [favourites,setFavourites] = useState<string[]>([]);
    const [loading,setLoading] = useState(true);
    async function fetchFavouriteProduct()
    {
        try{
            const res = await fetch("/api/favourites");
             if (res.status === 401) {
          setFavourites([]);
          setLoading(false);
          return;
        }
         if (!res.ok) {
        throw new Error("Failed to fetch favourites");
      }
           
            const data = await res.json();
            setFavourites(data.favourites || []);





            
        }
        catch(error)
        {
            console.log("Failed to fetch favourites",error);

        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchFavouriteProduct();
        window.addEventListener('auth-changed',fetchFavouriteProduct);
        return()=>window.removeEventListener("auth-changed",fetchFavouriteProduct);
    },[])
    return{
        favourites,
        setFavourites,
        loading
    }
}