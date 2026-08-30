import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingBag, Star, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import ProductCard from "../../../components/ui/ProductCard";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 3600;

export default async function ProductDetail({ params }) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;

  // ID Parsing: "paradise-14" se "14" nikalne ke liye
  const idMatch = rawId.match(/-(\d+)$/);
  const productId = idMatch ? parseInt(idMatch[1]) : parseInt(rawId);

  if (isNaN(productId)) return notFound();

  // Database se product fetch karna
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) return notFound();

  // IMAGE SAFETY LOGIC: Agar image string ha to parse karein, warna array use karein
  let productImages = [];
  try {
    if (product.images) {
      productImages = typeof product.images === 'string' 
        ? JSON.parse(product.images) 
        : product.images;
    }
  } catch (e) { 
    console.error("Image parsing error:", e);
    productImages = []; 
  }

  // COLORS SAFETY LOGIC
  let productColors = [];
  try {
    if (product.colors) {
      productColors = typeof product.colors === 'string' 
        ? JSON.parse(product.colors) 
        : product.colors;
    }
  } catch (e) { productColors = []; }

  const suggestions = await prisma.product.findMany({
    where: { NOT: { id: productId } },
    take: 4,
    orderBy: { id: 'desc' }
  });

  const reviews = [
    { name: "Zoya Khan", comment: "Quality is even better than the pictures. Feels very premium.", date: "3 Days Ago" },
    { name: "Mariam Malik", comment: "The color is exactly what I wanted. Perfect for everyday use!", date: "5 Days Ago" },
    { name: "Saba Pervez", comment: "The hardware details are stunning and heavy.", date: "1 Week Ago" }
  ];

  return (
    <main className="bg-[#F9F9F9] min-h-screen pb-20 text-black selection:bg-[#C5A25D] font-sans overflow-x-hidden">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link href="/products" className="group inline-flex items-center gap-2 text-black hover:text-[#C5A25D] transition-all text-[10px] font-black uppercase tracking-[0.3em]">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back <span className="hidden sm:inline">to Collection</span>
          </Link>
          
          {/* Status Bar */}
          <div className="flex items-center gap-3 opacity-60 md:opacity-40">
             <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${productImages.length > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
             <span className="text-[9px] uppercase tracking-widest font-black">
               {productImages.length > 0 ? 'Authentic Piece' : 'Data Sync Required'}
             </span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        {/* Agar images missing hain to Warning dikhayega */}
        {productImages.length === 0 && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle size={18} />
            <p className="text-[11px] font-bold uppercase tracking-wider">
              Paradise Bag Error: Images are missing in Database for ID {productId}. Please update via Admin Panel.
            </p>
          </div>
        )}

        <ProductDetailClient 
          product={product} 
          productImages={productImages} 
          productColors={productColors} 
        />
      </div>

      {/* Suggestions Section */}
      {suggestions.length > 0 && (
        <section className="mt-12 md:mt-24 py-16 md:py-24 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center text-center mb-12 md:mb-16">
              <ShoppingBag size={32} className="text-black mb-4" strokeWidth={1} />
              <h2 className="text-2xl md:text-3xl font-serif uppercase tracking-[0.2em] md:tracking-[0.3em]">More to <span className="text-[#C5A25D]">Explore</span></h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-12">
              {suggestions.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-6 mt-16 md:mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {reviews.map((rev, i) => (
                <div key={i} className="bg-white p-6 md:p-8 border border-gray-100 shadow-sm">
                    <div className="flex text-yellow-500 mb-4 gap-1">
                        {[...Array(5)].map((_, star) => <Star key={star} size={10} fill="currentColor" />)}
                    </div>
                    <div className="text-[13px] md:text-[14px] leading-relaxed italic mb-6">{`"${rev.comment}"`}</div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <span className="text-[10px] font-black uppercase">{rev.name}</span>
                        <CheckCircle size={12} className="text-green-600" />
                    </div>
                </div>
            ))}
        </div>
      </section>
    </main>
  );
}