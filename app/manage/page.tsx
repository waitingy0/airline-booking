"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type BookingDetail = {
  bookingRef: string;
  status: "confirmed" | "cancelled";
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
  };
  schedule: {
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

export default function ManageBookingPage() {
  const [bookingRef, setBookingRef] = useState("");
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setMessage("");
    setBooking(null);

    try {
      const ref = bookingRef.trim().toUpperCase();
      const response = await fetch(`/api/bookings/${ref}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "Booking not found.");
        return;
      }

      setBooking(data.booking);
    } catch {
      setMessage("Something went wrong while searching for the booking.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCancel() {
    if (!booking) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel booking ${booking.bookingRef}?`
    );

    if (!confirmed) {
      return;
    }

    setIsCancelling(true);
    setMessage("");

    try {
      const response = await fetch(`/api/bookings/${booking.bookingRef}`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "Failed to cancel booking.");
        return;
      }

      setBooking(data.booking);
      setMessage(data.message || "Booking cancelled successfully.");
    } catch {
      setMessage("Something went wrong while cancelling the booking.");
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-medium text-blue-700">
          ← Back to home
        </Link>

        <section className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900">
            Manage Booking
          </h1>

          <p className="mt-3 text-slate-600">
            Enter your booking reference to view or cancel your booking.
          </p>

          <form onSubmit={handleSearch} className="mt-6 flex flex-col gap-4 md:flex-row">
            <input
              value={bookingRef}
              onChange={(event) => setBookingRef(event.target.value)}
              placeholder="Example: DFA-ABCDEFGH"
              required
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-slate-400"
            >
              {isLoading ? "Searching..." : "Find Booking"}
            </button>
          </form>

          {message && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
              {message}
            </div>
          )}
        </section>

        {booking && (
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                  Booking Reference
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {booking.bookingRef}
                </h2>

                <p className="mt-3">
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

              <div className="text-left md:text-right">
                <p className="text-2xl font-bold text-slate-900">
                  NZD ${booking.schedule.price}
                </p>
                <p className="text-sm text-slate-500">total price</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Passenger
                </h3>

                <p className="mt-3 text-slate-700">
                  {booking.passenger.firstName} {booking.passenger.lastName}
                </p>

                <p className="mt-1 text-slate-600">
                  {booking.passenger.email}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900">
                  Flight
                </h3>

                <p className="mt-3 text-xl font-semibold text-slate-800">
                  {booking.schedule.flightNo}
                </p>

                <p className="mt-1 text-slate-700">
                  {booking.schedule.origin.code} →{" "}
                  {booking.schedule.destination.code}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-500">
                  Departure
                </p>
                <p className="mt-2 font-medium text-slate-800">
                  {booking.schedule.departureDisplay}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-500">
                  Arrival
                </p>
                <p className="mt-2 font-medium text-slate-800">
                  {booking.schedule.arrivalDisplay}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-500">
                  Aircraft
                </p>
                <p className="mt-2 font-medium text-slate-800">
                  {booking.schedule.aircraft.type}
                </p>
              </div>
            </div>

            {booking.status === "confirmed" && (
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="mt-6 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:bg-slate-400"
              >
                {isCancelling ? "Cancelling..." : "Cancel Booking"}
              </button>
            )}
          </section>
        )}
      </div>
    </main>
  );
}