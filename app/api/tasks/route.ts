import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const batchId = searchParams.get("batchId");
        const studentId = searchParams.get("studentId");
        const createdById = searchParams.get("createdById");

        const where: any = {};
        if (batchId) where.batchId = batchId;
        if (createdById) where.createdById = createdById;

        const tasks = await prisma.task.findMany({
            where,
            include: {
                batch: { select: { id: true, name: true } },
                createdBy: { select: { id: true, name: true } },
                submissions: studentId
                    ? { where: { studentId }, select: { id: true, imageUrl: true, remarks: true, submittedAt: true } }
                    : { select: { id: true, studentId: true, imageUrl: true, remarks: true, submittedAt: true, student: { select: { name: true } } } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error("GET /api/tasks error:", error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { title, description, dueDate, batchId } = await req.json();
        if (!title || !batchId) {
            return NextResponse.json({ error: "Title and batch are required" }, { status: 400 });
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                dueDate: dueDate ? new Date(dueDate) : null,
                batchId,
                createdById: (session.user as any).id,
            },
            include: {
                batch: { select: { id: true, name: true } },
                createdBy: { select: { id: true, name: true } },
            },
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error("POST /api/tasks error:", error);
        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.task.delete({ where: { id } });
        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        console.error("DELETE /api/tasks error:", error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
