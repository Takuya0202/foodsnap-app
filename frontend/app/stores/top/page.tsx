"use client"
import { client } from "@/utils/setting";
import { useEffect, useState } from "react";

function TopSkeleton() {
  return (
    <>
    </>
  )
}


export default function TopPage() {
  const [isLoading , setIsLoading] = useState<boolean>(false);
  const [stores , setStores ] = useState([]);
  const [position , setPosition] = useState<{latitude : number , longitude : number} | null>(null);

  useEffect(() => {
    const 
  })
  return (
    <div>
      <h1>TopPage</h1>
    </div>
  );
}
