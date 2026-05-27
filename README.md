Dairy Flat Airways Booking System

Features:
- Search scheduled flights
- Select a flight and make a booking
- View booking invoice
- Cancel a booking
- Search all bookings by passenger email

Tech stack:
- Next.js
- TypeScript
- MongoDB Atlas
- Tailwind CSS
- Vercel

Important routes:
- /
- /search
- /schedules/[id]
- /booking/[ref]
- /manage
- /passenger

API routes:
- GET /api/schedules
- GET /api/schedules/[id]
- POST /api/bookings
- GET /api/bookings/[ref]
- PATCH /api/bookings/[ref]
- GET /api/passenger-bookings

How to run:
npm.cmd install
npm.cmd run seed
npm.cmd run dev

Build:
npm.cmd run lint
npm.cmd run build