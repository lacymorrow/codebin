"use client"
import Logout from '@/components/auth/logout';
import { Button } from '@/components/ui/button';
import createSnippet from '@/server_functions/createSnippet';
import { getCurrentUser } from '@/utils/current-user';
import { useEffect, useState } from 'react';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    // const click9 = () =>{
    //     console.log(user.uid);
    //     if (user) {
    //         createSnippet(user?.uid, {
    //             title: "Test snippet",
    //             description: "This is a test snippet.",
    //             code: "console.log('Hello, world!');",
    //             output: "Hello, world!",
    //             language: "javascript"
    //         });
    //     }
    // };
    useEffect(() => {
        getCurrentUser(setUser);
    }, []);

    if (!user) {
        return <p>Loading or no user logged in...</p>;
    }

    return (
        <div>
            {/* <Button onClick={click9}>Create snippet</Button> */}
            <Logout />
            <h1>Welcome, {user.displayName}</h1>
            <p>Email: {user.email}</p>
            <img src={user.photoURL} alt={`${user.displayName}'s avatar`} />
        </div>
    );
};

export default UserProfile;
