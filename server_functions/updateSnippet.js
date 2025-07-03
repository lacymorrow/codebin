"use server";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default async function updateSnippet(
  snipId,
  { author, title, desc, code },
) {
  const snippetDocRef = doc(db, "snippets", snipId);

  try {
    const snippetSnap = await getDoc(snippetDocRef);
    if (!snippetSnap.exists()) {
      return null;
    }
    const existingSnippet = snippetSnap.data();
    if (existingSnippet.author !== author) {
      return null;
    }
    await updateDoc(snippetDocRef, {
      title,
      desc,
      code,
    });
    console.log("Snippet updated:", snipId);
    return snipId;
  } catch (error) {
    console.error("Error updating snippet:", error);
    return error;
  }
}
