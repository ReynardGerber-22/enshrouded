<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\Perk;

#[Signature('enshrouded:import-perks')]
#[Description('Import Enshrouded perks into the database')]
class ImportEnshroudedPerks extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $path = storage_path('app/enshrouded/perks.json');

        $json = file_get_contents($path);

        $data = json_decode($json, true);

        foreach ($data['perks'] as $perk) {
            Perk::updateOrCreate(
                ['perk_id' => $perk['perk_id']],
                [
                    'guid' => $perk['guid'],
                    'debug_name' => $perk['debug_name'],
                    'name' => $perk['name_en'] ?? null,
                    'kind' => $perk['kind'] ?? null,
                    'description' => $perk['desc_en'] ?? null,
                    'damage_modifier' => $perk['damage_modifier'] ?? null,
                    'effects' => $perk['effects'] ?? [],
                ]
            );
        }

        $this->info('Import completed. Total perks: ' . Perk::count());

        return self::SUCCESS;
    }
}
