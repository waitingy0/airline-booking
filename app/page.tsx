import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center text-center">
        <p className="mb-4 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          Dairy Flat Airways
        </p>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-900">
          Premium regional flight booking from Dairy Flat Airport
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Search scheduled flights, make bookings, manage booking references,
          and view passenger flight records.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/search"
            className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
          >
            Search Flights
          </Link>

          <Link
            href="/manage"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50"
          >
            Manage Booking
          </Link>

          <Link
            href="/passenger"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50"
          >
            Passenger Flights
          </Link>
        </div>
      </section>
    </main>
  );
}