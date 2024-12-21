import FeaturedOffers from "@/components/cards/featured-offers";
import FeaturedTailors from "@/components/cards/featured-tailors";
import HeroSection from "@/components/cards/hero-section";
import HowItWorks from "@/components/cards/how-it-works";
import PopularCategories from "@/components/cards/popular-categories";
import Footer from "@/components/layout/footer";

export default function AlinhavoCostura() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <main className="container mx-auto px-4 py-8">
        <HeroSection />
        <FeaturedOffers />
        <PopularCategories />
        <HowItWorks />
        <FeaturedTailors />
      </main>
      <Footer />
    </div>
  );
}
