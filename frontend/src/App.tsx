import { useEffect, useState } from "react";
import type { Item } from "./types/item";

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
        params.set("level", level.toString());
        params.set("level", level.toString());

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
        setLoading(false);
      }
    };

    fetchItems();

    return () => {
      controller.abort();
    };
  }, [slot, level, page]);

  return (
    <div className="min-h-screen bg-slate-950 p-10 text-white">
      <h1 className="text-4xl font-bold text-amber-400">
        Enshrouded Gear Comparator
      </h1>

      <p className="mt-4 text-slate-400">
        Find and compare the best equipment for your build.
      </p>

      <div className="mt-8">
        <label
          htmlFor="slot"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Equipment Slot
        </label>

        <select
          id="slot"
          value={slot}
          onChange={(event) => {
            setSlot(event.target.value);
            setPage(1);
          }}
          className="w-full max-w-xs rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
        >
          <option value="">All Equipment</option>
          <option value="weapon">Weapons</option>
          <option value="helmet">Helmets</option>
          <option value="chest">Chest Armor</option>
          <option value="arms">Gloves</option>
          <option value="legs">Leg Armor</option>
          <option value="boots">Boots</option>
          <option value="ring">Rings</option>
          <option value="shield">Shields</option>
        </select>
      </div>
      <div className="mt-4">
        <label
          htmlFor="level"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Character Level
        </label>

        <select
          id="level"
          value={level}
          onChange={(event) => {
            setLevel(Number(event.target.value));
            setPage(1);
          }}
          className="w-full max-w-xs rounded-lg border border-slate-700 bg-slate-900 p-3 text-white"
        >
          {Array.from({ length: 50 }, (_, index) => index + 1).map((value) => (
            <option key={value} value={value}>
              Level {value}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="mt-8 text-slate-400">Loading equipment...</p>
      ) : error ? (
        <p className="mt-8 text-red-500">{error}</p>
      ) : (
        <ul className="mt-8 space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {item.name}
                </h3>

                <p className="text-sm text-slate-400">
                  {item.rarity} • Level {item.min_level}–{item.max_level}
                </p>
              </div>

              <div className="text-right">
                {item.damage_total !== null && (
                  <p className="text-orange-400">Damage: {item.damage_total}</p>
                )}

                {item.armor_total !== null && (
                  <p className="text-blue-400">Armor: {item.armor_total}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && lastPage > 1 && (
        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-slate-400">
            Page {page} of {lastPage}
          </span>
          <button
            type="button"
            disabled={page === lastPage}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
