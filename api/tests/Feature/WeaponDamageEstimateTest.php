<?php

namespace Tests\Feature;

use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WeaponDamageEstimateTest extends TestCase
{
    use RefreshDatabase;

    public function test_item_response_estimates_damage_automatically_for_fixed_level_weapon(): void
    {
        Item::create([
            'item_id' => 1,
            'guid' => '00000000-0000-0000-0000-000000000001',
            'debug_name' => 'Craft_Weapon_T3',
            'name' => 'Wolf\'s Hydra',
            'equip_slot' => 'weapon',
            'min_level' => 16,
            'max_level' => 16,
            'damage_total' => 21,
            'damage_speed_mod' => 1,
            'damage_dmg_mod' => 1,
        ]);

        $this->getJson('/api/items?level=20')
            ->assertOk()
            ->assertJsonPath('data.0.damage_total', 21)
            ->assertJsonPath('data.0.estimated_base_damage', 34);
    }

    public function test_variable_level_weapon_requires_explicit_item_level(): void
    {
        Item::create([
            'item_id' => 1,
            'guid' => '00000000-0000-0000-0000-000000000001',
            'debug_name' => 'Weapon_T3',
            'name' => 'Wolf\'s Hydra',
            'equip_slot' => 'weapon',
            'min_level' => 1,
            'max_level' => 50,
            'damage_total' => 21,
            'damage_speed_mod' => 1,
            'damage_dmg_mod' => 1,
        ]);

        $this->getJson('/api/items')
            ->assertOk()
            ->assertJsonPath('data.0.estimated_base_damage', null);

        $this->getJson('/api/items?item_level=16')
            ->assertOk()
            ->assertJsonPath('data.0.estimated_base_damage', 34);
    }

    public function test_item_level_outside_weapon_range_returns_null_estimate(): void
    {
        Item::create([
            'item_id' => 1,
            'guid' => '00000000-0000-0000-0000-000000000001',
            'debug_name' => 'Craft_Weapon_T3',
            'name' => 'Wolf\'s Hydra',
            'equip_slot' => 'weapon',
            'min_level' => 16,
            'max_level' => 16,
            'damage_total' => 21,
            'damage_speed_mod' => 1,
            'damage_dmg_mod' => 1,
        ]);

        $this->getJson('/api/items?item_level=17')
            ->assertOk()
            ->assertJsonPath('data.0.estimated_base_damage', null);
    }
}
