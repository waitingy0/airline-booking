import { NextRequest, NextResponse } from "next/server";
import type { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type BookingDocument = {
  bookingRef: string;
  status: "confirmed" | "cancelled";
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: Date;
  cancelledAt?: Date;
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
  departureDisplay: string;
  arrivalDisplay: string;
  price: number;
  bookings: BookingDocument[];
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        { status: 400 }
      );
    }

    const db = await getDb();
    const schedules = db.collection<ScheduleDocument>("schedules");

    const matchedSchedules = await schedules
      .find({
        "bookings.passenger.email": email,
      })
      .sort({ departureTimeUtc: 1 })
      .toArray();

    const bookings = matchedSchedules.flatMap((schedule) => {
      const matchedBookings = schedule.bookings.filter(
        (booking) => booking.passenger.email.toLowerCase() === email
      );

      return matchedBookings.map((booking) => ({
        bookingRef: booking.bookingRef,
        status: booking.status,
        passenger: booking.passenger,
        createdAt: booking.createdAt,
        schedule: {
          id: schedule._id.toString(),
          flightNo: schedule.flightNo,
          origin: schedule.origin,
          destination: schedule.destination,
          aircraft: schedule.aircraft,
          departureDisplay: schedule.departureDisplay,
          arrivalDisplay: schedule.arrivalDisplay,
          price: schedule.price,
        },
      }));
    });

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Passenger bookings error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load passenger bookings.",
        error: message,
      },
      { status: 500 }
    );
  }
}