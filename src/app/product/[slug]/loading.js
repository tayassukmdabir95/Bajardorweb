
export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-base-200 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl animate-pulse space-y-8">
        <div className="skeleton h-5 w-40" />

        <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="skeleton h-28 w-28 shrink-0 rounded-3xl" />

            <div className="flex-1 space-y-4">
              <div className="skeleton h-5 w-32" />
              <div className="skeleton h-10 w-2/3" />
              <div className="skeleton h-5 w-1/2" />
              <div className="skeleton h-9 w-44" />
            </div>
          </div>
        </div>

        <div className="skeleton h-8 w-48" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="skeleton h-28" />
          <div className="skeleton h-28" />
          <div className="skeleton h-28" />
        </div>

        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-56 w-full rounded-2xl" />
      </div>
    </main>
  );
}
