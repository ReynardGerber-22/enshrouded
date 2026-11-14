<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Models\Perk;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PerkResourceTest extends TestCase
{
    use RefreshDatabase;

    public function test_item_response_includes_internal_and_source_perk_ids(): void
    {
        $item = Item::create([
            'item_id' => 1,
            'guid' => '00000000-0000-0000-0000-000000000001',
            'debug_name' => 'Test_Weapon',
            'name' => 'Test Weapon',
            'equip_slot' => 'weapon',
        ]);
        $perk = Perk::create([
            'perk_id' => 2552497178,
            'guid' => '00000000-0000-0000-0000-000000000002',
            'debug_name' => 'Test_Perk',
            'name' => 'Heavy',
            'kind' => 'other',
        ]);
        $item->perks()->attach($perk->id, ['position' => 0]);

        $this->getJson('/api/items')
            ->assertOk()
            ->assertJsonPath('data.0.perks.0.id', $perk->id)
            ->assertJsonPath('data.0.perks.0.perk_id', 2552497178)
            ->assertJsonPath('data.0.perks.0.name', 'Heavy');
    }
}
