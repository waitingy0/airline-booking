"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type PassengerBooking = {
  bookingRef: string;
  status: "confirmed" | "cancelled";
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
  };
  schedule: {
    id: string;
    flightNo: string;
    origin: {
      code: string;
      name: string;
    };
    destination: {
      code: string;
      name: string;
    };
    aircraft: {
      type: string;
    };
    departureDisplay: string;
    arrivalDisplay: string;
    price: number;
  };
};

export default function PassengerFlightsPage() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<PassengerBooking[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setMessage("");
    setBookings([]);

    try {
      const params = new URLSearchParams({
        email: email.trim().toLowerCase(),
      });

      const response = await fetch(`/api/passenger-bookings?${params}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "Failed to find passenger bookings.");
        return;
      }

      setBookings(data.bookings);

      if (data.bookings.length === 0) {
        setMessage("No bookings were found for this passenger email.");
      }
    } catch {
      setMessage("Something went wrong while searching passenger bookings.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-sm font-medium text-blue-700">
          Back to home
        </Link>

        <section className="mt-5 rounded-lg bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Passenger Flights
          </h1>

          <p className="mt-3 text-slate-600">
            Enter a passenger email address to show their bookings.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-6 flex flex-col gap-4 md:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Example: passenger@example.com"
              required
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-slate-400"
            >
              {isLoading ? "Searching..." : "Passenger Flights"}
            </button>
          </form>

          {message && (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
              {message}
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-5">
          {bookings.map((booking) => (
            <article
              key={booking.bookingRef}
              className="rounded-lg bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                    {booking.bookingRef}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {booking.schedule.flightNo}
                  </h2>

                  <p className="mt-1 text-lg font-semibold text-slate-700">
                    {booking.schedule.origin.code} to{" "}
                    {booking.schedule.destination.code}
                  </p>

                  <p className="mt-1 text-slate-600">
                    {booking.schedule.origin.name} to{" "}
                    {booking.schedule.destination.name}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    NZD ${booking.schedule.price}
                  </p>

                  <p className="mt-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 rounded-lg bg-slate-50 p-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Departure
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {booking.schedule.departureDisplay}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Arrival
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {booking.schedule.arrivalDisplay}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Aircraft
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {booking.schedule.aircraft.type}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/booking/${booking.bookingRef}`}
                  className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-700"
                >
                  View Invoice
                </Link>

                <Link
                  // href="/manage"
                  href={`/manage?ref=${booking.bookingRef}`}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Manage Booking
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
