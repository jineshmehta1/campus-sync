import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const stage = searchParams.get("stage");
        const folderId = searchParams.get("folderId");

        const where: any = {};
        if (folderId) where.folderId = folderId;
        if (stage) where.stage = stage;

        const mcqs = await prisma.mCQ.findMany({
            where,
            include: { folder: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(mcqs);
    } catch (error) {
        console.error("GET /api/mcq error:", error);
        return NextResponse.json({ error: "Failed to fetch MCQs" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { question, options, correctOptions, folderId, stage, explanation, position } = body;

        if (!question || !options || !correctOptions || correctOptions.length === 0) {
            return NextResponse.json({ error: "Question, options, and correct answer(s) are required" }, { status: 400 });
        }

        const mcq = await prisma.mCQ.create({
            data: {
                position: position || null,
                question,
                options,
                correctOptions,
                folderId: folderId || null,
                stage: stage || "BEGINNER",
                explanation: explanation || null,
            },
        });

        return NextResponse.json(mcq);
    } catch (error) {
        console.error("POST /api/mcq error:", error);
        return NextResponse.json({ error: "Failed to create MCQ" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, question, options, correctOptions, folderId, stage, explanation, position } = body;

        if (!id) {
            return NextResponse.json({ error: "MCQ ID is required" }, { status: 400 });
        }

        const mcq = await prisma.mCQ.update({
            where: { id },
            data: {
                position: position || null,
                question,
                options,
                correctOptions,
                folderId: folderId || null,
                stage: stage || "BEGINNER",
                explanation: explanation || null,
            },
        });

        return NextResponse.json(mcq);
    } catch (error) {
        console.error("PUT /api/mcq error:", error);
        return NextResponse.json({ error: "Failed to update MCQ" }, { status: 500 });
    }
}
