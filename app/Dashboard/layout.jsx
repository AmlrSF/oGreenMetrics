"use client";

import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";



export default function DashboardLayout({
  children,
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    (async () => {
      

     
      setIsSuccess(true);
    })();
  }, []);

  if (!isSuccess) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <header>
        <Link href='/Dashboard'>
          Dashboard
        </Link>
        top secret
      </header>
      {children}
    </main>
  );
}

