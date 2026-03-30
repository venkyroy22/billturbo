import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { totalAmount, subtotal, gstTotal, customerName, customerPhone, items } = await req.json();

    // For SQLite compatibility, we need to handle billNumber manually since it's not the primary ID
    const maxBill = await prisma.bill.findFirst({
      orderBy: { billNumber: 'desc' },
      select: { billNumber: true }
    });
    
    const nextBillNumber = (maxBill?.billNumber || 0) + 1;

    const bill = await prisma.bill.create({
      data: {
        billNumber: nextBillNumber,
        totalAmount: parseFloat(totalAmount),
        subtotal: parseFloat(subtotal),
        gstTotal: parseFloat(gstTotal),
        customerName,
        customerPhone,
        shopId: session.user.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            price: parseFloat(item.price),
            quantity: parseInt(item.quantity),
            gstPercent: parseFloat(item.gstPercent),
            subtotal: parseFloat(item.subtotal),
          })),
        },
      },
    });

    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    console.error("Bill generation error:", error);
    return NextResponse.json({ error: "Failed to generate bill" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const bills = await prisma.bill.findMany({
      where: { shopId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
      // isPaid and paidAt are automatically included (part of model)
    });
    return NextResponse.json(bills);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bills" }, { status: 500 });
  }
}
