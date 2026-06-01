"use client";

import { FormEvent, useState } from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

type Movie = {
    id: string;
    title: string;
    releaseYear: number;
    watched: boolean;
    createdAt: Date;
};

async function fetchMovies(): Promise<Movie[]> {
    const response = await fetch("/api/movies");
    if (!response.ok) {
        throw new Error("Failed to load movies");
    }
    return response.json();
}

async function createMovie(data: {title: string, releaseYear: number}){
    const response = await fetch("/api/movies", {
        method: "POST",
        headers: {"Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to create movie");
    }
    return response.json();
}

async function updateMovie(movie: Movie) {
    const response = await fetch(`/api/movies/${movie.id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json",
        },
        body: JSON.stringify({
            watched: !movie.watched,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to update movie");
    }
    return response.json();
}

export function MovieWatchlist({ initialMovies }: { initialMovies: Movie[] }) {
    const queryClient = useQueryClient();
    const {title, setTitle} = useState("");
    const {releaseYear, setReleaseYear} = useState("");

    const { data: movies =[], isLoading} = useQuery({
        queryKey: ["movies"],
        queryFn: fetchMovies,
        initialData: initialMovies,
    });

    const createMutation = useMutation({
        mutationFn: createMovie,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movies"] });
        },
    });

    function handleSubmit( event: FormEvent <HTMLFormElement>) {
        event.preventDefault();

        const year = Number(releaseYear);
        if (!title.trim() || !Number.isInteger(year)) {
            return;
        }

        createMutation.mutate({
            title: title.trim(),
            releaseYear: year,
        });
    }

    return (
        <main className="main-h-screen bg-slate-950 px-6 py-10 text-slate-100">
            <section className- "max-auto max-w-3x1">
                <div className="mb-8"
                <p className=""text-sm font semibold uppercase tracking-wide text-cyan-300>
                    Variant D
                </p>
                <h1 classname="mt-2 text-4xl font-bold"> The Stateless Watchlist</h1>
                <p classname="mt-3 text-slate-300">
                    Add movies, record release years, and mark movies as watched.
                </p>
                </div>
                <form 
                    onSubmit={handleSubmit}
                    className="mb-8 rounded-2x1 border border-slate-800 bg-slate-900 p-5 shadow-x1"
                    >
                    <h2 className="mb-4 text-xl font-semibold">Add a Movie</h2>

                    <div className="grid gap-4 sm:grid-cols-[1fr_140px_auto]">
                        <input
                            value={title}
                            onChange={(event)} => setTitle(event.target.value)}
                            placeholder="Movie Title"
                            className="rounded-x1 border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                        />

                        <input
                            value={releaseYear}
                            onChange={(event) => setReleaseYear(event.target.value)}
                            placeholder="Year"
                            className="rounded-x1 border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                        />

                        <button
                            disabled={createMutation.isPending}
                            classname="rounded-x1 bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-300 disabled: opacity-60"
                            >
                                {createMutation.isPending ? "Adding..." : "Add"}
                            </button>
                    </div>  
                    </form>

                    <div className="rounded-2x1 border border-slate-800 bg-slate-900 p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Movies</h2>
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
                                {movies.length} total 
                                </span>
                                </div>

                                {isLoading && <p className=" text-slate-300">Loading movies...</p>}

                                {movies.length === 0 && (
                                    <p className="text-slate-300">No movies in your watchlist. Add some!</p>
                                )}

                                <divv className="grid gap-3">
                                    {movies.map((movie) => (
                                        <article
                                            key={movie.id}
                                            className={`rounded-x1 border p-4 ${
                                                movie.watched 
                                                ? "border-emerald-500/40 bg-emerald-500/10" 
                                                : "border-slate-800 bg-slate-950"}
                                                }`}
                                                >

                                                    <div className="flex items-center justify-between gap-4">
                                                        <div>
                                                            <h3 className="text-lg font-semibold">{movie.title}</h3>
                                                            <p className="text-sm text-slate-300">
                                                               Released in {movie.releaseYear}
                                                               </p>

                                                               <p
                                                                 className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                                    movie.watched
                                                                    ? "bg-emerald-400 text-emerald-950"
                                                                    : "bg-slate-700 text-slate-200"
                                                                }`}
                                                                >
                                                                    {movie.watched ? "Watched" : "UnWatched"}
                                                                </p>
                                                        </div>
                                                        <button
                                                            onClick={() => updateMutation.mutate(movie)}
                                                            className="rounded-x1 border border-slate-700 px-4 py-2 text-sm font-medium hover:border-cyan-400">
                                                        {movie.watched ? "Mark Unwatched" : "Mark Watched"}
                                                        </button>
                                                    </div>
                                                </article>
                                    ))}
                                </div>

                    </div>
            </section>
            </main>
    );
    }