import { auth } from '@/libs/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const getCurrentUser = (setUser) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser({
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            });
        } else {
            setUser(null);
        }
    });
};
