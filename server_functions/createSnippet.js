"use server";

import { db } from "@/lib/firebase";
import { getCurrentUser } from "@/utils/current-user";
import { addDoc, collection, doc } from "firebase/firestore";

export default async function createSnippet(id, dataa) {
    const userDocRef = doc(db, 'users', id);
    const snippetsCollectionRef = collection(userDocRef, 'snippets');

    try {
        const newSnippetRef = await addDoc(snippetsCollectionRef, dataa);
        console.log('Snippet created with ID:', newSnippetRef.id);
    } catch (error) {
        console.error('Error adding snippet:', error);
    }

}