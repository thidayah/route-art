import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RouteList from "@/components/RouteList";
import SubmitRouteForm from "@/components/SubmitRouteForm";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-950">
      <Navbar />
      <HeroSection />
      <RouteList />
      <SubmitRouteForm />
      <Footer />
    </main>
  );
}
