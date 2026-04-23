import { Hero, PopularShops, Creators, FeaturedProducts } from "@/ui/components/home";

export default function HomePage() {
  return (
    <div className="pt-[56px] sm:pt-[64px] md:pt-[116px] lg:pt-[128px]"> {/* Responsive padding for fixed header and navbar */}
      <Hero />
      <PopularShops />
      <Creators />
      <FeaturedProducts />
    </div>
  );
}
