import { prisma } from "../../../lib/prisma"; 
import { NextResponse } from "next/server";

// 1. GET: Products fetch karein with Priority Logic
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: [
        // Pehle priority (1, 2, 3...) phir naya stock (Date)
        { priority: "asc" }, 
        { createdAt: "desc" }
      ],
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// 2. POST: Naya product add karein
export async function POST(req) {
  try {
    const body = await req.json();
    
    // Validation
    if (!body.name || !body.price) {
      return NextResponse.json({ error: "Name and Price are required" }, { status: 400 });
    }

    // Numbers ko safely parse karein taake error na aaye
    const price = parseFloat(body.price);
    const rating = body.rating ? parseFloat(body.rating) : 5.0;
    
    // Logic: Agar priority nahi di gayi, to usay 100 rakhein 
    // taake wo 1, 2, 3 wali priority ke niche nazar aaye.
    const priority = body.priority !== undefined && body.priority !== "" 
      ? parseInt(body.priority) 
      : 100;

    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        price: price,
        description: body.description || "",
        category: body.category || "General",
        // Images aur colors agar string hain to array mein convert karein (safety check)
        images: Array.isArray(body.images) ? body.images : [], 
        colors: Array.isArray(body.colors) ? body.colors : [],
        priority: priority, 
        rating: rating,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    // Error message detail mein bhejein taake debugging asan ho
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}