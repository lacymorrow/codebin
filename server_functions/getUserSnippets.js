"use server";

import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function getUserSnippets(id) {
    try {
        const snippetsCollectionRef = collection(db, 'snippets'); // Root-level 'snippets' collection
        const userSnippetsQuery = query(snippetsCollectionRef, where('author', '==', id)); // Query snippets by author
        const snippetsSnapshot = await getDocs(userSnippetsQuery);
        const snippetsList = snippetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return snippetsList;
    } catch (error) {
        console.error("Error fetching snippets:", error);
        return [];
    }
}
