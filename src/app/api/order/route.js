import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { sendEmail, sendOrderEmail } from "../../../lib/email";
import { SITE_EMAIL } from "../../../lib/siteConfig";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export async function POST(request) {
  try {
    const body = await request.json();

    const customerName = String(body.customerName || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const address = String(body.address || "").trim();
    const city = String(body.city || "").trim();
    const productName = String(body.productName || "").trim();
    const colorSelected = String(body.colorSelected || "Default").trim();
    const totalPrice = Number(body.totalPrice) || 0;
    const deliveryCharges = Number(body.deliveryCharges) || 0;
    const paymentMethod = String(body.paymentMethod || "COD").trim();
    const notes = String(body.notes || "").trim();

    if (!customerName || !phone || !address || !productName) {
      return NextResponse.json(
        { error: "Customer name, phone, address, and product are required." },
        { status: 400 }
      );
    }

    const newOrder = await prisma.order.create({
      data: {
        customerName,
        email: email || null,
        phone,
        address,
        city: city || "Pakistan",
        productName,
        colorSelected,
        totalPrice,
        status: "PENDING",
        paymentMethod,
      },
    });

    const orderTotal = Number(newOrder.totalPrice || totalPrice || 0);
    const adminEmail = process.env.ORDER_NOTIFICATION_EMAIL || SITE_EMAIL;

    try {
      if (email) {
        await sendEmail({
          to: email,
          from: process.env.SMTP_FROM || process.env.EMAIL_USER || SITE_EMAIL,
          replyTo: process.env.CONTACT_NOTIFICATION_EMAIL || SITE_EMAIL,
          subject: `Order Confirmed: ${productName}`,
          html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 640px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #ffffff;">
              <div style="background: #C5A25D; padding: 24px; text-align: center; color: #fff;">
                <h1 style="margin: 0; font-size: 28px; letter-spacing: 3px; text-transform: uppercase; font-weight: 300;">LadyNest</h1>
              </div>
              <div style="padding: 32px 24px; color: #1f2937;">
                <h2 style="margin-top: 0; text-align: center;">Thank You for Your Order!</h2>
                <p style="line-height: 1.7; text-align: center;">Hello ${customerName}, your order has been successfully placed. Our team will contact you for confirmation before dispatch.</p>
                <div style="background: #fcf9f3; border: 1px dashed #C5A25D; border-radius: 10px; padding: 20px; margin: 24px 0;">
                  <h3 style="margin-top: 0; color: #C5A25D; font-size: 14px; letter-spacing: 1px; text-transform: uppercase;">Order Summary</h3>
                  <p><strong>Order ID:</strong> #${newOrder.id}</p>
                  <p><strong>Product:</strong> ${productName}</p>
                  <p><strong>Color:</strong> ${colorSelected}</p>
                  <p><strong>Total Amount:</strong> Rs. ${orderTotal.toLocaleString()}</p>
                </div>
                <div style="padding-top: 8px; border-top: 1px solid #f3f4f6;">
                  <p><strong>Shipping Address:</strong> ${address}${city ? `, ${city}` : ""}</p>
                  <p><strong>Contact:</strong> ${phone}</p>
                </div>
                <p style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 13px;">If you have any questions, reply to this email or contact us through WhatsApp.</p>
                <p style="margin-top: 14px; text-align: center; color: #C5A25D; font-weight: 700;">Thank you for choosing LadyNest!</p>
              </div>
            </div>
          `,
        });
      }

      // Send admin notification using helper
      await sendOrderEmail({
        ...newOrder,
        quantity: newOrder.quantity || 1,
        deliveryCharges,
      });
    } catch (mailError) {
      console.warn("[ORDER_EMAIL] Failed to send order notification", {
        orderId: newOrder.id,
        customerEmail: email,
        recipient: adminEmail,
        code: mailError?.code,
        message: mailError?.message,
      });
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("[ORDER_API] Error:", {
      message: error?.message,
      code: error?.code,
    });
    return NextResponse.json({ error: "Order Processing Failed. Please try again later." }, { status: 500 });
  }
}