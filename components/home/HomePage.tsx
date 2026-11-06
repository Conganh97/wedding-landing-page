"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Starfield } from "@/components/layout/Starfield";
import { WeddingAudio } from "@/components/layout/WeddingAudio";
import { InvitationGate } from "@/components/invitation/InvitationGate";
import { Hero } from "@/components/sections/Hero";
import { FormalInvitation } from "@/components/sections/FormalInvitation";
import { FamilyInfo } from "@/components/sections/FamilyInfo";
import { EventInfo } from "@/components/sections/EventInfo";
import { WeddingCalendar } from "@/components/sections/WeddingCalendar";
import { CountdownSection } from "@/components/sections/CountdownSection";
import { WeddingSchedule } from "@/components/sections/WeddingSchedule";
import { VenueMapSection } from "@/components/sections/VenueMapSection";
import { Gallery } from "@/components/sections/Gallery";
import { BlessingGuestbook } from "@/components/sections/BlessingGuestbook";
import { RsvpForm } from "@/components/sections/RsvpForm";
import { WeddingGifts } from "@/components/sections/WeddingGifts";
import { ThankYou } from "@/components/sections/ThankYou";

export function HomePage() {
  const [invitationOpen, setInvitationOpen] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const showContent = !invitationOpen;

  return (
    <>
      <Starfield />
      {invitationOpen && (
        <InvitationGate onOpen={() => setInvitationOpen(false)} />
      )}

      <motion.div
        initial={false}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`relative z-10 flex min-h-full flex-1 flex-col ${showContent ? "" : "pointer-events-none"}`}
        aria-hidden={!showContent}
      >
        {showContent && (
          <>
            <Header />
            <main id="main-content" className="main-luxury-surface flex-1">
              <Hero />
              <FamilyInfo />
              <FormalInvitation />
              <EventInfo />
              <WeddingCalendar />
              <CountdownSection />
              <WeddingSchedule />
              <VenueMapSection compactTop />
              <Gallery />
              <BlessingGuestbook />
              <RsvpForm />
              <WeddingGifts />
              <ThankYou />
            </main>
            <Footer />
            <WeddingAudio enabled />
          </>
        )}
      </motion.div>
    </>
  );
}
