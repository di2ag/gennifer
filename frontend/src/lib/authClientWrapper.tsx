'use client'

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export function AuthWrapper ({
    children,
  }: {
    children: React.ReactNode
  }) {
    const { data: session } = useSession();
    const router = useRouter();
  
    useEffect(() => {
      // check if the error has occurred
      if (session?.error === "RefreshAccessTokenError") {
          // Sign out here
          signOut();
      }
    }, [session?.error, router]);
  
    return (
      <>{children}</>
    )
  }