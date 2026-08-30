import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { orderId, newStatus } = await req.json();
    
    const updatedOrder = await prisma.order.update({
      where: { id: orderId }, // Agar error aaye to parseInt(orderId) kar dein
      data: { status: newStatus },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}