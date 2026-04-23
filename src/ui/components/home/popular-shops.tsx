export default function PopularShops() {
  const shops = [
    "Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Gucci", "Prada", "Louis Vuitton",
    "Chanel", "Versace", "Armani", "Calvin Klein", "Tommy Hilfiger", "Ralph Lauren",
    "Levi's", "Gap", "Forever 21", "Urban Outfitters", "American Eagle", "Hollister"
  ];

  return (
    <section className="bg-black py-2 overflow-hidden">
      <div className="relative">
        {/* Sliding strip */}
        <div className="flex animate-scroll">
          {/* First set of shops */}
          {shops.map((shop, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 px-8 py-2"
            >
              <span className="text-white font-medium text-lg whitespace-nowrap">
                {shop}
              </span>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {shops.map((shop, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 px-8 py-2"
            >
              <span className="text-white font-medium text-lg whitespace-nowrap">
                {shop}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}