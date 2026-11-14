<?php

namespace App\Http\Resources;

use App\Services\WeaponDamageCalculator;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'equip_slot' => $this->equip_slot,
            'rarity' => $this->rarity,
            'min_level' => $this->min_level,
            'max_level' => $this->max_level,
            'damage_total' => $this->damage_total,
            'estimated_base_damage' => $this->estimatedBaseDamage($request),
            'armor_total' => $this->armor_total,
            'weapon_category_type' => $this->weapon_category_type,
            'weapon_class_type' => $this->weapon_class_type,
            'icon_image' => $this->icon_image,
            'perks' => PerkResource::collection($this->whenLoaded('perks')),
        ];
    }

    private function estimatedBaseDamage(Request $request): ?int
    {
        if (
            $this->equip_slot !== 'weapon'
            || $this->min_level === null
            || $this->max_level === null
        ) {
            return null;
        }

        if ($request->filled('item_level')) {
            $itemLevel = (int) $request->input('item_level');
        } elseif ($this->min_level === $this->max_level) {
            $itemLevel = (int) $this->min_level;
        } else {
            return null;
        }

        if ($itemLevel < $this->min_level || $itemLevel > $this->max_level) {
            return null;
        }

        return app(WeaponDamageCalculator::class)->calculate(
            $itemLevel,
            $this->damage_speed_mod === null ? null : (float) $this->damage_speed_mod,
            $this->damage_dmg_mod === null ? null : (float) $this->damage_dmg_mod,
        );
    }
}
