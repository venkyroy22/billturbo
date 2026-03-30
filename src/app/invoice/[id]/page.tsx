import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import InvoiceClient from "@/components/invoice/InvoiceClient";

async function getBill(id: string) {
  if (!id) return null;
  const bill = await prisma.bill.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          shopName: true,
          upiId: true,
          gstNumber: true,
        },
      },
      items: true,
    },
  });
  if (!bill) return null;
  return bill;
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [bill, session] = await Promise.all([
    getBill(id),
    getServerSession(authOptions),
  ]);

  if (!bill) notFound();

  // Determine if the logged-in user is the merchant who owns this bill
  const isMerchant = session?.user?.id === bill.owner.id;

  return <InvoiceClient bill={bill} isMerchant={isMerchant} />;
}
