import { prisma } from "../../../../lib/prisma";
import ProductCard from "../../../../components/ui/ProductCard";
import Link from "next/link";

export default async function CategoryPage({ params }) {
  // 1. Next.js 15+ ke liye params ko await karna
  const { slug } = await params;

  // Aapki 7 Categories + All Products ka setup
  const navCategories = [
    { name: "All Products", href: "/products", activeSlug: "all" },
    { name: "Tote Bags", href: "/products/category/tote-bags", activeSlug: "tote-bags" },
    { name: "Cross Body", href: "/products/category/cross-body", activeSlug: "cross-body" },
    { name: "Hand Bag", href: "/products/category/hand-bag", activeSlug: "hand-bag" },
    { name: "Shoulder Bag", href: "/products/category/shoulder-bag", activeSlug: "shoulder-bag" },
    { name: "Three Piece", href: "/products/category/three-piece", activeSlug: "three-piece" },
    { name: "Two Piece", href: "/products/category/two-piece", activeSlug: "two-piece" },
    { name: "Clutches", href: "/products/category/clutches", activeSlug: "clutches" },
  ];

  const categoryDisplayName = slug.replace(/-/g, ' ');

  // 2. Database se products nikalna
  const filteredProducts = await prisma.product.findMany({
    where: {
      category: {
        equals: slug, 
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-white pb-20">
      
      {/* --- LUXURY CATEGORY NAV --- */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-start md:justify-center gap-6 md:gap-10 overflow-x-auto no-scrollbar py-5">
            {navCategories.map((cat) => (
              <Link
                key={cat.activeSlug}
                href={cat.href}
                className={`whitespace-nowrap text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-bold transition-all duration-300 relative group ${
                  slug === cat.activeSlug 
                  ? "text-[#C5A25D]" 
                  : "text-gray-400 hover:text-black"
                }`}
              >
                {cat.name}
                {/* Active Indicator Line */}
                <span className={`absolute -bottom-1 left-0 w-full h-[1.5px] bg-[#C5A25D] transition-transform duration-300 ${
                  slug === cat.activeSlug ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                }`} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-[#FAF9F6] py-12 md:py-20 border-b border-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-[0.15em] text-black italic">
            {categoryDisplayName}
          </h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] mt-6">
            LedyNest Curated Selection &nbsp; | &nbsp; {filteredProducts.length} Items
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 mt-16">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-gray-200 rounded-sm max-w-3xl mx-auto">
            <p className="font-serif text-xl text-gray-300 italic">
              Our artisans are currently crafting new pieces for this collection.
            </p>
            <Link 
              href="/products" 
              className="inline-block mt-8 bg-black text-white px-12 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#C5A25D] transition-all shadow-xl"
            >
              View All Collections
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}