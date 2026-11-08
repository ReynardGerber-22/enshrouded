<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PerkResource;

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
            'armor_total' => $this->armor_total,
            'weapon_category_type' => $this->weapon_category_type,
            'weapon_class_type' => $this->weapon_class_type,
            'icon_image' => $this->icon_image,
            'perks' => PerkResource::collection($this->whenLoaded('perks')),
        ];
    }
}
