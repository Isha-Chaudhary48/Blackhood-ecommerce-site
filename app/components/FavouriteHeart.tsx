"use client";
import { useEffect, useState } from "react";
import {FaHeart,FaRegHeart} from "react-icons/fa"

type FavouriteHeartProps = {
    _id : number
}
export default function FavouriteHeart({_id}: FavouriteHeartProps)
{
    const [isFav,setIsFav] = useState(false)
    useEffect(()=>{
        const stored: number[] = JSON.parse(
            localStorage.getItem("favourites") || "[]"
        );

        if(stored.includes(_id))
        {
            setIsFav(true)
        }
    },[_id])

    function handleClick(e: React.MouseEvent<HTMLButtonElement>){
        e.stopPropagation();
        e.preventDefault();
        let stored: number[] = JSON.parse(
            localStorage.getItem('favourites') || "[]"
        )
        
         if(stored.includes(_id))
    {
        stored = stored.filter((id) => id !== _id);
        setIsFav(false)
    }
    else{
        stored.push(_id);
        setIsFav(true)
    }
    localStorage.setItem(
        "favourites",
        JSON.stringify(stored)
    )

    }
   
    return(<>
    <div className="inline-block" onClick={handleClick}>{isFav ? <FaHeart className="text-red-600"/> : <FaRegHeart/>}</div>
    </>)
}

