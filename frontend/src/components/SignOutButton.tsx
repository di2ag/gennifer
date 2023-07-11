'use client'

import { useState } from 'react';
import Button from '@/ui/Button';
import { signOut } from 'next-auth/react';
import { toast } from '@/ui/toast';

const SignOutButton = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const signOutWithGoogle = async () => {
        setIsLoading(true);
        try {
            await signOut();

        } catch (error) {
            toast({
                title: 'Error signing out',
                message: 'Please try again later.',
                type: 'error',
            })
        }
    }

  return (
    <Button onClick={signOutWithGoogle} isLoading={isLoading}>
        Sign Out
    </Button>
  )
}

export default SignOutButton;