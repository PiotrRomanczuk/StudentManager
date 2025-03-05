"use client";

import HeroHome from "@/components/landingPage/hero/HeroHome";
import Feature from "@/components/landingPage/feature/Feature";
import Team from "@/components/landingPage/team/Team";
import Navbar from "@/components/landingPage/navbar/Navbar";

export default function Page() {
  return (
    <section>
      <Navbar />
      <HeroHome />
      <Feature />
      <Team />
    </section>
  );
}
