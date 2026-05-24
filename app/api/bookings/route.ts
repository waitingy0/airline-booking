// import { NextRequest, NextResponse } from "next/server";
// import { ObjectId } from "mongodb";
// import { customAlphabet } from "nanoid";
// import { z } from "zod";
// import { getDb } from "@/lib/mongodb";

// const makeReference = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

// const BookingSchema = z.object({
//   scheduleId: z.string().min(1),
//   passenger: z.object({
//     firstName: z.string().min(1),
//     lastName: z.string().min(1),
//     email: z.string().email(),
//   }),
// });

// type Booking = {
//   status: "confirmed" | "cancelled";
// };

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const parsed = BookingSchema.safeParse(body);

//     if (!parsed.success) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid booking information.",
//           errors: parsed.error.flatten(),
//         },
//         { status: 400 }
//       );
//     }

//     const { scheduleId, passenger } = parsed.data;

//     if (!ObjectId.isValid(scheduleId)) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Invalid schedule ID.",
//         },
//         { status: 400 }
//       );
//     }

//     const db = await getDb();
//     const schedules = db.collection("schedules");

//     const schedule = await schedules.findOne({
//       _id: new ObjectId(scheduleId),
//     });

//     if (!schedule) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Schedule not found.",
//         },
//         { status: 404 }
//       );
//     }

//     const bookings = (schedule.bookings || []) as Booking[];

//     const confirmedBookings = bookings.filter(
//       (booking) => booking.status === "confirmed"
//     ).length;

//     if (confirmedBookings >= schedule.aircraft.capacity) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "This flight is full.",
//         },
//         { status: 409 }
//       );
//     }

//     const bookingRef = `DFA-${makeReference()}`;

//     const booking = {
//       bookingRef,
//       status: "confirmed",
//       passenger: {
//         firstName: passenger.firstName.trim(),
//         lastName: passenger.lastName.trim(),
//         email: passenger.email.trim().toLowerCase(),
//       },
//       createdAt: new Date(),
//     };

//     await schedules.updateOne(
//       {
//         _id: new ObjectId(scheduleId),
//       },
//       {
//         $push: {
//           bookings: booking,
//         },
//       }
//     );

//     return NextResponse.json({
//       success: true,
//       message: "Booking created successfully.",
//       bookingRef,
//     });
//   } catch (error) {
//     console.error("Create booking error:", error);

//     const message = error instanceof Error ? error.message : "Unknown error";

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to create booking.",
//         error: message,
//       },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { customAlphabet } from "nanoid";
import { z } from "zod";
import { getDb } from "@/lib/mongodb";

const makeReference = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

const BookingSchema = z.object({
  scheduleId: z.string().min(1),
  passenger: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
  }),
});

type BookingStatus = "confirmed" | "cancelled";

type BookingDocument = {
  bookingRef: string;
  status: BookingStatus;
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: Date;
};

type ScheduleDocument = {
  _id: ObjectId;
  aircraft: {
    type: string;
    capacity: number;
  };
  bookings: BookingDocument[];
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = BookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking information.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { scheduleId, passenger } = parsed.data;

    if (!ObjectId.isValid(scheduleId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid schedule ID.",
        },
        { status: 400 }
      );
    }

    const db = await getDb();
    const schedules = db.collection<ScheduleDocument>("schedules");

    const schedule = await schedules.findOne({
      _id: new ObjectId(scheduleId),
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

    const bookings = schedule.bookings || [];

    const confirmedBookings = bookings.filter(
      (booking) => booking.status === "confirmed"
    ).length;

    if (confirmedBookings >= schedule.aircraft.capacity) {
      return NextResponse.json(
        {
          success: false,
          message: "This flight is full.",
        },
        { status: 409 }
      );
    }

    const booking: BookingDocument = {
      bookingRef: `DFA-${makeReference()}`,
      status: "confirmed",
      passenger: {
        firstName: passenger.firstName.trim(),
        lastName: passenger.lastName.trim(),
        email: passenger.email.trim().toLowerCase(),
      },
      createdAt: new Date(),
    };

    await schedules.updateOne(
      {
        _id: new ObjectId(scheduleId),
      },
      {
        $push: {
          bookings: booking,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Booking created successfully.",
      bookingRef: booking.bookingRef,
    });
  } catch (error) {
    console.error("Create booking error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create booking.",
        error: message,
      },
      { status: 500 }
    );
  }
}
