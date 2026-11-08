import type { Item } from "../types/item";
import ItemCard from "./ItemCard";

interface ItemListProps {
  items: Item[];
}

function ItemList({ items }: ItemListProps) {
  return (
    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </ul>
  );
}

export default ItemList;
