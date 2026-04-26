import { Hero, FeaturedProducts, TopSellers } from "@/ui/components/home";

export default function HomePage() {
  return (
    <div className="pt-[56px] sm:pt-[64px] md:pt-[116px] lg:pt-[128px]">
      <Hero />
      <FeaturedProducts />
      <TopSellers />
    </div>
  );
}
