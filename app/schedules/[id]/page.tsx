"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type ScheduleDetail = {
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
  capacity: number;
  confirmedBookings: number;
  remainingSeats: number;
  isFull: boolean;
};

export default function ScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const scheduleId = params.id as string;

  const [schedule, setSchedule] = useState<ScheduleDetail | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadSchedule() {
      try {
        const response = await fetch(`/api/schedules/${scheduleId}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          setMessage(data.message || "Failed to load flight.");
          return;
        }

        setSchedule(data.schedule);
      } catch {
        setMessage("Something went wrong while loading the flight.");
      } finally {
        setIsLoading(false);
      }
    }

    if (scheduleId) {
      loadSchedule();
    }
  }, [scheduleId]);

  async function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!schedule) {
      return;
    }

    setIsBooking(true);
    setMessage("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scheduleId: schedule.id,
          passenger: {
            firstName,
            lastName,
            email,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "Failed to create booking.");
        return;
      }

      router.push(`/booking/${data.bookingRef}`);
    } catch {
      setMessage("Something went wrong while creating the booking.");
    } finally {
      setIsBooking(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm">
          Loading flight details...
        </div>
      </main>
    );
  }

  if (!schedule) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-red-700">{message || "Flight not found."}</p>
          <Link href="/search" className="mt-4 inline-block text-blue-700">
            ← Back to search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/search" className="text-sm font-medium text-blue-700">
          ← Back to search
        </Link>

        <section className="mt-5 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                {schedule.flightNo}
              </h1>

              <p className="mt-2 text-xl font-semibold text-slate-700">
                {schedule.origin.code} → {schedule.destination.code}
              </p>

              <p className="mt-1 text-slate-600">
                {schedule.origin.name} to {schedule.destination.name}
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-3xl font-bold text-slate-900">
                NZD ${schedule.price}
              </p>
              <p className="text-sm text-slate-500">per passenger</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-5 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Departure
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {schedule.departureDisplay}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">Arrival</p>
              <p className="mt-1 font-medium text-slate-800">
                {schedule.arrivalDisplay}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500">Aircraft</p>
              <p className="mt-1 font-medium text-slate-800">
                {schedule.aircraft.type}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 p-4">
            <p className="font-semibold text-slate-800">
              Seats available:{" "}
              <span
                className={
                  schedule.isFull ? "text-red-700" : "text-green-700"
                }
              >
                {schedule.remainingSeats} / {schedule.capacity}
              </span>
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Passenger Details
          </h2>

          {schedule.isFull ? (
            <p className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">
              This flight is full and cannot accept new bookings.
            </p>
          ) : (
            <form onSubmit={handleBooking} className="mt-5 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    First name
                  </span>
                  <input
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    required
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Last name
                  </span>
                  <input
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    required
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>

              {message && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isBooking}
                className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-slate-400"
              >
                {isBooking ? "Creating booking..." : "Confirm Booking"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}