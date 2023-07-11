'use client'

import { useState } from 'react';
import Button from '@/ui/Button';
import { signIn } from 'next-auth/react';
import { toast } from '@/ui/toast';

const SignInButton = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
        try {
            await signIn()
        } catch (error) {
            toast({
                title: 'Error signing in with credentials',
                message: 'Please try again later.',
                type: 'error',
            })
        }
    }

  return (
    <Button onClick={signInWithCredentials} isLoading={isLoading}>
        Sign In
    </Button>
  )
}

export default SignInButton;