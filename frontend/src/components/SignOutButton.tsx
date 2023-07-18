'use client'

import { useState } from 'react';
import Button from '@/ui/Button';
import { signOut } from 'next-auth/react';
import { toast } from '@/ui/toast';

const SignOutButton = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const signOutCredentials = () => {
        setIsLoading(true);
        try {
            signOut({ callbackUrl: '/'});

        } catch (error) {
            toast({
                title: 'Error signing out',
                message: 'Please try again later.',
                type: 'error',
            })
        }
    }

  return (
    <Button onClick={(e) => {e.preventDefault(); signOutCredentials()}} isLoading={isLoading}>
        Sign Out
    </Button>
  )
}

export default SignOutButton;