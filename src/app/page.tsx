"use client";

import HeroHome from "@/components/landingPage/hero/HeroHome";
import Feature from "@/components/landingPage/feature/Feature";
import Team from "@/components/landingPage/team/Team";
import Navbar from "@/components/landingPage/navbar/Navbar";
import Testimonials from "@/components/landingPage/testimonials/Testimonials";
import Pricing from "@/components/landingPage/pricing/Pricing";
import Footer from "@/components/landingPage/footer/Footer";
import Contact from "@/components/landingPage/contact/Contact";

export default function Page() {
  return (
    <section>
      <Navbar />
      <HeroHome />
      <Feature />
      <Testimonials />
      <Pricing />
      <Team />
      <Contact />
      <Footer />
    </section>
  );
}
