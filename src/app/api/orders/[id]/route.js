import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Best practice: Global level par client check karein taake connections overload na hon
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // ERROR FIX: 'id' ko integer mein convert karna lazmi hai
    const orderId = parseInt(id);

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid Order ID" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order status" }, 
      { status: 500 }
    );
  }
}