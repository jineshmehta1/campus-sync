import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: "asc" },
        });
        return NextResponse.json(events);
    } catch (error) {
        console.error("GET /api/events error:", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { title, description, date, location, imageUrl } = await req.json();
        if (!title || !date) {
            return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
        }
        const event = await prisma.event.create({
            data: { title, description, date: new Date(date), location, imageUrl },
        });
        return NextResponse.json(event);
    } catch (error) {
        console.error("POST /api/events error:", error);
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id, title, description, date, location, imageUrl } = await req.json();
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        const event = await prisma.event.update({
            where: { id },
            data: { title, description, date: date ? new Date(date) : undefined, location, imageUrl },
        });
        return NextResponse.json(event);
    } catch (error) {
        console.error("PUT /api/events error:", error);
        return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
        await prisma.event.delete({ where: { id } });
        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        console.error("DELETE /api/events error:", error);
        return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }
}
