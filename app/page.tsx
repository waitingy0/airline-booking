import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-slate-600">
            airport project
          </p>

          <h1 className="mt-3 max-w-3xl text-4xl font-bold text-slate-900">
            Dairy Flat Airways Booking System
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700">
            This web application allows users to search scheduled flights, make
            bookings, view invoices, cancel bookings, and find flights booked by
            a passenger.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link
            href="/search"
            className="rounded-lg bg-blue-700 px-5 py-4 font-semibold text-white hover:bg-blue-800"
          >
            Search Flights
          </Link>

          <Link
            href="/manage"
            className="rounded-lg border border-slate-300 bg-white px-5 py-4 font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Manage Booking
          </Link>

          <Link
            href="/passenger"
            className="rounded-lg border border-slate-300 bg-white px-5 py-4 font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            Passenger Flights
          </Link>
        </div>

        <section className="mt-6 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Project Functions
          </h2>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li>Search for flights between supported airports.</li>
            <li>Create a booking by entering passenger details.</li>
            <li>Use a booking reference to view or cancel a booking.</li>
            <li>Search passenger bookings by email address.</li>
          </ul>
        </section>
      </section>
    </main>
  );
}
