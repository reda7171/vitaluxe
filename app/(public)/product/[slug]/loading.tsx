export default function Loading() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
            <div className="grid md:grid-cols-2 gap-12">
                {/* Images */}
                <div className="space-y-3">
                    <div className="aspect-square bg-slate-200 rounded-2xl" />
                    <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-slate-200 rounded-xl" />)}
                    </div>
                </div>
                {/* Info */}
                <div className="space-y-5 pt-4">
                    <div className="h-5 bg-slate-200 rounded-full w-1/3" />
                    <div className="h-8 bg-slate-200 rounded-full w-3/4" />
                    <div className="h-8 bg-slate-200 rounded-full w-1/4" />
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-200 rounded-full" />
                        <div className="h-3 bg-slate-200 rounded-full" />
                        <div className="h-3 bg-slate-200 rounded-full w-5/6" />
                    </div>
                    <div className="h-12 bg-slate-200 rounded-xl mt-6" />
                </div>
            </div>
        </div>
    );
}
