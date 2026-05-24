import { NextRequest, NextResponse } from "next/server";
import type { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type Booking = {
  status: "confirmed" | "cancelled";
};

type ScheduleDocument = {
  _id: ObjectId;
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
  bookings?: Booking[];
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const orig = searchParams.get("orig");
    const dest = searchParams.get("dest");
    const date1 = searchParams.get("date1");
    const date2 = searchParams.get("date2");

    if (!orig || !dest || !date1 || !date2) {
      return NextResponse.json(
        {
          success: false,
          message: "orig, dest, date1 and date2 are required.",
        },
        { status: 400 }
      );
    }

    if (orig === dest) {
      return NextResponse.json(
        {
          success: false,
          message: "Origin and destination cannot be the same.",
        },
        { status: 400 }
      );
    }

    const db = await getDb();

    const schedules = await db
      .collection<ScheduleDocument>("schedules")
      .find({
        "origin.code": orig,
        "destination.code": dest,
        departureDateLocal: {
          $gte: date1,
          $lte: date2,
        },
      })
      .sort({ departureTimeUtc: 1 })
      .limit(100)
      .toArray();

    const results = schedules.map((schedule) => {
      const confirmedBookings =
        schedule.bookings?.filter((booking) => booking.status === "confirmed")
          .length || 0;

      const remainingSeats = schedule.aircraft.capacity - confirmedBookings;

      return {
        id: schedule._id.toString(),
        flightNo: schedule.flightNo,
        origin: schedule.origin,
        destination: schedule.destination,
        aircraft: schedule.aircraft,
        departureTimeUtc: schedule.departureTimeUtc,
        arrivalTimeUtc: schedule.arrivalTimeUtc,
        departureDateLocal: schedule.departureDateLocal,
        arrivalDateLocal: schedule.arrivalDateLocal,
        departureDisplay: schedule.departureDisplay,
        arrivalDisplay: schedule.arrivalDisplay,
        price: schedule.price,
        capacity: schedule.aircraft.capacity,
        confirmedBookings,
        remainingSeats,
        isFull: remainingSeats <= 0,
      };
    });

    return NextResponse.json({
      success: true,
      count: results.length,
      schedules: results,
    });
  } catch (error) {
    console.error("Schedule search error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "Failed to search schedules.",
        error: message,
      },
      { status: 500 }
    );
  }
}