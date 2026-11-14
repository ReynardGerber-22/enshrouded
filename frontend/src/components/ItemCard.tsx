import type { Item } from "../types/item";

interface ItemCardProps {
  item: Item;
  isSelected: boolean;
  isSelectionFull: boolean;
  onCompare: (item: Item) => void;
}

function ItemCard({
  item,
  isSelected,
  isSelectionFull,
  onCompare,
}: ItemCardProps) {
  const rarityStyles: Record<string, { card: string; name: string; badge: string }> = {
    common: {
      card: "border-slate-700",
      name: "text-slate-100",
      badge: "border-slate-600 bg-slate-800 text-slate-300",
    },
    rare: {
      card: "border-blue-400/60",
      name: "text-blue-300",
      badge: "border-blue-400/30 bg-blue-400/10 text-blue-300",
    },
    epic: {
      card: "border-purple-400/60",
      name: "text-purple-300",
      badge: "border-purple-400/30 bg-purple-400/10 text-purple-300",
    },
    legendary: {
      card: "border-orange-400/60",
      name: "text-orange-300",
      badge: "border-orange-400/30 bg-orange-400/10 text-orange-300",
    },
  };
  const rarity = item.rarity?.toLowerCase() ?? "common";
  const colors = rarityStyles[rarity] ?? rarityStyles.common;

  return (
    <li
      className={`group rounded-2xl border-l-4 ${colors.card} border-y border-r bg-slate-900/80 p-5 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-slate-900 ${
        isSelected ? "ring-2 ring-amber-400/70" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {item.equip_slot ?? "Equipment"}
          </p>
          <h3 className={`truncate text-lg font-bold ${colors.name}`}>
            {item.name}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {item.rarity ?? "Common"} · Level {item.min_level ?? "—"}–
            {item.max_level ?? "—"}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${colors.badge}`}
        >
          {item.rarity ?? "Common"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {item.damage_total !== null && (
          <div className="rounded-xl bg-orange-400/10 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wider text-orange-300/70">
              Imported damage
            </p>
            <p className="mt-1 font-semibold text-orange-300">
              {item.damage_total}
            </p>
          </div>
        )}
        {item.equip_slot === "weapon" && item.estimated_base_damage !== null && (
          <div className="rounded-xl bg-amber-400/10 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wider text-amber-300/70">
              Estimated base damage
            </p>
            <p className="mt-1 font-semibold text-amber-300">
              {item.estimated_base_damage}
            </p>
            <p className="mt-1 text-[10px] leading-4 text-slate-400">
              Estimate only; not final combat damage.
            </p>
          </div>
        )}
        {item.armor_total !== null && (
          <div className="rounded-xl bg-sky-400/10 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wider text-sky-300/70">
              Armor
            </p>
            <p className="mt-1 font-semibold text-sky-300">
              {item.armor_total}
            </p>
          </div>
        )}
      </div>

      {item.perks.length > 0 && (
        <div className="mt-5 border-t border-slate-800 pt-4">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            Perks
          </h4>
          <ul className="flex flex-wrap gap-2">
            {item.perks.map((perk) => (
              <li
                key={`${item.id}-${perk.position}`}
                className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-slate-300"
              >
                {perk.name ?? "Unknown perk"}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => onCompare(item)}
        disabled={isSelectionFull && !isSelected}
        className={`mt-5 w-full rounded-xl border px-3 py-2 text-sm font-semibold transition ${
          isSelected
            ? "border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
            : "border-slate-700 bg-slate-800 text-slate-300 hover:border-amber-400/40 hover:text-white"
        } disabled:cursor-not-allowed disabled:opacity-40`}
      >
        {isSelected ? "Remove from comparison" : "Compare"}
      </button>
    </li>
  );
}

export default ItemCard;
