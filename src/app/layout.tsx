import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastContainer } from "@/components/Toast";

export const metadata: Metadata = {
  title: "Axiom - Integrated Learning Platform",
  description:
    "One Axiom-designed platform for college exams, GATE, research paper implementation, placements, and repo-based learning.",
  keywords: ["education", "college prep", "gate", "placements", "research papers", "implementation"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Suppress unused preload warnings for CSS chunks */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                const observer = new PerformanceObserver((list) => {
                  for (const entry of list.getEntries()) {
                    if (entry.entryType === 'resource' && entry.name.includes('.css')) {
                      console.debug('CSS Resource:', entry.name);
                    }
                  }
                });
                observer.observe({ entryTypes: ['resource'] });
              }
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: "calc(100vh - 160px)", position: "relative", zIndex: 1 }}>
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
