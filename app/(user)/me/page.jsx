"use client"
import Logout from '@/components/auth/logout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import createSnippet from '@/server_functions/createSnippet';
import getUserSnippets from '@/server_functions/getUserSnippets';
import { getCurrentUser } from '@/utils/current-user';
import { Copy, Edit, Share, Share2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [snippets, setSnippets] = useState([]);

    const fetchSnippets = async () => {
        if (!user) return;
        try {
            const snippets = await getUserSnippets(user.uid);
            setSnippets(snippets);
            console.log(snippets);
        } catch (error) {
            console.error('Error fetching snippets:', error);
        }
    };

    useEffect(() => {
        getCurrentUser(setUser);
    }, []);
    useEffect(() => {
        fetchSnippets();
    }, [user]);

    if (!user) {
        return (
            <div className='px-6 md:px-20 lg:px-32'>
                <div className='flex gap-4'>
                    <Skeleton className='w-24 h-24' />
                    <div className='h-full grid gap-2'>
                        <Skeleton className='w-36 h-4' />
                        <div className='flex items-center gap-2'>
                            <Skeleton className="h-5 w-8" />
                            <Skeleton className="h-5 w-8" />
                            <Skeleton className="h-5 w-8" />
                        </div>
                        <Skeleton className='h-9 w-32' />
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-auto">
                    {snippets && snippets.map((snippet) => (
                        <div
                            key={snippet.id}
                            className="border flex flex-col border-border h-fit bg-card rounded-md p-4 shadow-sm break-inside-avoid"
                        >
                            <div className="bg-secondary rounded-md p-2 mb-3 overflow-hidden break-words max-h-[150px] min-h-[150px]">
                                <p className="text-sm text-foreground/80 overflow-hidden break-words">
                                    {snippet.code}
                                </p>
                            </div>
                            <div className="grid px-1 h-fit">
                                <h1 className="text-base font-medium">{snippet.title}</h1>
                                <p className="text-sm text-foreground/80">
                                    {snippet.desc ? snippet.desc.slice(0, 70) : "No description"}
                                </p>
                                <div className='flex gap-2 items-center mt-2'>
                                    <Button onClick={() => { navigator.clipboard.writeText(snippet.code); toast.success('Code copied!') }}>Copy <Copy className='h-4 w-4' /></Button>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="icon" variant="outline"><Share2 className='h-4 w-4' /></Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle className="text-left">{snippet.title}</DialogTitle>
                                                <DialogDescription className="text-left">
                                                    <div className='mt-2 grid gap-2'>
                                                        <Label htmlFor="link">This is your public link to share:</Label>
                                                        <Input id="link" defaultValue={`${location.origin}/s/${snippet.id}`} readOnly />
                                                        <Button onClick={() => { navigator.clipboard.writeText(`${location.origin}/s/${snippet.id}`); toast.success('Link copied!') }}>Copy</Button>
                                                    </div>
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    ))}
                    {!snippets && (
                        <div className='flex gap-2 items-center h-64 justify-center border border-border rounded-md'>
                            <p className='text-foreground/80 text-sm'>No snippets found.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default UserProfile;
