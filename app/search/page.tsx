"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type AirportOption = {
  code: string;
  name: string;
};

type ScheduleResult = {
  id: string;
  flightNo: string;
  origin: {
    code: string;
    name: string;
    timezone: string;
  };
  destination: {
    code: string;
    name: string;
    timezone: string;
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

const airports: AirportOption[] = [
  { code: "NZNE", name: "Dairy Flat Airport" },
  { code: "YSSY", name: "Sydney Airport" },
  { code: "NZRO", name: "Rotorua Airport" },
  { code: "NZGB", name: "Claris Airport, Great Barrier Island" },
  { code: "NZCI", name: "Tuuta Airport, Chatham Islands" },
  { code: "NZTL", name: "Lake Tekapo Airport" },
];

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default function SearchPage() {
  const defaultDates = useMemo(() => {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 30);

    return {
      today: formatDateInput(today),
      future: formatDateInput(future),
    };
  }, []);

  const [origin, setOrigin] = useState("NZNE");
  const [destination, setDestination] = useState("YSSY");
  const [date1, setDate1] = useState(defaultDates.today);
  const [date2, setDate2] = useState(defaultDates.future);
  const [schedules, setSchedules] = useState<ScheduleResult[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (origin === destination) {
      setMessage("Origin and destination cannot be the same.");
      setSchedules([]);
      return;
    }

    setIsLoading(true);
    setMessage("");
    setSchedules([]);

    try {
      const params = new URLSearchParams({
        orig: origin,
        dest: destination,
        date1,
        date2,
      });

      const response = await fetch(`/api/schedules?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "Failed to search flights.");
        return;
      }

      setSchedules(data.schedules);

      if (data.schedules.length === 0) {
        setMessage(
          "No flights found. Try expanding the date range because some routes are infrequent."
        );
      }
    } catch {
      setMessage("Something went wrong while searching flights.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/" className="text-sm font-medium text-blue-700">
            ← Back to home
          </Link>

          <h1 className="mt-4 text-4xl font-bold text-slate-900">
            Search Flights
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Search scheduled flights by route and date range. Some routes only
            operate weekly or a few times per week, so a wider date range may
            show better results.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Origin
              </span>
              <select
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {airports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.code} - {airport.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Destination
              </span>
              <select
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {airports.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.code} - {airport.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                From date
              </span>
              <input
                type="date"
                value={date1}
                onChange={(event) => setDate1(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                To date
              </span>
              <input
                type="date"
                value={date2}
                onChange={(event) => setDate2(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-slate-400"
          >
            {isLoading ? "Searching..." : "Search Flights"}
          </button>
        </form>

        {message && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            {message}
          </div>
        )}

        <section className="mt-8 grid gap-5">
          {schedules.map((schedule) => (
            <article
              key={schedule.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {schedule.flightNo}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                        schedule.isFull
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {schedule.isFull
                        ? "Full"
                        : `${schedule.remainingSeats} seats left`}
                    </span>
                  </div>

                  <p className="mt-2 text-lg font-semibold text-slate-700">
                    {schedule.origin.code} → {schedule.destination.code}
                  </p>

                  <p className="mt-1 text-slate-600">
                    {schedule.origin.name} to {schedule.destination.name}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    NZD ${schedule.price}
                  </p>
                  <p className="text-sm text-slate-500">per passenger</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 rounded-xl bg-slate-50 p-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Departure
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {schedule.departureDisplay}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Arrival
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {schedule.arrivalDisplay}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    Aircraft
                  </p>
                  <p className="mt-1 font-medium text-slate-800">
                    {schedule.aircraft.type}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <Link
                  href={`/schedules/${schedule.id}`}
                  className={`inline-block rounded-lg px-5 py-3 font-semibold ${
                    schedule.isFull
                      ? "pointer-events-none bg-slate-300 text-slate-600"
                      : "bg-slate-900 text-white hover:bg-slate-700"
                  }`}
                >
                  {schedule.isFull ? "Flight Full" : "Select Flight"}
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}