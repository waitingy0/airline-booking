"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type BookingDetail = {
  bookingRef: string;
  status: "confirmed" | "cancelled";
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
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
      capacity: number;
    };
    departureDisplay: string;
    arrivalDisplay: string;
    price: number;
  };
};

export default function BookingInvoicePage() {
  const params = useParams();
  const ref = params.ref as string;

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBooking() {
      try {
        const response = await fetch(`/api/bookings/${ref}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          setMessage(data.message || "Failed to load booking.");
          return;
        }

        setBooking(data.booking);
      } catch {
        setMessage("Something went wrong while loading the booking.");
      } finally {
        setIsLoading(false);
      }
    }

    if (ref) {
      loadBooking();
    }
  }, [ref]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-sm">
          Loading invoice...
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-sm">
          <p className="text-red-700">{message || "Booking not found."}</p>
          <Link href="/search" className="mt-4 inline-block text-blue-700">
            Back to search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-medium text-blue-700">
          Back to home
        </Link>

        <section className="mt-5 rounded-lg bg-white p-6 shadow-sm">
          <div className="border-b border-slate-200 pb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Booking invoice
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Booking Details
            </h1>

            <p className="mt-3 text-slate-600">Booking reference:</p>

            <p className="mt-2 inline-block rounded-lg bg-slate-900 px-4 py-2 text-xl font-bold text-white">
              {booking.bookingRef}
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">Passenger</h2>

              <p className="mt-3 text-slate-700">
                {booking.passenger.firstName} {booking.passenger.lastName}
              </p>

              <p className="mt-1 text-slate-600">
                {booking.passenger.email}
              </p>

              <p className="mt-4">
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

            <div className="rounded-lg bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">Flight</h2>

              <p className="mt-3 text-xl font-semibold text-slate-800">
                {booking.schedule.flightNo}
              </p>

              <p className="mt-1 text-slate-700">
                {booking.schedule.origin.code} to{" "}
                {booking.schedule.destination.code}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {booking.schedule.origin.name} to{" "}
                {booking.schedule.destination.name}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-500">
                Departure
              </p>
              <p className="mt-2 font-medium text-slate-800">
                {booking.schedule.departureDisplay}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-500">
                Arrival
              </p>
              <p className="mt-2 font-medium text-slate-800">
                {booking.schedule.arrivalDisplay}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-500">
                Aircraft
              </p>
              <p className="mt-2 font-medium text-slate-800">
                {booking.schedule.aircraft.type}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-lg bg-slate-50 p-6">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-slate-800">
                Total
              </p>

              <p className="text-2xl font-bold text-slate-900">
                NZD ${booking.schedule.price}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/search"
              className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800"
            >
              Search Flights
            </Link>

            <Link
              href={`/manage?ref=${booking.bookingRef}`}
              className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50"
            >
              Manage Booking
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}   
