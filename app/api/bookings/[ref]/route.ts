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

type RouteParams = {
  params: Promise<{
    ref: string;
  }>;
};

function buildBookingResponse(
  schedule: ScheduleDocument,
  booking: BookingDocument
) {
  return {
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
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { ref } = await params;

    const db = await getDb();
    const schedules = db.collection<ScheduleDocument>("schedules");

    const schedule = await schedules.findOne({
      "bookings.bookingRef": ref,
    });

    if (!schedule) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    const booking = schedule.bookings.find((item) => item.bookingRef === ref);

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: buildBookingResponse(schedule, booking),
    });
  } catch (error) {
    console.error("Booking lookup error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load booking.",
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(_request: NextRequest, { params }: RouteParams) {
  try {
    const { ref } = await params;

    const db = await getDb();
    const schedules = db.collection<ScheduleDocument>("schedules");

    const schedule = await schedules.findOne({
      "bookings.bookingRef": ref,
    });

    if (!schedule) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    const booking = schedule.bookings.find((item) => item.bookingRef === ref);

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    if (booking.status === "cancelled") {
      return NextResponse.json({
        success: true,
        message: "Booking is already cancelled.",
        booking: buildBookingResponse(schedule, booking),
      });
    }

    await schedules.updateOne(
      {
        _id: schedule._id,
        "bookings.bookingRef": ref,
      },
      {
        $set: {
          "bookings.$.status": "cancelled",
          "bookings.$.cancelledAt": new Date(),
        },
      }
    );

    const updatedSchedule = await schedules.findOne({
      "bookings.bookingRef": ref,
    });

    if (!updatedSchedule) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found after update.",
        },
        { status: 404 }
      );
    }

    const updatedBooking = updatedSchedule.bookings.find(
      (item) => item.bookingRef === ref
    );

    if (!updatedBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found after update.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully.",
      booking: buildBookingResponse(updatedSchedule, updatedBooking),
    });
  } catch (error) {
    console.error("Cancel booking error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "Failed to cancel booking.",
        error: message,
      },
      { status: 500 }
    );
  }
}