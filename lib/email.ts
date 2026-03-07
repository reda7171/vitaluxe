// Shared email templates
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export async function sendOrderConfirmationEmail({
    to, name, orderId, items, total, paymentMethod,
}: {
    to: string;
    name: string;
    orderId: string;
    items: { name: string; quantity: number; price: number }[];
    total: number;
    paymentMethod: string;
}) {
    if (!process.env.RESEND_API_KEY) {
        console.log("📧 [DEV] Confirmation commande #" + orderId.slice(0, 8));
        return;
    }

    const rows = items.map(i =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9">${i.name} x${i.quantity}</td><td style="text-align:right;padding:8px 0;border-bottom:1px solid #f1f5f9">${i.price * i.quantity} MAD</td></tr>`
    ).join("");

    await resend.emails.send({
        from: "Vitaluxe <commandes@vitaluxe.ma>",
        to,
        subject: `✅ Commande confirmée #${orderId.slice(0, 8).toUpperCase()} — Vitaluxe`,
        html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#f8fafc;">
            <div style="background:linear-gradient(135deg,#103178,#1a4db8);padding:32px;border-radius:16px 16px 0 0;text-align:center;">
                <h1 style="color:white;margin:0;font-size:24px;font-weight:900;">Vitaluxe</h1>
                <p style="color:#93c5fd;margin:8px 0 0;">Parapharmacie en ligne</p>
            </div>
            <div style="background:white;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;">
                <h2 style="color:#1e293b;margin:0 0 8px;">Merci pour votre commande, ${name || "cher client"} !</h2>
                <p style="color:#64748b;margin:0 0 24px;">Votre commande <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> a bien été reçue et est en cours de traitement.</p>

                <h3 style="color:#1e293b;font-size:14px;margin:0 0 12px;">Récapitulatif :</h3>
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                    ${rows}
                    <tr>
                        <td style="padding:12px 0;font-weight:900;color:#103178;">Total</td>
                        <td style="text-align:right;padding:12px 0;font-weight:900;color:#103178;">${total} MAD</td>
                    </tr>
                </table>

                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-top:24px;">
                    <p style="margin:0;color:#166534;font-size:13px;">💳 Mode de paiement : <strong>${paymentMethod}</strong></p>
                </div>

                <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;text-align:center;">
                    Des questions ? Contactez-nous à <a href="mailto:support@vitaluxe.ma" style="color:#103178;">support@vitaluxe.ma</a>
                </p>
            </div>
        </div>`,
    });
}

export async function sendPasswordResetEmail({
    to, name, resetUrl,
}: {
    to: string;
    name: string;
    resetUrl: string;
}) {
    if (!process.env.RESEND_API_KEY) {
        console.log(`📧 [DEV] Récupération mot de passe pour ${to}: ${resetUrl}`);
        return;
    }

    await resend.emails.send({
        from: "Vitaluxe <support@vitaluxe.ma>",
        to,
        subject: `🔒 Réinitialisation de votre mot de passe — Vitaluxe`,
        html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#f8fafc;">
            <div style="background:linear-gradient(135deg,#103178,#1a4db8);padding:32px;border-radius:16px 16px 0 0;text-align:center;">
                <h1 style="color:white;margin:0;font-size:24px;font-weight:900;">Vitaluxe</h1>
            </div>
            <div style="background:white;padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;">
                <h2 style="color:#1e293b;margin:0 0 16px;">Réinitialisation de votre mot de passe</h2>
                <p style="color:#64748b;margin:0 0 24px;">Bonjour ${name},<br/><br/>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour le modifier.</p>

                <div style="text-align:center;margin:32px 0;">
                    <a href="${resetUrl}" style="background:#103178;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;border:1px solid #1a4db8;">
                        Réinitialiser mon mot de passe
                    </a>
                </div>

                <p style="color:#64748b;font-size:12px;margin:24px 0 0;">Si le bouton ne fonctionne pas, copiez ce lien :<br/><span style="color:#103178;word-break:break-all;">${resetUrl}</span></p>

                <p style="margin:32px 0 0;color:#94a3b8;font-size:12px;text-align:center;">
                    Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
                </p>
            </div>
        </div>`,
    });
}
