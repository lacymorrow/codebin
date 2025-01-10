"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, doc } from "firebase/firestore";

export default async function getUserSnippets(id) {
    const userDocRef = doc(db, 'users', id);
    const snippetsCollectionRef = collection(userDocRef, 'snippets');

    try {
        const snippetsSnapshot = await getDocs(snippetsCollectionRef);
        const snippetsList = snippetsSnapshot.docs.map(doc => doc.data());
        return snippetsList;
    } catch (error) {
        console.error(error);
    }
}
