"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include", // Ensures cookies are sent
        });

        const data = await response.json();
        
        if(data?.user){
          setIsSuccess(true);
        }else{
          push('login')
        }

      } catch (error) {
        console.error("Authorization failed:", error);
        push("/login"); // Redirect if auth fails
      }
    })();
  }, []);

  if (!isSuccess) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <header>
        <Link href="/Dashboard">Dashboard</Link>
        <span>Top Secret</span>
      </header>
      {children}
    </main>
  );
}
