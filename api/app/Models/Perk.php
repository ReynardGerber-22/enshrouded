<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Perk extends Model
{
    protected $fillable = [
        'perk_id',
        'guid',
        'debug_name',
        'name',
        'kind',
        'description',
        'damage_modifier',
        'effects',
    ];

    protected function casts(): array
    {
        return [
            'damage_modifier' => 'array',
            'effects' => 'array',
        ];
    }

    public function items(): BelongsToMany
    {
        return $this->belongsToMany(Item::class, 'item_perk')
            ->withPivot('position');
    }
    //
}
