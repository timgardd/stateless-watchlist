import {prisma} from "@/lib/prisma";
import { MovieWatchlist } from "@/components/MovieWatchlist";
import MODERN_BROWSERSLIST_TARGET from "next/dist/shared/lib/modern-browserslist-target";

export default async function HomePage() {
  const movies = await prisma.movie.findMany({
    orderBy: {createdAt: "desc"},
  });

  return <MovieWatchlist initialMovies={movies} />;
} 