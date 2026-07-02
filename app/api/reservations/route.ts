import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Convert date string to Date object
    const reservationDate = new Date(data.date);
    
    const reservation = await prisma.reservation.create({
      data: {
        serviceId: data.serviceId,
        userId: data.userId || null,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        date: reservationDate,
        time: data.time,
        notes: data.notes || null,
        status: "PENDING",
      }
    });
    
    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 });
  }
}
