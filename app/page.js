import Footer from "@/components/page/footer";
import Header from "@/components/page/header";
import Hero from "@/components/page/hero";

export default function Home() {
  return (
    <div className="relative">
      <img
        src="/bg_gradient.avif"
        className="absolute w-full -z-50 -top-0"
        draggable="false"
      />
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}
