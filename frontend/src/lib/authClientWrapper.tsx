'use client'

import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export function AuthWrapper ({
    children,
  }: {
    children: React.ReactNode
  }) {
    const { data: session } = useSession();
  
    useEffect(() => {
      if (session?.error) { // may need to be specific e.g. session.error === 'RefreshAccessTokenError'
          signOut({ callbackUrl: '/' }); // note: we are using the signOut function from the next-auth library
      }
    }, [session?.error]);
  
    return (
      <>{children}</>
    )
  }