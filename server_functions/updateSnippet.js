"use server";

import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default async function updateSnippet(
  snipId,
  { author, title, desc, code },
) {
  const snippetDocRef = doc(db, "snippets", snipId);

  try {
    await updateDoc(snippetDocRef, {
      author,
      title,
      desc,
      code,
    });
    console.log("Snippet updated:", snipId);
    return snipId;
  } catch (error) {
    console.error("Error updating snippet:", error);
    throw error;
  }
}
