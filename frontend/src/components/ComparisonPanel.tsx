import type { Item } from "../types/item";

interface ComparisonPanelProps {
  items: Item[];
  onRemove: (item: Item) => void;
}

function ComparisonPanel({ items, onRemove }: ComparisonPanelProps) {
  const firstItem = items[0];
  const secondItem = items[1];
  const higherDamageEstimateItemId =
    items.length === 2 &&
    firstItem?.equip_slot === "weapon" &&
    secondItem?.equip_slot === "weapon" &&
    firstItem.estimated_base_damage !== null &&
    secondItem.estimated_base_damage !== null &&
    firstItem.estimated_base_damage !== secondItem.estimated_base_damage
      ? firstItem.estimated_base_damage > secondItem.estimated_base_damage
        ? firstItem.id
        : secondItem.id
      : null;
  const sharedPerks = new Set(
    items[0]?.perks
      .map((perk) => perk.perk_id)
      .filter((perkId) =>
        items[1]?.perks.some((perk) => perk.perk_id === perkId),
      ),
  );

  return (
    <section
      aria-labelledby="comparison-heading"
      className="mt-8 rounded-2xl border border-amber-400/20 bg-slate-900/80 p-4 shadow-2xl shadow-black/20 sm:p-6"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Equipment comparison
          </p>
          <h2
            id="comparison-heading"
            className="mt-1 text-xl font-bold text-white"
          >
            Compare your selected gear
          </h2>
        </div>
        <span className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
          {items.length} of 2 selected
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-slate-700 bg-slate-950/70 p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-white">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {item.rarity ?? "Common"} ·{" "}
                  {item.equip_slot ?? "Equipment"} · Level{" "}
                  {item.min_level ?? "—"}–{item.max_level ?? "—"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-red-400/10 hover:text-red-300"
              >
                Remove
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              {item.damage_total !== null && (
                <div className="rounded-xl bg-orange-400/10 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-orange-300/70">
                    Imported damage
                  </p>
                  <p className="mt-1 text-xl font-bold text-orange-300">
                    {item.damage_total}
                  </p>
                </div>
              )}
              {item.equip_slot === "weapon" &&
                item.estimated_base_damage !== null && (
                  <div
                    className={`rounded-xl px-3 py-2 ${
                      item.id === higherDamageEstimateItemId
                        ? "bg-emerald-400/10 ring-1 ring-emerald-400/40"
                        : "bg-amber-400/10"
                    }`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/70">
                      Estimated base damage
                    </p>
                    <p
                      className={`mt-1 text-xl font-bold ${
                        item.id === higherDamageEstimateItemId
                          ? "text-emerald-300"
                          : "text-amber-300"
                      }`}
                    >
                      {item.estimated_base_damage}
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-slate-400">
                      Estimate only; not final combat damage.
                    </p>
                  </div>
                )}
              {item.armor_total !== null && (
                <div className="rounded-xl bg-sky-400/10 px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-300/70">
                    Armor
                  </p>
                  <p className="mt-1 text-xl font-bold text-sky-300">
                    {item.armor_total}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-slate-800 pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Perks
              </h4>
              {item.perks.length > 0 ? (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {item.perks.map((perk, index) => {
                    const name = perk.name ?? "Unknown perk";
                    const isShared = sharedPerks.has(perk.perk_id);

                    return (
                      <li
                        key={`${item.id}-${perk.position}-${index}`}
                        className={`rounded-lg px-2.5 py-1.5 text-xs ${
                          isShared
                            ? "bg-emerald-900/40 text-emerald-300"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {name}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No perks listed</p>
              )}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-5 text-xs leading-5 text-slate-500">
        Different equipment slots use different stats, so this comparison does
        not calculate an overall winner.
      </p>
    </section>
  );
}

export default ComparisonPanel;
