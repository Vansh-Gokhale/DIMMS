import { HeroSection } from "@/components/HeroSection";
import { LoginCard } from "@/components/LoginCard";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden text-white selection:bg-indigo-500/30">
      <div className="relative z-10 flex flex-col items-center w-full pb-20">
        <HeroSection />
        <LoginCard />
      </div>
    </main>
  );
}
