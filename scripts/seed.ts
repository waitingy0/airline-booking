import dotenv from "dotenv";
import { DateTime } from "luxon";
import { getDb } from "../lib/mongodb";
import { airports, flightTemplates } from "../lib/flightData";

dotenv.config({ path: ".env.local" });

type Booking = {
  bookingRef: string;
  status: "confirmed" | "cancelled";
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: Date;
};

type ScheduleDocument = {
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
  departureTimeUtc: Date;
  arrivalTimeUtc: Date;
  departureDateLocal: string;
  arrivalDateLocal: string;
  departureDisplay: string;
  arrivalDisplay: string;
  price: number;
  bookings: Booking[];
  createdAt: Date;
};

function createScheduleForDate(date: DateTime): ScheduleDocument[] {
  const weekday = date.weekday;

  const schedules: ScheduleDocument[] = [];

  for (const template of flightTemplates) {
    if (!template.operatingDays.includes(weekday)) {
      continue;
    }

    const origin = airports[template.origin];
    const destination = airports[template.destination];

    const [hour, minute] = template.departureTime.split(":").map(Number);

    const departureLocal = date
      .setZone(origin.timezone)
      .set({
        hour,
        minute,
        second: 0,
        millisecond: 0,
      });

    const arrivalLocal = departureLocal
      .toUTC()
      .plus({ minutes: template.durationMinutes })
      .setZone(destination.timezone);

    schedules.push({
      flightNo: template.flightNo,
      origin,
      destination,
      aircraft: template.aircraft,
      departureTimeUtc: departureLocal.toUTC().toJSDate(),
      arrivalTimeUtc: arrivalLocal.toUTC().toJSDate(),
      departureDateLocal: departureLocal.toISODate() || "",
      arrivalDateLocal: arrivalLocal.toISODate() || "",
      departureDisplay: departureLocal.toFormat("yyyy-LL-dd HH:mm ZZZZ"),
      arrivalDisplay: arrivalLocal.toFormat("yyyy-LL-dd HH:mm ZZZZ"),
      price: template.price,
      bookings: [],
      createdAt: new Date(),
    });
  }

  return schedules;
}

async function main() {
  const db = await getDb();
  const schedulesCollection = db.collection<ScheduleDocument>("schedules");

  console.log("Clearing old schedules...");
  await schedulesCollection.deleteMany({});

  const startDate = DateTime.now()
    .setZone("Pacific/Auckland")
    .startOf("day");

  const endDate = startDate.plus({ days: 365 });

  const allSchedules: ScheduleDocument[] = [];

  let currentDate = startDate;

  while (currentDate <= endDate) {
    const schedulesForDate = createScheduleForDate(currentDate);
    allSchedules.push(...schedulesForDate);
    currentDate = currentDate.plus({ days: 1 });
  }

  console.log(`Generated ${allSchedules.length} scheduled flights.`);

  if (allSchedules.length > 0) {
    await schedulesCollection.insertMany(allSchedules);
  }

  await schedulesCollection.createIndex({
    "origin.code": 1,
    "destination.code": 1,
    departureDateLocal: 1,
  });

  await schedulesCollection.createIndex({
    "bookings.bookingRef": 1,
  });

  await schedulesCollection.createIndex({
    "bookings.passenger.email": 1,
  });

  console.log("Seed completed successfully.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});