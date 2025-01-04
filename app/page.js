import Hero from "@/components/page/hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <header className="flex mb-10 justify-between py-3 border-b px-6 bg-secondary/30 backdrop-blur-lg items-center">
        <div>
          <h1 className="text-xl font-bold">Codebin</h1>
        </div>
        <div>
          <Button asChild>
            <Link href="/auth">Login</Link>
          </Button>
        </div>
      </header>
      <Hero/>
    </div>
  );
}
