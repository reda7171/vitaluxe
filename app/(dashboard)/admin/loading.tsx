export default function AdminLoading() {
    return (
        <div className="space-y-5 animate-pulse">
            <div className="h-8 bg-slate-200 rounded-xl w-48" />
            <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 shadow-sm" />
                ))}
            </div>
            <div className="h-64 bg-white rounded-2xl border border-slate-200 shadow-sm" />
            <div className="h-48 bg-white rounded-2xl border border-slate-200 shadow-sm" />
        </div>
    );
}
