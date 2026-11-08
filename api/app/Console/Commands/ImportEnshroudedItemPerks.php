<?php

namespace App\Console\Commands;

use App\Models\Item;
use App\Models\Perk;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('enshrouded:import-item-perks')]
#[Description('Import relationships between Enshrouded items and perks')]
class ImportEnshroudedItemPerks extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $path = storage_path('app/enshrouded/items.json');

        if (! file_exists($path)) {
            $this->error('Items JSON file not found.');

            return self::FAILURE;
        }

        try {
            $data = json_decode(
                file_get_contents($path),
                true,
                512,
                JSON_THROW_ON_ERROR
            );
        } catch (\JsonException $e) {
            $this->error('Invalid JSON: ' . $e->getMessage());

            return self::FAILURE;
        }

        if (! isset($data['items']) || ! is_array($data['items'])) {
            $this->error('Invalid items dataset.');

            return self::FAILURE;
        }

        // Build lookups using external Enshrouded IDs.
        $items = Item::all()->keyBy('item_id');
        $perks = Perk::all()->keyBy('perk_id');

        $imported = 0;
        $skipped = 0;
        $missingPerks = [];

        foreach ($data['items'] as $sourceItem) {
            $item = $items->get($sourceItem['item_id'] ?? null);

            // Skip items that were not imported into our database.
            if ($item === null) {
                $skipped++;
                continue;
            }

            $pivotData = [];

            foreach (($sourceItem['perk_ids'] ?? []) as $position => $perkId) {
                $perk = $perks->get($perkId);

                if ($perk === null) {
                    $missingPerks[$perkId] = true;
                    continue;
                }

                $pivotData[] = [
                    'item_id' => $item->id,
                    'perk_id' => $perk->id,
                    'position' => $position,
                ];
            }

            // Replace existing relationships for this item.
            // A transaction ensures deletion and insertion succeed together.
            DB::transaction(function () use ($item, $pivotData) {
                DB::table('item_perk')
                    ->where('item_id', $item->id)
                    ->delete();

                if (! empty($pivotData)) {
                    DB::table('item_perk')->insert($pivotData);
                }
            });

            $imported++;
        }

        $this->info('Item-perk import completed.');
        $this->info("Items processed: {$imported}");
        $this->info("Items skipped: {$skipped}");

        if (! empty($missingPerks)) {
            $this->warn(
                'Missing perk IDs: ' . implode(', ', array_keys($missingPerks))
            );
        }

        return self::SUCCESS;
    }
}
