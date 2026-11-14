export interface Perk {
  id: number;
  perk_id: number;
  name: string | null;
  kind: string | null;
  description: string | null;
  position: number;
}

export interface Item {
  id: number;
  name: string;
  category: string | null;
  equip_slot: string | null;
  rarity: string | null;
  min_level: number | null;
  max_level: number | null;
  damage_total: string | null;
  estimated_base_damage: number | null;
  armor_total: string | null;
  weapon_category_type: string | null;
  weapon_class_type: string | null;
  icon_image: string | null;
  perks: Perk[];
}