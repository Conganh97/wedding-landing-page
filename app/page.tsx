import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { LoveStory } from "@/components/sections/LoveStory";
import { Gallery } from "@/components/sections/Gallery";
import { EventInfo } from "@/components/sections/EventInfo";
import { RsvpForm } from "@/components/sections/RsvpForm";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 bg-linen">
        <Hero />
        <LoveStory />
        <Gallery />
        <EventInfo />
        <RsvpForm />
      </main>
      <Footer />
    </>
  );
}
