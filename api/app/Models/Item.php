<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Item extends Model
{
    protected $fillable = [
        'item_id',
        'guid',
        'debug_name',
        'name',
        'equip_slot',
        'category',
        'rarity',
        'min_level',
        'max_level',
        'damage_total',
        'armor_total',
        'damage_distribution',
        'armor_distribution',
        'weapon_category_type',
        'weapon_class_type',
        'icon_image',
        'damage_speed_mod',
        'damage_dmg_mod',
        'weapon_durability_mod',
    ];

    protected function casts(): array
    {
        return [
            'damage_distribution' => 'array',
            'armor_distribution' => 'array',
        ];
    }

    public function perks(): BelongsToMany
    {
        return $this->belongsToMany(Perk::class, 'item_perk')
            ->withPivot('position')
            ->orderByPivot('position');
    }
    //
}
