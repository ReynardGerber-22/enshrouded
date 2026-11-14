<?php

namespace Tests\Feature;

use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ItemSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_filters_items_alongside_slot_and_level(): void
    {
        foreach ([
            ['Soothsayer Staff', 'weapon', 20],
            ['Soothsayer Helmet', 'helmet', 20],
            ['Soothsayer Wand', 'weapon', 21],
            ['Other Staff', 'weapon', 20],
            ['Soothsayer Material', null, 20],
        ] as $index => [$name, $slot, $level]) {
            Item::create([
                'item_id' => $index + 1,
                'guid' => sprintf('00000000-0000-0000-0000-%012d', $index + 1),
                'debug_name' => $name,
                'name' => $name,
                'equip_slot' => $slot,
                'min_level' => $level,
            ]);
        }

        $this->getJson('/api/items?search=Soothsayer&slot=weapon&level=20&page=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Soothsayer Staff')
            ->assertJsonPath('meta.current_page', 1);
    }

    public function test_search_rejects_terms_longer_than_100_characters(): void
    {
        $this->getJson('/api/items?search='.str_repeat('a', 101))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('search');
    }
}
