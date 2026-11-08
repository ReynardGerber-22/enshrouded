import type { Item } from "../types/item";
import ItemCard from "./ItemCard";

interface ItemListProps {
  items: Item[];
  selectedItems: Item[];
  onCompare: (item: Item) => void;
}

function ItemList({ items, selectedItems, onCompare }: ItemListProps) {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          isSelected={selectedItems.some((selected) => selected.id === item.id)}
          isSelectionFull={selectedItems.length >= 2}
          onCompare={onCompare}
        />
      ))}
    </ul>
  );
}

export default ItemList;
