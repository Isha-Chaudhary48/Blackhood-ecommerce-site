"use client";
import React from "react";
import {FaHeart,FaRegHeart} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";


export default  function ToggleFavourite(
    {
        productId,
        favourites,
        setFavourites

    }:{
        productId : string,
        favourites: string[],
        setFavourites: React.Dispatch<React.SetStateAction<string[]>>
    }
)
{
    const router = useRouter();
    const isFav = favourites.includes(productId);
    async function favouriteButton(e:React.MouseEvent<HTMLButtonElement>)
    {
        e.preventDefault();
        e.stopPropagation();
        try{

        const res = await fetch('/api/favourites',{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({product_id: productId})
        });
        if(res.status === 401)
        {
            router.push('/SignIn');
            return;
        }
        if(!res.ok)
        {
            return;
        }

       setFavourites(prev => {
      const isFav = prev.includes(productId);
      return isFav
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
    });
    }
    catch(error)
    {
        console.log("Failed to toggle favourite", error);
    }
    }
    return(
        <>
        <Button className="flex justify-center items-center gap-1" type="button" onClick={favouriteButton}>
            {isFav? <FaHeart className="text-red-700" /> : <FaRegHeart/>}
            {isFav? " Added to Wishlist" : " Add to Wishlist"}
        </Button>
        </>
    )


}