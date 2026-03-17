import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, shopName, upiId, gstNumber } = await req.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        shopName,
        upiId,
        gstNumber,
      },
    });

    return NextResponse.json({
      message: "Settings updated successfully",
      user: {
        name: user.name,
        shopName: user.shopName,
        upiId: user.upiId,
        gstNumber: user.gstNumber,
      },
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
