import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Members } from "@/components/members";
import { Events } from "@/components/events";
import { Contact } from "@/components/contact";
import { ParticleBackground } from "@/components/particle-background";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar />
      <Hero />
      <About />
      <Members /> {/* now client-side fetch with skeleton */}
      <Events />  {/* also client-side fetch inside component */}
      <Contact />
    </main>
  );
}
