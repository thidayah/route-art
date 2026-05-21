export default function RouteDetailLoading() {
  return (
    <div className="min-h-screen bg-neutral-950 pt-16 animate-pulse">
      <div className="h-[50vh] sm:h-[60vh] bg-neutral-900" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6 relative z-10">
        <div className="bg-neutral-900 rounded-2xl border border-white/8 p-6 sm:p-8">
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-24 bg-neutral-800 rounded-full" />
            <div className="h-6 w-16 bg-neutral-800 rounded-full" />
          </div>
          <div className="h-8 bg-neutral-800 rounded-lg w-3/4 mb-2" />
          <div className="h-4 bg-neutral-800 rounded w-1/3 mb-8" />
          <div className="h-20 bg-neutral-800 rounded-xl mb-8" />
          <div className="h-11 bg-neutral-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
