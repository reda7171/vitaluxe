import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

// GET /api/admin/cron/abandoned-carts
// À appeler via un cron job (ex: Vercel Cron, GitHub Actions, ou cURL)
// Protégé par CRON_SECRET

export async function GET(req: NextRequest) {
    const secret = req.headers.get("x-cron-secret");
    if (secret !== process.env.CRON_SECRET && process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // il y a 24h

    // Paniers abandonnés depuis +24h, email pas encore envoyé, non récupérés
    const abandoned = await prisma.abandonedCart.findMany({
        where: {
            updatedAt: { lt: cutoff },
            sentAt: null,
            recoveredAt: null,
        },
        take: 50, // batch de 50 max
    });

    let sent = 0;
    let failed = 0;

    for (const cart of abandoned) {
        try {
            let items: any[] = [];
            try {
                const parsed = JSON.parse(cart.items as any);
                items = Array.isArray(parsed) ? parsed : [];
            } catch {
                items = [];
            }
            const rows = items.map((item: any) =>
                `<tr>
                    <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;">${item.product?.name ?? item.name}</td>
                    <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#64748b;text-align:center;">x${item.quantity}</td>
                    <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;font-weight:700;color:#103178;text-align:right;">${((item.product?.salePrice ?? item.product?.price ?? item.price) * item.quantity).toFixed(2)} MAD</td>
                </tr>`
            ).join("");

            const cartUrl = `${process.env.NEXTAUTH_URL ?? "https://vitaluxe.ma"}/checkout`;

            if (process.env.RESEND_API_KEY) {
                await resend.emails.send({
                    from: "Vitaluxe <no-reply@vitaluxe.ma>",
                    to: cart.email,
                    subject: `🛒 Vous avez oublié quelque chose, ${cart.name?.split(" ")[0] ?? "cher client"} !`,
                    html: `
                    <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#f8fafc;">
                        <div style="background:linear-gradient(135deg,#103178,#2d6a4f);padding:36px;border-radius:16px 16px 0 0;text-align:center;">
                            <h1 style="color:white;margin:0;font-size:26px;font-weight:900;letter-spacing:-0.5px;">Vitaluxe</h1>
                            <p style="color:#93c5fd;margin:6px 0 0;font-size:14px;">Parapharmacie en ligne</p>
                        </div>
                        <div style="background:white;padding:36px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;">
                            <h2 style="color:#1e293b;margin:0 0 8px;font-size:20px;">Vous avez laissé quelque chose derrière vous ! 😊</h2>
                            <p style="color:#64748b;margin:0 0 24px;font-size:15px;">Bonjour <strong>${cart.name ?? "cher client"}</strong>, votre panier vous attend encore chez Vitaluxe.</p>

                            <h3 style="color:#1e293b;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;">Votre panier :</h3>
                            <table style="width:100%;border-collapse:collapse;">
                                ${rows}
                                <tr>
                                    <td colspan="2" style="padding:12px 0;font-weight:700;color:#1e293b;font-size:15px;">Total</td>
                                    <td style="padding:12px 0;font-weight:900;color:#103178;font-size:16px;text-align:right;">${cart.totalAmount.toFixed(2)} MAD</td>
                                </tr>
                            </table>

                            <div style="text-align:center;margin:32px 0;">
                                <a href="${cartUrl}" style="background:linear-gradient(135deg,#103178,#2d6a4f);color:white;padding:14px 32px;text-decoration:none;border-radius:12px;font-weight:800;font-size:15px;display:inline-block;letter-spacing:0.01em;">
                                    ✅ Finaliser ma commande
                                </a>
                            </div>

                            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-top:8px;">
                                <p style="margin:0;color:#166534;font-size:13px;text-align:center;">
                                    🚚 Livraison rapide · 🔒 Paiement sécurisé · 💊 Produits authentiques
                                </p>
                            </div>

                            <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;text-align:center;">
                                Si vous ne souhaitez plus recevoir ces emails, <a href="${process.env.NEXTAUTH_URL ?? "https://vitaluxe.ma"}/unsubscribe?email=${encodeURIComponent(cart.email)}" style="color:#103178;">cliquez ici</a>.
                            </p>
                        </div>
                    </div>`,
                });
            } else {
                console.log(`📧 [DEV] Abandon panier → ${cart.email} (${cart.totalAmount} MAD)`);
            }

            // Marquer comme envoyé
            await prisma.abandonedCart.update({
                where: { id: cart.id },
                data: { sentAt: new Date() },
            });
            sent++;
        } catch (err) {
            console.error(`Echec email panier abandonné ${cart.email}:`, err);
            failed++;
        }
    }

    return NextResponse.json({
        processed: abandoned.length,
        sent,
        failed,
        timestamp: new Date().toISOString(),
    });
}
