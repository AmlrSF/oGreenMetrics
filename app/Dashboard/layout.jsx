"use client";

import {  useEffect } from "react";
import { useRouter } from "next/navigation";


export default function DashboardLayout({ children }) {
  const { push } = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://localhost:4000/auth", {
          method: "POST",
          credentials: "include",
        });

        const data = await response.json();
        if (!data?.user) {
          push("/login");
        }
      } catch (error) {
        console.error("Authorization failed:", error);
        push("/login");
      }
    })();
  }, []);

  return <main>{children}</main>;
}
