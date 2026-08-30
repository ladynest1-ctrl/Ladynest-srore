import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User nahi mila!" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Ghalat password!" }, { status: 401 });
    }

    return NextResponse.json({ 
      message: "Login kamyab!", 
      user: { id: user.id, name: user.name, email: user.email } 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Login mein masla hai" }, { status: 500 });
  }
}
