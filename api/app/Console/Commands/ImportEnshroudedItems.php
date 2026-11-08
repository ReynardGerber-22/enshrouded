<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\Item;

#[Signature('enshrouded:import-items')]
#[Description('Import Enshrouded items into the database')]
class ImportEnshroudedItems extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $path = storage_path('app/enshrouded/items.json');

        $json = file_get_contents($path);

        $data = json_decode($json, true);

        foreach ($data['items'] as $item) {

            if (empty($item['name_en'])) {
                continue;
            }

            Item::updateOrCreate(
                ['item_id' => $item['item_id']],
                [
                    'guid' => $item['guid'],
                    'debug_name' => $item['debug_name'],
                    'name' => $item['name_en'],
                    'equip_slot' => $item['equip_slot'],
                    'category' => $item['category'],
                    'rarity' => $item['rarity'],
                    'min_level' => $item['level_range']['minLevel'] ?? null,
                    'max_level' => $item['level_range']['maxLevel'] ?? null,
                    'damage_total' => $item['damage_total'] ?? null,
                    'armor_total' => $item['armor_total'] ?? null,
                    'damage_distribution' => $item['damage_distribution'] ?? null,
                    'armor_distribution' => $item['armor_distribution'] ?? null,
                    'weapon_category_type' => $item['weapon_category_type'] ?? null,
                    'weapon_class_type' => $item['weapon_class_type'] ?? null,
                    'icon_image' => $item['icon_image'] ?? null,
                    'damage_speed_mod' => $item['damage_speed_mod'] ?? null,
                    'damage_dmg_mod' => $item['damage_dmg_mod'] ?? null,
                    'weapon_durability_mod' => $item['weapon_durability_mod'] ?? null,
                ]
            );
            // Import each item here
        }

        $this->info('Import completed. Total items: ' . Item::count());
        return self::SUCCESS;
        //
    }
}
