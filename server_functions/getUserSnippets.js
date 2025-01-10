"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, doc } from "firebase/firestore";

export default async function getUserSnippets(id) {
    try {
        const userDocRef = doc(db, 'users', id);
        const snippetsCollectionRef = collection(userDocRef, 'snippets');
        const snippetsSnapshot = await getDocs(snippetsCollectionRef);
        const snippetsList = snippetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return snippetsList;
    } catch (error) {
        console.error("Error fetching snippets:", error);
        return [];
    }
}
