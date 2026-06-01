import { prisma } from "@/lib/prisma";
import { request } from "https";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
    const {id} = await context.params;
    const body = await request.json();

    const movie = await prisma.movie.update({
        where: { id },
        data: {
            watched: Boolean(body.watched),
        },
    });
    return Response.json(movie);
}