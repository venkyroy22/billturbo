import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/bills/[id]/status — public, returns isPaid status
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const bill = await prisma.bill.findUnique({
      where: { id },
      select: { id: true, isPaid: true, paidAt: true, totalAmount: true, billNumber: true },
    });
    if (!bill) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(bill);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// PATCH /api/bills/[id]/status — mark as paid (requires auth = merchant OR public flag)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  // Allow merchant to mark paid (requires session)
  // or allow a customer "I've paid" confirmation (public, sets isPaid=true)
  const session = await getServerSession(authOptions);
  const isMerchant = Boolean(session?.user?.id);

  try {
    const bill = await prisma.bill.findUnique({
      where: { id },
      select: { id: true, shopId: true, isPaid: true },
    });

    if (!bill) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // If merchant, verify they own the bill
    if (isMerchant && bill.shopId !== session!.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.bill.update({
      where: { id },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
      select: { id: true, isPaid: true, paidAt: true },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
