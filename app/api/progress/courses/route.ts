import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get("studentId");
        if (!studentId) return NextResponse.json({ error: "studentId required" }, { status: 400 });

        const progress = await prisma.courseProgress.findMany({
            where: { studentId },
        });

        return NextResponse.json(progress);
    } catch (error) {
        console.error("GET /api/progress/courses error:", error);
        return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { studentId, courseId, completedChapters } = await req.json();
        if (!studentId || !courseId) return NextResponse.json({ error: "studentId and courseId required" }, { status: 400 });

        const isCompleted = false;

        const progress = await prisma.courseProgress.upsert({
            where: { studentId_courseId: { studentId, courseId } },
            update: { completedChapters, isCompleted, lastAccessed: new Date() },
            create: { studentId, courseId, completedChapters: completedChapters || [], isCompleted },
        });

        return NextResponse.json(progress);
    } catch (error) {
        console.error("POST /api/progress/courses error:", error);
        return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
    }
}
