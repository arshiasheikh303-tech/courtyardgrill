import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reservationSchema } from "@/lib/validation";
import { getSession } from "@/lib/auth";
import { sendReservationConfirmation } from "@/lib/mailer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = reservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid input" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const requestedDate = new Date(`${data.date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isNaN(requestedDate.getTime()) || requestedDate < today) {
    return NextResponse.json(
      { error: "Please choose a valid, upcoming date." },
      { status: 400 }
    );
  }

  const session = await getSession();

  const reservation = await prisma.reservation.create({
    data: {
      userId: session?.sub,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      date: requestedDate,
      time: data.time,
      guests: data.guests,
      specialRequest: data.specialRequest || null,
    },
  });

  if (data.email) {
    await sendReservationConfirmation(data.email, {
      name: data.name,
      date: requestedDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: data.time,
      guests: data.guests,
    });
  }

  return NextResponse.json({ reservation }, { status: 201 });
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ reservations: [] });

  const reservations = await prisma.reservation.findMany({
    where: { userId: session.sub },
    orderBy: { date: "desc" },
  });
  return NextResponse.json({ reservations });
}
