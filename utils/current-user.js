import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const getCurrentUser = (setUser) => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            setUser({
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            });
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                console.log('User already exists');
            }
            else {
                const createUserDoc = await setDoc(doc(db, 'users', user.uid), {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                });
                console.log('User created');
            }
            return user;
        } else {
            setUser(null);
            return false;
        }
    });
};
