'use client'

import { useEffect, useState } from 'react';
import Button from '@/ui/Button';
import { getCsrfToken, signIn, useSession } from 'next-auth/react';
import { toast } from '@/ui/toast';


const SignInButton = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { status } = useSession();
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        async function fetchCsrfToken() {
          const result = await getCsrfToken();
          if (!result) {
            throw new Error('Can not sign in without a CSRF token');
          }
          setCsrfToken(result);
        }
    
        /*
          Wait until session is fetched before obtaining csrfToken 
          to prevent synchronization issues caused by both 
          /api/auth/session and /api/auth/csrf setting the cookie. 
          Only happens in dev environment.
        */
        if (status !== 'loading') {
          fetchCsrfToken();
        }
      }, [status]);

    const signInWithGoogle = async () => {
        setIsLoading(true);
        try {
            await signIn('google');

        } catch (error) {
            toast({
                title: 'Error signing in with Google',
                message: 'Please try again later.',
                type: 'error',
            })
        }
    }

    const signInWithCredentials = async () => {
      setIsLoading(true);
      await signIn(undefined, { callbackUrl: '/dashboard'});
      setIsLoading(false);
  }

  return (
    <Button onClick={(e) => {e.preventDefault(); signInWithCredentials()}} isLoading={isLoading}>
        Sign In
    </Button>
  )
}

export default SignInButton;