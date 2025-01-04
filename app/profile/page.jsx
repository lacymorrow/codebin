"use client"
import Logout from '@/components/auth/logout';
import { getCurrentUser } from '@/utils/current-user';
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
        <div>
            <Logout/>
            <h1>Welcome, {user.displayName}</h1>
            <p>Email: {user.email}</p>
            <img src={user.photoURL} alt={`${user.displayName}'s avatar`} />
        </div>
    );
};

export default UserProfile;
