import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { taskId, imageUrl, remarks } = await req.json();
        if (!taskId || !imageUrl) {
            return NextResponse.json({ error: "taskId and imageUrl are required" }, { status: 400 });
        }

        const studentId = (session.user as any).id;

        const submission = await prisma.taskSubmission.upsert({
            where: { taskId_studentId: { taskId, studentId } },
            update: { imageUrl, remarks },
            create: { taskId, studentId, imageUrl, remarks },
        });

        return NextResponse.json(submission);
    } catch (error) {
        console.error("POST /api/tasks/submit error:", error);
        return NextResponse.json({ error: "Failed to submit task" }, { status: 500 });
    }
}
