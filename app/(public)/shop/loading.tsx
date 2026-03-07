export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50 animate-pulse">
            {/* Hero skeleton */}
            <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 rounded-none" />

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Grid skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="aspect-square bg-slate-200" />
                            <div className="p-4 space-y-2">
                                <div className="h-3 bg-slate-200 rounded-full w-3/4" />
                                <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                                <div className="h-4 bg-slate-200 rounded-full w-1/3 mt-3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
