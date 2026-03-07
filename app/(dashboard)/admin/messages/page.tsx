import prisma from "@/lib/prisma";
import MessagesListClient from "@/components/dashboard/MessagesListClient";

export default async function MessagesPage() {
    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Messages de contact</h1>
                <p className="text-slate-500 text-sm mt-1">Gérez les demandes de vos clients depuis le site</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
                    <span className="text-sm font-semibold flex-1">Expéditeur</span>
                    <span className="text-sm font-semibold w-1/4">Sujet</span>
                    <span className="text-sm font-semibold w-32 text-center">Statut</span>
                    <span className="text-sm font-semibold w-32 text-right flex flex-col items-end">Date</span>
                </div>
                <MessagesListClient initialMessages={messages} />
            </div>
        </div>
    );
}
