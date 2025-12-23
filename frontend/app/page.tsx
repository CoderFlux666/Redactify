"use client";

import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { TrustedBy } from "@/components/landing/TrustedBy";
import { WorkflowDemo } from "@/components/landing/WorkflowDemo";
import { VisualBuilder } from "@/components/landing/VisualBuilder";
import { Features } from "@/components/landing/Features";
import { ArchitectureWorkflow } from "@/components/landing/ArchitectureWorkflow";
import { Footer } from "@/components/landing/Footer";
import { RedactionShowcase } from "@/components/landing/RedactionShowcase";
import { ScaleSection } from "@/components/landing/ScaleSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
      {/* Global Light Blue Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#e0f2fe_1px,transparent_1px),linear-gradient(to_bottom,#e0f2fe_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"
        />
        {/* Floating Orbs/Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-blue-100/40 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-[40%] right-[20%] w-96 h-96 bg-purple-100/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-[20%] left-[30%] w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <RedactionShowcase />
          <ScaleSection />
          <TrustedBy />
          <WorkflowDemo />
          <VisualBuilder />
          <Features />
          <ArchitectureWorkflow />
        </main>

        <Footer />
      </div>
    </div>
  );
}
