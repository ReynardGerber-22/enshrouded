import { useEffect, useState } from "react";
import type { Item } from "./types/item";
import ItemList from "./components/ItemList";

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [slot, setSlot] = useState<string>("");
  const [level, setLevel] = useState<number>(20);
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);

  useEffect(() => {
    const controller = new AbortController();
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();

        if (slot) {
          params.set("slot", slot);
        }
        params.set("level", level.toString());
        params.set("page", page.toString());

        const url = `/api/items?${params.toString()}`;

        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
          throw new Error("Failed to fetch equipment");
        }

        const result = await response.json();

        if (!Array.isArray(result.data)) {
          throw new Error("Invalid equipment response");
        }

        setItems(result.data);
        setLastPage(
          typeof result.meta?.last_page === "number"
            ? result.meta.last_page
            : 1,
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setError("Unable to load equipment. Please try again.");
        console.error(error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      controller.abort();
    };
  }, [slot, level, page]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_38%)]" />
      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Enshrouded
            <span className="h-1 w-1 rounded-full bg-amber-400" />
            Gear index
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Find your next <span className="text-amber-400">build piece.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">
            Browse equipment by slot and character level to compare stats and
            perks at a glance.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl shadow-black/20 sm:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Filter gear</p>
              <p className="mt-1 text-xs text-slate-500">
                Narrow the index to match your character.
              </p>
            </div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
              Level {level}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="slot"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Equipment slot
              </label>
              <select
                id="slot"
                value={slot}
                onChange={(event) => {
                  setSlot(event.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              >
                <option value="">All equipment</option>
                <option value="weapon">Weapons</option>
                <option value="helmet">Helmets</option>
                <option value="chest">Chest armor</option>
                <option value="arms">Gloves</option>
                <option value="legs">Leg armor</option>
                <option value="boots">Boots</option>
                <option value="ring">Rings</option>
                <option value="shield">Shields</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="level"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Character level
              </label>
              <select
                id="level"
                value={level}
                onChange={(event) => {
                  setLevel(Number(event.target.value));
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
              >
                {Array.from({ length: 50 }, (_, index) => index + 1).map(
                  (value) => (
                    <option key={value} value={value}>
                      Level {value}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((skeleton) => (
              <div
                key={skeleton}
                className="h-48 animate-pulse rounded-2xl border border-slate-800 bg-slate-900"
              />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-red-200">
            <p className="font-semibold">Unable to load equipment</p>
            <p className="mt-1 text-sm text-red-200/70">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-700 p-10 text-center">
            <p className="font-semibold text-white">No equipment found</p>
            <p className="mt-1 text-sm text-slate-500">
              Try changing the slot or character level.
            </p>
          </div>
        ) : (
          <ItemList items={items} />
        )}

        {!loading && !error && lastPage > 1 && (
          <nav
            aria-label="Equipment pages"
            className="mt-8 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-3"
          >
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              ← Previous
            </button>
            <span className="text-sm text-slate-400">
              Page <span className="font-semibold text-white">{page}</span> of{" "}
              {lastPage}
            </span>
            <button
              type="button"
              disabled={page === lastPage}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next →
            </button>
          </nav>
        )}
      </main>
    </div>
  );
}

export default App;
