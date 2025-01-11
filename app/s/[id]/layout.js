import Footer from "@/components/page/footer";
import Header from "@/components/page/header";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const generateMetadata = async ({ params }) => {
    try {
        const snipRef = doc(db, 'snippets', params.id); // Fetch snippet directly from the root-level 'snippets' collection
        const docSnap = await getDoc(snipRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                title: data.title,
                description: data.description || "Share code with output and syntax highlighting with ease.",
            }
        } else {
            return {
                title: `Error - Something went wrong!`,
                description: `The snippet with id ${id} does not exist.`,
            }
        }
    }
    catch (e) {
        return {
            title: `Error - Something went wrong!`,
            description: `The snippet with id ${id} does not exist.`,
        }
    }
}

export default function SnippetLayout({ children }) {
    return (
        <main className='relative'>
            <img
                src="/bg_gradient.avif"
                className="absolute w-full -z-50 -top-0"
            />
            <Header />
            {children}
            <Footer />
        </main>
    );
}