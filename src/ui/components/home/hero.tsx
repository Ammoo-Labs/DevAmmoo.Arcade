import Link from "next/link";
import Image from "next/image";
import { ActionButton } from "@/ui/components/button";
import heroImage from "@/assets/images/hero-image.png";
import { Circle } from "@/ui/components/Circle";

export default function Hero() {
  return (
    <section className="bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 lg:px-8 pb-4 sm:pb-8 lg:pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

          {/* Left Side - Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left relative z-10">
            <Circle size={220} className="top-[-190px] left-[-220px]" animate={true} animationType="float" />

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black mb-4">
              PISSU KANNA
            </h1>
            <p className="text-lg sm:text-xl text-red-600 font-semibold mb-2">
              SALE NOW ON !
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-6">
              up to 15% off on products
            </p>
            <Link href="/products">
              <ActionButton size="lg" className="w-full sm:w-auto">
                Shop Now
              </ActionButton>
            </Link>
          </div>

          {/* Right Side - Hero Image */}
          <div className="w-full lg:w-1/2 relative flex justify-center items-center">
            <Circle size={180} className="top-[1px] left-[350px]" animate={true} animationType="float" />
            <Circle size={220} className="bottom-[-15px] right-[-20px]" animate={true} animationType="float" />
            <Circle size={120} className="bottom-[170px] right-[450px]" animate={true} animationType="float" />

            <Image
              src={heroImage}
              alt="Hero"
              className="relative z-10 w-full h-auto max-w-sm lg:max-w-md"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
