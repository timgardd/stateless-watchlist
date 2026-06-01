import { prisma } from "@/lib/prisma";

export async function GET() {
    const movies = await prisma.movie.findMany({
    orderBy: {createdAt: "desc"},
    });

    return Response.json(movies);
}

export async function POST(request: Request) {
    const body = await request.json();
    
    const title = String(body.title || "").trim();
    const releaseYear = Number(body.releaseYear);

    if (!title || !Number.isInteger(releaseYear)) {
        return Response.json(
            { error: "Title and release year are required" },
            { status: 400 }
        );
    }

const movie = await prisma.movie.create({
    data: {
        title,
        releaseYear,
    },
});
return Response.json(movie, { status: 201 });
}