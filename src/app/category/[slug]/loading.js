
export default function Loading() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-10 sm:py-14">
      <div className="skeleton mb-3 h-9 w-56" />
      <div className="skeleton mb-8 h-5 w-72 max-w-full" />

      <div className="mb-8 flex justify-end">
        <div className="skeleton h-12 w-full sm:w-64" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="card border border-base-200 bg-base-100"
          >
            <div className="card-body gap-4 p-5">
              <div className="skeleton h-16 w-16 rounded-2xl" />
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton mt-3 h-8 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
