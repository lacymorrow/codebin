"use client"
import Logout from '@/components/auth/logout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import createSnippet from '@/server_functions/createSnippet';
import { getCurrentUser } from '@/utils/current-user';
import { Share, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getCurrentUser(setUser);
    }, []);

    if (!user) {
        return <p>Loading or no user logged in...</p>;
    }

    return (
        <div className='px-6 md:px-20 lg:px-32'>
            <div className='flex gap-4'>
                <img src={user.photoURL} alt={`${user.displayName}'s avatar`} className='w-24 h-24 rounded-2xl' width={50} height={50} />
                <div className='h-full'>
                    <h1 className='text-lg'>Welcome, <span className='font-bold font-geist'>{user.displayName}</span></h1>
                    <div className='flex items-center gap-3'>
                        <h1 className='text-sm text-foreground/80'>0 Snippets</h1>
                        <h1 className='text-sm text-foreground/80'>0 Views</h1>
                        <h1 className='text-sm text-foreground/80'>0 Likes</h1>
                    </div>
                    <div className='mt-2 flex gap-2 items-center'>
                        <Button>Share <Share2 className='h-4 w-4' /></Button>
                    </div>
                </div>
            </div>
            <div className='mt-14 grid gap-4 mb-10'>
                <h1 className='text-base text-foreground/80'>My Snippets.</h1>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                    {[...Array(10)].map((_, i) => (
                        <Skeleton key={i} className='w-full sm:max-w-48 h-48' />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
