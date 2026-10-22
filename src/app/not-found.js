
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-base-200 px-4 py-12">
      <section className="card w-full max-w-lg border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body items-center p-8 text-center sm:p-12">
          <div className="text-6xl" aria-hidden="true">
            🔎
          </div>

          <p className="mt-3 text-sm font-bold uppercase tracking-widest text-success">
            Error 404
          </p>

          <h1 className="text-3xl font-extrabold">
            পেজটি খুঁজে পাওয়া যায়নি
          </h1>

          <p className="text-base-content/60">
            আপনি যে পেজটি খুঁজছেন সেটি নেই অথবা সরিয়ে ফেলা হয়েছে।
          </p>

          <Link href="/" className="btn btn-success mt-4">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </section>
    </main>
  );
}
