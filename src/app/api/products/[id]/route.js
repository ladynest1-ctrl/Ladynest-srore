import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

// GET: Single Product
export async function GET(request, { params }) {
  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Parse images and colors
    let parsedImages = [];
    let parsedColors = [];
    
    try {
      parsedImages = typeof product.images === 'string' 
        ? JSON.parse(product.images) 
        : (Array.isArray(product.images) ? product.images : []);
    } catch (e) {
      parsedImages = [];
    }
    
    try {
      parsedColors = typeof product.colors === 'string' 
        ? JSON.parse(product.colors) 
        : (Array.isArray(product.colors) ? product.colors : []);
    } catch (e) {
      parsedColors = [];
    }

    const formattedProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      rating: product.rating || 5,
      priority: product.priority || 0,
      description: product.description || "",
      images: parsedImages,
      colors: parsedColors,
      // Default values for now
      stockStatus: "in-stock",
      discount: 0,
      featured: false
    };

    return NextResponse.json(formattedProduct);
    
  } catch (error) {
    console.error("API Fetch Error:", error);
    return NextResponse.json({ error: "Fetch failed: " + error.message }, { status: 500 });
  }
}

// PUT: Update Product (without extra fields)
export async function PUT(request, { params }) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Prepare images and colors
    let imagesData = body.images;
    let colorsData = body.colors;
    
    if (Array.isArray(body.images)) {
      imagesData = JSON.stringify(body.images);
    }
    
    if (Array.isArray(body.colors)) {
      colorsData = JSON.stringify(body.colors);
    }

    // Sirf existing fields update karo
    const updateData = {
      name: body.name,
      price: parseFloat(body.price),
      category: body.category,
      rating: body.rating ? parseFloat(body.rating) : 5,
      description: body.description || "",
      priority: body.priority !== undefined ? parseInt(body.priority) : 0,
      images: imagesData,
      colors: colorsData,
    };
    
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Product updated successfully",
      product: updatedProduct 
    });
    
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ 
      error: "Update failed: " + error.message 
    }, { status: 500 });
  }
}

// DELETE: Product
export async function DELETE(request, { params }) {
  const { id } = await params;
  
  try {
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    
    await prisma.product.delete({
      where: { id: productId },
    });
    
    return NextResponse.json({ 
      success: true,
      message: "Product deleted successfully" 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ 
      error: "Delete failed: " + error.message 
    }, { status: 500 });
  }
}