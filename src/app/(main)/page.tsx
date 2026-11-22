import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedServices } from "@/components/home/featured-services";
import { HeroSection } from "@/components/home/hero-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { VendorCtaSection } from "@/components/home/vendor-cta-section";
import { WhyChooseSection } from "@/components/home/why-choose-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedServices />
      <CategoriesSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <VendorCtaSection />
    </>
  );
}
