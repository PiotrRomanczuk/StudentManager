"use client";

import Navbar from "@/components/landingPage/navbar/Navbar";
import Footer from "@/components/landingPage/footer/Footer";
import { Container } from "@/components/ui/container";
import { useState } from "react";
import DocumentationSidebar from "./DocumentationSidebar";
import IntroductionSection from "./sections/IntroductionSection";
import FeaturesSection from "./sections/FeaturesSection";
import TechStackSection from "./sections/TechStackSection";
import GettingStartedSection from "./sections/GettingStartedSection";
import LicenseSection from "./sections/LicenseSection";
import SongsComponentsSection from "./sections/songs/SongsComponentsSection";

const sections = [
  { id: "documentation", label: "Introduction" },
  { id: "features", label: "Features" },
  {
    id: "tech-stack",
    label: "Tech Stack",
    children: [
      { id: "frontend", label: "Frontend" },
      { id: "backend", label: "Backend" },
    ],
  },
  { id: "getting-started", label: "Getting Started" },
  { id: "songs-components", label: "Songs Components" },
  { id: "license", label: "License" },
];

export default function DocumentationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-50">
        <DocumentationSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sections={sections}
        />
        {/* Main Content */}
        <main className="flex-1 w-full lg:ml-64">
          <Container className="py-12">
            <IntroductionSection />
            <FeaturesSection />
            <TechStackSection />
            <GettingStartedSection />
            <LicenseSection />
            <SongsComponentsSection />
          </Container>
          <Footer />
        </main>
      </div>
    </>
  );
}
