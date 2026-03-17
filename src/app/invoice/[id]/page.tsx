import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import InvoiceClient from "@/components/invoice/InvoiceClient";

async function getBill(id: string) {
  if (!id) return null;
  const bill = await prisma.bill.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
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
  const bill = await getBill(id);

  if (!bill) {
    notFound();
  }

  return <InvoiceClient bill={bill} />;
}
