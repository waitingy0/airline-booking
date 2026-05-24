import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

type Booking = {
  status: "confirmed" | "cancelled";
};

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid schedule ID.",
        },
        { status: 400 }
      );
    }

    const db = await getDb();

    const schedule = await db.collection("schedules").findOne({
      _id: new ObjectId(id),
    });

    if (!schedule) {
      return NextResponse.json(
        {
          success: false,
          message: "Schedule not found.",
        },
        { status: 404 }
      );
    }

    const bookings = (schedule.bookings || []) as Booking[];

    const confirmedBookings = bookings.filter(
      (booking) => booking.status === "confirmed"
    ).length;

    const remainingSeats = schedule.aircraft.capacity - confirmedBookings;

    return NextResponse.json({
      success: true,
      schedule: {
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
      },
    });
  } catch (error) {
    console.error("Schedule detail error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load schedule.",
        error: message,
      },
      { status: 500 }
    );
  }
}