"use server";

import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

export default async function createSnippet(id, dataa) {
    const snippetsCollectionRef = collection(db, 'snippets'); // Root-level 'snippets' collection

    try {
        const newSnippetRef = await addDoc(snippetsCollectionRef, { author: id, ...dataa });
        console.log('Snippet created with ID:', newSnippetRef.id);
        return newSnippetRef.id;
    } catch (error) {
        console.error('Error adding snippet:', error);
        throw error;
    }
}
