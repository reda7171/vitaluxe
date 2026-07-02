import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";

// GET pending orders & messages count for admin badge
export async function GET() {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
        return NextResponse.json({ count: 0, messagesCount: 0 });
    }

    const [count, messagesCount, prescriptionsCount, reviewsCount, lowStockCount, abandonedCartsCount, settings] = await Promise.all([
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.contactMessage.count({ where: { status: "UNREAD" } }),
        prisma.prescription.count({ where: { status: "PENDING" } }),
        prisma.review.count({ where: { status: "PENDING" } }),
        prisma.product.count({ where: { stock: { lt: 10 } } }),
        prisma.abandonedCart.count({ where: { updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
        prisma.storeSettings.findUnique({ where: { id: "1" } })
    ]);

    let modules = { enableServices: true };
    if (settings?.modules) {
        try {
            modules = JSON.parse(settings.modules);
        } catch (e) {
            console.error(e);
        }
    }

    return NextResponse.json({ count, messagesCount, prescriptionsCount, reviewsCount, lowStockCount, abandonedCartsCount, modules });
}
