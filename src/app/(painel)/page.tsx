import HeroSection from "@/components/cards/hero-section";
import Footer from "@/components/layout/footer";

export default function AlinhavoCostura() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* <main className="container mx-auto px-4 py-8 "> */}
      {/* ocupar 100 da altura da tela */}
      <main className="container mx-auto px-4 py-8 h-screen">
        <HeroSection />
        {/* <FeaturedOffers />
        <PopularCategories />
        <HowItWorks />
        <FeaturedTailors /> */}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
