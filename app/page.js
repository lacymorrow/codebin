import Hero from "@/components/page/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <header className="flex mb-10 justify-between py-3 px-6 items-center">
        <div>
          <h1 className="text-xl font-bold">Codebin</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button asChild>
              <RainbowButton>Get Started</RainbowButton>
            </Button>
          </Link>
          <ThemeSwitcher />
        </div>
      </header>
      <Hero />
    </div>
  );
}
