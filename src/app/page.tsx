import SplashScreen from "@/components/SplashScreen";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  return (
    <main className="min-h-screen bg-jade-dark">
      {/* Client Component Overlay - Self-managing */}
      <SplashScreen />

      {/* Server Component - Rendered immediately behind the splash */}
      <LandingPage />
    </main>
  );
}
